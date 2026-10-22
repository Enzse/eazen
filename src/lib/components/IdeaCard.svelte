<script lang="ts">
	import ScoreRing from '$lib/components/ScoreRing.svelte';
	import { spotlight } from '$lib/ui/spotlight';
	import { STAGE_LABEL } from '$lib/ui/status';

	let {
		idea,
		index = 0,
		featured = false
	}: {
		idea: {
			id: number;
			title: string;
			description: string;
			category: string;
			tags: string;
			stage: string;
			priority_score: number;
			createdAt: string | Date;
			interest?: number;
			learning_value?: number;
			income_potential?: number;
			effort?: number;
		};
		index?: number;
		featured?: boolean;
	} = $props();

	const tags = $derived(idea.tags ? idea.tags.split(',').filter(Boolean) : []);

	const factors = $derived(
		idea.interest == null
			? []
			: [
					{ label: 'Interest', v: idea.interest, minus: false },
					{ label: 'Learning', v: idea.learning_value ?? 0, minus: false },
					{ label: 'Income', v: idea.income_potential ?? 0, minus: false },
					{ label: 'Effort', v: idea.effort ?? 0, minus: true }
				]
	);

	function fmtDate(d: string | Date) {
		return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<a
	use:spotlight
	class="panel spot lift rise group flex h-full flex-col rounded-[1.25rem] {featured ? 'p-6 sm:p-7' : 'p-5'}"
	style:--i={index}
	href={`/app/ideas/${idea.id}`}
>
	<div class="flex items-start justify-between gap-4">
		<div class="min-w-0">
			<div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500">
				{#if idea.category}
					<span class="text-ink-300">{idea.category}</span>
					<span aria-hidden="true">·</span>
				{/if}
				<span class={idea.stage === 'archived' ? 'text-ink-500 line-through decoration-ink-600' : ''}>
					{STAGE_LABEL[idea.stage] ?? idea.stage}
				</span>
			</div>
			<h3
				class="mt-2 font-display font-semibold text-ink-100 transition-colors group-hover:text-white {featured
					? 'text-2xl leading-tight sm:text-3xl'
					: 'text-lg leading-snug'}"
			>
				{idea.title}
			</h3>
		</div>
		<ScoreRing score={idea.priority_score} size={featured ? 64 : 50} />
	</div>

	{#if idea.description}
		<p class="mt-3 text-sm leading-relaxed text-ink-400 {featured ? 'line-clamp-4 max-w-prose' : 'line-clamp-2'}">
			{idea.description}
		</p>
	{/if}

	{#if featured}
		<!-- Clipped wrapper so the glow stays inside the card -->
		<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]" aria-hidden="true">
			<div class="drift absolute -right-12 -bottom-16 h-64 w-64 rounded-full bg-ember-500/15 blur-[70px]"></div>
		</div>
	{/if}

	{#if featured && factors.length}
		<div class="mt-auto grid grid-cols-2 gap-x-6 gap-y-4 pt-8 sm:grid-cols-4">
			{#each factors as f (f.label)}
				<div>
					<div class="flex items-baseline justify-between text-xs">
						<span class="text-ink-500">{f.label}</span>
						<span class="num {f.minus ? 'text-ink-400' : 'text-ink-200'}">{f.minus ? '−' : '+'}{f.v}</span>
					</div>
					<div class="mt-1.5 h-1 overflow-hidden rounded-full bg-white/6">
						<div
							class="h-full rounded-full {f.minus ? 'bg-ink-500' : 'bg-linear-to-r from-ember-600 to-ember-400'}"
							style:width="{f.v * 10}%"
						></div>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<div class="flex items-end justify-between gap-3 pt-5 {featured && factors.length ? '' : 'mt-auto'}">
		<div class="flex min-w-0 flex-wrap gap-1.5">
			{#each tags.slice(0, featured ? 5 : 3) as t (t)}
				<span class="chip">#{t}</span>
			{/each}
			{#if tags.length > (featured ? 5 : 3)}
				<span class="chip">+{tags.length - (featured ? 5 : 3)}</span>
			{/if}
		</div>
		<span class="num shrink-0 text-[11px] text-ink-500">{fmtDate(idea.createdAt)}</span>
	</div>
</a>
