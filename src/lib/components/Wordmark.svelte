<script lang="ts">
	import { DOT_SPARK } from '$lib/brand';

	/** "ccino" with a spark for the dot on the i. Size it with a font-size class. */
	let { class: className = '' }: { class?: string } = $props();
</script>

<span class="wordmark {className}" aria-label="ccino"
	><span aria-hidden="true">cc<span class="i">ı<svg class="dot" viewBox="-10 -10 20 20"><path d={DOT_SPARK} /></svg></span>no</span
	></span
>

<style>
	.wordmark {
		font-family: var(--font-display);
		font-weight: 800;
		letter-spacing: -0.045em;
		line-height: 1;
		white-space: nowrap;
		color: var(--color-ink-100);
	}
	.i {
		position: relative;
		display: inline-block;
	}
	.dot {
		position: absolute;
		top: 0em;
		left: 50%;
		width: 0.36em;
		height: 0.36em;
		transform: translateX(-50%);
		overflow: visible;
		fill: var(--color-ember-400);
		filter: drop-shadow(0 0 4px rgb(var(--accent) / 0.7));
	}
</style>
