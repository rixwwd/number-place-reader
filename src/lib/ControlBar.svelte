<script lang="ts">
	let { buttons } = $props();
</script>

<div class="toolbar">
	{@render buttons()}
</div>

<style>
	.toolbar {
		display: flex;
		justify-content: center;
		width: 100%;
		height: 72px;
		background-color: rgba(0, 0, 0, 0.8);
		border-radius: 12px 12px 12px 12px;
	}
</style>
