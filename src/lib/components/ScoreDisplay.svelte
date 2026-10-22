<script lang="ts">
	import { getPriorityBadge, scoreHeat, SCORE_MAX, SCORE_MIN } from '$lib/idea/priority';

	let {
		priority_score,
		interest,
		learning_value,
		income_potential,
		effort,
		compact = false
	}: {
		priority_score: number;
		interest: number;
		learning_value: number;
		income_potential: number;
		effort: number;
		compact?: boolean;
	} = $props();

	const badge = $derived(getPriorityBadge(priority_score));
	const heat = $derived(scoreHeat(priority_score));

	const factors = $derived([
		{ label: 'Interest', value: interest, sign: '+' },
		{ label: 'Learning', value: learning_value, sign: '+' },
		{ label: 'Income', value: income_potential, sign: '+' },
		{ label: 'Effort', value: effort, sign: '−' }
	]);

	// Tier boundaries on the heat track (scores 10 and 18).
	const medAt = ((10 - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100;
	const highAt = ((18 - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100;
</script>

<div class="space-y-5">
	<div class="flex items-end justify-between gap-4">
		<div>
			<div class="eyebrow">Priority score</div>
			<div class="mt-1 flex items-baseline gap-3">
				<span
					class="num font-semibold tracking-tight {badge.textClass} {compact ? 'text-4xl' : 'text-6xl'}"
					style:text-shadow={badge.tier === 'high' ? '0 0 32px rgb(244 123 53 / 0.55)' : undefined}
				>
					{priority_score}
				</span>
				<span class="num text-sm text-ink-500">/ {SCORE_MAX}</span>
			</div>
		</div>
		<span class="chip {badge.badgeClass} {badge.textClass}">{badge.label} priority</span>
	</div>

	<!-- Heat track: where this idea sits between the worst and best possible score. -->
	<div>
		<div class="relative h-2 rounded-full bg-white/6">
			<div
				class="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-ink-600 via-sand-300 to-ember-500 transition-[width] duration-700"
				style:width="{heat * 100}%"
			></div>
			<span class="absolute -top-1 h-4 w-px bg-white/15" style:left="{medAt}%"></span>
			<span class="absolute -top-1 h-4 w-px bg-white/15" style:left="{highAt}%"></span>
			<span
				class="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink-950 transition-[left] duration-700"
				style:left="{heat * 100}%"
				style:background={badge.color}
				style:box-shadow={badge.tier === 'high' ? '0 0 14px rgb(255 155 90 / 0.9)' : undefined}
			></span>
		</div>
		<div class="num mt-2 flex justify-between text-[10px] text-ink-500">
			<span>{SCORE_MIN}</span>
			<span>low · medium · high</span>
			<span>{SCORE_MAX}</span>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
		{#each factors as f (f.label)}
			<div>
				<div class="flex items-baseline justify-between text-xs">
					<span class="text-ink-400">{f.label}</span>
					<span class="num font-medium {f.sign === '−' ? 'text-ink-400' : 'text-ink-100'}">{f.sign}{f.value}</span>
				</div>
				<div class="mt-1.5 flex gap-0.5">
					{#each Array(10) as _, n (n)}
						<span
							class="h-1.5 flex-1 rounded-xs transition-colors duration-300 {n < f.value
								? f.sign === '−'
									? 'bg-ink-400'
									: 'bg-ember-500'
								: 'bg-white/6'}"
						></span>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<p class="num text-xs text-ink-500">
		({interest} + {learning_value} + {income_potential}) − {effort} = <span class={badge.textClass}>{priority_score}</span>
	</p>
</div>
