<script>
	import { signIn } from '@auth/sveltekit/client';
</script>

<svelte:head>
	<title>Generative Adventure</title>
</svelte:head>

<div
	class="relative flex min-h-[92vh] w-full flex-col items-center justify-center overflow-hidden bg-[#040404] p-6 text-center sm:p-12"
>
	<div class="relative z-10 flex max-w-full flex-col items-center px-4">
		<div class="mb-4 opacity-40 sm:mb-6">
			<span
				class="whitespace-nowrap font-press-start text-[8px] tracking-[0.5em] text-white sm:text-[10px] sm:tracking-[1em]"
				>EST. 2026</span
			>
		</div>
		<h1
			class="font-press-start text-xl font-bold leading-tight tracking-[0.1em] text-white sm:text-2xl sm:tracking-[0.2em] md:text-4xl"
		>
			GENERATIVE<br /><span class="text-[#f8d81c]">ADVENTURE</span>
		</h1>
		<div class="mt-8 h-0.5 w-16 bg-white/20 sm:mt-12 sm:h-1 sm:w-24"></div>
		<p
			class="mt-8 max-w-xl font-pixel-operator text-lg leading-relaxed tracking-widest text-white/50 sm:mt-12 sm:text-xl md:text-2xl"
		>
			A WORLD BUILT FROM STRINGS AND DATA.<br class="hidden sm:block" />
			YOUR CHOICES DEFINE THE NARRATIVE.
		</p>

		<div class="mt-12 flex w-full flex-col items-center gap-6 sm:mt-20 sm:gap-10">
			<div class="w-full p-1 sm:w-auto">
				<button
					class="retro-button is-primary w-full bg-black px-8 py-4 font-press-start text-[10px] font-bold tracking-[0.2em] transition-all hover:scale-105 active:scale-95 sm:w-auto sm:px-16 sm:py-6 sm:text-xs sm:tracking-[0.5em]"
					on:click={() => signIn()}
				>
					PRESS START
				</button>
			</div>
			<div class="flex items-center gap-4 opacity-20">
				<div class="h-[1px] w-6 bg-white sm:w-8"></div>
				<p class="font-press-start text-[6px] uppercase tracking-widest text-white sm:text-[8px]">
					AWAITING CONNECTION
				</p>
				<div class="h-[1px] w-6 bg-white sm:w-8"></div>
			</div>
		</div>
	</div>
</div>
