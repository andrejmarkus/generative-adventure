<script>
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
</script>

<div class="min-h-screen bg-[#0a0a0a] selection:bg-[#f8d81c] selection:text-black">
	<div class="crt-flicker pointer-events-none"></div>
	<div class="scanline pointer-events-none"></div>
	<Navigation />
	<slot></slot>
</div>
