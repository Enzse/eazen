<script lang="ts" module>
	// One stroke weight for every icon so the set reads as a family.
	const PATHS = {
		home: 'M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z',
		spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5',
		stack: 'M12 4 3.5 8.5 12 13l8.5-4.5zM3.5 12.5 12 17l8.5-4.5M3.5 16.5 12 21l8.5-4.5',
		plus: 'M12 5v14M5 12h14',
		search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM20 20l-4.6-4.6',
		close: 'M6 6l12 12M18 6 6 18',
		arrowRight: 'M5 12h14M13 6l6 6-6 6',
		arrowLeft: 'M19 12H5M11 6l-6 6 6 6',
		arrowUpRight: 'M7 17 17 7M8 7h9v9',
		check: 'M5 12.5 10 17.5 19 7',
		circle: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
		half: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 4v16',
		pencil: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
		trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3',
		flame: 'M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.6 3-5.6 3.8-9.3 1.9 1.2 3.2 3 3.5 5.2 1-.7 1.6-1.8 1.8-3 1.9 1.7 3.9 4.4 3.9 7.1 0 3.6-2.6 6.2-6.5 6.2z',
		filter: 'M4 6h16M7 12h10M10 18h4',
		bolt: 'M13 3 5 13.5h6L10 21l8-10.5h-6z',
		command: 'M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z',
		folder: 'M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z',
		pause: 'M9 6v12M15 6v12',
		flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
		sliders: 'M4 7h9M17 7h3M15 5v4M4 17h3M11 17h9M9 15v4',
		palette:
			'M12 21a9 9 0 1 1 9-9c0 2-1.6 3-3.4 3H15a2 2 0 0 0-1.4 3.4c.5.6.2 2.6-1.6 2.6zM7.5 11h.01M10.5 7.5h.01M15 7.5h.01'
	} as const;

	export type IconName = keyof typeof PATHS;
</script>

<script lang="ts">
	let {
		name,
		size = 18,
		class: className = '',
		stroke = 1.75
	}: { name: IconName; size?: number; class?: string; stroke?: number } = $props();
</script>

<svg
	class={className}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={stroke}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d={PATHS[name]} />
</svg>
