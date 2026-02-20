<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<nav class="navbar border-b border-[#3f3]/20 bg-[#050a04] shadow-[0_0_15px_rgba(51,255,51,0.1)]">
	<div class="flex-1 px-4">
		<a
			href="/"
			class="font-pixel-operator text-2xl font-bold tracking-tighter text-[#3f3] [text-shadow:0_0_10px_rgba(51,255,51,0.5)]"
			>GENERATIVE ADVENTURE v1.0</a
		>
	</div>
	<div class="flex-none px-4">
		{#if $page.data.session}
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn btn-ghost p-1 ring-1 ring-[#3f3]/30">
					<div class="h-8 w-8 overflow-hidden rounded-sm border border-[#3f3]/50">
						<img
							src={$page.data.session.user.image}
							alt="User profile"
							class="contrast-125 grayscale"
						/>
					</div>
				</div>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="menu dropdown-content menu-sm z-[100] mt-3 w-52 border border-[#3f3]/30 bg-[#0a1208] p-2 text-[#3f3] shadow-xl"
				>
					<li><button on:click={() => signOut()} class="hover:bg-[#3f3]/10">LOGOUT</button></li>
				</ul>
			</div>
		{:else}
			<ul class="menu menu-horizontal">
				<li>
					<button
						class="px-4 py-1 text-[#3f3] ring-1 ring-[#3f3] hover:bg-[#3f3]/10"
						on:click={() => signIn()}>LOGIN</button
					>
				</li>
			</ul>
		{/if}
	</div>
</nav>
