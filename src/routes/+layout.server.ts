import { prisma } from '$lib/server/prisma';

/** Lightweight index for the Ctrl+K command bar. */
export async function load({ locals }) {
	const [ideas, projects] = await Promise.all([
		prisma.idea.findMany({
			select: { id: true, title: true, priority_score: true, stage: true },
			orderBy: [{ priority_score: 'desc' }, { createdAt: 'desc' }]
		}),
		prisma.project.findMany({
			select: { id: true, name: true, status: true },
			orderBy: { updatedAt: 'desc' }
		})
	]);

	return { nav: { ideas, projects }, theme: locals.theme };
}
