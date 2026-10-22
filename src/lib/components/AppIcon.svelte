<script lang="ts">
	import LogoMark from '$lib/components/LogoMark.svelte';

	/** The mark on its tile, styled by the current theme (see --icon-* in layout.css). */
	let { size = 40, class: className = '' }: { size?: number; class?: string } = $props();
</script>

<span class="app-icon {className}" style:--s="{size}px">
	<LogoMark size={Math.round(size * 0.78)} />
</span>

<style>
	.app-icon {
		display: grid;
		place-items: center;
		flex: none;
		width: var(--s);
		height: var(--s);
		border-radius: calc(var(--s) * 0.26);
		color: var(--icon-ink);
		background: var(--icon-bg);
		box-shadow: var(--icon-shadow);
		--logo-spark: var(--icon-spark);
		--logo-spark-glow: var(--icon-spark-glow);
	}
</style>
