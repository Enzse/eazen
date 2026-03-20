<script lang="ts">
	let { task } = $props<{
		task: {
			id: number;
			title: string;
			description: string | null;
			status: string;
			completedAt: string | Date | null;
		};
	}>();

	let selectedStatus = $state('todo');
	let selectedTitle = $state('');
	let selectedDescription = $state('');
	$effect(() => {
		selectedStatus = task.status;
		selectedTitle = task.title;
		selectedDescription = task.description ?? '';
	});

	function statusPill(status: string) {
		if (status === 'done') return { badgeClass: 'bg-green-50 border-green-200', textClass: 'text-green-700', label: 'Done' };
		if (status === 'doing') return { badgeClass: 'bg-blue-50 border-blue-200', textClass: 'text-blue-700', label: 'Doing' };
		return { badgeClass: 'bg-slate-50 border-slate-200', textClass: 'text-slate-700', label: 'Todo' };
	}

	const pill = $derived(statusPill(task.status));
</script>

<div class="rounded-lg border border-slate-200 bg-white p-3">
	<div class="flex items-start justify-between gap-3">
		<div>
			<div class="text-sm font-semibold text-slate-900">{task.title}</div>
			{#if task.description}
				<p class="mt-1 text-sm text-slate-600">{task.description}</p>
			{/if}
			{#if task.status === 'done' && task.completedAt}
				<div class="mt-2 text-xs text-slate-500">
					Completed: {new Date(task.completedAt).toLocaleDateString()}
				</div>
			{/if}
		</div>
		<span
			class={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${pill.badgeClass} ${pill.textClass}`}
		>
			{pill.label}
		</span>
	</div>

	<div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
		<form method="POST" action="?/updateTask" class="sm:col-span-2">
			<input type="hidden" name="taskId" value={task.id} />
			<label class="block text-xs text-slate-600">
				Title
				<input
					type="text"
					name="title"
					class="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
					required
					bind:value={selectedTitle}
				/>
			</label>

			<label class="mt-2 block text-xs text-slate-600">
				Description
				<textarea
					name="description"
					class="mt-1 w-full min-h-[70px] rounded border border-slate-200 bg-white px-3 py-2 text-sm"
					bind:value={selectedDescription}
				></textarea>
			</label>

			<label class="mt-2 block text-xs text-slate-600">
				Status
				<select
					name="status"
					class="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
					bind:value={selectedStatus}
				>
					<option value="todo">todo</option>
					<option value="doing">doing</option>
					<option value="done">done</option>
				</select>
			</label>
			<div class="mt-2 flex justify-end">
				<button
					type="submit"
					class="rounded bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
				>
					Save
				</button>
			</div>
		</form>

		<form method="POST" action="?/deleteTask">
			<input type="hidden" name="taskId" value={task.id} />
			<button
				type="submit"
				class="rounded border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-100"
			>
				Delete
			</button>
		</form>
	</div>
</div>

