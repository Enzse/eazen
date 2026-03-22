<script lang="ts">
	import IdeaForm from '$lib/components/IdeaForm.svelte';

	let { form } = $props<{
		form?: { error?: string; initial?: Record<string, unknown> };
	}>();

	const initial = $derived(form?.initial as any);
</script>

<div class="w-full">
	<h1 class="text-2xl font-bold text-slate-900">New Idea</h1>

	{#if form?.error}
		<div class="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
			{form.error}
		</div>
	{/if}

	<div class="mt-6">
		<form method="POST" action="?/createIdea">
			<IdeaForm initial={initial} submitLabel="Create Idea" />
		</form>
	</div>
</div>

