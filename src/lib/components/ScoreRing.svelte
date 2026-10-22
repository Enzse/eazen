<script lang="ts">
	import { getPriorityBadge, scoreHeat } from '$lib/idea/priority';

	let { score, size = 52 }: { score: number; size?: number } = $props();

	const badge = $derived(getPriorityBadge(score));
	const heat = $derived(scoreHeat(score));
	const R = 21;
	const C = 2 * Math.PI * R;
</script>

<div
	class="relative shrink-0"
	style:width="{size}px"
	style:height="{size}px"
	title="{badge.label} priority · score {score}"
>
	<svg viewBox="0 0 48 48" class="h-full w-full -rotate-90" aria-hidden="true">
		<circle cx="24" cy="24" r={R} fill="none" stroke="rgb(255 236 220 / 0.07)" stroke-width="3" />
		<circle
			cx="24"
			cy="24"
			r={R}
			fill="none"
			stroke={badge.color}
			stroke-width="3"
			stroke-linecap="round"
			stroke-dasharray={C}
			stroke-dashoffset={C * (1 - heat)}
			class="transition-[stroke-dashoffset] duration-700"
			style:filter={badge.tier === 'high' ? 'drop-shadow(0 0 4px rgb(255 155 90 / 0.8))' : undefined}
		/>
	</svg>
	<span class="num absolute inset-0 flex items-center justify-center text-sm font-semibold {badge.textClass}">
		{score}
	</span>
	<span class="sr-only">{badge.label} priority, score {score}</span>
</div>
