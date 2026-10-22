import { fail } from '@sveltejs/kit';
import { isThemeId, THEME_COOKIE } from '$lib/themes';

export function load({ locals }) {
	return { theme: locals.theme };
}

export const actions = {
	setTheme: async ({ request, cookies }) => {
		const data = await request.formData();
		const theme = data.get('theme');
		if (!isThemeId(theme)) return fail(400, { error: 'Unknown theme.' });

		cookies.set(THEME_COOKIE, theme, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
			sameSite: 'lax',
			httpOnly: false
		});

		return { theme };
	}
} satisfies import('./$types').Actions;
