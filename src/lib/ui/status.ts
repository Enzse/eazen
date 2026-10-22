import type { IconName } from '$lib/components/Icon.svelte';

type StatusStyle = { label: string; class: string; dot: string; icon: IconName };

export const PROJECT_STATUS: Record<string, StatusStyle> = {
	planned: { label: 'Planned', class: 'text-ink-300 bg-veil/4 border-veil/10', dot: 'bg-ink-400', icon: 'flag' },
	active: {
		label: 'Active',
		class: 'text-ember-300 bg-ember-500/12 border-ember-500/30',
		dot: 'bg-ember-400 shadow-[0_0_10px_rgb(var(--accent-hi)/0.9)]',
		icon: 'bolt'
	},
	paused: { label: 'Paused', class: 'text-sand-300 bg-sand-300/8 border-sand-300/25', dot: 'bg-sand-300', icon: 'pause' },
	completed: {
		label: 'Completed',
		class: 'text-sage-400 bg-sage-400/10 border-sage-400/25',
		dot: 'bg-sage-400',
		icon: 'check'
	}
};

export const TASK_STATUS: Record<string, StatusStyle> = {
	todo: { label: 'To do', class: 'text-ink-300 bg-veil/4 border-veil/10', dot: 'bg-ink-500', icon: 'circle' },
	doing: {
		label: 'Doing',
		class: 'text-ember-300 bg-ember-500/12 border-ember-500/30',
		dot: 'bg-ember-400',
		icon: 'half'
	},
	done: { label: 'Done', class: 'text-sage-400 bg-sage-400/10 border-sage-400/25', dot: 'bg-sage-400', icon: 'check' }
};

export const STAGE_LABEL: Record<string, string> = {
	captured: 'Captured',
	selected: 'Selected',
	archived: 'Archived'
};

export function projectStatus(s: string) {
	return PROJECT_STATUS[s] ?? PROJECT_STATUS.planned;
}

export function taskStatus(s: string) {
	return TASK_STATUS[s] ?? TASK_STATUS.todo;
}
