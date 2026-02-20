<script>
	import { fade } from 'svelte/transition';
	export let message;
	export let user = false;
	export let isLoading = false;
</script>

<div
	in:fade={{ duration: 400 }}
	class="mb-10 flex flex-col {user ? 'items-end' : 'items-start'} group w-full"
>
	<div
		class="retro-container max-w-[85%] {user
			? 'border-white/60 bg-[#111] shadow-[4px_4px_0_0_rgba(255,255,255,0.05)]'
			: 'border-white/20 bg-black'}"
	>
		<div
			class="mb-4 flex items-center gap-3 font-press-start text-[8px] uppercase tracking-[0.2em] {user
				? 'text-[#f8d81c]'
				: 'text-white'}"
		>
			<span class="h-1.5 w-1.5 animate-pulse bg-current"></span>
			{#if user}
				<span>INPUT</span>
			{:else}
				<span>CHRONICLE</span>
			{/if}
		</div>
		<p
			class="whitespace-pre-wrap text-wrap font-pixel-operator text-xl leading-relaxed tracking-wide md:text-2xl {user
				? 'text-[#f8d81c]/90'
				: 'text-white/90'}"
		>
			{#if !user && !message}
				<span class="animate-pulse opacity-40">...</span>
			{:else}
				{message}
			{/if}
			{#if isLoading && message}
				<span class="ml-2 inline-block h-4 w-4 animate-pulse bg-current opacity-80"></span>
			{/if}
		</p>
	</div>
</div>
