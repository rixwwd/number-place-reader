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
		class="bi bi-play-fill"
		viewBox="0 0 16 16"
	>
		<path
			d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"
		/>
	</svg>
	<br />
	<span>開始</span>
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
