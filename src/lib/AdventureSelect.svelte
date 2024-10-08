<script>
    export let adventureId;
    export let name;
    export let characterName;
</script>

<div class="bg-base-200 w-full flex justify-between items-center px-4 py-2">
    <div>
        <p class="text-xl">{name}</p>
        <p>You play as {characterName}</p>
    </div>
    <a href="/app/{adventureId}" class="btn btn-primary">Select</a>
</div>