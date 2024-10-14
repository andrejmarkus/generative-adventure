<script>
    export let adventureId;
    export let name;
    export let characterName;

    let show = true;

    const deleteAdventure = async () => {
        const response = await fetch('/app/delete', {
            method: 'POST',
            body: JSON.stringify({ adventureId }),
            headers: {
                'content-type': 'application/json'
            }
        });

        if (response.ok) {
            show = false;
        }
    }
</script>

{#if show}
    <div class="bg-base-200 w-full flex justify-between items-center px-4 py-2">
        <div>
            <p class="text-xl">{name}</p>
            <p>You play as {characterName}</p>
        </div>
        <div>
            <button on:click={deleteAdventure} class="btn btn-error">Delete</button>
            <a href="/app/{adventureId}" class="btn btn-primary">Select</a>
        </div>
    </div>
{/if}