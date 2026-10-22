<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '$lib/components/Icon.svelte';
	import IdeaForm from '$lib/components/IdeaForm.svelte';
	import IdeaFormStepper from '$lib/components/IdeaFormStepper.svelte';

	let {
		titleText,
		headingId,
		formAction,
		submitLabel,
		initial,
		formError
	}: {
		titleText: string;
		/** For `aria-labelledby` on the dialog */
		headingId: string;
		formAction: string;
		submitLabel: string;
		initial: Record<string, unknown> | undefined;
		formError?: string;
	} = $props();

	let dialogEl = $state<HTMLDialogElement | undefined>();
	let createPhase = $state<1 | 2>(1);

	export function openModal() {
		createPhase = 1;
		dialogEl?.showModal();
		// Start typing straight away instead of landing on the close button.
		dialogEl?.querySelector<HTMLInputElement>('input[name="title"]')?.focus();
	}

	export function closeModal() {
		createPhase = 1;
		dialogEl?.close();
	}
</script>

<!-- Don’t put `flex` on <dialog>: it overrides the default `display:none` when closed. -->
<dialog
	bind:this={dialogEl}
	class="editor m-auto w-[min(100vw-1.5rem,40rem)] max-w-none overflow-hidden rounded-3xl border border-white/9 bg-ink-900 p-0 text-ink-100 shadow-[0_50px_100px_-30px_rgb(0_0_0/0.9)]"
	aria-labelledby={headingId}
	onclick={(e) => {
		if (e.target === dialogEl) closeModal();
	}}
>
	<div class="relative flex max-h-[min(92dvh,52rem)] flex-col overflow-hidden">
		<!-- Ambient ember glow behind the header -->
		<div
			class="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-ember-500/25 blur-3xl"
			aria-hidden="true"
		></div>

		<div class="relative shrink-0">
			<div class="flex items-center justify-between gap-3 px-6 pt-6 pb-5">
				<h2 id={headingId} class="text-2xl font-bold text-ink-100">{titleText}</h2>
				<button type="button" class="btn btn-ghost btn-sm h-9 w-9 px-0" onclick={closeModal} aria-label="Close">
					<Icon name="close" size={16} />
				</button>
			</div>
			<IdeaFormStepper phase={createPhase} />
		</div>

		<div class="relative min-h-0 flex-1 overflow-y-auto border-t border-white/6 px-6 py-6">
			{#if formError}
				<div class="alert mb-5" role="alert">{formError}</div>
			{/if}

			<form method="POST" action={formAction} use:enhance>
				<IdeaForm bind:phase={createPhase} phased {initial} {submitLabel} />
			</form>
		</div>
	</div>
</dialog>

<style>
	.editor[open] {
		animation: dialog-in 260ms var(--ease-out-soft);
	}
	.editor::backdrop {
		background: rgb(8 7 6 / 0.65);
		backdrop-filter: blur(6px);
	}
</style>
