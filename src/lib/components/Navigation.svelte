<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<nav
	class="navbar sticky top-0 z-[1000] border-b-2 border-white/10 bg-black/80 px-2 backdrop-blur-sm sm:px-4"
>
	<div class="flex-1">
		<a
			href="/"
			class="font-press-start text-[8px] font-bold tracking-tight text-white transition-colors hover:text-[#f8d81c] sm:text-xs sm:tracking-[0.2em]"
			><span class="hidden sm:inline">GENERATIVE </span>ADVENTURE</a
		>
	</div>
	<div class="flex-none">
		{#if $page.data.session}
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="retro-button h-auto min-h-0 p-1">
					<div class="h-6 w-6 overflow-hidden border border-white/20">
						<img
							src={$page.data.session.user.image}
							alt="User profile"
							class="contrast-125 grayscale transition-all hover:grayscale-0"
						/>
					</div>
				</div>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="retro-container menu dropdown-content menu-sm z-[100] mt-3 w-44 border-white/40 bg-black p-2 text-white"
				>
					<li>
						<button
							on:click={() => signOut()}
							class="rounded-none py-3 font-press-start text-[8px] hover:bg-white/10"
							>EXIT GAME</button
						>
					</li>
				</ul>
			</div>
		{:else}
			<ul class="menu menu-horizontal">
				<li>
					<button class="retro-button px-3 py-1.5 text-[8px]" on:click={() => signIn()}
						>CONNECT</button
					>
				</li>
			</ul>
		{/if}
	</div>
</nav>
