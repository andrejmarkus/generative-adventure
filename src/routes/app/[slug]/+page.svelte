<script>
	import Console from '$lib/components/Console.svelte';

	export let data;
</script>

<svelte:head>
	<title>Generative adventure</title>
</svelte:head>

<div class="h-[calc(100dvh-64px)] lg:h-[93vh]">
	<Console messages={data.messages} stats={data.adventure.stats} />
</div>
