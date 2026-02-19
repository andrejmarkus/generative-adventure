<script>
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
</script>

<div class="min-h-screen bg-[#050a04] selection:bg-[#3f3] selection:text-black">
	<Navigation />
	<slot></slot>
</div>
