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
	<div
		class="flex w-full flex-col gap-5 bg-[#0a1208]/90 p-6 shadow-[0_0_20px_rgba(51,255,51,0.1)] ring-1 ring-[#3f3]/40 transition-all hover:shadow-[0_0_25px_rgba(51,255,51,0.15)]"
	>
		<div>
			<p
				class="font-pixel-operator text-3xl uppercase tracking-widest text-[#3f3] [text-shadow:0_0_8px_rgba(51,255,51,0.6)]"
			>
				{name}
			</p>
			<p class="font-mono mt-1 text-xs tracking-widest text-[#3f3]/60">
				UNIT_DESIGNATION: {characterName}
			</p>
		</div>
		<div class="flex gap-4">
			<button
				on:click={() => confirm_modal.showModal()}
				class="border border-[#f33]/40 px-6 py-2 text-xs font-bold tracking-widest text-[#f33]/60 transition-all hover:bg-[#f33] hover:text-[#0a1208]"
				>[ TERMINATE ]</button
			>
			<a
				href="/app/{adventureId}"
				class="flex-1 border border-[#3f3] px-6 py-2 text-center text-xs font-bold tracking-widest text-[#3f3] transition-all hover:bg-[#3f3] hover:text-[#050a04]"
				>[ SELECT_ENTRY ]</a
			>
		</div>
	</div>
{/if}
<dialog bind:this={confirm_modal} id="confirm_modal" class="modal bg-[#000]/80">
	<div class="modal-box rounded-none border border-[#f33]/50 bg-[#0a1208] text-[#f33]">
		<h3
			class="font-pixel-operator text-2xl uppercase tracking-widest shadow-red-500/20 [text-shadow:0_0_8px_rgba(255,51,51,0.6)]"
		>
			WARNING: PERMANENT TERMINATION
		</h3>
		<p class="font-mono py-4 text-xs tracking-widest opacity-70">
			SURE YOU WANT TO ERASE THIS TIMELINE FROM LOCAL STORAGE?
		</p>
		<div class="modal-action">
			<form method="dialog" class="flex w-full gap-4">
				<button
					on:click={deleteAdventure}
					class="flex-1 border border-[#f33] px-4 py-2 font-bold tracking-widest transition-all hover:bg-[#f33] hover:text-[#0a1208]"
					>[ CONFIRM ]</button
				>
				<button
					class="flex-1 border border-[#3f3]/30 px-4 py-2 font-bold tracking-widest text-[#3f3]/60 transition-all hover:bg-[#3f3] hover:text-[#050a04]"
					>[ ABORT ]</button
				>
			</form>
		</div>
	</div>
</dialog>
