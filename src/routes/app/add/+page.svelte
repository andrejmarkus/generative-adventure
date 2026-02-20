<script>
	import { enhance } from '$app/forms';
	export let form;
</script>

<div
	class="relative flex min-h-[92vh] w-full flex-col items-center justify-center overflow-y-auto p-4 sm:p-8 md:p-12"
>
	<div
		class="retro-container relative z-10 w-full max-w-2xl border-white/30 bg-black p-6 sm:p-10 md:p-12"
	>
		<div class="mb-8 flex items-center justify-center gap-4 md:mb-12 md:gap-6">
			<div class="h-[1px] flex-1 bg-white/20"></div>
			<h1
				class="whitespace-nowrap font-press-start text-[8px] font-bold uppercase tracking-widest text-white sm:text-[10px] md:text-xs md:tracking-[0.4em]"
			>
				INIT_DATA_STREAM
			</h1>
			<div class="h-[1px] flex-1 bg-white/20"></div>
		</div>
		<form method="post" use:enhance class="flex flex-col gap-6 md:gap-10">
			{#if form?.message}
				<div
					class="retro-container border-[#e74c3c] bg-[#e74c3c]/10 p-4 text-center font-press-start text-[8px] uppercase text-[#e74c3c] sm:p-5 sm:text-[10px]"
				>
					{form.message}
				</div>
			{/if}

			<div class="flex flex-col gap-3 md:gap-4">
				<label
					class="font-press-start text-[8px] uppercase tracking-widest text-white/50"
					for="character-name">DESIGN designation:</label
				>
				<input
					class="retro-input {form?.errors?.characterName
						? 'border-red-500'
						: ''} text-lg md:text-xl"
					name="character-name"
					placeholder="ENTER HERO NAME"
					autocomplete="off"
					value={form?.data?.characterName ?? ''}
				/>
				{#if form?.errors?.characterName}
					<p class="mt-2 font-press-start text-[8px] uppercase text-red-500">
						{form.errors.characterName[0]}
					</p>
				{/if}
			</div>

			<div class="flex flex-col gap-3 md:gap-4">
				<label
					class="font-press-start text-[8px] uppercase tracking-widest text-white/50"
					for="name">TIMELINE identifier:</label
				>
				<input
					class="retro-input {form?.errors?.name ? 'border-red-500' : ''} text-lg md:text-xl"
					name="name"
					placeholder="WORLD NAME"
					autocomplete="off"
					value={form?.data?.name ?? ''}
				/>
				{#if form?.errors?.name}
					<p class="mt-2 font-press-start text-[8px] uppercase text-red-500">
						{form.errors.name[0]}
					</p>
				{/if}
			</div>

			<div class="flex flex-col gap-3 md:gap-4">
				<label
					class="font-press-start text-[8px] uppercase tracking-widest text-white/50"
					for="setting">SPATIAL coordinates:</label
				>
				<textarea
					class="retro-input h-24 md:h-32 {form?.errors?.setting
						? 'border-red-500'
						: ''} text-lg md:text-xl"
					name="setting"
					placeholder="DESCRIBE THE UNIVERSE...">{form?.data?.setting ?? ''}</textarea
				>
				{#if form?.errors?.setting}
					<p class="mt-2 font-press-start text-[8px] uppercase text-red-500">
						{form.errors.setting[0]}
					</p>
				{/if}
			</div>

			<div class="mt-4 md:mt-8">
				<button
					class="retro-button is-primary w-full py-4 text-xs font-bold uppercase tracking-widest md:py-6 md:text-sm md:tracking-[0.2em]"
				>
					EXECUTE_GENESIS
				</button>
			</div>
		</form>
	</div>
</div>
