<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import TaskItem from '$lib/components/TaskItem.svelte';
	import { getPriorityBadge } from '$lib/idea/priority';
	import { PROJECT_STATUS, projectStatus } from '$lib/ui/status';

	let { data, form } = $props();

	const project = $derived(data.project);
	const idea = $derived(project.idea);
	const tasks = $derived(project.tasks);

	const ps = $derived(projectStatus(project.status));
	const badge = $derived(getPriorityBadge(idea.priority_score));

	const doneCount = $derived(tasks.filter((t) => t.status === 'done').length);
	const openCount = $derived(tasks.length - doneCount);
	const pct = $derived(tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0);

	const columns = $derived([
		{ key: 'todo', label: 'To do', dot: 'bg-ink-500', items: tasks.filter((t) => t.status === 'todo') },
		{ key: 'doing', label: 'Doing', dot: 'bg-ember-400', items: tasks.filter((t) => t.status === 'doing') },
		{ key: 'done', label: 'Done', dot: 'bg-sage-400', items: tasks.filter((t) => t.status === 'done') }
	]);

	let renaming = $state(false);
	let nameDraft = $state('');
	let nameInput = $state<HTMLInputElement>();
	let showNotes = $state(false);

	async function startRename() {
		nameDraft = project.name;
		renaming = true;
		await tick();
		nameInput?.select();
	}

	/** Returns false if the user backs out of completing a project with open tasks. */
	function confirmComplete(submitter: HTMLElement | null) {
		if ((submitter as HTMLButtonElement | null)?.value !== 'completed' || openCount === 0) return true;
		const msg = `${openCount} ${openCount === 1 ? 'task is' : 'tasks are'} still open. Mark the project completed anyway?`;
		return confirm(msg);
	}

	function confirmDelete(e: SubmitEvent) {
		if (!confirm('Delete this project and all its tasks? The idea will be kept.')) e.preventDefault();
	}

	// Ring geometry
	const R = 30;
	const C = 2 * Math.PI * R;
</script>

<svelte:head><title>{project.name} · ccino</title></svelte:head>

<a href="/app/projects" class="rise link inline-flex items-center gap-1.5 text-sm">
	<Icon name="arrowLeft" size={15} /> Projects
</a>

