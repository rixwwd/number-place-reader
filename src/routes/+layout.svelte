<svelte:options runes={true} />

<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css" rel="stylesheet" />
</svelte:head>

{@render children?.()}
