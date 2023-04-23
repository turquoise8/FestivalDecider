<script lang="ts">
	import { OverflowMenuItem, ButtonSet, OverflowMenu } from 'carbon-components-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import Menu from '../icons/Menu.svelte';
	export let nonInteractable = false;

	const handleLogout = () => {
		localStorage.setItem('isLoggedOut', 'true');
		localStorage.removeItem('refreshToken');
		goto('/');
	};
</script>

<!-- Current SvelteKit does not support multiple named slots on +layout.svelte files. So I had to come up with this workaround  -->
{#if browser}
	<div
		class="container"
		class:non-interactable={nonInteractable}
		class:column={$page.url.pathname !== '/'}
	>
		<slot name="section-left" />

		<slot name="section-right" />

		<footer class="footer">
			<OverflowMenu direction="top" size="xl" light icon={Menu}>
				<OverflowMenuItem
					text="Home"
					on:click={() => {
						goto('/');
					}}>Home</OverflowMenuItem
				>

				<OverflowMenuItem
					on:click={() => {
						window.open('https://www.linkedin.com/in/apaydinemre/', '_blank');
					}}>LinkedIn</OverflowMenuItem
				>
				<OverflowMenuItem
					on:click={() => {
						window.open('https://github.com/turquoise8', '_blank');
					}}>GitHub</OverflowMenuItem
				>
				{#if localStorage.getItem('isLoggedOut') !== 'true'}
					<OverflowMenuItem
						danger
						on:click={() => {
							handleLogout();
						}}>Logout</OverflowMenuItem
					>
				{/if}
			</OverflowMenu>
		</footer>
	</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600&family=Monoton&display=swap');
	@import 'carbon-components-svelte/css/all';

	:global(:root) {
		--cds-interactive-01: #1eb352;
		--cds-focus: rgb(243, 243, 243);
		--cds-hover-primary: #1aa84c;
		--cds-active-primary: #119740;
		--cds-hover-primary-text: #1aa84c;
		--cds-link-01: #f6f6f6e3;

		--main-color: #1db954;
		--main-color-hover: #1aa84c;
		--main-color-active: #119740;

		--error-color: #e74c3c;
		--error-color-hover: #d43f2f;
		--error-color-active: #c0392b;

		--white: #ffffff;
		--whitesmoke: #f6f6f6;
	}

	:global(body) {
		display: flex;
		margin: 0;
		padding: 0;
		height: 100vh;
		font-family: 'Josefin Sans', sans-serif;
	}

	.footer {
		position: absolute;
		bottom: 0;
		width: 50vw;
		left: 0;
		z-index: 10;
	}

	.container {
		display: flex;
		width: 100%;
		height: 100%;
		position: relative;
	}

	:global([slot='section-left']) {
		background-color: var(--main-color);
		height: 100%;
		width: 50vw;
		z-index: 2;
		display: flex;
		flex-direction: column;
	}

	:global([slot='section-right']) {
		background-color: var(--whitesmoke);
		height: 100vh;
		max-height: 100vh;
		width: 50vw;
		display: flex;
		flex-direction: column;
	}

	.non-interactable {
		pointer-events: none;
		opacity: 0.9;
	}

	@media (max-width: 1023px) {
		.column {
			flex-direction: column;
		}
	}
</style>
