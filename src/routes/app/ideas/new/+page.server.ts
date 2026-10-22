import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/** Legacy URL: send users to the ideas list with the create modal. */
export const load: PageServerLoad = () => {
	throw redirect(303, '/app/ideas?new=1');
};
