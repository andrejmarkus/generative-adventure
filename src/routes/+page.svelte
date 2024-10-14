<script>
    import { signIn } from "@auth/sveltekit/client"
    import { page } from "$app/stores"
</script>

<svelte:head>
    <title>Generative Adventure</title>
</svelte:head>

<div class="flex h-[91vh] mx-auto justify-around items-center">
    <div>
        {#if !$page.data.session}
            <p class="font-pixel-operator text-6xl font-bold whitespace-pre-line">
                Welcome to
                <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Generative Adventure</span>!
            </p>
            <p class="text-xl mt-4">To enjoy your first adventure, please sign in.</p>
            <button class="btn btn-primary mt-9" on:click={() => signIn()}>Sign in</button>
        {/if}
    </div>
    <div>
        <p>Hello</p>
    </div>
</div>