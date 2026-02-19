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
			const response = await fetch(`/api/app/${$page.params.slug}/init`, {
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

		const response = await fetch(`/api/app/${$page.params.slug}/chat`, {
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
		await fetch(`/api/app/${$page.params.slug}`, {
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
	class="retro-screen relative flex size-full flex-col items-stretch p-6 font-pixel-operator text-xl"
>
	<div class="scanline pointer-events-none"></div>
	<div
		bind:this={container}
		on:scroll={handleScroll}
		class="relative z-0 flex h-full flex-col overflow-y-auto px-4"
	>
		{#if messages}
			{#each messages.slice(2) as message, i}
				<Message message={message.content} user={i % 2 == 1} />
			{/each}
		{/if}
		{#if loading}
			<Message message={result} user={false} isLoading={true} />
		{/if}
	</div>
	<form class="relative z-20 pt-4" method="post" on:submit|preventDefault={handleSubmit}>
		<div class="flex items-center gap-4 bg-black/40 p-2 ring-1 ring-[#3f3]/30">
			<span class="animate-pulse text-[#3f3] shadow-lg">&gt;</span>
			<input
				bind:value={prompt}
				disabled={loading}
				name="prompt"
				placeholder={isThinking
					? 'ANALYZING...'
					: loading
						? 'TRANSMITTING...'
						: 'WAITING FOR COMMAND...'}
				class="w-full border-none bg-transparent text-[#3f3] outline-none placeholder:text-[#3f3]/30"
				type="text"
				autocomplete="off"
			/>
		</div>
	</form>
</div>
