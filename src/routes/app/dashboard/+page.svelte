<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import IdeaCard from '$lib/components/IdeaCard.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	let { data } = $props();

	const hour = new Date().getHours();
	const greeting = hour < 5 ? 'Up late' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

	const totalIdeas = $derived(data.stages.captured + data.stages.selected + data.stages.archived);
	const totalTasks = $derived(data.counts.todo + data.counts.doing + data.counts.done);
	const pct = (n: number) => (totalTasks ? (n / totalTasks) * 100 : 0);

	const [featured, ...rest] = $derived(data.topIdeas);

	const taskRows = $derived([
		{ key: 'todo', label: 'To do', n: data.counts.todo, bar: 'bg-ink-500' },
		{ key: 'doing', label: 'Doing', n: data.counts.doing, bar: 'bg-ember-500' },
		{ key: 'done', label: 'Done', n: data.counts.done, bar: 'bg-sage-400' }
	]);
</script>

<svelte:head><title>Dashboard · ccino</title></svelte:head>

<!-- Hero -->
<section class="relative">
	<div
		class="drift pointer-events-none absolute -top-24 right-0 -z-10 h-72 w-72 rounded-full bg-ember-500/20 blur-[90px] sm:right-16"
		aria-hidden="true"
	></div>
	<p class="rise eyebrow">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
	<h1 class="rise mt-3 text-4xl font-bold text-ink-100 sm:text-5xl" style:--i="1">
		{greeting}.
	</h1>
	<p class="rise mt-3 max-w-xl text-base leading-relaxed text-ink-400" style:--i="2">
		{#if totalIdeas === 0}
			Nothing here yet. Capture your first idea and ccino will help you decide what's worth building.
		{:else}
			You have <span class="text-ink-100">{data.stages.captured + data.stages.selected} live ideas</span>
			and <span class="text-ink-100">{data.activeProjects.length} {data.activeProjects.length === 1 ? 'project' : 'projects'}</span> in motion.
			{#if data.counts.doing > 0}
				<span class="text-ember-300">{data.counts.doing} {data.counts.doing === 1 ? 'task is' : 'tasks are'} underway.</span>
			{/if}
		{/if}
	</p>
	<div class="rise mt-6 flex flex-wrap items-center gap-3" style:--i="3">
		<a href="/app/ideas?new=1" class="btn btn-primary"><Icon name="plus" size={16} stroke={2.25} /> Capture an idea</a>
		<span class="hidden text-xs text-ink-500 sm:inline">
			or press <kbd class="num rounded-md border border-white/10 bg-white/4 px-1.5 py-0.5 text-ink-300">Ctrl K</kbd> to jump anywhere
		</span>
	</div>
</section>

<!-- Top ideas -->
<section class="mt-14">
	<div class="flex items-end justify-between gap-4">
		<div>
			<h2 class="text-xl font-semibold text-ink-100">Burning brightest</h2>
			<p class="mt-1 text-sm text-ink-500">Your highest-scoring live ideas</p>
		</div>
		<a class="link inline-flex items-center gap-1 text-sm" href="/app/ideas">All ideas <Icon name="arrowRight" size={14} /></a>
	</div>

	{#if !featured}
		<div class="panel rise mt-5 flex flex-col items-center px-6 py-14 text-center">
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-ember-500/12 text-ember-400 shadow-[0_0_30px_-6px_rgb(244_123_53/0.6)]">
				<Icon name="spark" size={26} />
			</div>
			<h3 class="mt-5 text-lg font-semibold">No ideas yet</h3>
			<p class="mt-1 max-w-sm text-sm text-ink-400">Write one down and score it. The best ones float up here.</p>
			<a href="/app/ideas?new=1" class="btn btn-primary mt-6">Capture an idea</a>
		</div>
	{:else}
		<div class="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-5">
			<div class="lg:col-span-3">
				<IdeaCard idea={featured} featured index={4} />
			</div>
			{#if rest.length}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
					{#each rest as idea, i (idea.id)}
						<IdeaCard {idea} index={5 + i} />
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</section>

<!-- Pulse -->
<section class="mt-14 grid grid-cols-1 gap-4 md:grid-cols-5">
	<div class="panel rise flex flex-col p-6 md:col-span-3" style:--i="7">
		<div class="flex items-baseline justify-between">
			<h2 class="text-base font-semibold">Task pulse</h2>
			<span class="num text-xs text-ink-500">{totalTasks} total</span>
		</div>
		{#if totalTasks === 0}
			<p class="mt-4 text-sm text-ink-500">No tasks yet. Turn an idea into a project and break it into steps.</p>
		{:else}
			<div class="mt-5 flex h-2.5 gap-1 overflow-hidden rounded-full">
				{#each taskRows as r (r.key)}
					{#if r.n > 0}
						<div class="h-full rounded-full {r.bar} transition-[width] duration-700" style:width="{pct(r.n)}%"></div>
					{/if}
				{/each}
			</div>
		{/if}
		<dl class="mt-auto grid grid-cols-3 gap-4 pt-6">
			{#each taskRows as r (r.key)}
				<div>
					<dt class="flex items-center gap-2 text-xs text-ink-400">
						<span class="h-2 w-2 rounded-full {r.bar}"></span>{r.label}
					</dt>
					<dd class="num mt-1 text-3xl font-semibold text-ink-100">{r.n}</dd>
				</div>
			{/each}
		</dl>
	</div>

	<div class="panel rise p-6 md:col-span-2" style:--i="8">
		<div class="flex items-baseline justify-between">
			<h2 class="text-base font-semibold">Idea pipeline</h2>
			<span class="num text-xs text-ink-500">{totalIdeas} total</span>
		</div>
		<ul class="mt-5 space-y-3">
			{#each [{ k: 'captured', label: 'Captured' }, { k: 'selected', label: 'Selected' }, { k: 'archived', label: 'Archived' }] as s (s.k)}
				<li>
					<a
						href="/app/ideas?stage={s.k}"
						class="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-white/4"
					>
						<span class="text-sm text-ink-300 group-hover:text-ink-100">{s.label}</span>
						<span class="flex items-center gap-2">
							<span class="num text-lg font-semibold text-ink-100">{data.stages[s.k]}</span>
							<Icon name="arrowRight" size={14} class="text-ink-600 transition-transform group-hover:translate-x-0.5 group-hover:text-ember-400" />
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- Projects -->
<section class="mt-14">
	<div class="flex items-end justify-between gap-4">
		<div>
			<h2 class="text-xl font-semibold text-ink-100">In motion</h2>
			<p class="mt-1 text-sm text-ink-500">Planned and active projects</p>
		</div>
		<a class="link inline-flex items-center gap-1 text-sm" href="/app/projects">All projects <Icon name="arrowRight" size={14} /></a>
	</div>

	{#if data.activeProjects.length === 0}
		<div class="panel-quiet rise mt-5 px-6 py-10 text-center text-sm text-ink-400">
			No projects in motion. Open an idea and choose <span class="text-ink-100">Start project</span>.
		</div>
	{:else}
		<div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.activeProjects as p, i (p.id)}
				<ProjectCard project={p} index={9 + i} />
			{/each}
		</div>
	{/if}
</section>
