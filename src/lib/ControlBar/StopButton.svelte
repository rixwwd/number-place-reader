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
		class="bi bi-stop-fill"
		viewBox="0 0 16 16"
	>
		<path
			d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5"
		/>
	</svg>
	<br />
	<span>停止</span>
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
