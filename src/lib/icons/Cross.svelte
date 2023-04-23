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
	viewBox="0 0 64 64"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	aria-hidden="true"
	role="img"
	class="iconify iconify--emojione-monotone"
	preserveAspectRatio="xMidYMid meet"
	{...props}
>
	{#if init}
		<path
			in:fly={{ duration: 500, y: 50, easing: (t) => t * (2 - t) }}
			d="M62 10.571L53.429 2L32 23.429L10.571 2L2 10.571L23.429 32L2 53.429L10.571 62L32 40.571L53.429 62L62 53.429L40.571 32z"
			fill={props.fill}
		/>
	{/if}
</svg>
