<script lang="ts">
	import { page } from '$app/state';
	import Icon from '$lib/components/Icon.svelte';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head><title>{notFound ? 'Not found' : 'Something broke'} · ccino</title></svelte:head>

<section class="relative flex min-h-[60dvh] flex-col items-start justify-center">
	<div
		class="drift pointer-events-none absolute top-0 left-10 -z-10 h-72 w-72 rounded-full bg-ember-500/15 blur-[100px]"
		aria-hidden="true"
	></div>
	<p class="rise num text-sm text-ember-400">{page.status}</p>
	<h1 class="rise mt-3 text-5xl font-bold text-ink-100" style:--i="1">
		{notFound ? 'This page went cold.' : 'Something broke.'}
	</h1>
	<p class="rise mt-4 max-w-md text-ink-400" style:--i="2">
		{#if notFound}
			We couldn't find what you were looking for. It may have been deleted.
		{:else}
			{page.error?.message ?? 'An unexpected error happened.'} Try again, or head back to the dashboard.
		{/if}
	</p>
	<a href="/app/dashboard" class="rise btn btn-primary mt-8" style:--i="3">
		<Icon name="arrowLeft" size={15} /> Back to dashboard
	</a>
</section>
