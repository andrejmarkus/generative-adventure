<script>
	import AdventureSelect from "../../lib/AdventureSelect.svelte";

    export let data;
</script>

<svelte:head>
    <title>My Adventures</title>
</svelte:head>

<div class="h-[92vh] w-full relative">
    <div class="w-2/3 mx-auto">
            <p class="font-pixel-operator font-bold text-4xl">My Adventures</p>
            {#if data.adventures}
                {#each data.adventures as adventure }
                    <AdventureSelect adventureId={adventure._id} name={adventure.name} characterName={adventure.characterName} />
                {/each}
            {:else}
                <div class="bg-base-200 text-center px-4 py-2 rounded-box">
                    <p class="text-xl whitespace-pre-line">
                        You don't have any adventures.
                        Please, create one.
                    </p>
                </div>
            {/if}
            <a href="/app/add" class="btn btn-primary mt-5">Add adventure</a>
    </div>
</div>