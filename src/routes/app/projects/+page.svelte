<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	let { data } = $props();

	const groups = $derived(
		[
			{ key: 'motion', title: 'In motion', note: 'Planned and active', statuses: ['active', 'planned'] },
			{ key: 'paused', title: 'Paused', note: 'On hold for now', statuses: ['paused'] },
			{ key: 'done', title: 'Completed', note: 'Shipped and finished', statuses: ['completed'] }
		]
			.map((g) => ({
				...g,
				items: data.projects
					.filter((p) => g.statuses.includes(p.status))
					// Active before planned inside "In motion".
					.sort((a, b) => g.statuses.indexOf(a.status) - g.statuses.indexOf(b.status))
			}))
			.filter((g) => g.items.length > 0)
	);

	let i = 0;
	const nextIndex = () => Math.min(i++, 12) + 3;
</script>

<svelte:head><title>Projects · ccino</title></svelte:head>

<header>
	<p class="rise eyebrow">Workshop</p>
	<h1 class="rise mt-2 text-4xl font-bold text-ink-100" style:--i="1">Projects</h1>
	<p class="rise mt-2 text-sm text-ink-400" style:--i="2">Ideas you decided to build, and how far along they are.</p>
</header>

{#if data.projects.length === 0}
	<div class="panel rise mt-8 flex flex-col items-center px-6 py-16 text-center" style:--i="3">
		<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-ember-500/12 text-ember-400">
			<Icon name="stack" size={26} />
		</div>
		<h2 class="mt-5 text-lg font-semibold">No projects yet</h2>
		<p class="mt-1 max-w-sm text-sm text-ink-400">
			Open one of your ideas and choose <span class="text-ink-100">Start project</span> to begin.
		</p>
		<a href="/app/ideas" class="btn btn-primary mt-6">Browse ideas</a>
	</div>
{:else}
	{#each groups as g (g.key)}
		<section class="mt-12">
			<div class="flex items-baseline gap-3">
				<h2 class="text-xl font-semibold text-ink-100">{g.title}</h2>
				<span class="num text-sm text-ink-500">{g.items.length}</span>
				<span class="hidden text-sm text-ink-500 sm:inline">· {g.note}</span>
			</div>
			<div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each g.items as p (p.id)}
					<ProjectCard project={p} index={nextIndex()} />
				{/each}
			</div>
		</section>
	{/each}
{/if}
