<script>
	import { enhance } from '$app/forms';
	export let form;
</script>

<div class="retro-screen relative flex h-[92vh] w-full flex-col items-center justify-center p-6">
	<div class="scanline pointer-events-none"></div>
	<div class="relative z-10 w-full max-w-lg bg-[#0a1208]/90 p-8 shadow-2xl ring-1 ring-[#3f3]/40">
		<h1
			class="mb-8 text-center font-pixel-operator text-4xl font-bold uppercase tracking-widest text-[#3f3] [text-shadow:0_0_10px_rgba(51,255,51,0.5)]"
		>
			INIT_NEW_TIMELINE
		</h1>
		<form method="post" use:enhance class="flex flex-col gap-6">
			{#if form?.message}
				<div
					class="font-mono border border-red-500 bg-red-900/20 p-2 text-center text-xs text-red-500"
				>
					{form.message}
				</div>
			{/if}

			<div class="flex flex-col gap-2">
				<label
					class="font-mono text-xs uppercase tracking-[0.2em] text-[#3f3]/70"
					for="character-name">UNIT_DESIGNATION:</label
				>
				<input
					class="w-full border-b border-[#3f3]/30 bg-black/40 p-2 font-pixel-operator text-xl text-[#3f3] outline-none transition-all placeholder:text-[#3f3]/20 focus:border-[#3f3] {form
						?.errors?.characterName
						? 'border-red-500'
						: ''}"
					name="character-name"
					placeholder="[ENTER_NAME]"
					autocomplete="off"
					value={form?.data?.characterName ?? ''}
				/>
				{#if form?.errors?.characterName}
					<p class="font-mono text-[10px] uppercase text-red-500">{form.errors.characterName[0]}</p>
				{/if}
			</div>

			<div class="flex flex-col gap-2">
				<label class="font-mono text-xs uppercase tracking-[0.2em] text-[#3f3]/70" for="name"
					>TIMELINE_FS_NAME:</label
				>
				<input
					class="w-full border-b border-[#3f3]/30 bg-black/40 p-2 font-pixel-operator text-xl text-[#3f3] outline-none transition-all placeholder:text-[#3f3]/20 focus:border-[#3f3] {form
						?.errors?.name
						? 'border-red-500'
						: ''}"
					name="name"
					placeholder="[ENTER_TITLE]"
					autocomplete="off"
					value={form?.data?.name ?? ''}
				/>
				{#if form?.errors?.name}
					<p class="font-mono text-[10px] uppercase text-red-500">{form.errors.name[0]}</p>
				{/if}
			</div>

			<div class="flex flex-col gap-2">
				<label class="font-mono text-xs uppercase tracking-[0.2em] text-[#3f3]/70" for="setting"
					>ENVIRONMENT_PARAMS:</label
				>
				<textarea
					class="h-32 w-full resize-none border border-[#3f3]/20 bg-black/40 p-3 font-pixel-operator text-lg text-[#3f3] outline-none transition-all placeholder:text-[#3f3]/20 focus:border-[#3f3]/50 {form
						?.errors?.setting
						? 'border-red-500'
						: ''}"
					name="setting"
					placeholder="[DEFINE_SPATIAL_COORDINATES_AND_SETTING_DETAILS]"
					>{form?.data?.setting ?? ''}</textarea
				>
				{#if form?.errors?.setting}
					<p class="font-mono text-[10px] uppercase text-red-500">{form.errors.setting[0]}</p>
				{/if}
			</div>

			<button
				class="mt-4 border border-[#3f3] py-4 font-pixel-operator text-2xl uppercase tracking-widest text-[#3f3] shadow-[0_0_20px_rgba(51,255,51,0.3)] transition-all hover:bg-[#3f3] hover:text-[#050a04]"
			>
				EXECUTE_GENESIS
			</button>
			<p class="font-mono text-center text-[10px] tracking-widest text-[#3f3]/40">
				ENCRYPTING DATA_STREAMS...
			</p>
		</form>
	</div>
</div>
