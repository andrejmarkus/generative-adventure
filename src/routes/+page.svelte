<script>
	import { signIn } from '@auth/sveltekit/client';
</script>

<svelte:head>
	<title>Generative Adventure</title>
</svelte:head>

<div
	class="relative flex h-[92vh] w-full flex-col items-center justify-center overflow-hidden bg-[#040404] p-12 text-center"
>
	<div class="relative z-10 flex flex-col items-center">
		<div class="mb-6 opacity-40">
			<span class="font-press-start text-[10px] tracking-[1em] text-white">EST. 2026</span>
		</div>
		<h1 class="font-press-start text-4xl font-bold leading-tight tracking-[0.2em] text-white">
			GENERATIVE<br /><span class="text-[#f8d81c]">ADVENTURE</span>
		</h1>
		<div class="mt-12 h-1 w-24 bg-white/20"></div>
		<p class="mt-12 max-w-xl font-pixel-operator text-2xl tracking-widest text-white/50">
			A WORLD BUILT FROM STRINGS AND DATA.<br />
			YOUR CHOICES DEFINE THE NARRATIVE.
		</p>

		<div class="mt-20 flex flex-col items-center gap-10">
			<div class="p-1">
				<button
					class="retro-button is-primary font-press-start bg-black px-16 py-6 text-xs font-bold tracking-[0.5em] transition-all hover:scale-105 active:scale-95"
					on:click={() => signIn()}
				>
					PRESS START
				</button>
			</div>
			<div class="flex items-center gap-4 opacity-20">
				<div class="h-1 w-8 bg-white"></div>
				<p class="font-press-start text-[8px] uppercase tracking-widest text-white">
					AWAITING CONNECTION
				</p>
				<div class="h-1 w-8 bg-white"></div>
			</div>
		</div>
	</div>
</div>
