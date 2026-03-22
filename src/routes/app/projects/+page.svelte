<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	let { data } = $props<{
		data: {
			projects: Array<{
				id: number;
				name: string;
				status: string;
				updatedAt: string | Date;
				idea?: { id: number; title: string } | null;
			}>;
		};
	}>();
</script>

<div class="w-full">
	<div class="flex items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-900">Projects</h1>
			<p class="mt-1 text-sm text-slate-600">Execution layer created from ideas</p>
		</div>
		<a
			class="inline-flex rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
			href="/app/ideas"
		>
			Back to Ideas
		</a>
	</div>

	<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#if data.projects.length === 0}
			<div class="col-span-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
				No projects yet. Convert an idea to a project.
			</div>
		{:else}
			{#each data.projects as p (p.id)}
				<ProjectCard project={p} />
			{/each}
		{/if}
	</div>
</div>

