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
    <div class="bg-base-200 w-full flex flex-col gap-5 p-5 rounded-lg">
        <div>
            <p class="text-2xl font-pixel-operator">{name}</p>
            <p>You play as {characterName}</p>
        </div>
        <div>
            <button on:click={deleteAdventure} class="btn btn-error">Delete</button>
            <a href="/app/{adventureId}" class="btn btn-primary">Select</a>
        </div>
    </div>
{/if}