import type { ThemeId } from '$lib/themes';

/**
 * A theme picked on the client during this visit (null until the user switches).
 * Only the browser writes this; the server always reads the cookie instead.
 */
export const themeState = $state<{ picked: ThemeId | null }>({ picked: null });
