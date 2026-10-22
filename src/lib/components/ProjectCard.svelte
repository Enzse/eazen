<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { spotlight } from '$lib/ui/spotlight';
	import { projectStatus } from '$lib/ui/status';

	let {
		project,
		index = 0
	}: {
		project: {
			id: number;
			name: string;
			status: string;
			idea?: { id: number; title: string } | null;
			updatedAt: string | Date;
			tasks?: Array<{ status: string }>;
		};
		index?: number;
	} = $props();

	const s = $derived(projectStatus(project.status));
	const total = $derived(project.tasks?.length ?? 0);
	const done = $derived(project.tasks?.filter((t) => t.status === 'done').length ?? 0);
	const pct = $derived(total ? Math.round((done / total) * 100) : 0);

	function fmtDate(d: string | Date) {
		return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
	}
</script>

<a
	use:spotlight
	class="panel spot lift rise group flex h-full flex-col p-5"
	style:--i={index}
	href={`/app/projects/${project.id}`}
>
	<div class="flex items-center justify-between gap-3">
		<span class="chip {s.class}">
			<span class="h-1.5 w-1.5 rounded-full {s.dot}"></span>
			{s.label}
		</span>
		<Icon
			name="arrowUpRight"
			size={16}
			class="text-ink-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember-400"
		/>
	</div>

	<h3 class="mt-4 font-display text-lg leading-snug font-semibold text-ink-100">{project.name}</h3>
	{#if project.idea && project.idea.title !== project.name}
		<p class="mt-1 truncate text-xs text-ink-500">From “{project.idea.title}”</p>
	{/if}

	<div class="mt-auto pt-6">
		{#if project.tasks}
			<div class="flex items-baseline justify-between text-xs">
				<span class="text-ink-400">
					{#if total === 0}No tasks yet{:else}<span class="num text-ink-100">{done}</span>/<span class="num">{total}</span> tasks done{/if}
				</span>
				<span class="num text-ink-500">{fmtDate(project.updatedAt)}</span>
			</div>
			<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-veil/6">
				<div
					class="h-full rounded-full transition-[width] duration-700 {project.status === 'completed'
						? 'bg-sage-400'
						: 'bg-linear-to-r from-ember-600 to-ember-400'}"
					style:width="{pct}%"
				></div>
			</div>
		{:else}
			<span class="num text-xs text-ink-500">Updated {fmtDate(project.updatedAt)}</span>
		{/if}
	</div>
</a>
