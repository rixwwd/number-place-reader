<script lang="ts">
	import cv from '@techstark/opencv-js';
	import ControlBar from './ControlBar.svelte';
	import StartButton from './ControlBar/StartButton.svelte';
	import StopButton from './ControlBar/StopButton.svelte';
	import { onDestroy, onMount } from 'svelte';
	import ScanButton from './ControlBar/ScanButton.svelte';
	import { Reader } from './Reader';
	import { Ocr } from './Ocr';

	interface Props {
		onRead?: (data: string[][], dataUrl: string) => void;
	}
	let { onRead }: Props = $props();

	/**
	 * カメラの映像
	 */
	let video: HTMLVideoElement;
	let finderCanvas: HTMLCanvasElement;

	/**
	 * ナンバープレースの枠線のガイド
	 */
	let finderFrameCanvas: HTMLCanvasElement;

	let videoStream: MediaStream | undefined;
	let capture: cv.VideoCapture;

	/**
	 * キャプチャした画像
	 */
	let src: cv.Mat;

	let readData: string[][];

	/** opencvのロードが完了して使用の準備ができたらtrue */
	let ready: boolean = $state(false);
	cv['onRuntimeInitialized'] = () => {
		console.debug('opencv loaded');
		ready = true;
	};

	let detectStarted = $state(false);
	let timerId: number | undefined;

	let processing: boolean = $state(false);

	const reader = $derived(ready ? new Reader() : null);
	const ocr = new Ocr();

	onMount(() => {
		if (cv.getBuildInformation !== undefined || cv.getBuildInformation !== null) {
			ready = true;
		}
		cleanCanvas();
	});

	onDestroy(() => {
		console.debug('onDestroy');
		if (timerId === undefined) {
			clearTimeout(timerId);
			timerId = undefined;
		}
		if (src && !src.isDeleted()) {
			src.delete();
		}
		if (videoStream) {
			videoStream.getTracks().forEach((track) => track.stop());
		}

		reader?.destroy();
	});

	function cleanCanvas() {
		const ctx = finderCanvas.getContext('2d');
		if (ctx) {
			ctx.fillStyle = '#000000';
			ctx?.fillRect(0, 0, finderCanvas.width, finderCanvas.height);
		}
	}

	async function startCamera() {
		console.debug(navigator.mediaDevices.getSupportedConstraints());
		const constraints = {
			audio: false,
			video: { width: 720, height: 720, facingMode: { ideal: 'environment' } }
		};
		await navigator.mediaDevices
			.getUserMedia(constraints)
			.then((stream) => {
				videoStream = stream;
				video.srcObject = stream;
				video.play();
			})
			.catch((err) => {
				console.error(`An error occurred: ${err}`);
			});

		console.debug('camera started');
	}

	async function processFrame() {
		if (!detectStarted) {
			console.debug('stop processFrame');
			return;
		}

		capture.read(src);
		cv.imshow(finderCanvas, src);

		const img = src.roi(new cv.Rect(72, 72, 64 * 9, 64 * 9));
		const result = reader!.detect(img);
		img.delete();
		const ctx = finderFrameCanvas.getContext('2d');
		if (ctx) {
			if (result) {
				ctx.strokeStyle = 'rgb(0 255 0)';
			} else {
				ctx.strokeStyle = 'rgb(255 255 0)';
			}
			ctx.strokeRect(72, 72, 64 * 9, 64 * 9);
		}

		timerId = setTimeout(processFrame, 50);
	}

	async function onStart() {
		console.debug('onStart');
		if (!ready) {
			console.debug('Applicatino is not ready.');
		}
		startCamera();
	}

	function cameraCanPlay() {
		console.debug('video can play');
		video.width = video.videoWidth;
		video.height = video.videoHeight;
		console.debug(`video height:${video.videoHeight}, width=${video.videoWidth}`);
		capture = new cv.VideoCapture(video);
		src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
		detectStarted = true;
		setTimeout(processFrame, 100);
	}

	async function onScan() {
		processing = true;
		const img = src.roi(new cv.Rect(72, 72, 64 * 9, 64 * 9));
		let needCallOnRead = false;
		let dataUrl = '';
		const result = reader!.detect(img);
		if (result) {
			console.log('DETECT!!');

			const ocrWorkCanvas: HTMLCanvasElement = document.createElement('canvas');
			reader!.toCanvas(ocrWorkCanvas);

			try {
				const rd = await ocr.readDigit(ocrWorkCanvas);
				if (rd !== readData) {
					readData = rd;
					needCallOnRead = true;
					dataUrl = ocrWorkCanvas.toDataURL();
				}
			} catch (error) {
				// FIXME そもそもエラーが出ないようにする
				console.error(error);
			}
		}
		img.delete();
		processing = false;
		if (needCallOnRead) {
			if (onRead) {
				onStop();
				onRead(readData, dataUrl);
				console.debug('call onRead');
			}
		} else {
			alert('読取失敗');
		}
	}

	function onStop() {
		console.debug('onStop');
		clearTimeout(timerId);
		timerId = undefined;
		detectStarted = false;
		videoStream?.getTracks().forEach((track) => track.stop());
		videoStream = undefined;
		src.delete();
		cleanCanvas();
	}
</script>

<div id="base">
	<div id="finder">
		<!-- svelte-ignore a11y_media_has_caption -->
		<video id="video" bind:this={video} oncanplay={cameraCanPlay}></video>
		<canvas id="finderCanvas" bind:this={finderCanvas} width="720" height="720"> </canvas>
		<canvas id="finderFrameCanvas" bind:this={finderFrameCanvas} width="720" height="720"></canvas>
	</div>
</div>

<ControlBar>
	{#snippet buttons()}
		<StartButton onclick={onStart} disabled={!(ready && !detectStarted)} />
		<ScanButton onclick={onScan} disabled={!detectStarted} />
		<StopButton onclick={onStop} disabled={!detectStarted} />
	{/snippet}
</ControlBar>

{#if processing}
	<div class="processingDialog">
		<p>処理中</p>
	</div>
{/if}

<style>
	#base {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: calc(100svh - 72px);
	}
	#finder {
		position: relative;
		max-width: 720px;
		max-height: 720px;

		width: min(100svw, calc(100svh - 72px));
		aspect-ratio: 1;
	}
	#video {
		display: none;
	}
	#finderCanvas,
	#finderFrameCanvas {
		position: absolute;
		top: 0;
		left: 0;
		max-width: 720px;
		max-height: 720px;

		width: 100%;
		aspect-ratio: 1;
	}

	.processingDialog {
		position: absolute;
		width: 60%;
		top: calc(100svh - 60%);
		left: 20%;
		text-align: center;
		background-color: #ffffff;
		box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
	}
</style>
