<script>
	import { enhance } from '$app/forms';
	export let form;
</script>

<div
	class="relative flex min-h-[92vh] w-full flex-col items-center justify-center overflow-y-auto p-12"
>
	<div class="retro-container relative z-10 w-full max-w-2xl border-white/30 bg-black p-12">
		<div class="mb-12 flex items-center justify-center gap-6">
			<div class="h-1px flex-1 bg-white/20"></div>
			<h1 class="font-press-start text-xs font-bold uppercase tracking-[0.4em] text-white">
				INIT_DATA_STREAM
			</h1>
			<div class="h-1px flex-1 bg-white/20"></div>
		</div>
		<form method="post" use:enhance class="flex flex-col gap-10">
			{#if form?.message}
				<div
					class="retro-container font-press-start border-[#e74c3c] bg-[#e74c3c]/10 p-5 text-center text-[10px] uppercase text-[#e74c3c]"
				>
					{form.message}
				</div>
			{/if}

			<div class="flex flex-col gap-4">
				<label
					class="font-press-start text-[8px] uppercase tracking-widest text-white/50"
					for="character-name">DESIGN designation:</label
				>
				<input
					class="retro-input {form?.errors?.characterName ? 'border-red-500' : ''}"
					name="character-name"
					placeholder="ENTER HERO NAME"
					autocomplete="off"
					value={form?.data?.characterName ?? ''}
				/>
				{#if form?.errors?.characterName}
					<p class="font-press-start mt-2 text-[8px] uppercase text-red-500">
						{form.errors.characterName[0]}
					</p>
				{/if}
			</div>

			<div class="flex flex-col gap-4">
				<label
					class="font-press-start text-[8px] uppercase tracking-widest text-white/50"
					for="name">TIMELINE identifier:</label
				>
				<input
					class="retro-input {form?.errors?.name ? 'border-red-500' : ''}"
					name="name"
					placeholder="WORLD NAME"
					autocomplete="off"
					value={form?.data?.name ?? ''}
				/>
				{#if form?.errors?.name}
					<p class="font-press-start mt-2 text-[8px] uppercase text-red-500">
						{form.errors.name[0]}
					</p>
				{/if}
			</div>

			<div class="flex flex-col gap-4">
				<label
					class="font-press-start text-[8px] uppercase tracking-widest text-white/50"
					for="setting">SPATIAL coordinates:</label
				>
				<textarea
					class="retro-input h-32 {form?.errors?.setting ? 'border-red-500' : ''}"
					name="setting"
					placeholder="DESCRIBE THE UNIVERSE...">{form?.data?.setting ?? ''}</textarea
				>
				{#if form?.errors?.setting}
					<p class="font-press-start mt-2 text-[8px] uppercase text-red-500">
						{form.errors.setting[0]}
					</p>
				{/if}
			</div>

			<div class="mt-8">
				<button
					class="retro-button is-primary w-full py-6 text-sm font-bold uppercase tracking-[0.2em]"
				>
					EXECUTE_GENESIS
				</button>
			</div>
		</form>
	</div>
</div>
