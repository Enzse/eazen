import { prisma } from '$lib/server/prisma';

export async function load() {
	const projects = await prisma.project.findMany({
		orderBy: { updatedAt: 'desc' },
		select: {
			id: true,
			name: true,
			status: true,
			updatedAt: true,
			idea: { select: { id: true, title: true } },
			tasks: { select: { status: true } }
		}
	});

	return { projects };
}
