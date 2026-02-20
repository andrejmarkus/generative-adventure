<script>
	export let prompt = '';
	export let loading = false;
	export let isThinking = false;
	export let onSubmit;
</script>

<form class="relative z-20 mt-auto pt-4 sm:pt-6" method="post" on:submit|preventDefault={onSubmit}>
	<div class="group relative">
		<div
			class="absolute -inset-0.5 bg-white/20 opacity-0 blur-sm transition-opacity group-focus-within:opacity-100"
		></div>
		<div
			class="relative flex items-center gap-3 border-2 border-white/40 bg-black p-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all focus-within:border-white sm:gap-5 sm:p-5"
		>
			<span class="font-press-start text-[8px] font-bold text-[#f8d81c] sm:text-xs">CMD_</span>
			<input
				bind:value={prompt}
				disabled={loading}
				name="prompt"
				placeholder={isThinking ? 'TRANSMITTING...' : loading ? 'PROCESSING...' : 'ENTER COMMAND'}
				class="w-full bg-transparent font-press-start text-[8px] tracking-tight text-white outline-none placeholder:text-white/20 sm:text-[10px] sm:tracking-widest"
				type="text"
				autocomplete="off"
			/>
		</div>
	</div>
</form>
