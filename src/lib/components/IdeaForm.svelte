<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import ScoreDisplay from '$lib/components/ScoreDisplay.svelte';
	import { computePriorityScore } from '$lib/idea/priority';
	import { STAGE_LABEL } from '$lib/ui/status';

	let {
		initial,
		submitLabel,
		phased = false,
		phase = $bindable<1 | 2>(1)
	}: {
		initial?: Partial<{
			title: string;
			description: string;
			category: string;
			tags: string;
			stage: string;
			interest: number;
			learning_value: number;
			income_potential: number;
			effort: number;
		}>;
		submitLabel: string;
		/** Two-step wizard: essentials → scores (e.g. create modal). */
		phased?: boolean;
		/** Current step (bind from parent to show stepper in the modal header). */
		phase?: 1 | 2;
	} = $props();

	const stageOptions = ['captured', 'selected', 'archived'];

	const scoreFields = [
		{ name: 'interest', label: 'Interest', hint: 'How much do you want to work on it?', inverse: false },
		{ name: 'learning_value', label: 'Learning value', hint: 'How much would you learn?', inverse: false },
		{ name: 'income_potential', label: 'Income potential', hint: 'Could it make money?', inverse: false },
		{ name: 'effort', label: 'Effort', hint: 'Higher effort lowers the priority.', inverse: true }
	] as const;

	type ScoreKey = (typeof scoreFields)[number]['name'];

	let values = $state({
		title: '',
		description: '',
		category: '',
		tags: '',
		stage: 'captured',
		interest: 5,
		learning_value: 5,
		income_potential: 5,
		effort: 5
	});

	$effect(() => {
		values.title = initial?.title ?? '';
		values.description = initial?.description ?? '';
		values.category = initial?.category ?? '';
		values.tags = initial?.tags ?? '';
		values.stage = initial?.stage ?? 'captured';
		values.interest = Number(initial?.interest ?? 5);
		values.learning_value = Number(initial?.learning_value ?? 5);
		values.income_potential = Number(initial?.income_potential ?? 5);
		values.effort = Number(initial?.effort ?? 5);
	});

	/** After successful submit, `initial` clears — reset wizard for next open. */
	$effect(() => {
		if (phased && !initial) phase = 1;
	});

	const previewPriorityScore = $derived(
		computePriorityScore({
			interest: values.interest,
			learning_value: values.learning_value,
			income_potential: values.income_potential,
			effort: values.effort
		})
	);

	let essentialsError = $state('');

	function goNext() {
		essentialsError = '';
		if (!values.title.trim()) {
			essentialsError = 'Give the idea a title first.';
			return;
		}
		phase = 2;
	}

	function goBack() {
		essentialsError = '';
		phase = 1;
	}

	const showEssentials = $derived(!phased || phase === 1);
	const showScores = $derived(!phased || phase === 2);

	function fill(v: number) {
		return `${((v - 1) / 9) * 100}%`;
	}
</script>

<div class="w-full">
	<!-- Both steps stay in the DOM so every field submits together. -->
	<div class="space-y-5" class:hidden={!showEssentials} aria-hidden={!showEssentials}>
		<label class="block">
			<span class="label">Title</span>
			<input
				class="field font-display text-lg! font-semibold"
				type="text"
				name="title"
				placeholder="What's the idea?"
				required={!phased}
				bind:value={values.title}
			/>
		</label>
		{#if phased && essentialsError}
			<p class="-mt-3 text-sm text-rust-400">{essentialsError}</p>
		{/if}

		<label class="block">
			<span class="label">Description <span class="text-ink-500">· optional</span></span>
			<textarea
				class="field min-h-28 resize-y leading-relaxed"
				name="description"
				placeholder="What is it, who's it for, why now?"
				bind:value={values.description}
			></textarea>
		</label>

		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
			<label class="block">
				<span class="label">Category <span class="text-ink-500">· optional</span></span>
				<input class="field" type="text" name="category" placeholder="e.g. side project" bind:value={values.category} />
			</label>
			<label class="block">
				<span class="label">Tags <span class="text-ink-500">· comma-separated</span></span>
				<input class="field" type="text" name="tags" placeholder="ai, business, game dev" bind:value={values.tags} />
			</label>
		</div>

		<fieldset>
			<legend class="label">Stage</legend>
			<div class="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-white/7 bg-ink-950/50 p-1">
				{#each stageOptions as s (s)}
					<label
						class="cursor-pointer rounded-lg px-3 py-2 text-center text-sm font-medium transition-all duration-200 has-focus-visible:ring-2 has-focus-visible:ring-ember-400 {values.stage ===
						s
							? 'bg-white/8 text-ink-100 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]'
							: 'text-ink-500 hover:text-ink-300'}"
					>
						<input type="radio" name="stage" value={s} class="sr-only" bind:group={values.stage} />
						{STAGE_LABEL[s]}
					</label>
				{/each}
			</div>
		</fieldset>
	</div>

	<div class="space-y-6" class:hidden={!showScores} class:mt-8={!phased} aria-hidden={!showScores}>
		<div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
			{#each scoreFields as f (f.name)}
				{@const v = values[f.name as ScoreKey]}
				<label class="block">
					<div class="flex items-baseline justify-between">
						<span class="text-sm font-medium text-ink-100">{f.label}</span>
						<span class="num text-lg font-semibold {f.inverse ? 'text-ink-300' : 'text-ember-300'}">
							{f.inverse ? '−' : ''}{v}
						</span>
					</div>
					<p class="mt-0.5 text-xs text-ink-500">{f.hint}</p>
					<input
						class="slider mt-3"
						class:slider-inverse={f.inverse}
						type="range"
						min="1"
						max="10"
						step="1"
						name={f.name}
						style:--fill={fill(v)}
						bind:value={values[f.name as ScoreKey]}
					/>
				</label>
			{/each}
		</div>

		<div class="panel-quiet p-5">
			<ScoreDisplay
				compact
				priority_score={previewPriorityScore}
				interest={values.interest}
				learning_value={values.learning_value}
				income_potential={values.income_potential}
				effort={values.effort}
			/>
		</div>
	</div>

	<div class="mt-8 flex items-center justify-between gap-3">
		{#if phased && phase === 2}
			<button type="button" class="btn btn-ghost" onclick={goBack}>
				<Icon name="arrowLeft" size={16} /> Back
			</button>
		{:else}
			<span></span>
		{/if}

		{#if phased && phase === 1}
			<button type="button" class="btn btn-primary" onclick={goNext}>
				Next: score it <Icon name="arrowRight" size={16} />
			</button>
		{:else}
			<button type="submit" class="btn btn-primary">
				{submitLabel}
			</button>
		{/if}
	</div>
</div>
