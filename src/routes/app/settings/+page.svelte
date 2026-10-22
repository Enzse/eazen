<script lang="ts">
	import { enhance } from '$app/forms';
	import AppIcon from '$lib/components/AppIcon.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { themeState } from '$lib/theme.svelte';
	import { getTheme, THEMES, type ThemeId } from '$lib/themes';

	let { data, form } = $props();

	// Tracks the choice immediately so the UI doesn't wait on the server.
	let current = $state<ThemeId>('ember');
	$effect(() => {
		current = data.theme;
	});

	/** Repaint the whole app right away; the cookie save happens in the background. */
	function applyTheme(id: ThemeId) {
		current = id;
		themeState.picked = id;
		document.documentElement.dataset.theme = id;
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getTheme(id).chrome);
	}
</script>

<svelte:head><title>Settings · ccino</title></svelte:head>

<header>
	<p class="rise eyebrow">Preferences</p>
	<h1 class="rise mt-2 text-4xl font-bold text-ink-100" style:--i="1">Settings</h1>
	<p class="rise mt-2 text-sm text-ink-400" style:--i="2">Make ccino feel like yours.</p>
</header>

<section class="mt-12">
	<div class="rise flex items-center gap-3" style:--i="3">
		<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-ember-500/12 text-ember-400">
			<Icon name="palette" size={18} />
		</span>
		<div>
			<h2 class="text-xl font-semibold text-ink-100">Theme</h2>
			<p class="text-sm text-ink-500">Changes apply instantly and are remembered on this browser.</p>
		</div>
	</div>

	{#if form?.error}
		<div class="alert mt-5 max-w-xl" role="alert">{form.error}</div>
	{/if}

	<form
		method="POST"
		action="?/setTheme"
		class="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
		use:enhance={({ submitter }) => {
			const id = (submitter as HTMLButtonElement | null)?.value as ThemeId | undefined;
			if (id) applyTheme(id);
			return async ({ update }) => {
				await update({ reset: false, invalidateAll: false });
			};
		}}
	>
		{#each THEMES as t, i (t.id)}
			{@const on = current === t.id}
			<button
				type="submit"
				name="theme"
				value={t.id}
				aria-pressed={on}
				class="rise group panel lift block overflow-hidden p-0 text-left transition-shadow duration-300 {on
					? 'ring-2 ring-ember-500 shadow-[0_0_40px_-12px_rgb(var(--accent)/0.7)]'
					: ''}"
				style:--i={4 + i}
			>
				<!-- Live preview: the same components, rendered in this theme's palette. -->
				<div data-theme={t.id} class="theme-preview relative h-52 overflow-hidden border-b border-veil/8 p-4">
					<div class="pointer-events-none absolute -top-10 -left-6 h-40 w-40 rounded-full bg-ember-500/25 blur-3xl"></div>
					<div class="relative flex h-full gap-3">
						<div class="flex w-9 flex-col items-center gap-2 rounded-xl border border-veil/6 bg-ink-950/60 py-2.5">
							<AppIcon size={22} />
							<span class="mt-1 h-1.5 w-4 rounded-full bg-ember-400"></span>
							<span class="h-1.5 w-4 rounded-full bg-veil/12"></span>
							<span class="h-1.5 w-4 rounded-full bg-veil/12"></span>
						</div>
						<div class="flex min-w-0 flex-1 flex-col gap-2.5">
							<div class="font-display text-lg leading-none font-bold text-ink-100">Good evening.</div>
							<div class="panel flex items-start justify-between gap-2 rounded-xl! p-3">
								<div class="min-w-0">
									<div class="text-[10px] text-ink-500">side project · Selected</div>
									<div class="mt-1 truncate font-display text-sm font-semibold text-ink-100">Pocket recipe scaler</div>
									<div class="mt-2 flex gap-1">
										<span class="chip h-4! px-1.5! text-[9px]!">#web</span>
										<span class="chip h-4! px-1.5! text-[9px]!">#cooking</span>
									</div>
								</div>
								<span
									class="num flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ember-500 text-xs font-semibold text-ember-300 shadow-[0_0_10px_-2px_rgb(var(--accent)/0.6)]"
									>22</span
								>
							</div>
							<div class="mt-auto flex items-center gap-2">
								<span class="btn btn-primary btn-sm pointer-events-none h-7! px-2.5! text-[11px]!">Capture</span>
								<span class="btn btn-ghost btn-sm pointer-events-none h-7! px-2.5! text-[11px]!">Ideas</span>
								<span class="ml-auto h-1.5 w-14 overflow-hidden rounded-full bg-veil/8">
									<span class="block h-full w-3/5 rounded-full bg-linear-to-r from-ember-600 to-ember-400"></span>
								</span>
							</div>
						</div>
					</div>
				</div>

				<div class="flex items-start justify-between gap-4 p-5">
					<div>
						<div class="flex items-center gap-2">
							<span class="font-display text-lg font-semibold text-ink-100">{t.name}</span>
							<span class="chip h-5! text-[10px]!">{t.mode === 'dark' ? 'Dark' : 'Light'}</span>
						</div>
						<p class="mt-1 text-sm text-ink-400">{t.description}</p>
						<div class="mt-3 flex gap-1.5" aria-hidden="true">
							{#each t.swatches as c (c)}
								<span class="h-4 w-4 rounded-full border border-veil/15" style:background={c}></span>
							{/each}
						</div>
					</div>
					<span
						class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 {on
							? 'border-ember-500 bg-ember-500 text-on-accent'
							: 'border-veil/15 text-transparent group-hover:border-ember-400/60'}"
					>
						<Icon name="check" size={13} stroke={2.75} />
					</span>
				</div>
				<span class="sr-only">{on ? 'Current theme' : `Use ${t.name} theme`}</span>
			</button>
		{/each}
	</form>
</section>

<style>
	/* The preview box paints its own theme's canvas, independent of the page theme. */
	.theme-preview {
		color: var(--color-ink-100);
		background:
			radial-gradient(14rem 10rem at 10% 0%, var(--canvas-glow-1), transparent 70%),
			radial-gradient(14rem 10rem at 100% 0%, var(--canvas-glow-2), transparent 70%),
			var(--canvas);
	}
</style>
