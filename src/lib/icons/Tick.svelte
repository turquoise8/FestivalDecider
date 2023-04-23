<script lang="ts">
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	export let props: any;

	let init = false;

	onMount(() => {
		init = true;
	});
</script>

<svg
	viewBox="0 0 16 16"
	version="1.1"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	{...props}
>
	<rect width="16" height="16" id="icon-bound" fill="none" />
	{#if init}
		<path
			in:fly|intro={{ duration: 500, y: 20, easing: (t) => t * (2 - t) }}
			stroke="#1db954"
			stroke-width="0.1"
			d="M0,9.014L1.414,7.6L5.004,11.189L14.593,1.6L16.007,3.014L5.003,14.017L0,9.014Z"
		/>
	{/if}
</svg>
