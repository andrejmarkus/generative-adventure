<script>
	export let prompt = '';
	export let loading = false;
	export let isThinking = false;
	export let onSubmit = () => {};
	export let onQuickAction = (action) => {};
</script>

<form
	class="relative z-20 mt-auto pt-4 sm:pt-6"
	method="post"
	on:submit|preventDefault={() => onSubmit()}
>
	<!-- Quick Actions -->
	<div class="mb-3 flex flex-wrap gap-2">
		<button
			type="button"
			on:click={() => onQuickAction('rest')}
			disabled={loading}
			class="rounded border border-white/20 bg-black/50 px-2 py-1 font-press-start text-[6px] text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50 sm:text-[8px]"
			title="Rest to recover health"
		>
			REST
		</button>
		<button
			type="button"
			on:click={() => onQuickAction('inventory')}
			disabled={loading}
			class="rounded border border-white/20 bg-black/50 px-2 py-1 font-press-start text-[6px] text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50 sm:text-[8px]"
			title="Check inventory"
		>
			INV
		</button>
		<button
			type="button"
			on:click={() => onQuickAction('look')}
			disabled={loading}
			class="rounded border border-white/20 bg-black/50 px-2 py-1 font-press-start text-[6px] text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50 sm:text-[8px]"
			title="Look around"
		>
			LOOK
		</button>
		<button
			type="button"
			on:click={() => onQuickAction('attack')}
			disabled={loading}
			class="rounded border border-red-900/40 bg-red-950/20 px-2 py-1 font-press-start text-[6px] text-red-400/80 transition-colors hover:bg-red-900/30 hover:text-red-300 disabled:opacity-50 sm:text-[8px]"
			title="Attack the nearest enemy"
		>
			ATTACK
		</button>
		<button
			type="button"
			on:click={() => onQuickAction('defend')}
			disabled={loading}
			class="rounded border border-blue-900/40 bg-blue-950/20 px-2 py-1 font-press-start text-[6px] text-blue-400/80 transition-colors hover:bg-blue-900/30 hover:text-blue-300 disabled:opacity-50 sm:text-[8px]"
			title="Take a defensive stance"
		>
			DEFEND
		</button>
		<button
			type="button"
			on:click={() => onQuickAction('status')}
			disabled={loading}
			class="rounded border border-white/20 bg-black/50 px-2 py-1 font-press-start text-[6px] text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50 sm:text-[8px]"
			title="Check status"
		>
			STATUS
		</button>
	</div>

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
		<button type="submit" class="hidden" aria-hidden="true"></button>
	</div>
</form>
