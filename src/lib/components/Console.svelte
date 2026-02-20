<script>
	import Message from './Message.svelte';
	import { page } from '$app/stores';
	import { onMount, tick } from 'svelte';

	export let messages = [];

	let prompt;
	let loading = false;
	let isThinking = false;
	let result = '';
	let container;
	let autoscroll = true;

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

			await typewriter(fullText);

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

		await typewriter(fullText);

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

<div class="relative flex h-full flex-col items-stretch p-8 font-pixel-operator">
	<div
		bind:this={container}
		on:scroll={handleScroll}
		class="custom-scrollbar relative z-0 flex h-full flex-col overflow-y-auto px-4"
	>
		{#if messages}
			<div class="flex flex-col gap-2 pt-8">
				{#each messages.slice(2) as message, i}
					<Message message={message.content} user={i % 2 == 1} />
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
					placeholder={isThinking ? 'TRANSMITTING...' : loading ? 'PROCESSING...' : 'ENTER COMMAND'}
					class="font-press-start w-full bg-transparent text-[10px] tracking-widest text-white outline-none placeholder:text-white/20"
					type="text"
					autocomplete="off"
				/>
			</div>
		</div>
	</form>
</div>
