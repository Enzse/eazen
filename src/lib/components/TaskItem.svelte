<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '$lib/components/Icon.svelte';
	import { taskStatus, TASK_STATUS } from '$lib/ui/status';

	let {
		task,
		index = 0
	}: {
		task: {
			id: number;
			title: string;
			description: string | null;
			status: string;
			completedAt: string | Date | null;
		};
		index?: number;
	} = $props();

	const NEXT: Record<string, string> = { todo: 'doing', doing: 'done', done: 'todo' };

	let editing = $state(false);
	let editTitle = $state('');
	let editDescription = $state('');
	let editStatus = $state('todo');

	function startEdit() {
		editTitle = task.title;
		editDescription = task.description ?? '';
		editStatus = task.status;
		editing = true;
	}

	const s = $derived(taskStatus(task.status));
	const next = $derived(taskStatus(NEXT[task.status] ?? 'todo'));
	const done = $derived(task.status === 'done');
</script>

<article
	class="rise group rounded-2xl border bg-ink-900/70 p-3.5 transition-all duration-200 {editing
		? 'border-ember-500/30'
		: 'border-white/6 hover:border-white/12 hover:bg-ink-850/80'}"
	style:--i={index}
>
	{#if !editing}
		<div class="flex items-start gap-3">
			<!-- One click moves the task to its next status. -->
			<form method="POST" action="?/updateTask" use:enhance>
				<input type="hidden" name="taskId" value={task.id} />
				<input type="hidden" name="title" value={task.title} />
				<input type="hidden" name="description" value={task.description ?? ''} />
				<input type="hidden" name="status" value={NEXT[task.status] ?? 'todo'} />
				<button
					type="submit"
					class="mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg border transition-all duration-200 active:scale-90 {done
						? 'border-sage-400/40 bg-sage-400/15 text-sage-400'
						: task.status === 'doing'
							? 'border-ember-500/50 bg-ember-500/15 text-ember-300 shadow-[0_0_12px_-2px_rgb(244_123_53/0.6)]'
							: 'border-white/15 text-transparent hover:border-ember-400/60 hover:text-ember-400/60'}"
					title="Move to {next.label}"
					aria-label="Move “{task.title}” to {next.label}"
				>
					<Icon name={task.status === 'doing' ? 'half' : 'check'} size={13} stroke={2.5} />
				</button>
			</form>

			<div class="min-w-0 flex-1">
				<p class="text-sm leading-snug font-medium {done ? 'text-ink-500 line-through decoration-ink-600' : 'text-ink-100'}">
					{task.title}
				</p>
				{#if task.description}
					<p class="mt-1 line-clamp-3 text-xs leading-relaxed text-ink-500">{task.description}</p>
				{/if}
				{#if done && task.completedAt}
					<p class="num mt-1.5 text-[11px] text-sage-400/80">
						Done {new Date(task.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
					</p>
				{/if}
			</div>

			<button
				type="button"
				class="rounded-lg p-1.5 text-ink-600 opacity-100 transition-all hover:bg-white/6 hover:text-ink-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
				onclick={startEdit}
				aria-label="Edit “{task.title}”"
			>
				<Icon name="pencil" size={14} />
			</button>
		</div>
	{:else}
		<form
			method="POST"
			action="?/updateTask"
			use:enhance={() =>
				async ({ update }) => {
					await update();
					editing = false;
				}}
			class="space-y-3"
		>
			<input type="hidden" name="taskId" value={task.id} />
			<label class="block">
				<span class="sr-only">Title</span>
				<input type="text" name="title" class="field mt-0!" required bind:value={editTitle} />
			</label>
			<label class="block">
				<span class="sr-only">Description</span>
				<textarea
					name="description"
					class="field mt-0! min-h-18 text-xs"
					placeholder="Notes (optional)"
					bind:value={editDescription}
				></textarea>
			</label>
			<div class="grid grid-cols-3 gap-1 rounded-xl border border-white/7 bg-ink-950/50 p-1">
				{#each Object.entries(TASK_STATUS) as [value, st] (value)}
					<label
						class="cursor-pointer rounded-lg py-1.5 text-center text-xs font-medium transition-all has-focus-visible:ring-2 has-focus-visible:ring-ember-400 {editStatus ===
						value
							? 'bg-white/8 text-ink-100'
							: 'text-ink-500 hover:text-ink-300'}"
					>
						<input type="radio" name="status" {value} class="sr-only" bind:group={editStatus} />
						{st.label}
					</label>
				{/each}
			</div>
			<div class="flex items-center justify-between gap-2">
				<button type="submit" formaction="?/deleteTask" formnovalidate class="btn btn-danger btn-sm" onclick={(e) => {
					if (!confirm(`Delete “${task.title}”?`)) e.preventDefault();
				}}>
					<Icon name="trash" size={13} /> Delete
				</button>
				<div class="flex gap-2">
					<button type="button" class="btn btn-ghost btn-sm" onclick={() => (editing = false)}>Cancel</button>
					<button type="submit" class="btn btn-primary btn-sm">Save</button>
				</div>
			</div>
		</form>
	{/if}
</article>
