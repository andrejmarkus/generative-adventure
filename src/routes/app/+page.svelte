<script>
	import AdventureSelect from '$lib/components/AdventureSelect.svelte';

	export let data;
</script>

<svelte:head>
	<title>My Adventures</title>
</svelte:head>

<div class="relative h-[92vh] w-full">
	<div class="mx-auto w-2/3">
		<p class="font-pixel-operator text-4xl font-bold">My Adventures</p>
		{#if data.adventures}
			{#each data.adventures as adventure}
				<AdventureSelect
					adventureId={adventure._id}
					name={adventure.name}
					characterName={adventure.characterName}
				/>
			{/each}
		{:else}
			<div class="rounded-box bg-base-200 px-4 py-2 text-center">
				<p class="whitespace-pre-line text-xl">
					You don't have any adventures. Please, create one.
				</p>
			</div>
		{/if}
		<a href="/app/add" class="btn btn-primary mt-5">Add adventure</a>
	</div>
</div>
