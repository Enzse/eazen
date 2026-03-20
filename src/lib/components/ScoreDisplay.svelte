<script lang="ts">
	import { getPriorityBadge } from '$lib/idea/priority';

	let {
		priority_score,
		interest,
		learning_value,
		income_potential,
		effort
	} = $props<{
		priority_score: number;
		interest: number;
		learning_value: number;
		income_potential: number;
		effort: number;
	}>();

	const badge = $derived(getPriorityBadge(priority_score));
</script>

<div class="rounded-lg border bg-white p-3">
	<div class="flex items-center gap-3">
		<span class={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${badge.badgeClass} ${badge.textClass}`}>
			{badge.label}
		</span>
		<div class="text-sm font-semibold text-slate-900">Priority score: {priority_score}</div>
	</div>
	<div class="mt-2 text-xs text-slate-600">
		({interest} + {learning_value} + {income_potential}) - {effort}
	</div>
</div>

