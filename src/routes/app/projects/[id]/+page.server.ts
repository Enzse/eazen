import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

const TASK_STATUS = new Set(['todo', 'doing', 'done']);
const PROJECT_STATUS = new Set(['planned', 'active', 'paused', 'completed']);

function parseInt(input: FormDataEntryValue | string | null | undefined) {
	if (typeof input !== 'string') return null;
	const n = Number.parseInt(input, 10);
	return Number.isNaN(n) ? null : n;
}

export async function load({ params }) {
	const projectId = Number.parseInt(params.id, 10);
	if (Number.isNaN(projectId)) throw error(400, 'Invalid project id.');

	const project = await prisma.project.findUnique({
		where: { id: projectId },
		include: {
			idea: true,
			tasks: { orderBy: { createdAt: 'asc' } }
		}
	});

	if (!project) throw error(404, 'Project not found.');

	return { project };
}

export const actions = {
	updateProject: async ({ request, params }) => {
		const projectId = Number.parseInt(params.id, 10);
		if (Number.isNaN(projectId)) throw error(400, 'Invalid project id.');

		const data = await request.formData();
		const nameRaw = data.get('name');
		const statusRaw = data.get('status');
		const name = typeof nameRaw === 'string' ? nameRaw.trim() : '';
		const status = typeof statusRaw === 'string' ? statusRaw : '';

		if (!name) return fail(400, { projectError: 'Project name is required.' });
		if (!PROJECT_STATUS.has(status)) return fail(400, { projectError: 'Invalid project status.' });

		const existing = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } });
		if (!existing) throw error(404, 'Project not found.');

		await prisma.project.update({ where: { id: projectId }, data: { name, status } });

		return redirect(303, `/app/projects/${projectId}`);
	},

	deleteProject: async ({ params }) => {
		const projectId = Number.parseInt(params.id, 10);
		if (Number.isNaN(projectId)) throw error(400, 'Invalid project id.');

		// Tasks first, then the project. The idea stays and can be converted again.
		await prisma.$transaction([
			prisma.task.deleteMany({ where: { projectId } }),
			prisma.project.deleteMany({ where: { id: projectId } })
		]);

		return redirect(303, '/app/projects');
	},

	createTask: async ({ request, params }) => {
		const projectId = Number.parseInt(params.id, 10);
		if (Number.isNaN(projectId)) throw error(400, 'Invalid project id.');

		const data = await request.formData();
		const title = data.get('title');
		const description = data.get('description');

		if (typeof title !== 'string' || !title.trim()) {
			return fail(400, { error: 'Task title is required.' });
		}

		const normalizedDescription =
			typeof description === 'string' && description.trim() ? description.trim() : null;

		await prisma.task.create({
			data: {
				projectId,
				title: title.trim(),
				description: normalizedDescription,
				status: 'todo',
				completedAt: null
			}
		});

		return redirect(303, `/app/projects/${projectId}`);
	},

	updateTask: async ({ request, params }) => {
		const projectId = Number.parseInt(params.id, 10);
		if (Number.isNaN(projectId)) throw error(400, 'Invalid project id.');

		const data = await request.formData();
		const taskId = parseInt(data.get('taskId'));
		const statusRaw = data.get('status');
		const status = typeof statusRaw === 'string' ? statusRaw : null;
		const titleRaw = data.get('title');
		const descriptionRaw = data.get('description');

		const title = typeof titleRaw === 'string' ? titleRaw.trim() : null;
		const normalizedDescription =
			typeof descriptionRaw === 'string' && descriptionRaw.trim() ? descriptionRaw.trim() : null;

		if (taskId === null) return fail(400, { error: 'Invalid task id.' });
		if (!status) return fail(400, { error: 'Invalid task status.' });
		if (!title) return fail(400, { error: 'Task title is required.' });
		if (!TASK_STATUS.has(status)) return fail(400, { error: 'Invalid task status.' });

		// Ensure the task belongs to this project.
		const existing = await prisma.task.findFirst({
			where: { id: taskId, projectId },
			select: { id: true }
		});
		if (!existing) return fail(404, { error: 'Task not found.' });

		await prisma.task.update({
			where: { id: taskId },
			data: {
				title,
				description: normalizedDescription,
				status,
				completedAt: status === 'done' ? new Date() : null
			}
		});

		return redirect(303, `/app/projects/${projectId}`);
	},

	deleteTask: async ({ request, params }) => {
		const projectId = Number.parseInt(params.id, 10);
		if (Number.isNaN(projectId)) throw error(400, 'Invalid project id.');

		const data = await request.formData();
		const taskId = parseInt(data.get('taskId'));
		if (taskId === null) return fail(400, { error: 'Invalid task id.' });

		const result = await prisma.task.deleteMany({
			where: { id: taskId, projectId }
		});

		if (result.count === 0) return fail(404, { error: 'Task not found.' });

		return redirect(303, `/app/projects/${projectId}`);
	}
} satisfies import('./$types').Actions;

