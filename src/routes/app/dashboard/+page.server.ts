import { prisma } from '$lib/server/prisma';

export async function load() {
	const [topIdeas, activeProjects, tasks, stageGroups] = await Promise.all([
		prisma.idea.findMany({
			take: 3,
			where: { stage: { not: 'archived' } },
			orderBy: [{ priority_score: 'desc' }, { createdAt: 'desc' }],
			select: {
				id: true,
				title: true,
				description: true,
				category: true,
				tags: true,
				stage: true,
				priority_score: true,
				interest: true,
				learning_value: true,
				income_potential: true,
				effort: true,
				createdAt: true
			}
		}),
		prisma.project.findMany({
			where: { status: { in: ['planned', 'active'] } },
			take: 6,
			orderBy: { updatedAt: 'desc' },
			include: { idea: { select: { id: true, title: true } }, tasks: { select: { status: true } } }
		}),
		prisma.task.findMany({ select: { status: true } }),
		prisma.idea.groupBy({ by: ['stage'], _count: { _all: true } })
	]);

	const counts = { todo: 0, doing: 0, done: 0 };
	for (const t of tasks) {
		if (t.status === 'todo') counts.todo += 1;
		else if (t.status === 'doing') counts.doing += 1;
		else if (t.status === 'done') counts.done += 1;
	}

	const stages = { captured: 0, selected: 0, archived: 0 } as Record<string, number>;
	for (const g of stageGroups) stages[g.stage] = g._count._all;

	return { topIdeas, activeProjects, counts, stages };
}
