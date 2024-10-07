<script>
    import { SignIn, SignOut } from "@auth/sveltekit/components"
    import { page } from "$app/stores"
</script>

<div>
    {#if $page.data.session}
        <SignOut>
            <div slot="submitButton" class="buttonPrimary">Sign out</div>
        </SignOut>
    {:else}
        <SignIn>
            <div slot="submitButton" class="buttonPrimary">Sign in</div>
        </SignIn>
    {/if}
</div>