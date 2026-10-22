<script lang="ts">
	let { phase }: { phase: 1 | 2 } = $props();

	const steps = [
		{ n: 1, label: 'The idea' },
		{ n: 2, label: 'Score it' }
	] as const;
</script>

<nav class="px-6 pb-5" aria-label="Idea form steps">
	<ol class="flex items-center gap-3">
		{#each steps as s, i (s.n)}
			{@const on = phase === s.n}
			{@const past = phase > s.n}
			<li class="flex items-center gap-2.5" aria-current={on ? 'step' : undefined}>
				<span
					class="num flex h-6 w-6 items-center justify-center rounded-lg text-[11px] font-semibold transition-all duration-300 {on
						? 'bg-ember-500 text-ink-950 shadow-[0_0_14px_rgb(244_123_53/0.6)]'
						: past
							? 'bg-ember-500/20 text-ember-300'
							: 'bg-white/6 text-ink-500'}"
				>
					{s.n}
				</span>
				<span class="text-sm transition-colors {on ? 'font-medium text-ink-100' : 'text-ink-500'}">{s.label}</span>
			</li>
			{#if i < steps.length - 1}
				<li class="h-px flex-1 overflow-hidden rounded-full bg-white/8" aria-hidden="true">
					<span
						class="block h-full bg-ember-500 transition-[width] duration-500"
						style:width={phase > 1 ? '100%' : '0%'}
					></span>
				</li>
			{/if}
		{/each}
	</ol>
</nav>
