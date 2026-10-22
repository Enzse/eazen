<script lang="ts">
	import { MARK_ARCS, MARK_SPARK, MARK_STROKE } from '$lib/brand';

	/** The bare mark. Strokes use the current text color; the spark uses --logo-spark (theme accent by default). */
	let { size = 32, class: className = '' }: { size?: number; class?: string } = $props();
</script>

<svg class="logo-mark {className}" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
	<path d={MARK_ARCS} fill="none" stroke="currentColor" stroke-width={MARK_STROKE} stroke-linecap="round" />
	<path class="logo-spark" d={MARK_SPARK} />
</svg>

<style>
	.logo-mark {
		display: block;
		overflow: visible;
	}
	.logo-spark {
		fill: var(--logo-spark, var(--color-ember-400));
		filter: drop-shadow(0 0 3px var(--logo-spark-glow, rgb(var(--accent) / 0.7)));
	}
</style>
