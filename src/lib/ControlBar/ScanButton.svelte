<script lang="ts">
	import type { ButtonProps } from './button';

	let { onclick, disabled }: ButtonProps = $props();
</script>

<button class="button" {onclick} {disabled}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="32"
		height="32"
		fill="currentColor"
		class="bi bi-camera-fill"
		viewBox="0 0 16 16"
	>
		<path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
		<path
			d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"
		/>
	</svg>
	<br />
	<span>読取</span>
</button>

<style>
	.button {
		width: 72px;
		height: 100%;
		margin-left: 12px;
		margin-right: 12px;
		margin-top: 0;
		margin-bottom: 0;

		background-color: rgba(0, 0, 0, 0);
		border: 0;
		color: white;
	}
	.button span {
		margin-bottom: 4px;
	}
	.button:disabled {
		color: #777777;
	}
</style>
