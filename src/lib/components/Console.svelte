<script>
	import Message from './Message.svelte';
	import { page } from '$app/stores';
	import { onMount, tick } from 'svelte';

	export let messages = [];
	export let stats = {
		inventory: [],
		weapons: [],
		health: 100,
		hunger: 100,
		money: 0
	};

	let prompt;
	let loading = false;
	let isThinking = false;
	let result = '';
	let container;
	let autoscroll = true;

	const extractStats = (text) => {
		const newStats = { ...stats };
		try {
			const inventoryMatch = text.match(/INVENTORY:\s*([\s\S]*?)\s*(?:WEAPONS\/ARMOR:|$)/i);
			if (inventoryMatch) {
				newStats.inventory = inventoryMatch[1]
					.trim()
					.split('\n')
					.filter((i) => i.trim() && i.trim() !== '[ items ]');
			}

			const weaponsMatch = text.match(/WEAPONS\/ARMOR:\s*([\s\S]*?)\s*(?:STATS:|$)/i);
			if (weaponsMatch) {
				newStats.weapons = weaponsMatch[1]
					.trim()
					.split('\n')
					.filter((i) => i.trim() && !i.includes('[ weapon'));
			}

			const healthMatch = text.match(/Health:\s*(\d+)/i);
			if (healthMatch) newStats.health = parseInt(healthMatch[1]);

			const hungerMatch = text.match(/Hunger:\s*(\d+)/i);
			if (hungerMatch) newStats.hunger = parseInt(hungerMatch[1]);

			const moneyMatch = text.match(/Money:\s*(\d+)/i);
			if (moneyMatch) newStats.money = parseInt(moneyMatch[1]);
		} catch (e) {
			console.error('Error parsing stats:', e);
		}
		return newStats;
	};

	const stripStats = (text) => {
		if (!text) return '';
		return text.replace(/INVENTORY:\s*[\s\S]*?(?:STATS:[\s\S]*?(?:\n\n|$)|$)/i, '').trim();
	};

	const handleScroll = () => {
		if (!container) return;
		const { scrollTop, scrollHeight, clientHeight } = container;
		autoscroll = scrollHeight - (scrollTop + clientHeight) < 100;
	};

	const typewriter = async (text) => {
		isThinking = false;
		result = '';
		const speed = 15; // ms per character
		for (let i = 0; i <= text.length; i++) {
			result = text.slice(0, i);
			if (autoscroll) scrollToBottom('auto');
			await new Promise((resolve) => setTimeout(resolve, speed));
		}
	};

	onMount(async () => {
		if (messages.length == 2) {
			loading = true;
			isThinking = true;
			const response = await fetch(`/api/adventure/${$page.params.slug}/init`, {
				method: 'POST'
			});

			const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
			let fullText = '';
			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				fullText += value;
			}

			stats = extractStats(fullText);
			const cleanText = stripStats(fullText);

			await typewriter(cleanText);

			messages = [
				...messages,
				{
					role: 'assistant',
					content: fullText
				}
			];
			result = '';
			loading = false;

			await updateDatabase();
			scrollToBottom();
		}
	});

	const handleSubmit = async () => {
		if (!prompt || loading) return;

		loading = true;
		isThinking = true;
		autoscroll = true;
		messages = [...messages, { role: 'user', content: prompt }];
		prompt = '';

		const response = await fetch(`/api/adventure/${$page.params.slug}/chat`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ messages })
		});

		const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
		let fullText = '';

		while (true) {
			const { value, done } = await reader.read();
			if (done) break;
			fullText += value;
		}

		stats = extractStats(fullText);
		const cleanText = stripStats(fullText);

		await typewriter(cleanText);

		messages = [
			...messages,
			{
				role: 'assistant',
				content: fullText
			}
		];
		result = '';
		loading = false;

		await updateDatabase();
		scrollToBottom();
	};

	const updateDatabase = async () => {
		await fetch(`/api/adventure/${$page.params.slug}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ messages })
		});
	};

	let lastScrollTime = 0;
	const scrollToBottom = async (behavior = 'smooth') => {
		const now = Date.now();
		if (behavior === 'auto' && now - lastScrollTime < 50) return; // throttle if auto

		await tick();
		if (container) {
			container.scrollTo({ top: container.scrollHeight, behavior });
			lastScrollTime = now;
		}
	};
</script>

<div
	class="relative flex h-full flex-col items-stretch gap-4 p-4 font-pixel-operator lg:flex-row lg:gap-8 lg:p-8"
>
	<div class="flex min-w-0 flex-1 flex-col items-stretch">
		<div
			bind:this={container}
			on:scroll={handleScroll}
			class="custom-scrollbar relative z-0 flex h-full flex-col overflow-y-auto px-4"
		>
			{#if messages}
				<div class="flex flex-col gap-2 pt-8">
					{#each messages.slice(2) as message, i}
						<Message
							message={message.role === 'assistant' ? stripStats(message.content) : message.content}
							user={message.role === 'user'}
						/>
					{/each}
				</div>
			{/if}
			{#if loading}
				<Message message={result} user={false} isLoading={true} />
			{/if}
		</div>
		<form class="relative z-20 mt-auto pt-8" method="post" on:submit|preventDefault={handleSubmit}>
			<div class="group relative">
				<div
					class="absolute -inset-0.5 bg-white/20 opacity-0 blur-sm transition-opacity group-focus-within:opacity-100"
				></div>
				<div
					class="relative flex items-center gap-5 border-2 border-white/40 bg-black p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all focus-within:border-white"
				>
					<span class="font-press-start text-xs font-bold text-[#f8d81c]">CMD_</span>
					<input
						bind:value={prompt}
						disabled={loading}
						name="prompt"
						placeholder={isThinking
							? 'TRANSMITTING...'
							: loading
								? 'PROCESSING...'
								: 'ENTER COMMAND'}
						class="w-full bg-transparent font-press-start text-[10px] tracking-widest text-white outline-none placeholder:text-white/20"
						type="text"
						autocomplete="off"
					/>
				</div>
			</div>
		</form>
	</div>

	<!-- Stats HUD -->
	<div
		class="flex w-full flex-col gap-6 border-2 border-white/20 bg-black/40 p-6 text-[12px] uppercase tracking-tighter shadow-2xl backdrop-blur-sm lg:w-72"
	>
		<div class="border-b border-white/20 pb-2">
			<h3 class="font-press-start text-[10px] text-[#f8d81c]">STATUS</h3>
		</div>

		<div class="space-y-4">
			<div>
				<div class="mb-1 flex justify-between">
					<span class="text-white/60">Health</span>
					<span class="text-red-500">{stats?.health || 100}/100</span>
				</div>
				<div class="h-1.5 w-full border border-white/10 bg-white/5">
					<div
						class="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all duration-500"
						style="width: {stats?.health || 100}%"
					></div>
				</div>
			</div>

			<div>
				<div class="mb-1 flex justify-between">
					<span class="text-white/60">Hunger</span>
					<span class="text-orange-500">{stats?.hunger || 100}/100</span>
				</div>
				<div class="h-1.5 w-full border border-white/10 bg-white/5">
					<div
						class="h-full bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.5)] transition-all duration-500"
						style="width: {stats?.hunger || 100}%"
					></div>
				</div>
			</div>

			<div class="flex justify-between">
				<span class="text-white/60">Currency</span>
				<span class="font-bold text-[#f8d81c]">{stats?.money || 0} GOLD</span>
			</div>
		</div>

		<div class="flex min-h-[150px] flex-1 flex-col">
			<div class="mb-3 border-b border-white/10 pb-1">
				<h3 class="font-press-start text-[8px] text-white/40">Inventory / Equipment</h3>
			</div>
			<div class="custom-scrollbar flex-1 overflow-y-auto pr-2">
				<ul class="list-none space-y-2 p-0 text-[11px] text-white/80">
					{#each [...(stats?.weapons || []), ...(stats?.inventory || [])] as item}
						<li class="flex gap-2">
							<span class="text-[#f8d81c]">></span>
							<span class="leading-tight">{item}</span>
						</li>
					{/each}
					{#if !stats?.inventory?.length && !stats?.weapons?.length}
						<li class="italic text-white/20">Empty</li>
					{/if}
				</ul>
			</div>
		</div>

		<div class="border-t border-white/10 pt-4 font-press-start text-[9px] text-white/40 opacity-50">
			SYSTEM SIGNAL: STABLE
		</div>
	</div>
</div>
