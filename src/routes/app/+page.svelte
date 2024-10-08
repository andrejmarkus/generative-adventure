<script>
	import AdventureSelect from "../../lib/AdventureSelect.svelte";

    export let data;
</script>

<div class="hero w-full">
    <div class="hero-content">
        <div class="text-center">
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
</div>