<script lang="ts">

	let { project } = $props<{
		project: {
			id: number;
			name: string;
			status: string;
			idea?: { id: number; title: string } | null;
			updatedAt: string | Date;
		};
	}>();

	function statusPill(status: string) {
		const s = status;
		if (s === 'completed') return { badgeClass: 'bg-green-50 border-green-200', textClass: 'text-green-700', label: 'Completed' };
		if (s === 'paused') return { badgeClass: 'bg-yellow-50 border-yellow-200', textClass: 'text-yellow-700', label: 'Paused' };
		if (s === 'active') return { badgeClass: 'bg-blue-50 border-blue-200', textClass: 'text-blue-700', label: 'Active' };
		return { badgeClass: 'bg-slate-50 border-slate-200', textClass: 'text-slate-700', label: 'Planned' };
	}

	const pill = $derived(statusPill(project.status));

	function fmtDate(d: string | Date) {
		const date = typeof d === 'string' ? new Date(d) : d;
		return date.toLocaleDateString();
	}
</script>

<a
	class="block rounded-lg border bg-white p-4 hover:bg-slate-50"
	href={`/app/projects/${project.id}`}
>
	<div class="flex items-start justify-between gap-3">
		<div>
			<div class="text-xs text-slate-500">From Idea: {project.idea?.title ?? '—'}</div>
			<div class="mt-1 text-base font-bold text-slate-900">{project.name}</div>
		</div>
		<span class={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${pill.badgeClass} ${pill.textClass}`}>
			{pill.label}
		</span>
	</div>

	<div class="mt-3 text-xs text-slate-500">Updated: {fmtDate(project.updatedAt)}</div>
</a>

