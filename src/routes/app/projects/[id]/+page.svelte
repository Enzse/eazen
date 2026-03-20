<script lang="ts">
	import TaskItem from '$lib/components/TaskItem.svelte';

	let { data, form } = $props<{
		data: { project: any };
		form?: { error?: string };
	}>();

	const project = $derived(data.project);
	const idea = $derived(project.idea);
	const tasks = $derived(project.tasks);

	function statusPill(status: string) {
		if (status === 'completed')
			return { badgeClass: 'bg-green-50 border-green-200', textClass: 'text-green-700', label: 'Completed' };
		if (status === 'paused')
			return { badgeClass: 'bg-yellow-50 border-yellow-200', textClass: 'text-yellow-700', label: 'Paused' };
		if (status === 'active')
			return { badgeClass: 'bg-blue-50 border-blue-200', textClass: 'text-blue-700', label: 'Active' };
		return { badgeClass: 'bg-slate-50 border-slate-200', textClass: 'text-slate-700', label: 'Planned' };
	}

	const pill = $derived(statusPill(project.status));
</script>

<div class="mx-auto max-w-5xl p-6">
	<div class="flex items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-900">Project: {project.name}</h1>
			<div class="mt-1 text-sm text-slate-600">
				Status:
				<span class={`ml-2 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${pill.badgeClass} ${pill.textClass}`}>
					{pill.label}
				</span>
			</div>
		</div>

		<div class="flex flex-col items-end gap-2">
			<a
				class="inline-flex rounded border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
				href="/app/projects"
			>
				Back to Projects
			</a>
		</div>
	</div>

	<section class="mt-6 rounded-lg border border-slate-200 bg-white p-4">
		<h2 class="text-lg font-semibold text-slate-900">Linked Idea</h2>
		<div class="mt-2 text-sm text-slate-700">
			<div class="font-semibold">{idea.title}</div>
			<div class="mt-1 text-slate-600">
				{idea.category} · {idea.stage} · priority score: {idea.priority_score}
			</div>
		</div>
		<div class="mt-3">
			<a class="text-sm font-semibold text-slate-700 hover:underline" href={`/app/ideas/${idea.id}`}>
				Open Idea
			</a>
		</div>
	</section>

	<section class="mt-6 rounded-lg border border-slate-200 bg-white p-4">
		<div class="flex items-center justify-between gap-4">
			<h2 class="text-lg font-semibold text-slate-900">Tasks</h2>
		</div>

		{#if form?.error}
			<div class="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
				{form.error}
			</div>
		{/if}

		<div class="mt-4 rounded border border-slate-200 bg-slate-50 p-4">
			<form method="POST" action="?/createTask">
				<label class="block text-sm font-medium text-slate-900">
					Task title
					<input
						class="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
						name="title"
						type="text"
						required
					/>
				</label>
				<label class="mt-3 block text-sm font-medium text-slate-900">
					Description (optional)
					<textarea
						class="mt-1 w-full min-h-[90px] rounded border border-slate-200 bg-white px-3 py-2 text-sm"
						name="description"
					></textarea>
				</label>
				<div class="mt-4 flex justify-end">
					<button
						type="submit"
						class="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
					>
						Add Task
					</button>
				</div>
			</form>
		</div>

		<div class="mt-4 grid grid-cols-1 gap-3">
			{#if tasks.length === 0}
				<div class="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
					No tasks yet. Add one above.
				</div>
			{:else}
				{#each tasks as t (t.id)}
					<TaskItem task={t} />
				{/each}
			{/if}
		</div>
	</section>
</div>

