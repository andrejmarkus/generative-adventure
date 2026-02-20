<script>
	import AdventureSelect from '$lib/components/AdventureSelect.svelte';

	export let data;
</script>

<svelte:head>
	<title>My Adventures</title>
</svelte:head>

<div class="relative flex min-h-[92vh] w-full flex-col items-center p-6 md:p-12">
	<div class="relative z-10 w-full max-w-5xl">
		<div class="mb-8 flex items-center gap-4 md:mb-12 md:gap-6">
			<div class="h-6 w-1 bg-[#f8d81c] md:h-10 md:w-2"></div>
			<h1
				class="font-press-start text-xs uppercase tracking-[0.2em] text-white md:text-sm md:tracking-[0.5em]"
			>
				SAVED CHRONICLES
			</h1>
		</div>
		<div class="flex flex-col gap-4 md:gap-6">
			{#if data.adventures && data.adventures.length > 0}
				{#each data.adventures as adventure}
					<AdventureSelect
						adventureId={adventure._id}
						name={adventure.name}
						characterName={adventure.characterName}
					/>
				{/each}
			{:else}
				<div
					class="retro-container border-dashed border-white/10 bg-black/40 p-8 text-center md:p-16"
				>
					<p
						class="mb-4 font-press-start text-[8px] uppercase tracking-widest text-white/40 md:mb-6 md:text-[10px]"
					>
						NO TEMPORAL STREAMS DETECTED
					</p>
					<div class="flex flex-col items-center justify-center gap-3 md:gap-4">
						<div class="h-1 w-8 bg-white/20 md:w-12"></div>
						<p class="font-pixel-operator text-lg text-white/20 md:text-xl">CREATE A NEW HISTORY</p>
					</div>
				</div>
			{/if}

			<div class="mt-8 text-center md:mt-12 md:text-left">
				<a
					href="/app/add"
					class="retro-button is-primary w-full px-8 py-3 text-[8px] font-bold uppercase md:w-auto md:px-12 md:py-5 md:text-[10px]"
				>
					NEW QUEST
				</a>
			</div>
		</div>
	</div>
</div>
