import type { Handle } from '@sveltejs/kit';
import { DEFAULT_THEME, getTheme, isThemeId, THEME_COOKIE } from '$lib/themes';

/** Applies the saved theme on the server so the page never flashes the wrong colors. */
export const handle: Handle = async ({ event, resolve }) => {
	const saved = event.cookies.get(THEME_COOKIE);
	const theme = isThemeId(saved) ? saved : DEFAULT_THEME;
	event.locals.theme = theme;

	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('%ccino.theme%', theme).replace('%ccino.chrome%', getTheme(theme).chrome)
	});
};
