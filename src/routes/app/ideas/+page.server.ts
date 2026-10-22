import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { runCreateIdeaAction } from '$lib/server/createIdeaAction';

const STAGE_OPTIONS = ['captured', 'selected', 'archived'] as const;
type Stage = (typeof STAGE_OPTIONS)[number];

function getStage(input: string | null): Stage | null {
	if (!input) return null;
	const s = input.trim();
	return STAGE_OPTIONS.includes(s as Stage) ? (s as Stage) : null;
}

export async function load({ url }) {
	const category = url.searchParams.get('category')?.trim() || null;
	const stage = getStage(url.searchParams.get('stage'));
	const sort = url.searchParams.get('sort')?.trim() || 'priority';

	const validSort = sort === 'priority' || sort === 'newest';

	if (!validSort) throw error(400, 'Invalid sort value.');

	const where =
		category && stage
			? { category, stage }
			: category
				? { category }
				: stage
					? { stage }
					: {};

	const ideas = await prisma.idea.findMany({
		where,
		orderBy: sort === 'priority' ? [{ priority_score: 'desc' }, { createdAt: 'desc' }] : [{ createdAt: 'desc' }],
		select: {
			id: true,
			title: true,
			description: true,
			category: true,
			tags: true,
			stage: true,
			priority_score: true,
			createdAt: true
		}
	});

	const categories = await prisma.idea
		.findMany({
			distinct: ['category'],
			select: { category: true },
			orderBy: { category: 'asc' }
		})
		.then((rows) => rows.map((r) => r.category));

	return {
		ideas,
		categories,
		selectedCategory: category,
		selectedStage: stage,
		sort
	};
}

export const actions = {
	createIdea: runCreateIdeaAction
} satisfies import('./$types').Actions;
