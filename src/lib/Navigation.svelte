<script>
    import { signIn, signOut } from "@auth/sveltekit/client"
    import { page } from "$app/stores"
</script>

<nav class="navbar bg-base-200">
    <div class="flex-1">
        <a href="/" class="btn btn-ghost font-pixel-operator text-2xl font-bold">Generative Adventure</a>
    </div>
    <div class="flex-none">
        {#if $page.data.session}
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full">
                        <img src={$page.data.session.user.image}>
                    </div>
                </div>
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <ul tabindex="0" class="menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow bg-base-200">
                    <li><button on:click={() => signOut()}>Sign Out</button></li>
                </ul>
            </div>
        {:else}
            <ul class="menu menu-horizontal">
                <li><button class="btn btn-ghost" on:click={() => signIn()}>Sign in</button></li>
            </ul>
        {/if}
    </div>
</nav>