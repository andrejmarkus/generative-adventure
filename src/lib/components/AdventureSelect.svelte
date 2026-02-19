<script>
	export let adventureId;
	export let name;
	export let characterName;

	let show = true;

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
		class="flex w-full flex-col gap-5 bg-[#0a1208]/90 p-6 shadow-[0_0_15px_rgba(51,255,51,0.05)] ring-1 ring-[#3f3]/30"
	>
		<div>
			<p
				class="font-pixel-operator text-3xl uppercase tracking-tighter text-[#3f3] [text-shadow:0_0_5px_rgba(51,255,51,0.5)]"
			>
				{name}
			</p>
			<p class="font-mono text-sm tracking-wide text-[#3f3]/70">
				UNIT_DESIGNATION: {characterName}
			</p>
		</div>
		<div class="flex gap-4">
			<button
				on:click={() => confirm_modal.showModal()}
				class="border border-[#f33]/40 px-5 py-2 text-xs tracking-tighter text-[#f33]/60 hover:bg-[#f33]/10"
				>TERMINATE</button
			>
			<a
				href="/app/{adventureId}"
				class="flex-1 border border-[#3f3] px-5 py-2 text-center text-xs tracking-tighter text-[#3f3] hover:bg-[#3f3]/10"
				>SELECT_ENTRY</a
			>
		</div>
	</div>
{/if}
<dialog id="confirm_modal" class="modal bg-[#000]/80">
	<div class="modal-box rounded-none border border-[#f33]/50 bg-[#0a1208] text-[#f33]">
		<h3 class="font-pixel-operator text-2xl uppercase">WARNING: PERMANENT TERMINATION</h3>
		<p class="font-mono py-4 text-xs opacity-70">
			SURE YOU WANT TO ERASE THIS TIMELINE FROM LOCAL STORAGE?
		</p>
		<div class="modal-action">
			<form method="dialog" class="flex w-full gap-4">
				<button
					on:click={deleteAdventure}
					class="flex-1 border border-[#f33] px-4 py-2 hover:bg-[#f33]/10">CONFIRM</button
				>
				<button class="flex-1 border border-[#3f3]/30 px-4 py-2 text-[#3f3]/60 hover:bg-[#3f3]/10"
					>ABORT</button
				>
			</form>
		</div>
	</div>
</dialog>
