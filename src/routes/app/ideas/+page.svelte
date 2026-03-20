<script lang="ts">
	import IdeaCard from '$lib/components/IdeaCard.svelte';

	let { data } = $props<{
		data: {
			ideas: Array<{
				id: number;
				title: string;
				description: string;
				category: string;
				tags: string;
				stage: string;
				priority_score: number;
				createdAt: string | Date;
			}>;
			categories: string[];
			selectedCategory: string | null;
			selectedStage: string | null;
			sort: string;
		};
	}>();

	const stageOptions = ['captured', 'selected', 'archived'];
</script>

<div class="mx-auto max-w-5xl p-6">
	<div class="flex items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-900">Ideas</h1>
			<p class="mt-1 text-sm text-slate-600">Capture, evaluate, and prioritize</p>
		</div>
		<a
			class="inline-flex rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
			href="/app/ideas/new"
		>
			New Idea
		</a>
	</div>

	<form class="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3" method="GET">
		<label class="block text-sm">
			<span class="text-slate-700">Category</span>
			<select
				name="category"
				class="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
				value={data.selectedCategory ?? ''}
			>
				<option value="">All</option>
				{#each data.categories as c}
					<option value={c}>{c}</option>
				{/each}
			</select>
		</label>

		<label class="block text-sm">
			<span class="text-slate-700">Stage</span>
			<select
				name="stage"
				class="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
				value={data.selectedStage ?? ''}
			>
				<option value="">All</option>
				{#each stageOptions as s}
					<option value={s}>{s}</option>
				{/each}
			</select>
		</label>

		<label class="block text-sm">
			<span class="text-slate-700">Sort</span>
			<select
				name="sort"
				class="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
				value={data.sort}
			>
				<option value="priority">Priority (high first)</option>
				<option value="newest">Newest</option>
			</select>
		</label>

		<div class="md:col-span-3 flex justify-end gap-3">
			<a
				class="rounded border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
				href="/app/ideas"
			>
				Clear
			</a>
			<button
				type="submit"
				class="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
			>
				Apply
			</button>
		</div>
	</form>

	<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
		{#if data.ideas.length === 0}
			<div class="sm:col-span-2 rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
				No ideas match your filters.
			</div>
		{:else}
			{#each data.ideas as idea (idea.id)}
				<IdeaCard {idea} />
			{/each}
		{/if}
	</div>
</div>

