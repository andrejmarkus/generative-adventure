<script>
	export let stats = {
		inventory: [],
		weapons: [],
		health: 100,
		hunger: 100,
		money: 0
	};
	export let isExpanded = false;
	export let onHelpClick = () => {};

	let isSticky = false;

	const toggleSticky = () => {
		isSticky = !isSticky;
		isExpanded = isSticky;
	};

	const onHover = (state) => {
		if (!isSticky) {
			isExpanded = state;
		}
	};
</script>

<div
	class="relative mb-4 transition-all duration-300 ease-in-out"
	on:mouseenter={() => onHover(true)}
	on:mouseleave={() => onHover(false)}
	on:click={toggleSticky}
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleSticky();
		}
	}}
	tabindex="0"
	role="button"
	aria-expanded={isExpanded}
	aria-label="Toggle inventory view"
>
	<div
		class="retro-container group flex flex-col border-white/30 !bg-black/60 backdrop-blur-md {isExpanded
			? 'max-h-[800px] !p-4 sm:!p-6'
			: 'max-h-24 !p-3 sm:!p-4'}"
	>
		<!-- Collapsed View Header -->
		<div class="flex items-center justify-between gap-4">
			<div class="flex items-center gap-4 sm:gap-8">
				<div class="flex items-center gap-2">
					<span class="font-press-start text-[8px] text-white/40 sm:text-[10px]">HP:</span>
					<span
						class="font-bold {(stats?.health || 100) <= 0
							? 'animate-pulse text-red-600'
							: (stats?.health || 100) < 30
								? 'text-red-500'
								: 'text-green-500'}">{stats?.health || 100}</span
					>
					<div class="h-1 w-8 overflow-hidden rounded-full bg-white/5 sm:w-12">
						<div
							class="h-full rounded-full {(stats?.health || 100) <= 0
								? 'bg-gradient-to-r from-red-800 to-red-600'
								: 'bg-gradient-to-r from-green-600 to-green-400 shadow-[0_0_5px_rgba(34,197,94,0.6)]'} transition-all duration-500"
							style="width: {stats?.health || 100}%"
						></div>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<span class="font-press-start text-[8px] text-white/40 sm:text-[10px]">HG:</span>
					<span
						class="font-bold {(stats?.hunger || 100) <= 0
							? 'animate-pulse text-red-600'
							: (stats?.hunger || 100) < 30
								? 'text-orange-500'
								: 'text-blue-400'}">{stats?.hunger || 100}</span
					>
					<div class="h-1 w-8 overflow-hidden rounded-full bg-white/5 sm:w-12">
						<div
							class="h-full rounded-full {(stats?.hunger || 100) <= 0
								? 'bg-gradient-to-r from-red-800 to-red-600 shadow-[0_0_5px_rgba(220,38,38,0.8)]'
								: 'bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_5px_rgba(234,88,12,0.6)]'} transition-all duration-500"
							style="width: {stats?.hunger || 100}%"
						></div>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<span class="font-press-start text-[8px] text-[#f8d81c] sm:text-[10px]">GOLD:</span>
					<span class="font-bold text-white">{stats?.money || 0}</span>
				</div>
			</div>

			<div class="flex items-center gap-2">
				{#if !isExpanded}
					<span
						class="animate-pulse font-press-start text-[8px] text-[#f8d81c] opacity-40 sm:text-[10px]"
						>STATUS_</span
					>
				{:else}
					<span class="font-press-start text-[8px] text-[#f8d81c] sm:text-[10px]">INVENTORY:</span>
				{/if}
				<button
					on:click|stopPropagation={onHelpClick}
					class="font-press-start text-[8px] text-white/60 transition-colors hover:text-white sm:text-[10px]"
					aria-label="Show help"
					title="Help & Shortcuts (Ctrl+H)"
				>
					HELP
				</button>
			</div>
		</div>

		<!-- Expanded Content (Inventory & Details) -->
		<div
			class="flex flex-col gap-4 overflow-hidden transition-all duration-300 {isExpanded
				? 'mt-6 max-h-[400px] opacity-100'
				: 'max-h-0 opacity-0'}"
		>
			<div class="flex flex-col">
				<div class="mb-3 border-b border-white/10 pb-1">
					<h3 class="font-press-start text-[12px] text-white/40">Inventory / Equipment</h3>
				</div>
				<div class="custom-scrollbar max-h-48 flex-1 overflow-y-auto pr-2">
					<ul class="list-none space-y-2 p-0 text-[16px] text-white/80">
						{#each [...(stats?.weapons || []), ...(stats?.inventory || [])] as item}
							<li class="flex gap-2">
								<span class="text-[#f8d81c]">></span>
								<span class="leading-tight">{item}</span>
							</li>
						{/each}
						{#if !stats?.inventory?.length && !stats?.weapons?.length}
							<li class="italic text-white/20">Empty</li>
						{/if}
					</ul>
				</div>
			</div>

			<div
				class="border-t border-white/10 pt-4 font-press-start text-[9px] text-white/40 opacity-50"
			>
				SYSTEM SIGNAL: STABLE
			</div>
		</div>
	</div>
</div>
