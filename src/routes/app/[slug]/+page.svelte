<script>
	import Console from "$lib/Console.svelte";

    export let data;
</script>

<svelte:head>
    <title>Generative adventure</title>
</svelte:head>

<div class="h-[93vh]">
    <Console messages={data.messages} />
</div>
