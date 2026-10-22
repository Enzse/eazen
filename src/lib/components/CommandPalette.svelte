<script lang="ts">
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';
	import Icon, { type IconName } from '$lib/components/Icon.svelte';
	import { getPriorityBadge } from '$lib/idea/priority';
	import { projectStatus } from '$lib/ui/status';

	type Item = {
		id: string;
		group: 'Actions' | 'Ideas' | 'Projects';
		label: string;
		href: string;
		icon: IconName;
		meta?: string;
		metaClass?: string;
	};

	let {
		ideas,
		projects
	}: {
		ideas: Array<{ id: number; title: string; priority_score: number }>;
		projects: Array<{ id: number; name: string; status: string }>;
	} = $props();

	let dialogEl = $state<HTMLDialogElement>();
	let inputEl = $state<HTMLInputElement>();
	let query = $state('');
	let active = $state(0);

	const actions: Item[] = [
		{ id: 'a-new', group: 'Actions', label: 'New idea', href: '/app/ideas?new=1', icon: 'plus' },
		{ id: 'a-dash', group: 'Actions', label: 'Go to dashboard', href: '/app/dashboard', icon: 'home' },
		{ id: 'a-ideas', group: 'Actions', label: 'Go to ideas', href: '/app/ideas', icon: 'spark' },
		{ id: 'a-proj', group: 'Actions', label: 'Go to projects', href: '/app/projects', icon: 'stack' },
		{ id: 'a-settings', group: 'Actions', label: 'Settings and theme', href: '/app/settings', icon: 'sliders' }
	];

	const all = $derived<Item[]>([
		...actions,
		...ideas.map((i) => {
			const b = getPriorityBadge(i.priority_score);
			return {
				id: `i-${i.id}`,
				group: 'Ideas' as const,
				label: i.title,
				href: `/app/ideas/${i.id}`,
				icon: 'spark' as const,
				meta: String(i.priority_score),
				metaClass: b.textClass
			};
		}),
		...projects.map((p) => {
			const s = projectStatus(p.status);
			return {
				id: `p-${p.id}`,
				group: 'Projects' as const,
				label: p.name,
				href: `/app/projects/${p.id}`,
				icon: 'stack' as const,
				meta: s.label,
				metaClass: s.class.split(' ')[0]
			};
		})
	]);

	const results = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const list = q ? all.filter((it) => it.label.toLowerCase().includes(q)) : all;
		return list.slice(0, 40);
	});

	const groups = $derived(
		(['Actions', 'Ideas', 'Projects'] as const)
			.map((g) => ({ name: g, items: results.filter((r) => r.group === g) }))
			.filter((g) => g.items.length > 0)
	);

	$effect(() => {
		// Reset highlight whenever the query changes.
		void query;
		active = 0;
	});

	export async function open() {
		query = '';
		active = 0;
		dialogEl?.showModal();
		await tick();
		inputEl?.focus();
	}

	function close() {
		dialogEl?.close();
	}

	function choose(item: Item | undefined) {
		if (!item) return;
		close();
		goto(item.href);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			active = Math.min(results.length - 1, active + 1);
			scrollActive();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			active = Math.max(0, active - 1);
			scrollActive();
		} else if (e.key === 'Enter') {
			e.preventDefault();
			choose(results[active]);
		}
	}

	async function scrollActive() {
		await tick();
		dialogEl?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
	}

	function onWindowKey(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			if (dialogEl?.open) close();
			else open();
		}
	}
</script>

<svelte:window onkeydown={onWindowKey} />

<dialog
	bind:this={dialogEl}
	class="palette m-auto mt-[12vh] w-[min(100vw-2rem,36rem)] max-w-none overflow-hidden rounded-2xl border border-veil/10 bg-ink-900/95 p-0 text-ink-100 shadow-[0_40px_80px_-20px_rgb(var(--shade)/calc(0.8*var(--shade-k))),0_0_0_1px_rgb(var(--veil)/0.04)] backdrop-blur-xl"
	aria-label="Command bar"
	onclick={(e) => {
		if (e.target === dialogEl) close();
	}}
>
	<div class="flex items-center gap-3 border-b border-veil/7 px-4">
		<Icon name="search" class="text-ink-500" />
		<input
			bind:this={inputEl}
			bind:value={query}
			onkeydown={onKey}
			class="h-14 w-full border-0 bg-transparent p-0 text-[15px] text-ink-100 placeholder:text-ink-500 focus:ring-0 focus:outline-none"
			placeholder="Search ideas and projects, or jump somewhere…"
			aria-label="Search"
			autocomplete="off"
			spellcheck="false"
		/>
		<kbd class="num rounded-md border border-veil/10 px-1.5 py-0.5 text-[10px] text-ink-500">Esc</kbd>
	</div>

	<div class="max-h-[min(60vh,26rem)] overflow-y-auto p-2" role="listbox" aria-label="Results">
		{#if results.length === 0}
			<p class="px-3 py-8 text-center text-sm text-ink-500">Nothing matches “{query.trim()}”.</p>
		{/if}
		{#each groups as g (g.name)}
			<div class="px-3 pt-3 pb-1.5 eyebrow">{g.name}</div>
			{#each g.items as item (item.id)}
				{@const idx = results.indexOf(item)}
				<button
					type="button"
					role="option"
					aria-selected={idx === active}
					data-active={idx === active}
					class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors {idx ===
					active
						? 'bg-ember-500/12 text-ink-100'
						: 'text-ink-300 hover:bg-veil/4'}"
					onmouseenter={() => (active = idx)}
					onclick={() => choose(item)}
				>
					<Icon name={item.icon} size={16} class={idx === active ? 'text-ember-400' : 'text-ink-500'} />
					<span class="min-w-0 flex-1 truncate">{item.label}</span>
					{#if item.meta}
						<span class="num text-xs {item.metaClass}">{item.meta}</span>
					{/if}
					{#if idx === active}
						<Icon name="arrowRight" size={14} class="text-ember-400" />
					{/if}
				</button>
			{/each}
		{/each}
	</div>

	<div class="flex items-center gap-4 border-t border-veil/7 px-4 py-2.5 text-[11px] text-ink-500">
		<span><kbd class="num">↑↓</kbd> move</span>
		<span><kbd class="num">↵</kbd> open</span>
		<span class="ml-auto"><kbd class="num">Ctrl K</kbd> toggle</span>
	</div>
</dialog>

<style>
	.palette[open] {
		animation: dialog-in 220ms var(--ease-out-soft);
	}
	.palette::backdrop {
		background: var(--backdrop);
		backdrop-filter: blur(4px);
	}
</style>
