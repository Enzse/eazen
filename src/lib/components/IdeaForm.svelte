<script lang="ts">
	import ScoreDisplay from '$lib/components/ScoreDisplay.svelte';
	import { computePriorityScore } from '$lib/idea/priority';

	let { initial, submitLabel } = $props<{
		initial?: Partial<{
			title: string;
			description: string;
			category: string;
			tags: string;
			stage: string;
			interest: number;
			learning_value: number;
			income_potential: number;
			effort: number;
		}>;
		submitLabel: string;
	}>();

	const stageOptions = ['captured', 'selected', 'archived'];

	let values = $state({
		title: '',
		description: '',
		category: '',
		tags: '',
		stage: 'captured',
		interest: '1',
		learning_value: '1',
		income_potential: '1',
		effort: '1'
	});

	$effect(() => {
		values.title = initial?.title ?? '';
		values.description = initial?.description ?? '';
		values.category = initial?.category ?? '';
		values.tags = initial?.tags ?? '';
		values.stage = initial?.stage ?? 'captured';
		values.interest = String(initial?.interest ?? 1);
		values.learning_value = String(initial?.learning_value ?? 1);
		values.income_potential = String(initial?.income_potential ?? 1);
		values.effort = String(initial?.effort ?? 1);
	});

	let previewPriorityScore = $derived(
		computePriorityScore({
			interest: Number.parseInt(values.interest || '0', 10),
			learning_value: Number.parseInt(values.learning_value || '0', 10),
			income_potential: Number.parseInt(values.income_potential || '0', 10),
			effort: Number.parseInt(values.effort || '0', 10)
		})
	);
</script>

<div class="w-full">
	<div class="space-y-4">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="md:col-span-2">
				<label class="block text-sm font-medium text-slate-900">
					Title
					<input
						class="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
						type="text"
						name="title"
						required
						bind:value={values.title}
					/>
				</label>
			</div>

			<div class="md:col-span-2">
				<label class="block text-sm font-medium text-slate-900">
					Description
					<textarea
						class="mt-1 w-full min-h-[120px] rounded border border-slate-200 bg-white px-3 py-2 text-sm"
						name="description"
						required
						bind:value={values.description}
					></textarea>
				</label>
			</div>

			<label class="block text-sm font-medium text-slate-900">
				Category
				<input
					class="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
					type="text"
					name="category"
					required
					bind:value={values.category}
				/>
			</label>

			<label class="block text-sm font-medium text-slate-900">
				Tags (comma-separated)
				<input
					class="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
					type="text"
					name="tags"
					placeholder="ai, business, game dev"
					bind:value={values.tags}
				/>
			</label>

			<label class="block text-sm font-medium text-slate-900">
				Stage
				<select
					class="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
					name="stage"
					required
					bind:value={values.stage}
				>
					{#each stageOptions as s}
						<option value={s}>{s}</option>
					{/each}
				</select>
			</label>

			<div class="rounded-lg border border-slate-200 bg-slate-50 p-3 md:col-span-2">
				<div class="text-sm font-semibold text-slate-900">Score inputs (1-10)</div>
				<div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
					<label class="block text-sm font-medium text-slate-900">
						Interest
						<input
							class="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
							type="number"
							min="1"
							max="10"
							name="interest"
							required
							bind:value={values.interest}
						/>
					</label>
					<label class="block text-sm font-medium text-slate-900">
						Learning value
						<input
							class="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
							type="number"
							min="1"
							max="10"
							name="learning_value"
							required
							bind:value={values.learning_value}
						/>
					</label>
					<label class="block text-sm font-medium text-slate-900">
						Income potential
						<input
							class="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
							type="number"
							min="1"
							max="10"
							name="income_potential"
							required
							bind:value={values.income_potential}
						/>
					</label>
					<label class="block text-sm font-medium text-slate-900">
						Effort (higher = less priority)
						<input
							class="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
							type="number"
							min="1"
							max="10"
							name="effort"
							required
							bind:value={values.effort}
						/>
					</label>
				</div>

				<div class="mt-4">
					<ScoreDisplay
						priority_score={previewPriorityScore}
						interest={Number.parseInt(values.interest || '0', 10)}
						learning_value={Number.parseInt(values.learning_value || '0', 10)}
						income_potential={Number.parseInt(values.income_potential || '0', 10)}
						effort={Number.parseInt(values.effort || '0', 10)}
					/>
				</div>
			</div>
		</div>
		<div class="flex justify-end">
			<button
				type="submit"
				class="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
			>
				{submitLabel}
			</button>
		</div>
	</div>
</div>

