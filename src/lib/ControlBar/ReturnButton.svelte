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
		class="bi bi-x"
		viewBox="0 0 16 16"
	>
		<path
			d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
		/>
	</svg>
	<br />
	<span>閉じる</span>
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
