<script lang="ts">
	import NumerPlaceReader from '$lib/NumerPlaceReader.svelte';
	import NumberPlaceViewer from '$lib/NumberPlaceViewer.svelte';

	const Mode = {
		Scan: 'scan',
		View: 'view'
	} as const;
	let mode: (typeof Mode)[keyof typeof Mode] = $state('scan');
	let numberPlaceData: string[][] = $state([]);
	let numberPlaceImageDataUrl: string = $state('');
</script>

{#if mode == Mode.Scan}
	<NumerPlaceReader
		onRead={async (data, dataUrl) => {
			console.debug('main onRead', data);
			numberPlaceData = data;
			numberPlaceImageDataUrl = dataUrl;
			mode = Mode.View;
		}}
	/>
{/if}
{#if mode == Mode.View}
	<NumberPlaceViewer
		onClose={() => {
			console.debug('resolver cloed');
			mode = Mode.Scan;
		}}
		cellDigit={numberPlaceData}
		cellImageDataUrl={numberPlaceImageDataUrl}
	/>
{/if}
