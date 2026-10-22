<script lang="ts">
	import { onDestroy } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import IdeaEditorModal from '$lib/components/IdeaEditorModal.svelte';
	import ScoreDisplay from '$lib/components/ScoreDisplay.svelte';
	import { getPriorityBadge } from '$lib/idea/priority';
	import { projectStatus, STAGE_LABEL } from '$lib/ui/status';

	let { data, form } = $props();

	const idea = $derived(data.idea);
	const project = $derived(data.project ?? null);

	const baseInitial = $derived({
		title: idea.title,
		description: idea.description,
		category: idea.category,
		tags: idea.tags,
		stage: idea.stage,
		interest: idea.interest,
		learning_value: idea.learning_value,
		income_potential: idea.income_potential,
		effort: idea.effort
	});

	const initial = $derived(
		form?.initial ? { ...baseInitial, ...(form.initial as Record<string, unknown>) } : baseInitial
	);

	let editModalRef: { openModal: () => void; closeModal: () => void } | undefined = $state();

	const badge = $derived(getPriorityBadge(idea.priority_score));
	const tagList = $derived(idea.tags ? idea.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []);
	const ps = $derived(project ? projectStatus(project.status) : null);
	const doneTasks = $derived(project ? project.tasks.filter((t: { status: string }) => t.status === 'done').length : 0);

	function confirmDelete(e: SubmitEvent) {
		const message = project
			? `Delete this idea? Its project "${project.name}" and all its tasks will be deleted too.`
			: 'Delete this idea?';
		if (!confirm(message)) e.preventDefault();
	}

	onDestroy(() => {
		editModalRef?.closeModal();
	});
</script>

<svelte:head><title>{idea.title} · ccino</title></svelte:head>

<a href="/app/ideas" class="rise link inline-flex items-center gap-1.5 text-sm">
	<Icon name="arrowLeft" size={15} /> Ideas
</a>

<div class="relative mt-6">
	{#if badge.tier === 'high'}
		<div
			class="glow-pulse pointer-events-none absolute -top-16 -left-10 -z-10 h-64 w-64 rounded-full bg-ember-500/25 blur-[80px]"
			aria-hidden="true"
		></div>
	{/if}

	<div class="rise flex flex-wrap items-center gap-2 text-sm" style:--i="1">
		<span class="chip">{STAGE_LABEL[idea.stage] ?? idea.stage}</span>
		{#if idea.category}<span class="chip">{idea.category}</span>{/if}
		<span class="chip {badge.badgeClass} {badge.textClass}">{badge.label} priority</span>
	</div>

	<div class="mt-4 flex flex-wrap items-start justify-between gap-6">
		<h1 class="rise max-w-3xl text-4xl leading-[1.05] font-bold text-ink-100 sm:text-5xl" style:--i="2">{idea.title}</h1>
		<button type="button" class="rise btn btn-ghost" style:--i="2" onclick={() => editModalRef?.openModal()}>
			<Icon name="pencil" size={15} /> Edit
		</button>
	</div>

	{#if tagList.length > 0}
		<div class="rise mt-4 flex flex-wrap gap-1.5" style:--i="3">
			{#each tagList as t (t)}<span class="chip">#{t}</span>{/each}
		</div>
	{/if}
</div>

<div class="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
	<div class="space-y-5 lg:col-span-2">
		<section class="panel rise p-6 sm:p-7" style:--i="4">
			<h2 class="eyebrow">Notes</h2>
			{#if idea.description}
				<p class="mt-3 max-w-prose text-[15px] leading-relaxed whitespace-pre-wrap text-ink-200">{idea.description}</p>
			{:else}
				<p class="mt-3 text-sm text-ink-500">
					No description yet.
					<button type="button" class="link" onclick={() => editModalRef?.openModal()}>Add one</button>
				</p>
			{/if}
		</section>

		<section class="panel rise p-6 sm:p-7" style:--i="5">
			<ScoreDisplay
				priority_score={idea.priority_score}
				interest={idea.interest}
				learning_value={idea.learning_value}
				income_potential={idea.income_potential}
				effort={idea.effort}
			/>
		</section>
	</div>

	<aside class="space-y-5 lg:sticky lg:top-8 lg:self-start">
		<section class="panel rise overflow-hidden p-6" style:--i="6">
			{#if project && ps}
				<h2 class="eyebrow">Project</h2>
				<p class="mt-3 font-display text-lg font-semibold">{project.name}</p>
				<div class="mt-3 flex items-center gap-3">
					<span class="chip {ps.class}"><span class="h-1.5 w-1.5 rounded-full {ps.dot}"></span>{ps.label}</span>
					<span class="num text-xs text-ink-500">{doneTasks}/{project.tasks.length} tasks done</span>
				</div>
				<a class="btn btn-primary mt-5 w-full" href={`/app/projects/${project.id}`}>
					Open project <Icon name="arrowRight" size={15} />
				</a>
			{:else}
				<div
					class="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-ember-500/20 blur-3xl"
					aria-hidden="true"
				></div>
				<h2 class="eyebrow">Ready to build?</h2>
				<p class="relative mt-3 text-sm leading-relaxed text-ink-300">
					Turn this idea into a project and break it into tasks.
				</p>
				<form method="POST" action="?/convertIdeaToProject" class="relative">
					<button type="submit" class="btn btn-primary mt-5 w-full">
						<Icon name="bolt" size={15} /> Start project
					</button>
				</form>
			{/if}
		</section>

		<section class="rise px-1" style:--i="7">
			<p class="num text-xs text-ink-500">
				Created {new Date(idea.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
				<br />Updated {new Date(idea.updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
			</p>
			<form method="POST" action="?/deleteIdea" onsubmit={confirmDelete} class="mt-4">
				<button type="submit" class="btn btn-danger btn-sm">
					<Icon name="trash" size={14} /> Delete idea
				</button>
			</form>
		</section>
	</aside>
</div>

<IdeaEditorModal
	bind:this={editModalRef}
	titleText="Edit idea"
	headingId="edit-idea-title"
	formAction="?/updateIdea"
	submitLabel="Save changes"
	{initial}
	formError={form?.error}
/>
