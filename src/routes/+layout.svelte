<script>
	import '../app.css';
	import Navigation from '$lib/Navigation.svelte';
</script>

<div class="min-h-screen">
	<Navigation />
	<slot></slot>
</div>
