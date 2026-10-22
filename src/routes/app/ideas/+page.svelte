<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { onDestroy, tick } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import IdeaCard from '$lib/components/IdeaCard.svelte';
	import IdeaEditorModal from '$lib/components/IdeaEditorModal.svelte';

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

	let { data, form } = $props();

	let ideaModalRef: { openModal: () => void; closeModal: () => void } | undefined = $state();

	const initial = $derived(form?.initial as Record<string, unknown> | undefined);

	/** Client-only: filters the loaded list as the user types */
	let searchQuery = $state('');

	const stageTabs = [
		{ value: null, label: 'All' },
		{ value: 'captured', label: 'Captured' },
		{ value: 'selected', label: 'Selected' },
		{ value: 'archived', label: 'Archived' }
	];

	const filtersActive = $derived(Boolean(data.selectedCategory || data.selectedStage || data.sort !== 'priority'));

	const filteredIdeas = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return data.ideas as IdeaRow[];
		return (data.ideas as IdeaRow[]).filter(
			(idea) =>
				idea.title.toLowerCase().includes(q) ||
				idea.description.toLowerCase().includes(q) ||
				idea.tags.toLowerCase().includes(q)
		);
	});

	/** Builds a list URL that keeps the other filters as they are. */
	function hrefWith(patch: Record<string, string | null>) {
		const p = new URLSearchParams();
		const next = {
			category: data.selectedCategory,
			stage: data.selectedStage,
			sort: data.sort === 'priority' ? null : data.sort,
			...patch
		};
		for (const [k, v] of Object.entries(next)) if (v) p.set(k, v);
		const s = p.toString();
		return s ? `/app/ideas?${s}` : '/app/ideas';
	}

	function openCreateModal() {
		ideaModalRef?.openModal();
	}

	/** Open modal from `?new=1` after navigation completes (avoids racing $effect + goto with route teardown). */
	afterNavigate(async ({ to }) => {
		if (!to) return;
		if (to.url.pathname !== '/app/ideas') return;
		if (to.url.searchParams.get('new') !== '1') return;
		await tick();
		ideaModalRef?.openModal();
		const u = new URL(to.url);
		u.searchParams.delete('new');
		await goto(`${u.pathname}${u.search}`, { replaceState: true, noScroll: true, keepFocus: true });
	});

	onDestroy(() => {
		ideaModalRef?.closeModal();
	});
</script>

<svelte:head><title>Ideas · ccino</title></svelte:head>

<header class="flex flex-wrap items-end justify-between gap-4">
	<div>
		<p class="rise eyebrow">Library</p>
		<h1 class="rise mt-2 text-4xl font-bold text-ink-100" style:--i="1">Ideas</h1>
		<p class="rise mt-2 text-sm text-ink-400" style:--i="2">Capture, score, and let the best ones rise.</p>
	</div>
	<button type="button" class="rise btn btn-primary" style:--i="2" onclick={openCreateModal}>
		<Icon name="plus" size={16} stroke={2.25} /> New idea
	</button>
</header>

<!-- Toolbar -->
<div class="rise mt-8 space-y-3" style:--i="3">
	<div class="flex flex-col gap-3 lg:flex-row lg:items-center">
		<label class="relative min-w-0 flex-1">
			<span class="sr-only">Search ideas</span>
			<Icon name="search" size={16} class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-500" />
			<input
				type="search"
				bind:value={searchQuery}
				placeholder="Search titles, descriptions, tags…"
				class="field mt-0! h-11 pl-10"
				autocomplete="off"
			/>
		</label>

		<div class="flex flex-wrap items-center gap-2">
			<nav class="flex rounded-xl border border-white/7 bg-ink-950/50 p-1" aria-label="Filter by stage">
				{#each stageTabs as t (t.label)}
					{@const on = (data.selectedStage ?? null) === t.value}
					<a
						href={hrefWith({ stage: t.value })}
						class="rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 {on
							? 'bg-white/8 text-ink-100 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]'
							: 'text-ink-500 hover:text-ink-300'}"
						aria-current={on ? 'true' : undefined}
						data-sveltekit-noscroll
						data-sveltekit-keepfocus
					>
						{t.label}
					</a>
				{/each}
			</nav>

			{#if data.categories.filter(Boolean).length > 0}
				<form method="GET" action="/app/ideas" class="contents">
					{#if data.selectedStage}<input type="hidden" name="stage" value={data.selectedStage} />{/if}
					{#if data.sort !== 'priority'}<input type="hidden" name="sort" value={data.sort} />{/if}
					<label class="sr-only" for="cat">Category</label>
					<select
						id="cat"
						name="category"
						class="field mt-0! h-10 w-auto min-w-36 py-0"
						value={data.selectedCategory ?? ''}
						onchange={(e) => e.currentTarget.form?.requestSubmit()}
					>
						<option value="">All categories</option>
						{#each data.categories.filter(Boolean) as c (c)}
							<option value={c}>{c}</option>
						{/each}
					</select>
					<noscript><button class="btn btn-ghost btn-sm" type="submit">Apply</button></noscript>
				</form>
			{/if}

			<a
				href={hrefWith({ sort: data.sort === 'priority' ? 'newest' : null })}
				class="btn btn-ghost h-10"
				title="Change sort order"
				data-sveltekit-noscroll
			>
				<Icon name={data.sort === 'priority' ? 'flame' : 'filter'} size={15} class="text-ember-400" />
				{data.sort === 'priority' ? 'Top priority' : 'Newest'}
			</a>
		</div>
	</div>

	<p class="flex items-center gap-3 text-xs text-ink-500">
		<span class="num">
			{#if searchQuery.trim()}
				{filteredIdeas.length} of {data.ideas.length} shown
			{:else}
				{data.ideas.length} {data.ideas.length === 1 ? 'idea' : 'ideas'}
			{/if}
		</span>
		{#if filtersActive}
			<a href="/app/ideas" class="link text-xs">Clear filters</a>
		{/if}
	</p>
</div>

<!-- Grid -->
{#if data.ideas.length === 0}
	<div class="panel rise mt-6 flex flex-col items-center px-6 py-16 text-center" style:--i="4">
		<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-ember-500/12 text-ember-400">
			<Icon name="spark" size={26} />
		</div>
		{#if filtersActive}
			<h2 class="mt-5 text-lg font-semibold">Nothing matches these filters</h2>
			<p class="mt-1 text-sm text-ink-400">Try another stage or category.</p>
			<a href="/app/ideas" class="btn btn-ghost mt-6">Clear filters</a>
		{:else}
			<h2 class="mt-5 text-lg font-semibold">Your idea library is empty</h2>
			<p class="mt-1 max-w-sm text-sm text-ink-400">Every project starts as a line in a notebook. Write the first one.</p>
			<button type="button" class="btn btn-primary mt-6" onclick={openCreateModal}>Capture an idea</button>
		{/if}
	</div>
{:else if filteredIdeas.length === 0}
	<div class="panel-quiet mt-6 px-6 py-12 text-center text-sm text-ink-400">
		No ideas match “<span class="text-ink-100">{searchQuery.trim()}</span>”.
		<button type="button" class="link ml-1" onclick={() => (searchQuery = '')}>Clear search</button>
	</div>
{:else}
	<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
		{#each filteredIdeas as idea, i (idea.id)}
			<IdeaCard {idea} index={Math.min(i, 12) + 4} />
		{/each}
	</div>
{/if}

<IdeaEditorModal
	bind:this={ideaModalRef}
	titleText="New idea"
	headingId="create-idea-title"
	formAction="?/createIdea"
	submitLabel="Save idea"
	{initial}
	formError={form?.error}
/>
