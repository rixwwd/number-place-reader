<script lang="ts">
	import ControlBar from './ControlBar.svelte';
	import ReturnButton from './ControlBar/ReturnButton.svelte';

	interface Props {
		cellDigit: string[][];
		cellImageDataUrl: string;
		onClose: () => void;
	}

	let { cellDigit, cellImageDataUrl, onClose }: Props = $props();

	const cellIndex: number[] = [];
	for (let i = 0; i < 81; i++) {
		cellIndex.push(i);
	}

	function onEdit(index: number) {
		const inputValue = window.prompt(
			'セルの数字を入力してください',
			cellDigit[Math.floor(index / 9)][index % 9]
		);
		if (inputValue === null) {
			return;
		}

		let newValue: string;
		if (inputValue.trim().length === 0) {
			newValue = '';
		} else if (inputValue?.match(/^[1-9]$/)) {
			newValue = inputValue;
		} else {
			return;
		}

		cellDigit[Math.floor(index / 9)][index % 9] = newValue;
	}
</script>

<div id="base">
	<img id="scanImage" alt="" src={cellImageDataUrl} />
	<div id="board">
		{#each cellIndex as ci}
			<!-- svelte-ignore a11y_click_events_have_key_events,a11y_no_static_element_interactions -->
			<div onclick={() => onEdit(ci)} class="cell initialValue">
				{cellDigit[Math.floor(ci / 9)][ci % 9]}
			</div>
		{/each}
	</div>
</div>

<ControlBar>
	{#snippet buttons()}
		<ReturnButton onclick={onClose}></ReturnButton>
	{/snippet}
</ControlBar>

<style>
	#base {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: calc(100svh - 72px);
	}

	#scanImage {
		position: absolute;
		max-width: 720px;
		max-height: 720px;

		width: min(100svw, calc(100svh - 72px));
		aspect-ratio: 1;

		z-index: 10;
	}

	#board {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		max-width: 720px;
		max-height: 720px;

		width: min(100svw, calc(100svh - 72px));
		aspect-ratio: 1;

		z-index: 11;
	}

	.cell {
		width: 11%;
		height: 11%;
		border: 0;
		box-sizing: border-box;
		padding-right: calc(11% * 0.1);
		padding-top: calc(11% * 0.1);
		font-weight: bold;
		background-color: rgba(0, 0, 0, 0.3);
		display: flex;

		z-index: 12;
	}
	.cell:nth-of-type(9n) {
		border-right: 1px;
	}
	.cell:nth-child(n + 73) {
		border-bottom: 1px;
	}
	.initialValue {
		color: orange;
		font-size: 12pt;
		justify-content: flex-end;
	}
</style>
