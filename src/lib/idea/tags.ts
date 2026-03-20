export function normalizeTags(input: string): string {
	// MVP normalization:
	// - split on commas
	// - trim whitespace
	// - lowercase
	// - remove empty entries
	// - store as a comma-separated string with no extra spaces
	return input
		.split(',')
		.map((t) => t.trim().toLowerCase())
		.filter(Boolean)
		.join(',');
}

