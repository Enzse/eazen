<script lang="ts">
	import IdeaForm from '$lib/components/IdeaForm.svelte';

	let { data, form } = $props<{
		data: { idea: any; project?: { id: number; name: string; status: string } | null };
		form?: { error?: string; initial?: Record<string, unknown> };
	}>();

	const idea = $derived(data.idea);

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
		form?.initial ? { ...baseInitial, ...(form.initial as any) } : baseInitial
	);

	const project = $derived(data.project ?? null);
</script>

<div class="mx-auto max-w-5xl p-6">
	<div class="flex items-center justify-between gap-4">
		<h1 class="text-2xl font-bold text-slate-900">Idea #{idea.id}</h1>
		<div class="text-xs text-slate-500">
			Updated: {new Date(idea.updatedAt).toLocaleString()}
		</div>
	</div>

	{#if form?.error}
		<div class="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
			{form.error}
		</div>
	{/if}

	<div class="mt-6">
		<form method="POST" action="?/updateIdea">
			<IdeaForm initial={initial} submitLabel="Update Idea" />
		</form>
	</div>

	<div class="mt-6 rounded border border-slate-200 bg-white p-4">
		{#if project}
			<a
				class="inline-flex items-center rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
				href={`/app/projects/${project.id}`}
			>
				View Project
			</a>
		{:else}
			<form method="POST" action="?/convertIdeaToProject">
				<button
					type="submit"
					class="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
				>
					Convert to Project
				</button>
			</form>
		{/if}
	</div>

	<div class="mt-8 rounded border border-slate-200 bg-white p-4">
		<form method="POST" action="?/deleteIdea">
			<button
				type="submit"
				class="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
			>
				Delete Idea
			</button>
		</form>
	</div>
</div>

