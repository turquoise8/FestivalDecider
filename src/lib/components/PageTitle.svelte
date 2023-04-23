<script lang="ts">
	export let title: string;
	export let color: 'green' | 'white';
</script>

<span class:green={color === 'green'} class:white={color === 'white'} class="page-title"
	>{title}</span
>

<style lang="scss">
	.page-title {
		height: 10%;
		width: 100%;
		text-transform: uppercase;
		font-size: 3rem;
		font-weight: 600;
		display: flex;
		justify-content: center;
		margin-top: 2rem;

		@media (max-width: 1023px) {
			align-items: flex-end;
		}
	}

	.green {
		color: var(--main-color);
		border-bottom: 5px solid var(--main-color);
	}

	.white {
		color: var(--white);
		border-bottom: 5px solid var(--white);
	}
</style>
