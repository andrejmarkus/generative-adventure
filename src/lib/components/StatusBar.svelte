<script>
	export let stats = {
		inventory: [],
		weapons: [],
		health: 100,
		hunger: 100,
		money: 0
	};
	export let isExpanded = false;
</script>

<div
	class="relative mb-4 transition-all duration-300 ease-in-out"
	on:mouseenter={() => (isExpanded = true)}
	on:mouseleave={() => (isExpanded = false)}
	on:click={() => (isExpanded = !isExpanded)}
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			isExpanded = !isExpanded;
		}
	}}
	tabindex="0"
	role="button"
	aria-expanded={isExpanded}
	aria-label="Toggle inventory view"
>
	<div
		class="group flex flex-col border-2 border-white/20 bg-black/60 shadow-2xl backdrop-blur-md transition-all hover:border-white/40 {isExpanded
			? 'max-h-[500px] p-4 sm:p-6'
			: 'max-h-20 p-3 sm:p-4'}"
	>
		<!-- Collapsed View Header -->
		<div class="flex items-center justify-between gap-4">
			<div class="flex items-center gap-4 sm:gap-8">
				<div class="flex items-center gap-2">
					<span class="font-press-start text-[8px] text-white/40 sm:text-[10px]">HP:</span>
					<span class="font-bold {(stats?.health || 100) < 30 ? 'text-red-500' : 'text-green-500'}"
						>{stats?.health || 100}</span
					>
					<div class="w-8 h-1 overflow-hidden rounded-full bg-white/5 sm:w-12">
						<div
							class="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_5px_rgba(220,38,38,0.6)] transition-all duration-500"
							style="width: {stats?.health || 100}%"
						></div>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<span class="font-press-start text-[8px] text-white/40 sm:text-[10px]">HG:</span>
					<span
						class="font-bold {(stats?.hunger || 100) < 30 ? 'text-orange-500' : 'text-blue-400'}"
						>{stats?.hunger || 100}</span
					>
					<div class="w-8 h-1 overflow-hidden rounded-full bg-white/5 sm:w-12">
						<div
							class="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_5px_rgba(234,88,12,0.6)] transition-all duration-500"
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
						class="animate-bounce font-press-start text-[8px] text-[#f8d81c] opacity-40 sm:text-[10px]"
						>INV_</span
					>
				{/if}
				<div class="font-press-start text-[8px] text-white/20 sm:text-[10px]">
					<h3 class="font-press-start text-[8px] text-[#f8d81c] sm:text-[10px]">STATUS</h3>
				</div>
			</div>
		</div>

		<!-- Expanded Content (Just Inventory) -->
		<div
			class="flex flex-col gap-4 overflow-hidden transition-all duration-300 {isExpanded
				? 'mt-6 max-h-[400px] opacity-100'
				: 'max-h-0 opacity-0'}"
		>
			<div class="flex flex-col">
				<div class="pb-1 mb-3 border-b border-white/10">
					<h3 class="font-press-start text-[12px] text-white/40">Inventory / Equipment</h3>
				</div>
				<div class="flex-1 pr-2 overflow-y-auto custom-scrollbar max-h-48">
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