<!-- Header -->
<section class="relative mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
	{#if project.status === 'active'}
		<div
			class="glow-pulse pointer-events-none absolute -top-20 -left-10 -z-10 h-60 w-60 rounded-full bg-ember-500/20 blur-[80px]"
			aria-hidden="true"
		></div>
	{/if}

	<div class="min-w-0 flex-1">
		<span class="rise chip {ps.class}"><span class="h-1.5 w-1.5 rounded-full {ps.dot}"></span>{ps.label}</span>

		{#if renaming}
			<form
				method="POST"
				action="?/updateProject"
				class="mt-4 flex max-w-2xl items-center gap-2"
				use:enhance={() =>
					async ({ update }) => {
						await update();
						renaming = false;
					}}
			>
				<input type="hidden" name="status" value={project.status} />
				<label class="flex-1">
					<span class="sr-only">Project name</span>
					<input
						bind:this={nameInput}
						bind:value={nameDraft}
						name="name"
						required
						class="field mt-0! font-display text-2xl! font-bold"
						onkeydown={(e) => e.key === 'Escape' && (renaming = false)}
					/>
				</label>
				<button type="submit" class="btn btn-primary">Save</button>
				<button type="button" class="btn btn-ghost" onclick={() => (renaming = false)}>Cancel</button>
			</form>
		{:else}
			<div class="group mt-4 flex items-start gap-3">
				<h1 class="rise text-4xl leading-[1.05] font-bold text-ink-100 sm:text-5xl" style:--i="1">{project.name}</h1>
				<button
					type="button"
					class="mt-2 rounded-lg p-2 text-ink-600 transition-all hover:bg-white/6 hover:text-ink-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
					onclick={startRename}
					aria-label="Rename project"
				>
					<Icon name="pencil" size={16} />
				</button>
			</div>
		{/if}

		{#if form?.projectError}
			<div class="alert mt-4 max-w-xl" role="alert">{form.projectError}</div>
		{/if}

		<!-- Status switcher -->
		<form
			method="POST"
			action="?/updateProject"
			class="rise mt-6 grid grid-cols-4 gap-1 rounded-xl border border-white/7 bg-ink-950/50 p-1 sm:inline-flex"
			style:--i="2"
			use:enhance={({ submitter, cancel }) => {
				if (!confirmComplete(submitter)) cancel();
			}}
		>
			<input type="hidden" name="name" value={project.name} />
			{#each Object.entries(PROJECT_STATUS) as [value, st] (value)}
				{@const on = project.status === value}
				<button
					type="submit"
					name="status"
					{value}
					class="flex items-center justify-center gap-1.5 rounded-lg px-1.5 py-1.5 text-xs font-medium transition-all duration-200 sm:px-3 sm:text-sm {on
						? 'bg-white/8 text-ink-100 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]'
						: 'text-ink-500 hover:text-ink-300'}"
					aria-pressed={on}
				>
					<Icon name={st.icon} size={14} class="hidden sm:block {on ? st.class.split(' ')[0] : ''}" />
					{st.label}
				</button>
			{/each}
		</form>
	</div>

	<!-- Progress ring -->
	<div class="rise flex items-center gap-5" style:--i="3">
		<div class="relative h-24 w-24">
			<svg viewBox="0 0 72 72" class="h-full w-full -rotate-90" aria-hidden="true">
				<circle cx="36" cy="36" r={R} fill="none" stroke="rgb(255 236 220 / 0.07)" stroke-width="5" />
				<circle
					cx="36"
					cy="36"
					r={R}
					fill="none"
					stroke={project.status === 'completed' ? 'var(--color-sage-400)' : 'var(--color-ember-500)'}
					stroke-width="5"
					stroke-linecap="round"
					stroke-dasharray={C}
					stroke-dashoffset={C * (1 - pct / 100)}
					class="transition-[stroke-dashoffset] duration-700"
					style:filter={project.status === 'completed' ? undefined : 'drop-shadow(0 0 6px rgb(244 123 53 / 0.6))'}
				/>
			</svg>
			<span class="num absolute inset-0 flex items-center justify-center text-xl font-semibold">{pct}%</span>
		</div>
		<div class="text-sm">
			<p class="text-ink-100"><span class="num">{doneCount}</span> of <span class="num">{tasks.length}</span> tasks done</p>
			<a href={`/app/ideas/${idea.id}`} class="link mt-1.5 inline-flex items-center gap-1.5 text-xs">
				<Icon name="spark" size={13} />
				From “{idea.title}” · <span class="num {badge.textClass}">{idea.priority_score}</span>
			</a>
		</div>
	</div>
</section>

<!-- Quick add -->
<section class="rise mt-10" style:--i="4">
	{#if form?.error}
		<div class="alert mb-3" role="alert">{form.error}</div>
	{/if}
	<form
		method="POST"
		action="?/createTask"
		class="panel p-2"
		use:enhance={({ formElement }) =>
			async ({ update }) => {
				await update();
				formElement.reset();
				showNotes = false;
				formElement.querySelector<HTMLInputElement>('input[name="title"]')?.focus();
			}}
	>
		<div class="flex items-center gap-2">
			<Icon name="plus" size={18} class="ml-3 shrink-0 text-ember-400" />
			<label class="flex-1">
				<span class="sr-only">New task</span>
				<input
					name="title"
					required
					placeholder="Add a task and press Enter…"
					class="h-11 w-full border-0 bg-transparent px-1 text-[15px] text-ink-100 placeholder:text-ink-500 focus:ring-0 focus:outline-none"
					autocomplete="off"
				/>
			</label>
			<button
				type="button"
				class="btn btn-ghost btn-sm hidden sm:inline-flex"
				onclick={() => (showNotes = !showNotes)}
				aria-expanded={showNotes}
			>
				Notes
			</button>
			<button type="submit" class="btn btn-primary btn-sm">Add</button>
		</div>
		{#if showNotes}
			<label class="block px-2 pt-1 pb-2">
				<span class="sr-only">Notes</span>
				<textarea name="description" class="field min-h-18" placeholder="Optional notes for this task"></textarea>
			</label>
		{/if}
	</form>
</section>

<!-- Board -->
<section class="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
	{#each columns as col, ci (col.key)}
		<div class="rise" style:--i={5 + ci}>
			<div class="mb-3 flex items-center gap-2 px-1">
				<span class="h-2 w-2 rounded-full {col.dot}"></span>
				<h2 class="font-sans text-sm font-semibold text-ink-200">{col.label}</h2>
				<span class="num text-xs text-ink-500">{col.items.length}</span>
			</div>
			<div class="panel-quiet min-h-32 space-y-2 p-2">
				{#if col.items.length === 0}
					<p class="px-3 py-8 text-center text-xs text-ink-600">
						{col.key === 'todo' ? 'Nothing queued' : col.key === 'doing' ? 'Nothing in progress' : 'Nothing finished yet'}
					</p>
				{:else}
					{#each col.items as t, i (t.id)}
						<TaskItem task={t} index={i} />
					{/each}
				{/if}
			</div>
		</div>
	{/each}
</section>

<div class="mt-14 flex justify-end">
	<form method="POST" action="?/deleteProject" onsubmit={confirmDelete}>
		<button type="submit" class="btn btn-danger btn-sm"><Icon name="trash" size={14} /> Delete project</button>
	</form>
</div>
