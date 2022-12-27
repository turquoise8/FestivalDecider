<script>
	import { Theme } from 'carbon-components-svelte';
</script>

<slot />

<style>
	@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&family=Monoton&display=swap');
	@import 'carbon-components-svelte/css/all';

	:global(body) {
		display: flex;
		margin: 0;
		padding: 0;
		height: 100vh;
		font-family: 'Josefin Sans', sans-serif;
	}
</style>
