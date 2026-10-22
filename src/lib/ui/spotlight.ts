/** Feeds the cursor position to `.spot` cards as --mx / --my so their glow follows the pointer. */
export function spotlight(node: HTMLElement) {
	function onMove(e: PointerEvent) {
		const r = node.getBoundingClientRect();
		node.style.setProperty('--mx', `${e.clientX - r.left}px`);
		node.style.setProperty('--my', `${e.clientY - r.top}px`);
	}
	node.addEventListener('pointermove', onMove);
	return {
		destroy() {
			node.removeEventListener('pointermove', onMove);
		}
	};
}
