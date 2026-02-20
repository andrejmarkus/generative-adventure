<script>
	import AdventureSelect from '$lib/components/AdventureSelect.svelte';

	export let data;
</script>

<svelte:head>
	<title>My Adventures</title>
</svelte:head>

<div class="relative flex min-h-[92vh] w-full flex-col items-center p-12">
	<div class="relative z-10 w-full max-w-5xl">
		<div class="mb-12 flex items-center gap-6">
			<div class="h-10 w-2 bg-[#f8d81c]"></div>
			<h1 class="font-press-start text-sm uppercase tracking-[0.5em] text-white">
				SAVED CHRONICLES
			</h1>
		</div>
		<div class="flex flex-col gap-6">
			{#if data.adventures && data.adventures.length > 0}
				{#each data.adventures as adventure}
					<AdventureSelect
						adventureId={adventure._id}
						name={adventure.name}
						characterName={adventure.characterName}
					/>
				{/each}
			{:else}
				<div class="retro-container border-dashed border-white/10 bg-black/40 p-16 text-center">
					<p class="font-press-start mb-6 text-[10px] uppercase tracking-widest text-white/40">
						NO TEMPORAL STREAMS DETECTED
					</p>
					<div class="flex flex-col items-center justify-center gap-4">
						<div class="h-1 w-12 bg-white/20"></div>
						<p class="font-pixel-operator text-xl text-white/20">CREATE A NEW HISTORY</p>
					</div>
				</div>
			{/if}

			<div class="mt-12">
				<a href="/app/add" class="retro-button is-primary px-12 py-5 font-bold uppercase">
					NEW QUEST
				</a>
			</div>
		</div>
	</div>
</div>
