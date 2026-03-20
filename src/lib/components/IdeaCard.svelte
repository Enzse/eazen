<script lang="ts">
	import { getPriorityBadge } from '$lib/idea/priority';

	let { idea } = $props<{
		idea: {
			id: number;
			title: string;
			description: string;
			category: string;
			tags: string;
			stage: string;
			priority_score: number;
			createdAt: string | Date;
		};
	}>();

	const badge = $derived(getPriorityBadge(idea.priority_score));
	const tags = $derived(idea.tags ? idea.tags.split(',').filter(Boolean) : []);

	function fmtDate(d: string | Date) {
		const date = typeof d === 'string' ? new Date(d) : d;
		return date.toLocaleDateString();
	}
</script>

<a class="block rounded-lg border bg-white p-4 hover:bg-slate-50" href={`/app/ideas/${idea.id}`}>
	<div class="flex items-start justify-between gap-3">
		<div>
			<div class="text-xs text-slate-500">
				{idea.category} · {idea.stage}
			</div>
			<div class="mt-1 text-base font-bold text-slate-900">{idea.title}</div>
		</div>
		<span
			class={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${badge.badgeClass} ${badge.textClass}`}
		>
			{badge.label} ({idea.priority_score})
		</span>
	</div>

	{#if idea.description}
		<p class="mt-2 line-clamp-3 text-sm text-slate-600">{idea.description}</p>
	{/if}

	{#if tags.length > 0}
		<div class="mt-3 flex flex-wrap gap-2">
			{#each tags as t}
				<span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{t}</span>
			{/each}
		</div>
	{/if}

	<div class="mt-3 text-xs text-slate-500">Created: {fmtDate(idea.createdAt)}</div>
</a>

