import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';

export async function load() {
	const topIdeas = await prisma.idea.findMany({
		take: 3,
		orderBy: [{ priority_score: 'desc' }, { createdAt: 'desc' }],
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

	// Phase 2: projects may be empty; this query keeps the dashboard future-ready.
	const activeProjects = await prisma.project.findMany({
		where: { status: { in: ['planned', 'active'] } },
		take: 5,
		orderBy: { updatedAt: 'desc' },
		include: { idea: true }
	});

	const taskCounts = await prisma.task.findMany({
		select: { status: true }
	});

	const counts = { todo: 0, doing: 0, done: 0 };
	for (const t of taskCounts) {
		if (t.status === 'todo') counts.todo += 1;
		else if (t.status === 'doing') counts.doing += 1;
		else if (t.status === 'done') counts.done += 1;
	}

	return { topIdeas, activeProjects, counts };
}

