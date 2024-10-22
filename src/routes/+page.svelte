<script>
    import { signIn } from "@auth/sveltekit/client"
</script>

<svelte:head>
    <title>Generative Adventure</title>
</svelte:head>

<div class="h-[92vh] w-full relative flex flex-col justify-between">
    <div class="absolute -z-10 bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]"></div>
    <div class="flex h-full items-center justify-center text-center flex-col">
        <div>
            <p class="font-pixel-operator text-8xl font-bold whitespace-pre-line">
                Welcome to
                <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Generative Adventure</span>!
            </p>
            <p class="text-2xl mt-4">Experience your unique adventures as you want, wherever you want.</p>
        </div>
        <div class="relative group mt-9">
            <div
                class="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-75 group-hover:opacity-100 group-hover:blur-lg">
            </div>
            <div class="bg-base-content rounded-xl flex justify-between items-center p-4 drop-shadow-lg w-fit gap-8">
                <span class="flex items-center gap-3">
                    <span class="text-4xl">✨</span>
                    <span class="text-primary-content text-lg">Tell me, where should your adventure take place?</span>
                </span>
                <button class="btn btn-primary drop-shadow-md" on:click={() => signIn()}>Sign in</button>
            </div>
        </div>
    </div>
    <footer class="footer footer-center text-base-content p-4">
        <aside>
            <p>Let <b>AI</b> help with realizing you adventure, that you are dreaming of.</p>
        </aside>
    </footer>
</div>