export type PriorityTier = 'high' | 'medium' | 'low';

export type PriorityBreakdownInput = {
	interest: number;
	learning_value: number;
	income_potential: number;
	effort: number;
};

export function computePriorityScore(input: PriorityBreakdownInput): number {
	return input.interest + input.learning_value + input.income_potential - input.effort;
}

export function getPriorityTier(priority_score: number): PriorityTier {
	if (priority_score >= 18) return 'high';
	if (priority_score >= 10) return 'medium';
	return 'low';
}

export function getPriorityBadge(priority_score: number): {
	tier: PriorityTier;
	label: string;
	badgeClass: string;
	textClass: string;
} {
	const tier = getPriorityTier(priority_score);

	if (tier === 'high') {
		return { tier, label: 'High', badgeClass: 'bg-red-50 border-red-200', textClass: 'text-red-700' };
	}

	if (tier === 'medium') {
		return { tier, label: 'Medium', badgeClass: 'bg-yellow-50 border-yellow-200', textClass: 'text-yellow-700' };
	}

	return { tier, label: 'Low', badgeClass: 'bg-green-50 border-green-200', textClass: 'text-green-700' };
}

