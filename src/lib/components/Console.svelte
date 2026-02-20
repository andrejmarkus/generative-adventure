<script>
	import Message from './Message.svelte';
	import StatusBar from './StatusBar.svelte';
	import CommandLine from './CommandLine.svelte';
	import { page } from '$app/stores';
	import { onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';

	export let messages = [];
	export let stats = {
		inventory: [],
		weapons: [],
		health: 100,
		hunger: 100,
		money: 0
	};

	let prompt = '';
	let loading = false;
	let isThinking = false;
	let result = '';
	let container;
	let autoscroll = true;
	let isExpanded = false;
	let toasts = [];
	let toastId = 0;
	let toastsSticky = false;
	let toastsExpanded = false;
	let isGameOver = false;
	let loadingMessage = '';
	let loadingMessages = [
		'Consulting the ancient tomes...',
		'Whispering with the spirits...',
		'Rolling the dice of fate...',
		'Weaving the threads of destiny...',
		'Consulting the oracle...',
		'Deciphering the runes...',
		'Channeling the narrative...',
		'Crafting your legend...'
	];
	let showHelp = false;
	let shaking = false;

	const triggerShake = (intensity = 'medium') => {
		shaking = true;
		setTimeout(() => (shaking = false), 500);
	};

	$: if (stats) {
		// Detect stat changes and show toasts
		const prevStats = stats;
		// We'll compare in the reactive statement below
	}

	// Check for game over condition
	$: isGameOver =
		stats?.health <= 0 ||
		stats?.hunger <= 0 ||
		(messages &&
			messages.length > 0 &&
			messages[messages.length - 1]?.content?.toUpperCase().includes('GAME OVER:'));

	// Reactive statement to detect changes
	$: {
		if (stats && typeof window !== 'undefined') {
			const prevStats = JSON.parse(sessionStorage.getItem('prevStats') || '{}');
			const changes = [];

			if (prevStats.health !== undefined && prevStats.health !== stats.health) {
				const diff = stats.health - prevStats.health;
				if (diff < 0) triggerShake();
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
				const currentToastId = ++toastId;
				toasts = [...toasts, { ...change, id: currentToastId }];

				// Auto-expand on new change
				if (!toastsSticky) {
					toastsExpanded = true;
				}

				setTimeout(() => {
					toasts = toasts.filter((t) => t.id !== currentToastId);
					// Auto-collapse if empty
					if (toasts.length === 0 && !toastsSticky) {
						toastsExpanded = false;
					}
				}, 6000);
			});

			sessionStorage.setItem('prevStats', JSON.stringify(stats));
		}
	}

	const removeToast = (id) => {
		toasts = toasts.filter((t) => t.id !== id);
		if (toasts.length === 0 && !toastsSticky) {
			toastsExpanded = false;
		}
	};

	const toggleToastsSticky = () => {
		toastsSticky = !toastsSticky;
		toastsExpanded = toastsSticky;
	};

	const onToastsHover = (state) => {
		if (!toastsSticky && toasts.length > 0) {
			toastsExpanded = state;
		}
	};

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

		// Add keyboard shortcuts
		const handleKeydown = (e) => {
			const isMod = e.ctrlKey || e.metaKey;
			const isInputFocused =
				document.activeElement?.tagName === 'INPUT' ||
				document.activeElement?.tagName === 'TEXTAREA';
			const key = e.key.toLowerCase();

			// If the user is typing in an input and not using a shortcut modifier,
			// let the browser handle it (e.g., typing the letter 'h')
			if (isInputFocused && !isMod && key !== 'enter' && key !== 'escape') {
				return;
			}

			// Enter to submit (Global if shortcut, or local if focused)
			if (key === 'enter') {
				if ((isMod || isInputFocused) && !loading && !isGameOver) {
					e.preventDefault();
					handleSubmit();
				}
				return;
			}

			// Escape to clear or close modal
			if (key === 'escape') {
				if (showHelp) {
					showHelp = false;
				} else {
					prompt = '';
				}
				return;
			}

			// Global shortcut keys (can be used anywhere, but require Ctrl/Cmd)
			if (isMod) {
				if (key === 'k') {
					e.preventDefault();
					document.querySelector('input[name="prompt"]')?.focus();
					return;
				}
				if (key === 'h') {
					e.preventDefault();
					showHelp = !showHelp;
					return;
				}
			}

			// Single character shortcuts (ONLY when NOT focused)
			if (!isMod && !isInputFocused) {
				if (key === 'h') {
					e.preventDefault();
					showHelp = !showHelp;
					return;
				}
			}
		};

		document.addEventListener('keydown', handleKeydown);
		return () => document.removeEventListener('keydown', handleKeydown);
	});

	const handleSubmit = async () => {
		if (!prompt || loading || isGameOver) return;

		loading = true;
		isThinking = true;
		autoscroll = true;
		messages = [...messages, { role: 'user', content: prompt }];
		prompt = '';

		// Cycle through loading messages
		let messageIndex = 0;
		const messageInterval = setInterval(() => {
			loadingMessage = loadingMessages[messageIndex % loadingMessages.length];
			messageIndex++;
		}, 2000);

		try {
			const response = await fetch(`/api/adventure/${$page.params.slug}/chat`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ messages })
			});

			if (!response.ok) {
				throw new Error(`Server error: ${response.status}`);
			}

			clearInterval(messageInterval);
			loadingMessage = '';

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
		} catch (error) {
			console.error('Chat submission error:', error);
			clearInterval(messageInterval);
			loadingMessage = '';
			loading = false;
			isThinking = false;

			// Show error toast
			toasts = [
				...toasts,
				{
					type: 'error',
					message: 'Failed to send command. Please try again.',
					color: 'text-red-400',
					id: ++toastId
				}
			];
			setTimeout(() => {
				toasts = toasts.filter((t) => t.id !== toastId);
			}, 5000);

			// Restore the prompt if it was cleared and we failed before getting a response
			// but only if the last message was a user message
			if (!prompt && messages.length > 0 && messages[messages.length - 1].role === 'user') {
				prompt = messages[messages.length - 1]?.content || '';
				messages = messages.slice(0, -1);
			}
		}
	};

	const handleQuickAction = (action) => {
		const actions = {
			rest: 'I want to rest and recover my health',
			inventory: 'Show me my current inventory and equipment',
			look: 'I look around and examine my surroundings',
			status: 'Tell me about my current status and condition',
			attack: 'I strike at the nearest enemy with my weapon!',
			defend: 'I brace myself and take a defensive position.'
		};
		prompt = actions[action] || '';
		handleSubmit();
	};

	const updateDatabase = async () => {
		try {
			await fetch(`/api/adventure/${$page.params.slug}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ messages })
			});
		} catch (e) {
			console.error('Failed to update database:', e);
		}
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
	class="relative flex h-full flex-col items-stretch gap-2 p-2 font-pixel-operator sm:gap-4 sm:p-4 lg:p-8 {shaking
		? 'shake'
		: ''}"
>
	<!-- Top Adaptive HUD -->
	<StatusBar {stats} bind:isExpanded onHelpClick={() => (showHelp = !showHelp)} />

	<!-- Game Over Screen -->
	{#if isGameOver}
		<div class="relative z-10 flex flex-col items-center justify-center py-8">
			<div
				class="mx-auto max-w-2xl rounded-lg border-2 border-red-500/50 bg-black/90 p-8 text-center shadow-2xl backdrop-blur-md"
			>
				<div class="mb-6">
					<h1 class="mb-4 animate-pulse font-press-start text-4xl text-red-500">GAME OVER</h1>
					<div class="mx-auto mb-6 h-1 w-24 bg-red-500"></div>
				</div>

				<div class="mb-8 space-y-4 font-pixel-operator text-lg leading-relaxed text-white/90">
					{#if messages && messages.length > 0 && messages[messages.length - 1]?.content
							?.toUpperCase()
							.includes('GAME OVER:')}
						{stripStats(messages[messages.length - 1].content)
							.replace(/GAME OVER:/i, '')
							.trim()}
					{:else}
						<p class="italic text-red-400">Your journey has come to a tragic end...</p>
						<p>
							The shadows of defeat loom large as your final breath escapes into the void. The world
							continues its merciless dance, indifferent to the fall of yet another hero.
						</p>
						<p class="text-yellow-400">
							But remember, brave adventurer: every end is but the seed of a new beginning. Your
							legend may be written, but the story of adventure never truly dies.
						</p>
					{/if}
				</div>

				<div class="border-t border-red-500/30 pt-6">
					<p class="font-press-start text-sm text-red-400/70">FINAL STATS</p>
					<div class="mt-4 flex justify-center gap-8 text-sm">
						<div class="text-center">
							<div class="font-press-start text-red-500">HP: {stats?.health || 0}</div>
						</div>
						<div class="text-center">
							<div class="font-press-start text-orange-500">HG: {stats?.hunger || 0}</div>
						</div>
						<div class="text-center">
							<div class="font-press-start text-yellow-400">GOLD: {stats?.money || 0}</div>
						</div>
					</div>
				</div>

				<div class="mt-8 border-t border-red-500/30 pt-6">
					<div class="flex flex-col items-center gap-4">
						<p class="text-sm italic text-white/60">
							"Death is not the end, but merely a pause in the grand symphony of existence."
						</p>
						<a
							href="/app/add"
							class="rounded border border-red-500/50 bg-red-500/10 px-6 py-2 font-press-start text-sm text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
						>
							START NEW ADVENTURE
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Help Modal -->
	{#if showHelp}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
			<div class="mx-4 max-w-2xl rounded-lg border-2 border-white/20 bg-black/95 p-8 shadow-2xl">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="font-press-start text-xl text-[#f8d81c]">ADVENTURE GUIDE</h2>
					<button
						on:click={() => (showHelp = false)}
						class="font-press-start text-sm text-white/60 hover:text-white"
						aria-label="Close help"
					>
						[X]
					</button>
				</div>

				<div class="space-y-6 font-pixel-operator text-white/90">
					<div>
						<h3 class="mb-2 font-press-start text-sm text-[#f8d81c]">HOW TO PLAY</h3>
						<p class="text-sm leading-relaxed">
							You are the hero of your own story. Describe your actions in natural language and the
							AI narrator will guide you through an epic adventure in ANY setting - from fantasy
							worlds to cyberpunk cities to modern day life. The AI adapts the rules and mechanics
							to fit your chosen universe.
						</p>
					</div>

					<div>
						<h3 class="mb-2 font-press-start text-sm text-[#f8d81c]">COMMANDS</h3>
						<ul class="space-y-1 text-sm">
							<li>
								<strong class="text-[#f8d81c]">Movement:</strong> "walk north", "go to the tavern", "travel
								to the mountains", "drive to the city", "take the elevator up"
							</li>
							<li>
								<strong class="text-[#f8d81c]">Actions:</strong> "attack the goblin", "hack the terminal",
								"talk to the merchant", "investigate the crime scene", "negotiate the deal"
							</li>
							<li>
								<strong class="text-[#f8d81c]">Rest/Recovery:</strong> "rest", "sleep", "eat [food item]",
								"take medication", "recharge my implant"
							</li>
							<li>
								<strong class="text-[#f8d81c]">Inventory:</strong> "check inventory", "use potion", "equip
								sword", "access my neural implant", "check my wallet"
							</li>
						</ul>
					</div>

					<div>
						<h3 class="mb-2 font-press-start text-sm text-[#f8d81c]">STATS</h3>
						<ul class="space-y-1 text-sm">
							<li>
								<strong class="text-green-400">Health (HP):</strong> Reduced in combat, recover by resting
							</li>
							<li>
								<strong class="text-blue-400">Hunger (HG):</strong> Decreases over time, eat food to
								restore
							</li>
							<li>
								<strong class="text-yellow-400">Gold:</strong> Currency for buying equipment and services
							</li>
						</ul>
					</div>

					<div>
						<h3 class="mb-2 font-press-start text-sm text-[#f8d81c]">KEYBOARD SHORTCUTS</h3>
						<ul class="space-y-1 text-sm">
							<li>
								<strong class="text-[#f8d81c]">Enter:</strong> Send message (when input focused)
							</li>
							<li>
								<strong class="text-[#f8d81c]">Ctrl/Cmd + Enter:</strong> Send message (anywhere)
							</li>
							<li><strong class="text-[#f8d81c]">Ctrl/Cmd + K:</strong> Focus input field</li>
							<li><strong class="text-[#f8d81c]">Escape:</strong> Clear input</li>
							<li>
								<strong class="text-[#f8d81c]">Ctrl/Cmd + H:</strong> Toggle this help
							</li>
						</ul>
					</div>

					<div>
						<h3 class="mb-2 font-press-start text-sm text-[#f8d81c]">TIPS</h3>
						<ul class="space-y-1 text-sm">
							<li>• Be descriptive in your actions for better responses</li>
							<li>• Rest regularly to maintain health and avoid death</li>
							<li>• Explore different paths - the story adapts to your choices</li>
							<li>• NPCs remember your interactions and relationships</li>
							<li>• Random events can dramatically change your adventure</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	{/if}
	<div class="pointer-events-none fixed right-4 top-20 z-50 flex flex-col items-end">
		{#if toasts.length > 0}
			<div
				class="retro-container group pointer-events-auto flex flex-col border-white/30 !bg-black/80 shadow-2xl backdrop-blur-md transition-all duration-300 {toastsExpanded
					? 'max-h-[500px] w-64 !p-4'
					: 'max-h-12 w-32 !p-2 px-3'}"
				on:mouseenter={() => onToastsHover(true)}
				on:mouseleave={() => onToastsHover(false)}
				on:click={toggleToastsSticky}
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						toggleToastsSticky();
					}
				}}
				tabindex="0"
				role="button"
				aria-expanded={toastsExpanded}
				aria-label="Toggle notifications log"
			>
				<!-- Stack Header -->
				<div class="flex items-center justify-between gap-3 overflow-hidden">
					<div class="flex items-center gap-2">
						{#if !toastsExpanded}
							<span class="animate-pulse font-press-start text-[10px] text-[#f8d81c]">!</span>
						{/if}
						<span class="font-press-start text-[8px] tracking-widest text-[#f8d81c]">LOG</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="font-press-start text-[8px] text-white/60">[{toasts.length}]</span>
						{#if toastsSticky}
							<div
								class="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]"
							></div>
						{/if}
					</div>
				</div>

				<!-- Expanded Content -->
				{#if toastsExpanded}
					<div class="custom-scrollbar mt-4 flex flex-col gap-2 overflow-y-auto pr-1">
						{#each [...toasts].reverse() as toast (toast.id)}
							<div class="border-b border-white/10 pb-2 last:border-0" in:fade={{ duration: 200 }}>
								<div class="flex items-center justify-between gap-2">
									<p class="font-press-start text-[8px] leading-relaxed {toast.color}">
										{toast.message}
									</p>
									<button
										on:click|stopPropagation={() => removeToast(toast.id)}
										class="font-press-start text-[8px] text-white/20 hover:text-white"
										aria-label="Clear notification"
									>
										X
									</button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div
		class="flex min-w-0 flex-1 flex-col items-stretch overflow-hidden"
		class:opacity-50={isGameOver}
		class:pointer-events-none={isGameOver}
	>
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
				<Message message={result || loadingMessage} user={false} isLoading={true} />
			{/if}
		</div>
		<CommandLine
			bind:prompt
			{loading}
			{isThinking}
			onSubmit={handleSubmit}
			onQuickAction={handleQuickAction}
		/>
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

	.shake {
		animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
		transform: translate3d(0, 0, 0);
	}

	@keyframes shake {
		10%,
		90% {
			transform: translate3d(-1px, 0, 0);
		}
		20%,
		80% {
			transform: translate3d(2px, 0, 0);
		}
		30%,
		50%,
		70% {
			transform: translate3d(-4px, 0, 0);
		}
		40%,
		60% {
			transform: translate3d(4px, 0, 0);
		}
	}
</style>
