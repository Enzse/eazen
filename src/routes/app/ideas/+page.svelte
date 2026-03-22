<script lang="ts">
	import IdeaCard from '$lib/components/IdeaCard.svelte';

	type IdeaRow = {
		id: number;
		title: string;
		description: string;
		category: string;
		tags: string;
		stage: string;
		priority_score: number;
		createdAt: string | Date;
	};

	let { data } = $props<{
		data: {
			ideas: IdeaRow[];
			categories: string[];
			selectedCategory: string | null;
			selectedStage: string | null;
			sort: string;
		};
	}>();

	/** Client-only: filters the loaded list as the user types */
	let searchQuery = $state('');

	const stageOptions = ['captured', 'selected', 'archived'];

	const sortLabel = $derived(
		data.sort === 'newest' ? 'Newest first' : 'Priority (high first)'
	);

	const filtersActive = $derived(
		Boolean(data.selectedCategory || data.selectedStage || data.sort !== 'priority')
	);

	const searchActive = $derived(Boolean(searchQuery.trim()));

	const filteredIdeas = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return data.ideas;
		return data.ideas.filter((idea: IdeaRow) => {
			const title = idea.title.toLowerCase();
			const desc = idea.description.toLowerCase();
			const tags = idea.tags.toLowerCase();
			return title.includes(q) || desc.includes(q) || tags.includes(q);
		});
	});
</script>

<div class="w-full">
	<div class="flex items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-900">Ideas</h1>
			<p class="mt-1 text-sm text-slate-600">Capture, evaluate, and prioritize</p>
		</div>
		<a
			class="inline-flex shrink-0 rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
			href="/app/ideas/new"
		>
			New Idea
		</a>
	</div>

	<!-- Search stays outside the GET form so Enter doesn’t submit filters and reset typing -->
	<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
		<label class="relative min-w-0 flex-1">
			<span class="sr-only">Search ideas</span>
			<input
				type="search"
				bind:value={searchQuery}
				placeholder="Search title, description, tags…"
				class="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
				autocomplete="off"
			/>
			<span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="7" />
					<path d="M21 21l-4.35-4.35" />
				</svg>
			</span>
		</label>

		<form class="relative shrink-0 sm:self-stretch" method="GET" action="/app/ideas">
		<div class="relative h-full min-w-[10rem]">
			<details class="group h-full min-w-[10rem]">
				<summary
					class="flex h-full cursor-pointer list-none items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 [&::-webkit-details-marker]:hidden"
				>
					<svg class="h-4 w-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M4 6h16M4 12h10M4 18h7" />
					</svg>
					Filters
					{#if filtersActive}
						<span class="h-2 w-2 rounded-full bg-slate-900" title="Filters active"></span>
					{/if}
					<svg
						class="h-4 w-4 text-slate-500 transition group-open:rotate-180"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M6 9l6 6 6-6" />
					</svg>
				</summary>

				<div
					class="absolute right-0 z-20 mt-2 w-[min(100vw-2rem,20rem)] rounded-lg border border-slate-200 bg-white p-4 shadow-lg sm:w-80"
				>
					<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Refine list</p>

					<div class="mt-3 space-y-3">
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
					</div>

					<div class="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4">
						<a
							class="rounded border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
							href="/app/ideas"
						>
							Reset all
						</a>
						<button
							type="submit"
							class="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
						>
							Apply filters
						</button>
					</div>
				</div>
			</details>
		</div>
		</form>
	</div>

	<p class="mt-2 text-xs text-slate-500">
		{#if searchActive}
			{filteredIdeas.length} shown (of {data.ideas.length} loaded)
		{:else}
			{data.ideas.length} result(s)
		{/if}
		· Sorted: {sortLabel}
	</p>

	<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#if data.ideas.length === 0}
			<div class="col-span-full rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
				No ideas match your filters.
			</div>
		{:else if filteredIdeas.length === 0}
			<div class="col-span-full rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
				No ideas match “{searchQuery.trim()}”. Try a different search or clear the box.
			</div>
		{:else}
			{#each filteredIdeas as idea (idea.id)}
				<IdeaCard {idea} />
			{/each}
		{/if}
	</div>
</div>
