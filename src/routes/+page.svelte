<script>
    import { signIn } from "@auth/sveltekit/client"
</script>

<svelte:head>
    <title>Generative Adventure</title>
</svelte:head>

<div class="retro-screen relative flex h-[92vh] w-full flex-col items-center justify-center text-center">
    <div class="scanline pointer-events-none"></div>
    <div class="relative z-10 flex flex-col items-center">
        <p class="font-pixel-operator text-7xl font-bold tracking-tighter text-[#3f3] [text-shadow:0_0_20px_rgba(51,255,51,0.8)]">
            GENERATIVE ADVENTURE
        </p>
        <p class="mt-6 text-2xl text-[#3f3]/70">SYSTEM_REBOOT: SUCCESSFUL... READY FOR COMMANDS.</p>
        
        <div class="mt-12 flex flex-col items-center gap-6">
            <div class="ring-1 ring-[#3f3]/50 bg-[#0a1208]/80 p-6 shadow-[0_0_30px_rgba(51,255,51,0.2)]">
                <p class="text-xl text-[#3f3] mb-4">INITIALIZING CONNECTION TO NARRATOR_ENGINE...</p>
                <button 
                    class="px-8 py-3 border border-[#3f3] text-[#3f3] hover:bg-[#3f3] hover:text-[#050a04] transition-all font-bold tracking-widest text-xl shadow-[0_0_15px_rgba(51,255,51,0.4)]"
                    on:click={() => signIn()}
                >
                    [ EXECUTE_LOGIN ]
                </button>
            </div>
            <p class="text-[#3f3]/40 animate-pulse text-sm">AWAITING AUTHORIZATION...</p>
        </div>
    </div>
</div>
    </div>
    <footer class="footer footer-center text-base-content p-4">
        <aside>
            <p>Let <b>AI</b> help with realizing you adventure, that you are dreaming of.</p>
        </aside>
    </footer>
</div>