<script>
	import { PUBLIC_BASE_URL, PUBLIC_CLIENT_ID } from '$env/static/public';
	import { onMount } from 'svelte';
	import { slide, fly } from 'svelte/transition';
	import logo from '$lib/assets/spotify.png';

	let ready = false;
	onMount(() => {
		ready = true;
	});

	const state = crypto.randomUUID();
	const redirect_uri = `${PUBLIC_BASE_URL}/app`;
	const scope =
		'user-read-private user-read-email user-top-read user-library-read user-follow-read';

	const url = `https://accounts.spotify.com/authorize?client_id=${PUBLIC_CLIENT_ID}&response_type=code&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`;

	function requestAuth() {
		window.location.replace(url);
	}
</script>

<div class="left">
	{#if ready}
		<span transition:slide={{ delay: 1000, duration: 2000 }} class="title">Welcome</span>
		<span transition:slide={{ delay: 1000, duration: 2000 }} class="name">Festival Decider</span>
		<div class="quote-container">
			<p class="quote" transition:slide={{ delay: 1500, duration: 2000 }}>
				"There's a festival coming up! There are like 50 artists playing. I don't even know... 48 of
				them? Am I going to enjoy this?"
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
				on:click={requestAuth}
				transition:fly={{ delay: 3000, duration: 2000, x: 50 }}
				class="spotify-button"
			>
				<img src={logo} alt="Spotify logo" class="spotify-logo" />
				Login with Spotify
			</button>
		{/if}
	</div>
</div>

<div class="right">
	{#if ready}
		<div class="quote-container">
			<i class="quote-owner" transition:slide={{ delay: 1750, duration: 2000 }}
				>-Developer of this app</i
			>
			<i class="quote-owner" transition:slide={{ delay: 2250, duration: 2000 }}
				>-Someone, probably</i
			>
			<i class="quote-owner" transition:slide={{ delay: 2750, duration: 2000 }}>-This app, surely</i
			>
		</div>
	{/if}
</div>

<style lang="scss">
	.left {
		background-color: #1db954;
		height: 100%;
		width: 50vw;
		z-index: 2;
	}

	.right {
		background-color: rgb(239, 239, 239);
		height: 100%;
		width: 50vw;
	}

	.title {
		background: linear-gradient(90deg, #ffffff 50%, #1ed760 50%);
		background-clip: text;
		text-transform: uppercase;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		font-size: 18vw;
		position: absolute;
		top: 5%;
		left: 50%;
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
		top: 25%;
		width: 100%;
		text-align: center;
		text-shadow: none;

		@media (max-width: 600px) {
			top: 10%;
		}
	}

	.quote {
		font-size: 1.3rem;
		font-weight: 600;
		color: white;
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
			padding-top: 40%;
			display: grid;
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr 1fr;
			height: 50%;

			@media (max-width: 600px) {
				padding: 0.5rem;
				padding-top: 50%;
				height: 65%;
			}
		}

		&-owner {
			display: flex;
			align-items: center;
			color: #16863d;
			font-size: 1.2rem;

			@media (max-width: 400px) {
				font-size: 0.8rem;
			}
		}
	}

	.spotify {
		&-button {
			box-sizing: content-box;
			background: #1db954;
			outline: none;
			border: none;
			border-radius: 5px;
			color: white;
			font-size: 1.1rem;
			padding: 5px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-left: 20px;
			transition: 0.1s all ease-in-out;

			&:hover {
				cursor: pointer;
			}

			&:active {
				box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.491);
				padding: 9px 1px 1px 9px;
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
				background-color: rgb(239, 239, 239);
				border-radius: 5px;
				width: 20%;
				height: 10%;

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
</style>
