<script>
	import { PUBLIC_BASE_URL, PUBLIC_CLIENT_ID } from '$env/static/public';
	import { onMount } from 'svelte';
	import { slide, fly } from 'svelte/transition';
	import logo from '$lib/assets/spotify.png';
	import Layout from '../lib/layouts/MainLayout.svelte';
	import AppTitle from '$lib/components/AppTitle.svelte';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });

	// Svelte animations won't work on the first render. This is a workaround.
	let ready = false;
	onMount(() => {
		ready = true;
	});

	const requestSpotifyAuthFromUser = () => {
		const state = crypto.randomUUID();
		const redirect_uri = `${PUBLIC_BASE_URL}/lineup`;
		const scope =
			'user-read-private user-read-email user-top-read user-library-read user-follow-read';
		const userLoggedOut = localStorage.getItem('isLoggedOut') === 'true';
		const url = `https://accounts.spotify.com/authorize?client_id=${PUBLIC_CLIENT_ID}&response_type=code&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}&show_dialog=${userLoggedOut}`;
		localStorage.setItem('isLoggedOut', 'false');
		window.location.replace(url);
	};
</script>

<Layout>
	<div slot="section-left">
		{#if ready}
			<div transition:slide={{ delay: 1000, duration: 2000 }} class="titles-container">
				<span class="title"> Welcome </span>
				<span class="name"> Festival Decider </span>
			</div>
			<div class="quote-container">
				<p class="quote" transition:slide={{ delay: 1500, duration: 2000 }}>
					"There's a festival coming up! There are like 50 artists playing. I don't even know... 48
					of them? Am I going to enjoy this?"
				</p>
				<p class="quote" transition:slide={{ delay: 2000, duration: 2000 }}>
					"Oh shit I'm already here. Three artists playing at the same time? Which one do I go to?"
				</p>
				<p class="quote" transition:slide={{ delay: 2500, duration: 2000 }}>
					"Say no more. I got you fam."
				</p>
			</div>
		{/if}

		<div class="spotify-button-container">
			{#if ready}
				<button
					on:click={requestSpotifyAuthFromUser}
					transition:fly={{ delay: 3000, duration: 2000, x: 50 }}
					class="spotify-button"
				>
					<img src={logo} alt="Spotify logo" class="spotify-logo" />
					Login with Spotify
				</button>
			{/if}
		</div>
	</div>

	<div slot="section-right">
		{#if ready}
			<div class="quote-container">
				<i class="quote-owner" transition:slide={{ delay: 1750, duration: 2000 }}
					>-Developer of this app</i
				>
				<i class="quote-owner" transition:slide={{ delay: 2250, duration: 2000 }}
					>-Someone, probably</i
				>
				<i class="quote-owner" transition:slide={{ delay: 2750, duration: 2000 }}
					>-This app, surely</i
				>
			</div>
		{/if}
	</div>
</Layout>

<style lang="scss">
	.quote {
		font-size: 1.3rem;
		font-weight: 600;
		color: var(--white);
		letter-spacing: 1px;
		line-height: 1.5;
		display: flex;
		align-items: center;
		text-align: end;
		justify-content: flex-end;

		@media (max-width: 600px) {
			font-size: 1rem;
			text-align: center;
		}

		@media (max-width: 400px) {
			font-size: 0.8rem;
		}

		&-container {
			padding: 2rem;
			padding-top: 60%;
			display: grid;
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr 1fr;
			height: 85%;
			gap: 10px 0;

			@media (max-width: 600px) {
				padding: 0.5rem;
				padding-top: 60%;
			}
		}

		&-owner {
			display: flex;
			align-items: center;
			color: var(--main-color-active);
			font-size: 1.2rem;

			@media (max-width: 400px) {
				font-size: 0.8rem;
			}
		}
	}

	.spotify {
		&-button {
			box-sizing: content-box;
			background: var(--main-color);
			outline: none;
			border: none;
			color: var(--white);
			font-size: 1.1rem;
			padding: 10px 15px 10px 15px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-left: 10px;
			transition: 0.1s all ease-in-out;
			height: 50px;

			&:hover {
				cursor: pointer;
				box-shadow: 0px 0px 8px var(--main-color);
			}

			&:active {
				box-shadow: 0px 0px 12px var(--main-color);
			}

			@media (max-width: 600px) {
				width: 100%;
				font-size: 1rem;
			}

			&-container {
				position: absolute;
				left: 50%;
				top: 90%;
				display: flex;
				align-items: center;
				transform: translate(-50%, -50%);
				background-color: var(--whitesmoke);
				width: 20%;
				height: 90px;

				@media (max-width: 600px) {
					width: 50%;
					height: 12%;
				}

				@media (max-width: 400px) {
					height: 13%;
					width: 70%;
				}
			}
		}

		&-logo {
			height: 3rem;
			margin-right: 1rem;
		}
	}

	.titles-container {
		width: 100%;
		position: absolute;
		padding: 1%;
	}

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

		padding: 0 11%;

		@media (max-width: 600px) {
			top: 10%;
		}
	}
</style>
