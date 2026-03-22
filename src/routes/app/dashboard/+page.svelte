<script lang="ts">
	import IdeaCard from '$lib/components/IdeaCard.svelte';

	let { data } = $props<{
		data: {
			topIdeas: Array<{
				id: number;
				title: string;
				description: string;
				category: string;
				tags: string;
				stage: string;
				priority_score: number;
				createdAt: string | Date;
			}>;
			activeProjects: Array<any>;
			counts: { todo: number; doing: number; done: number };
		};
	}>();
</script>

<div class="w-full">
	<h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
	<p class="mt-1 text-sm text-slate-600">Your priorities and next actions</p>

	<div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
		<section class="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-4">
			<div class="flex items-center justify-between gap-4">
				<h2 class="text-lg font-semibold text-slate-900">Top Ideas</h2>
				<a class="text-sm font-semibold text-slate-700 hover:underline" href="/app/ideas">
					View all
				</a>
			</div>

			<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{#if data.topIdeas.length === 0}
					<div class="col-span-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
						No ideas yet. Create one to see it on your dashboard.
					</div>
				{:else}
					{#each data.topIdeas as idea (idea.id)}
						<IdeaCard {idea} />
					{/each}
				{/if}
			</div>
		</section>

		<section class="rounded-lg border border-slate-200 bg-white p-4">
			<h2 class="text-lg font-semibold text-slate-900">Task Summary</h2>
			<div class="mt-4 grid grid-cols-1 gap-2 text-sm">
				<div class="flex items-center justify-between">
					<span class="text-slate-600">Todo</span>
					<span class="font-semibold text-slate-900">{data.counts.todo}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-slate-600">Doing</span>
					<span class="font-semibold text-slate-900">{data.counts.doing}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-slate-600">Done</span>
					<span class="font-semibold text-slate-900">{data.counts.done}</span>
				</div>
			</div>
			<div class="mt-4 text-xs text-slate-500">
				Task/project features are added in later phases.
			</div>
		</section>

		<section class="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-3">
			<div class="flex items-center justify-between gap-4">
				<h2 class="text-lg font-semibold text-slate-900">Active Projects</h2>
			</div>

			{#if data.activeProjects.length === 0}
				<div class="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
					No active projects yet. Convert an idea into a project in Phase 3.
				</div>
			{:else}
				<div class="mt-4 text-sm text-slate-700">
					{#each data.activeProjects as p (p.id)}
						<div class="py-1">
							Project #{p.id} — {p.name} (idea: {p.idea?.title})
						</div>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</div>

