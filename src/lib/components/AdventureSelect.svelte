<script>
	export let adventureId;
	export let name;
	export let characterName;

	let show = true;
	let confirm_modal;

	const deleteAdventure = async () => {
		const response = await fetch('/app/delete', {
			method: 'POST',
			body: JSON.stringify({ adventureId }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok) {
			show = false;
		}
	};
</script>

{#if show}
	<div class="retro-container group bg-[#040404] p-6 transition-all hover:bg-[#080808]">
		<div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
			<div>
				<p
					class="font-press-start text-sm uppercase tracking-[0.2em] text-white transition-colors group-hover:text-[#f8d81c]"
				>
					{name}
				</p>
				<p class="mt-3 font-pixel-operator text-xs uppercase tracking-widest text-white/50">
					HERO: {characterName}
				</p>
			</div>
			<div class="flex w-full gap-4 md:w-auto">
				<button
					on:click={() => confirm_modal.showModal()}
					class="retro-button is-error flex-1 text-[8px] uppercase md:flex-none">ERASE</button
				>
				<a
					href="/app/{adventureId}"
					class="retro-button is-primary flex-1 text-[8px] uppercase md:flex-none">CONTINUE</a
				>
			</div>
		</div>
	</div>
{/if}
<dialog bind:this={confirm_modal} id="confirm_modal" class="modal bg-black/90 backdrop-blur-sm">
	<div
		class="retro-container modal-box rounded-none border-white/60 bg-black p-8 ring-1 ring-white/10"
	>
		<h3 class="font-press-start text-xs uppercase tracking-widest text-[#e74c3c]">
			ERASE TIMELINE?
		</h3>
		<p class="py-6 font-pixel-operator text-lg text-white/70">
			THIS DATA STREAM WILL BE PERMANENTLY DELETED FROM THE COSMOS.
		</p>
		<div class="modal-action">
			<form method="dialog" class="flex w-full gap-5">
				<button on:click={deleteAdventure} class="retro-button is-error flex-1 text-[8px] uppercase"
					>YES</button
				>
				<button class="retro-button flex-1 text-[8px] uppercase">NO</button>
			</form>
		</div>
	</div>
</dialog>
