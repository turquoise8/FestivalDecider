<script lang="ts">
	import { slide } from 'svelte/transition';

	export let title: string;
	export let type: 'big' | 'medium';
	export let top: number = 50;
	export let left: number = 50;
</script>

<span
	transition:slide={{ delay: 1000, duration: 2000 }}
	class:title={type === 'big'}
	class:name={type === 'medium'}
	style="top: {top}rem; left: {left}%;"
>
	{title}
</span>

<style lang="scss">
	.title {
		background: linear-gradient(90deg, var(--white) 50%, var(--main-color) 50%);
		background-clip: text;
		text-transform: uppercase;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		font-size: 18vw;
		transform: translate(-50%, -50%);
		text-shadow: 0 20px 5px rgba(0, 0, 0, 0.074);
		pointer-events: none;
		margin: auto;

		@media (max-width: 600px) {
			top: 2%;
		}
	}

	.name {
		@extend .title;
		font-size: 8vw;
		width: 100%;
		text-align: center;
		text-shadow: none;

		@media (max-width: 600px) {
			top: 10%;
		}
	}
</style>
