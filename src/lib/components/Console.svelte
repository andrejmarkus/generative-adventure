<script>
	import Message from './Message.svelte';
	import StatusBar from './StatusBar.svelte';
	import CommandLine from './CommandLine.svelte';
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
	let isExpanded = false;
	let toasts = [];
	let toastId = 0;

	$: if (stats) {
		// Detect stat changes and show toasts
		const prevStats = stats;
		// We'll compare in the reactive statement below
	}

	// Reactive statement to detect changes
	$: {
		if (stats && typeof window !== 'undefined') {
			const prevStats = JSON.parse(sessionStorage.getItem('prevStats') || '{}');
			const changes = [];

			if (prevStats.health !== undefined && prevStats.health !== stats.health) {
				const diff = stats.health - prevStats.health;
				changes.push({
					type: 'health',
					message: `Health ${diff > 0 ? '+' : ''}${diff}`,
					color: diff > 0 ? 'text-green-400' : 'text-red-400'
				});
			}
			if (prevStats.hunger !== undefined && prevStats.hunger !== stats.hunger) {
				const diff = stats.hunger - prevStats.hunger;
				changes.push({
					type: 'hunger',
					message: `Hunger ${diff > 0 ? '+' : ''}${diff}`,
					color: diff > 0 ? 'text-blue-400' : 'text-orange-400'
				});
			}
			if (prevStats.money !== undefined && prevStats.money !== stats.money) {
				const diff = stats.money - prevStats.money;
				changes.push({
					type: 'money',
					message: `Gold ${diff > 0 ? '+' : ''}${diff}`,
					color: 'text-yellow-400'
				});
			}

			// Check inventory changes
			const prevInventory = prevStats.inventory || [];
			const currentInventory = stats.inventory || [];
			const addedItems = currentInventory.filter((item) => !prevInventory.includes(item));
			const removedItems = prevInventory.filter((item) => !currentInventory.includes(item));

			addedItems.forEach((item) => {
				changes.push({
					type: 'inventory',
					message: `+ ${item}`,
					color: 'text-green-400'
				});
			});
			removedItems.forEach((item) => {
				changes.push({
					type: 'inventory',
					message: `- ${item}`,
					color: 'text-red-400'
				});
			});

			// Check weapons changes
			const prevWeapons = prevStats.weapons || [];
			const currentWeapons = stats.weapons || [];
			const addedWeapons = currentWeapons.filter((item) => !prevWeapons.includes(item));
			const removedWeapons = prevWeapons.filter((item) => !currentWeapons.includes(item));

			addedWeapons.forEach((item) => {
				changes.push({
					type: 'weapon',
					message: `+ ${item}`,
					color: 'text-purple-400'
				});
			});
			removedWeapons.forEach((item) => {
				changes.push({
					type: 'weapon',
					message: `- ${item}`,
					color: 'text-red-400'
				});
			});

			changes.forEach((change) => {
				toasts = [...toasts, { ...change, id: ++toastId }];
				setTimeout(() => {
					toasts = toasts.filter((t) => t.id !== toastId);
				}, 3000);
			});

			sessionStorage.setItem('prevStats', JSON.stringify(stats));
		}
	}

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
	class="relative flex h-full flex-col items-stretch gap-2 p-2 font-pixel-operator sm:gap-4 sm:p-4 lg:p-8"
>
	<!-- Top Adaptive HUD -->
	<StatusBar {stats} bind:isExpanded />

	<!-- Toast Notifications -->
	<div class="fixed right-4 top-20 z-50 space-y-2">
		{#each toasts as toast (toast.id)}
			<div
				class="animate-slide-in-right border bg-gray-800 border-{toast.color.split(
					'-'
				)[1]}-400 font-mono rounded px-4 py-2 text-sm text-white shadow-lg {toast.color}"
			>
				{toast.message}
			</div>
		{/each}
	</div>

	<div class="flex min-w-0 flex-1 flex-col items-stretch overflow-hidden">
		<div
			bind:this={container}
			on:scroll={handleScroll}
			class="custom-scrollbar relative z-0 flex h-full flex-col overflow-y-auto px-2 sm:px-4"
		>
			{#if messages}
				<div class="flex flex-col gap-2 pt-4 sm:pt-8">
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
		<CommandLine {prompt} {loading} {isThinking} onSubmit={handleSubmit} />
	</div>
</div>

<style>
	@keyframes slide-in-right {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}
	.animate-slide-in-right {
		animation: slide-in-right 0.5s ease-out;
	}
</style>
