export type PriorityTier = 'high' | 'medium' | 'low';

export type PriorityBreakdownInput = {
	interest: number;
	learning_value: number;
	income_potential: number;
	effort: number;
};

export const SCORE_MIN = -7;
export const SCORE_MAX = 29;

export function computePriorityScore(input: PriorityBreakdownInput): number {
	return input.interest + input.learning_value + input.income_potential - input.effort;
}

export function getPriorityTier(priority_score: number): PriorityTier {
	if (priority_score >= 18) return 'high';
	if (priority_score >= 10) return 'medium';
	return 'low';
}

/** Where a score sits between the lowest and highest possible score, 0–1. */
export function scoreHeat(priority_score: number): number {
	const t = (priority_score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN);
	return Math.min(1, Math.max(0, t));
}

/** Priority reads as heat: high glows ember, medium is warm sand, low stays neutral. */
export function getPriorityBadge(priority_score: number): {
	tier: PriorityTier;
	label: string;
	badgeClass: string;
	textClass: string;
	color: string;
} {
	const tier = getPriorityTier(priority_score);

	if (tier === 'high') {
		return {
			tier,
			label: 'High',
			badgeClass: 'bg-ember-500/12 border-ember-500/35 shadow-[0_0_18px_-4px_rgb(var(--accent)/0.55)]',
			textClass: 'text-ember-300',
			color: 'var(--color-ember-400)'
		};
	}

	if (tier === 'medium') {
		return {
			tier,
			label: 'Medium',
			badgeClass: 'bg-sand-300/8 border-sand-300/25',
			textClass: 'text-sand-300',
			color: 'var(--color-sand-300)'
		};
	}

	return {
		tier,
		label: 'Low',
		badgeClass: 'bg-veil/4 border-veil/10',
		textClass: 'text-ink-400',
		color: 'var(--color-ink-400)'
	};
}
