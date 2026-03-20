import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { computePriorityScore } from '$lib/idea/priority';
import { normalizeTags } from '$lib/idea/tags';

const STAGE_OPTIONS = new Set(['captured', 'selected', 'archived']);

function parseIntInRange(input: FormDataEntryValue | null, name: string, min: number, max: number) {
	if (input === null || typeof input !== 'string') return null;
	const n = Number.parseInt(input, 10);
	if (Number.isNaN(n) || n < min || n > max) return null;
	return n;
}

export const actions = {
	createIdea: async ({ request }) => {
		const data = await request.formData();

		const title = data.get('title');
		const description = data.get('description');
		const category = data.get('category');
		const tags = data.get('tags');
		const stage = data.get('stage');
		const stageValue = typeof stage === 'string' ? stage.trim() : 'captured';

		const interest = parseIntInRange(data.get('interest'), 'interest', 1, 10);
		const learning_value = parseIntInRange(data.get('learning_value'), 'learning_value', 1, 10);
		const income_potential = parseIntInRange(data.get('income_potential'), 'income_potential', 1, 10);
		const effort = parseIntInRange(data.get('effort'), 'effort', 1, 10);

		const initial = {
			title: typeof title === 'string' ? title : '',
			description: typeof description === 'string' ? description : '',
			category: typeof category === 'string' ? category : '',
			tags: typeof tags === 'string' ? tags : '',
			stage: stageValue,
			interest: interest ?? 1,
			learning_value: learning_value ?? 1,
			income_potential: income_potential ?? 1,
			effort: effort ?? 1
		};

		if (typeof title !== 'string' || !title.trim()) {
			return fail(400, { error: 'Title is required.', initial });
		}
		if (typeof description !== 'string' || !description.trim()) {
			return fail(400, { error: 'Description is required.', initial });
		}
		if (typeof category !== 'string' || !category.trim()) {
			return fail(400, { error: 'Category is required.', initial });
		}
		if (typeof tags !== 'string') {
			return fail(400, { error: 'Tags must be a string.', initial });
		}
		if (typeof stage !== 'string' || !STAGE_OPTIONS.has(stageValue)) {
			return fail(400, {
				error: 'Stage must be one of captured, selected, archived.',
				initial
			});
		}
		if (interest === null || learning_value === null || income_potential === null || effort === null) {
			return fail(400, { error: 'Score inputs must be integers between 1 and 10.', initial });
		}

		const normalizedTags = normalizeTags(tags);

		const priority_score = computePriorityScore({ interest, learning_value, income_potential, effort });

		const idea = await prisma.idea.create({
			data: {
				title: title.trim(),
				description: description.trim(),
				category: category.trim(),
				tags: normalizedTags,
				stage: stageValue,
				interest,
				learning_value,
				income_potential,
				effort,
				priority_score
			}
		});

		return redirect(303, `/app/ideas/${idea.id}`);
	}
} satisfies import('./$types').Actions;

