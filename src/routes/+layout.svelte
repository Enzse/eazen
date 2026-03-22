<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	/** Narrow strip (icons + tooltips) vs full labels */
	let collapsed = $state(false);
	/** Mobile drawer open */
	let mobileOpen = $state(false);

	const pathname = $derived(page.url.pathname);

	onMount(() => {
		const v = localStorage.getItem('ideaos-sidebar-collapsed');
		if (v === '1') collapsed = true;
	});

	$effect(() => {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem('ideaos-sidebar-collapsed', collapsed ? '1' : '0');
	});

	function closeMobile() {
		mobileOpen = false;
	}

	function navActive(href: '/app/dashboard' | '/app/ideas' | '/app/projects') {
		if (href === '/app/dashboard') {
			return pathname === '/app/dashboard' || pathname === '/';
		}
		if (href === '/app/ideas') {
			return pathname.startsWith('/app/ideas');
		}
		return pathname.startsWith('/app/projects');
	}

	function navClass(href: '/app/dashboard' | '/app/ideas' | '/app/projects') {
		const active = navActive(href);
		return [
			'flex items-center rounded-lg py-2.5 text-sm font-semibold transition-colors',
			collapsed ? 'justify-center px-2' : 'gap-3 px-3',
			active
				? 'bg-slate-900 text-white'
				: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
		].join(' ');
	}

	const newIdeaActive = $derived(pathname.startsWith('/app/ideas/new'));
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen bg-slate-50">
	<!-- Mobile backdrop -->
	{#if mobileOpen}
		<button
			type="button"
			class="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
			aria-label="Close menu"
			onclick={closeMobile}
		></button>
	{/if}

	<!-- Sidebar -->
	<aside
		class={[
			'fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-slate-200 bg-white shadow-sm transition-[width,transform] duration-200 ease-out md:relative md:z-0 md:translate-x-0 md:shadow-none',
			collapsed ? 'w-[4.25rem]' : 'w-56',
			mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
		].join(' ')}
		aria-label="Main navigation"
	>
		<div class="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-3">
			{#if !collapsed}
				<a href="/app/dashboard" class="truncate text-base font-bold text-slate-900" onclick={closeMobile}>
					Ideate
				</a>
			{/if}
			<button
				type="button"
				class="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 md:flex"
				title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				aria-expanded={!collapsed}
				onclick={() => (collapsed = !collapsed)}
			>
				<span class="sr-only">{collapsed ? 'Expand' : 'Collapse'} sidebar</span>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					{#if collapsed}
						<path d="M9 18l6-6-6-6" />
					{:else}
						<path d="M15 18l-6-6 6-6" />
					{/if}
				</svg>
			</button>
		</div>

		<nav class="flex flex-1 flex-col gap-1 p-2">
			<a
				href="/app/dashboard"
				class={navClass('/app/dashboard')}
				title={collapsed ? 'Dashboard' : undefined}
				onclick={closeMobile}
			>
				<svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
					<path d="M9 22V12h6v10" />
				</svg>
				{#if !collapsed}<span>Dashboard</span>{/if}
			</a>
			<a
				href="/app/ideas"
				class={navClass('/app/ideas')}
				title={collapsed ? 'Ideas' : undefined}
				onclick={closeMobile}
			>
				<svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
					<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
				</svg>
				{#if !collapsed}<span>Ideas</span>{/if}
			</a>
			<a
				href="/app/projects"
				class={navClass('/app/projects')}
				title={collapsed ? 'Projects' : undefined}
				onclick={closeMobile}
			>
				<svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
				</svg>
				{#if !collapsed}<span>Projects</span>{/if}
			</a>
		</nav>

		<div class="border-t border-slate-200 p-2">
			<a
				href="/app/ideas/new"
				class={[
					'flex items-center rounded-lg py-2.5 text-sm font-semibold',
					collapsed ? 'justify-center px-2' : 'justify-center gap-2 px-3',
					newIdeaActive ? 'bg-slate-800 text-white ring-1 ring-white/20' : 'bg-slate-900 text-white hover:bg-slate-800'
				].join(' ')}
				title={collapsed ? 'New idea' : undefined}
				onclick={closeMobile}
			>
				<svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 5v14M5 12h14" />
				</svg>
				{#if !collapsed}<span>New idea</span>{/if}
			</a>
		</div>
	</aside>

	<!-- Main column -->
	<div class="flex min-w-0 flex-1 flex-col">
		<!-- Mobile top bar -->
		<header class="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/90 px-3 backdrop-blur md:hidden">
			<button
				type="button"
				class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
				aria-label="Open menu"
				aria-expanded={mobileOpen}
				onclick={() => (mobileOpen = true)}
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
			<a href="/app/dashboard" class="text-base font-bold text-slate-900">IdeaOS</a>
		</header>

		{#if children}
			<main class="w-full min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
				{@render children()}
			</main>
		{/if}
	</div>
</div>
