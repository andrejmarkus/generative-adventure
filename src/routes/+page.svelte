<script>
	import { signIn } from '@auth/sveltekit/client';
</script>

<svelte:head>
	<title>Generative Adventure</title>
</svelte:head>

<div
	class="retro-screen relative flex h-[92vh] w-full flex-col items-center justify-center text-center"
>
	<div class="scanline pointer-events-none"></div>
	<div class="relative z-10 flex flex-col items-center">
		<p
			class="font-pixel-operator text-7xl font-bold tracking-tighter text-[#3f3] [text-shadow:0_0_20px_rgba(51,255,51,0.8)]"
		>
			GENERATIVE ADVENTURE
		</p>
		<p class="mt-6 text-2xl text-[#3f3]/70">SYSTEM_REBOOT: SUCCESSFUL... READY FOR COMMANDS.</p>

		<div class="mt-12 flex flex-col items-center gap-6">
			<div class="bg-[#0a1208]/80 p-6 shadow-[0_0_30px_rgba(51,255,51,0.2)] ring-1 ring-[#3f3]/50">
				<p class="mb-4 text-xl text-[#3f3]">INITIALIZING CONNECTION TO NARRATOR_ENGINE...</p>
				<button
					class="border border-[#3f3] px-8 py-3 text-xl font-bold tracking-widest text-[#3f3] shadow-[0_0_15px_rgba(51,255,51,0.4)] transition-all hover:bg-[#3f3] hover:text-[#050a04]"
					on:click={() => signIn()}
				>
					[ EXECUTE_LOGIN ]
				</button>
			</div>
			<p class="animate-pulse text-sm text-[#3f3]/40">AWAITING AUTHORIZATION...</p>
		</div>
	</div>
	<footer class="footer footer-center p-4 text-base-content">
		<aside>
			<p>Let <b>AI</b> help with realizing you adventure, that you are dreaming of.</p>
		</aside>
	</footer>
</div>
