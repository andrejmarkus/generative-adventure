<script>
	import AdventureSelect from '$lib/components/AdventureSelect.svelte';

	export let data;
</script>

<svelte:head>
	<title>My Adventures</title>
</svelte:head>

<div class="retro-screen relative flex min-h-[92vh] w-full flex-col items-center p-6">
	<div class="scanline pointer-events-none"></div>
	<div class="relative z-10 w-full max-w-4xl">
		<h1
			class="mb-8 font-pixel-operator text-4xl font-bold uppercase tracking-widest text-[#3f3] [text-shadow:0_0_10px_rgba(51,255,51,0.5)]"
		>
			ACTIVE_TIMELINES
		</h1>
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
				<div class="bg-[#0a1208]/80 p-12 text-center ring-1 ring-[#3f3]/30">
					<p class="mb-4 animate-pulse font-pixel-operator text-2xl text-[#3f3]/60">
						ERROR: NO_ACTIVE_DATA_STREAMS_FOUND
					</p>
					<p class="font-mono text-xs uppercase tracking-widest text-[#3f3]/40">
						PLEASE_INITIALIZE_TEMPORAL_ANCHOR
					</p>
				</div>
			{/if}

			<div class="mt-8">
				<a
					href="/app/add"
					class="inline-block border border-[#3f3] px-10 py-4 font-pixel-operator text-2xl font-bold uppercase tracking-widest text-[#3f3] shadow-[0_0_20px_rgba(51,255,51,0.3)] transition-all hover:bg-[#3f3] hover:text-[#050a04]"
				>
					[ INIT_NEW_TIMELINE ]
				</a>
			</div>
		</div>
	</div>
</div>
