<script>
	import { fade } from 'svelte/transition';
	export let message;
	export let user = false;
	export let isLoading = false;
</script>

<div
	in:fade={{ duration: 400 }}
	class="mb-6 flex flex-col {user ? 'items-end' : 'items-start'} w-full"
>
	<div
		class="max-w-[90%] {user
			? 'border-l-4 border-[#0ff]/60 bg-[#001a1a]/40 p-4 text-[#0ff] [text-shadow:0_0_8px_rgba(0,255,255,0.4)]'
			: 'border-l-4 border-[#3f3]/60 bg-[#051105]/40 p-4 text-[#3f3] [text-shadow:0_0_8px_rgba(51,255,51,0.4)]'}"
	>
		<div
			class="font-mono mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] opacity-40"
		>
			{#if user}
				<span class="h-1 w-8 bg-[#0ff]/40"></span>
				<span>PLAYER_INPUT</span>
			{:else}
				<span class="h-1 w-8 bg-[#3f3]/40"></span>
				<span>NARRATOR_FEED</span>
			{/if}
		</div>
		<p
			class="whitespace-pre-wrap text-wrap font-pixel-operator text-xl leading-relaxed tracking-wide"
		>
			{#if !user && !message}
				<span class="animate-pulse italic opacity-70">AWAITING_DATA_STREAM...</span>
			{/if}
			{message}
			{#if isLoading && message}
				<span class="mb-[-2px] ml-1 inline-block h-[1.1em] w-2.5 animate-pulse bg-current"></span>
			{/if}
		</p>
	</div>
</div>
