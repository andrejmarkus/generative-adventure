<script>
	import { enhance } from '$app/forms';

	export let form;

	// Multi-step form state
	let currentStep = 1;
	let characterName = form?.data?.characterName ?? '';
	let setting = form?.data?.setting ?? '';
	let selectedClass = form?.data?.characterClass ?? '';
	let timelineName = form?.data?.name ?? '';
	let suggestedClasses = [];
	let isLoadingClasses = false;
	let classError = '';

	// Step 1: Character name and setting
	async function proceedToStep2() {
		if (!characterName.trim() || !setting.trim()) {
			return;
		}

		isLoadingClasses = true;
		classError = '';

		try {
			const response = await fetch('/api/suggest-classes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ setting })
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || `Server responded with ${response.status}`);
			}

			const data = await response.json();
			suggestedClasses = data.classes || [];

			if (data.isFallback) {
				classError = data.error || 'AI generation failed. Using defaults.';
			}

			if (suggestedClasses.length === 0) {
				throw new Error('No archetypes were generated.');
			}

			currentStep = 2;
		} catch (error) {
			console.error('Error getting suggested classes:', error);
			classError = error.message || 'Failed to get class suggestions.';
			// Use a robust fallback if AI fails
			suggestedClasses = ['Warrior', 'Scholar', 'Merchant', 'Guardian', 'Explorer', 'Technician'];
			currentStep = 2;
		}

		isLoadingClasses = false;
	}

	// Step 2: Select class
	function proceedToStep3() {
		if (!selectedClass) {
			return;
		}
		currentStep = 3;
	}

	// Go back to previous step
	function goBack() {
		if (currentStep > 1) {
			currentStep--;
		}
	}
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
		<!-- Step Indicator -->
		<div class="mb-6 flex justify-center">
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2">
					<div
						class="h-3 w-3 rounded-full {currentStep >= 1 ? 'bg-[#f8d81c]' : 'bg-white/30'}"
					></div>
					<span class="font-press-start text-[6px] text-white/60 sm:text-[8px]">UNIVERSE</span>
				</div>
				<div class="h-px w-8 bg-white/20"></div>
				<div class="flex items-center gap-2">
					<div
						class="h-3 w-3 rounded-full {currentStep >= 2 ? 'bg-[#f8d81c]' : 'bg-white/30'}"
					></div>
					<span class="font-press-start text-[6px] text-white/60 sm:text-[8px]">ARCHETYPE</span>
				</div>
				<div class="h-px w-8 bg-white/20"></div>
				<div class="flex items-center gap-2">
					<div
						class="h-3 w-3 rounded-full {currentStep >= 3 ? 'bg-[#f8d81c]' : 'bg-white/30'}"
					></div>
					<span class="font-press-start text-[6px] text-white/60 sm:text-[8px]">FINALIZE</span>
				</div>
			</div>
		</div>

		{#if form?.message}
			<div
				class="retro-container border-[#e74c3c] bg-[#e74c3c]/10 p-4 text-center font-press-start text-[8px] uppercase text-[#e74c3c] sm:p-5 sm:text-[10px]"
			>
				{form.message}
			</div>
		{/if}

		<!-- Step 1: Universe Description -->
		{#if currentStep === 1}
			<div class="flex flex-col gap-6 md:gap-10">
				<div class="text-center">
					<h2 class="mb-2 font-press-start text-sm text-[#f8d81c]">
						STEP 1: DESCRIBE YOUR UNIVERSE
					</h2>
					<p class="font-pixel-operator text-sm text-white/70">
						Tell us about the world your hero will explore. The AI will analyze this to suggest
						appropriate character archetypes.
					</p>
				</div>

				<div class="flex flex-col gap-3 md:gap-4">
					<label
						class="font-press-start text-[8px] uppercase tracking-widest text-white/50"
						for="character-name">HERO NAME:</label
					>
					<input
						bind:value={characterName}
						class="retro-input text-lg md:text-xl"
						placeholder="ENTER YOUR HERO'S NAME"
						autocomplete="off"
					/>
				</div>

				<div class="flex flex-col gap-3 md:gap-4">
					<label
						class="font-press-start text-[8px] uppercase tracking-widest text-white/50"
						for="setting">UNIVERSE DESCRIPTION:</label
					>
					<textarea
						bind:value={setting}
						class="retro-input h-32 text-lg md:h-40 md:text-xl"
						placeholder="DESCRIBE THE WORLD YOUR HERO WILL EXPLORE... (e.g., 'A cyberpunk megacity in 2147 where corporations control everything and hackers fight for freedom')"
					></textarea>
				</div>

				<div class="mt-4 md:mt-8">
					<button
						type="button"
						on:click={proceedToStep2}
						disabled={!characterName.trim() || !setting.trim() || isLoadingClasses}
						class="retro-button is-primary w-full py-4 text-xs font-bold uppercase tracking-widest disabled:opacity-50 md:py-6 md:text-sm md:tracking-[0.2em]"
					>
						{isLoadingClasses ? 'ANALYZING UNIVERSE...' : 'ANALYZE UNIVERSE & CONTINUE'}
					</button>
				</div>
			</div>
		{/if}

		<!-- Step 2: Class Selection -->
		{#if currentStep === 2}
			<div class="flex flex-col gap-6 md:gap-10">
				<div class="text-center">
					<h2 class="mb-2 font-press-start text-sm text-[#f8d81c]">
						STEP 2: CHOOSE YOUR ARCHETYPE
					</h2>
					<p class="font-pixel-operator text-sm text-white/70">
						Based on your universe description, here are the character archetypes that would fit
						this world:
					</p>
				</div>

				{#if classError}
					<div class="retro-container border-yellow-500 bg-yellow-500/10 p-4 text-center">
						<p class="font-press-start text-[8px] text-yellow-500">{classError}</p>
					</div>
				{/if}

				<div class="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
					{#each suggestedClasses as classOption}
						<button
							type="button"
							on:click={() => (selectedClass = classOption)}
							class="retro-button flex flex-col items-center justify-center p-4 text-center transition-all hover:scale-105 {selectedClass ===
							classOption
								? 'ring-2 ring-[#f8d81c]'
								: ''}"
						>
							<span class="font-press-start text-xs font-bold uppercase tracking-widest">
								{classOption}
							</span>
						</button>
					{/each}
				</div>

				<div class="flex gap-4">
					<button
						type="button"
						on:click={goBack}
						class="retro-button flex-1 py-3 text-xs font-bold uppercase tracking-widest"
					>
						BACK
					</button>
					<button
						type="button"
						on:click={proceedToStep3}
						disabled={!selectedClass}
						class="retro-button is-primary flex-1 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
					>
						CONTINUE
					</button>
				</div>
			</div>
		{/if}

		<!-- Step 3: Finalize -->
		{#if currentStep === 3}
			<form method="post" use:enhance class="flex flex-col gap-6 md:gap-10">
				<div class="text-center">
					<h2 class="mb-2 font-press-start text-sm text-[#f8d81c]">STEP 3: FINALIZE ADVENTURE</h2>
					<p class="font-pixel-operator text-sm text-white/70">
						Give your adventure a name and create your world!
					</p>
				</div>

				<!-- Hidden fields for collected data -->
				<input type="hidden" name="character-name" value={characterName} />
				<input type="hidden" name="character-class" value={selectedClass} />
				<input type="hidden" name="setting" value={setting} />

				<div class="flex flex-col gap-3 md:gap-4">
					<label
						class="font-press-start text-[8px] uppercase tracking-widest text-white/50"
						for="name">ADVENTURE NAME:</label
					>
					<input
						class="retro-input {form?.errors?.name ? 'border-red-500' : ''} text-lg md:text-xl"
						name="name"
						placeholder="NAME YOUR ADVENTURE"
						autocomplete="off"
						value={form?.data?.name ?? timelineName}
					/>
					{#if form?.errors?.name}
						<p class="mt-2 font-press-start text-[8px] uppercase text-red-500">
							{form.errors.name[0]}
						</p>
					{/if}
				</div>

				<!-- Summary -->
				<div class="retro-container bg-white/5 p-4">
					<h3 class="mb-3 font-press-start text-[10px] text-[#f8d81c]">ADVENTURE SUMMARY</h3>
					<div class="space-y-2 font-pixel-operator text-sm text-white/80">
						<p><strong class="text-[#f8d81c]">Hero:</strong> {characterName}</p>
						<p><strong class="text-[#f8d81c]">Archetype:</strong> {selectedClass}</p>
						<p>
							<strong class="text-[#f8d81c]">Universe:</strong>
							{setting.substring(0, 100)}{setting.length > 100 ? '...' : ''}
						</p>
					</div>
				</div>

				<div class="flex gap-4">
					<button
						type="button"
						on:click={goBack}
						class="retro-button flex-1 py-3 text-xs font-bold uppercase tracking-widest"
					>
						BACK
					</button>
					<button
						class="retro-button is-primary flex-1 py-3 text-xs font-bold uppercase tracking-widest md:py-6 md:text-sm md:tracking-[0.2em]"
					>
						CREATE ADVENTURE
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
