/**
 * Available color themes. The palettes themselves live in `src/routes/layout.css`
 * under `[data-theme='<id>']`; this list drives the settings page and the cookie check.
 */
export const THEMES = [
	{
		id: 'ember',
		name: 'Ember',
		description: 'Dark studio with a warm ember glow. Easy on the eyes at night.',
		mode: 'dark',
		/** Browser UI color (address bar on mobile). */
		chrome: '#0d0c0b',
		swatches: ['#0d0c0b', '#211e1b', '#f1ebe5', '#f47b35', '#e6c48f']
	},
	{
		id: 'minccino',
		name: 'Minccino',
		description: 'Soft gray and white with ink outlines and a blush of pink.',
		mode: 'light',
		chrome: '#e8e6e5',
		swatches: ['#e8e6e5', '#ffffff', '#1b1818', '#cc5770', '#e07d92']
	}
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export const DEFAULT_THEME: ThemeId = 'ember';
export const THEME_COOKIE = 'ccino-theme';

export function isThemeId(value: unknown): value is ThemeId {
	return typeof value === 'string' && THEMES.some((t) => t.id === value);
}

export function getTheme(id: ThemeId) {
	return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
