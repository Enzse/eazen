<script lang="ts">
	import { page } from '$app/state';
	import './layout.css';
	import faviconEmber from '$lib/assets/favicon-ember.svg';
	import faviconMinccino from '$lib/assets/favicon-minccino.svg';
	import AppIcon from '$lib/components/AppIcon.svelte';
	import Icon, { type IconName } from '$lib/components/Icon.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import Wordmark from '$lib/components/Wordmark.svelte';
	import { themeState } from '$lib/theme.svelte';

	let { children, data } = $props();

	// The saved theme from the server, unless the user just switched in settings.
	const activeTheme = $derived(themeState.picked ?? data.theme);
	const favicon = $derived(activeTheme === 'minccino' ? faviconMinccino : faviconEmber);

	let palette = $state<{ open: () => void }>();

	const pathname = $derived(page.url.pathname);

	const NAV: Array<{ href: string; label: string; icon: IconName }> = [
		{ href: '/app/dashboard', label: 'Dashboard', icon: 'home' },
		{ href: '/app/ideas', label: 'Ideas', icon: 'spark' },
		{ href: '/app/projects', label: 'Projects', icon: 'stack' }
	];

	function isActive(href: string) {
		return pathname === href || pathname.startsWith(href + '/');
	}

	const settingsOn = $derived(isActive('/app/settings'));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>ccino</title>
</svelte:head>

<a
	href="#main"
	class="sr-only z-70 rounded-lg bg-ember-500 px-3 py-2 text-sm font-semibold text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
>
	Skip to content
</a>

<div class="flex min-h-dvh">
	<!-- Desktop rail -->
	<aside
		class="fixed inset-y-0 left-0 z-40 hidden w-[4.75rem] flex-col items-center border-r border-veil/6 bg-ink-950/60 py-5 backdrop-blur-xl md:flex"
		aria-label="Main navigation"
	>
		<a href="/app/dashboard" class="group relative mb-8" aria-label="ccino home">
			<span
				class="absolute -inset-2 rounded-2xl bg-ember-500/30 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100"
			></span>
			<AppIcon size={40} class="relative transition-transform duration-300 group-hover:-rotate-6" />
		</a>

		<nav class="flex flex-1 flex-col items-center gap-2">
			{#each NAV as item (item.href)}
				{@const on = isActive(item.href)}
				<a
					href={item.href}
					class="group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 {on
						? 'bg-veil/7 text-ember-300'
						: 'text-ink-500 hover:bg-veil/4 hover:text-ink-100'}"
					aria-current={on ? 'page' : undefined}
					aria-label={item.label}
				>
					{#if on}
						<span
							class="absolute top-1/2 -left-[1.05rem] h-5 w-1 -translate-y-1/2 rounded-r-full bg-ember-400 shadow-[0_0_12px_rgb(var(--accent-hi)/0.9)]"
						></span>
					{/if}
					<Icon name={item.icon} size={20} />
					<span
						class="pointer-events-none absolute left-full ml-3 -translate-x-1 rounded-lg border border-veil/8 bg-ink-850 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-ink-100 opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
					>
						{item.label}
					</span>
				</a>
			{/each}
		</nav>

		<div class="flex flex-col items-center gap-2">
			<a
				href="/app/settings"
				class="group relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors {settingsOn
					? 'bg-veil/7 text-ember-300'
					: 'text-ink-500 hover:bg-veil/4 hover:text-ink-100'}"
				aria-current={settingsOn ? 'page' : undefined}
				aria-label="Settings"
			>
				<Icon name="sliders" size={20} />
				<span
					class="pointer-events-none absolute left-full ml-3 -translate-x-1 rounded-lg border border-veil/8 bg-ink-850 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-ink-100 opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
				>
					Settings
				</span>
			</a>
			<button
				type="button"
				class="group relative flex h-11 w-11 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-veil/4 hover:text-ink-100"
				aria-label="Open command bar (Ctrl K)"
				onclick={() => palette?.open()}
			>
				<Icon name="search" size={20} />
				<span
					class="pointer-events-none absolute left-full ml-3 -translate-x-1 rounded-lg border border-veil/8 bg-ink-850 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-ink-100 opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
				>
					Search <span class="num ml-1 text-ink-500">Ctrl K</span>
				</span>
			</button>
			<a
				href="/app/ideas?new=1"
				class="group relative flex h-11 w-11 items-center justify-center rounded-xl bg-ember-500 text-on-accent shadow-[0_8px_24px_-8px_rgb(var(--accent)/0.8),inset_0_1px_0_rgb(255_255_255/0.3)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
				aria-label="New idea"
			>
				<Icon name="plus" size={20} stroke={2.25} />
				<span
					class="pointer-events-none absolute left-full ml-3 -translate-x-1 rounded-lg border border-veil/8 bg-ink-850 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-ink-100 opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
				>
					New idea
				</span>
			</a>
		</div>
	</aside>

	<div class="flex min-w-0 flex-1 flex-col md:pl-[4.75rem]">
		<!-- Mobile top bar -->
		<header
			class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-veil/6 bg-ink-950/75 px-4 backdrop-blur-xl md:hidden"
		>
			<a href="/app/dashboard" class="flex items-center gap-2.5" aria-label="ccino home">
				<AppIcon size={32} />
				<Wordmark class="text-[1.45rem]" />
			</a>
			<div class="flex items-center gap-2">
				<button type="button" class="btn btn-ghost btn-sm" onclick={() => palette?.open()} aria-label="Search">
					<Icon name="search" size={16} />
				</button>
				<a href="/app/settings" class="btn btn-ghost btn-sm" aria-label="Settings">
					<Icon name="sliders" size={16} />
				</a>
			</div>
		</header>

		<main id="main" class="isolate mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 sm:px-6 md:pt-10 md:pb-16 lg:px-10">
			{#key pathname}
				{@render children()}
			{/key}
		</main>
	</div>

	<!-- Mobile tab bar -->
	<nav
		class="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-veil/8 bg-ink-900/85 px-2 py-1.5 shadow-[0_20px_40px_-12px_rgb(var(--shade)/calc(0.8*var(--shade-k)))] backdrop-blur-xl md:hidden"
		aria-label="Main navigation"
	>
		{#each NAV as item (item.href)}
			{@const on = isActive(item.href)}
			<a
				href={item.href}
				class="flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-[11px] font-medium transition-colors {on
					? 'text-ember-300'
					: 'text-ink-500'}"
				aria-current={on ? 'page' : undefined}
			>
				<Icon name={item.icon} size={20} />
				{item.label}
			</a>
		{/each}
		<a
			href="/app/ideas?new=1"
			class="flex h-11 w-11 items-center justify-center rounded-xl bg-ember-500 text-on-accent shadow-[0_8px_20px_-6px_rgb(var(--accent)/0.8)]"
			aria-label="New idea"
		>
			<Icon name="plus" size={20} stroke={2.25} />
		</a>
	</nav>
</div>

<CommandPalette bind:this={palette} ideas={data.nav.ideas} projects={data.nav.projects} />
