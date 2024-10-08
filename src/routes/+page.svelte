<script>
    import { signIn } from "@auth/sveltekit/client"
    import { page } from "$app/stores"
</script>

<svelte:head>
    <title>Generative Adventure</title>
</svelte:head>

<div class="hero min-h-screen">
    <div class="hero-content text-center">
        <div>
            {#if !$page.data.session}
                <p class="text-3xl font-bold">Welcome to Genertive Adventure</p>
                <p class="text-xl mt-2">To enjoy your first adventure, please sign in.</p>
                <button class="btn btn-primary mt-5" on:click={() => signIn()}>Sign in</button>
            {/if}
        </div>
    </div>
</div>