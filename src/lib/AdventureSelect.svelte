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
            <button onclick="confirm_modal.showModal()" class="btn btn-error">Delete</button>
            <a href="/app/{adventureId}" class="btn btn-primary">Select</a>
        </div>
    </div>
{/if}
<dialog id="confirm_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
        <h3>Delete adventure</h3>
        <p>Are you sure you want to delete this adventure?</p>
        <div class="modal-action">
            <form method="dialog">
                <button on:click={deleteAdventure} class="btn btn-error">Yes</button>
                <button class="btn">No</button>
            </form>
        </div>
    </div>
</dialog>