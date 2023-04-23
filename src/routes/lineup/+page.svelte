<script lang="ts">
	import { page } from '$app/stores';
	import SpotifyApi from 'spotify-web-api-js';
	import { onMount } from 'svelte';
	import { Button, ToastNotification } from 'carbon-components-svelte';
	import { fly } from 'svelte/transition';
	import type { Artist } from '$lib/types/types';
	import { getRecommendation } from '../../lib/functions/RecommendationEngine';
	import { artistRecommendations, generalRecommendations } from '../../lib/stores/store';
	import { goto } from '$app/navigation';
	import Layout from '../../lib/layouts/MainLayout.svelte';
	import SelectedArtistTile from './components/SelectedArtistTile.svelte';
	import ArtistSearch from './components/ArtistSearch.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { getSpotifyAccessTokenFromRefreshToken, getSpotifyToken } from '$lib/functions/Spotify';

	const code = $page.url.searchParams.get('code');
	const state = $page.url.searchParams.get('state');

	let calculating: boolean = false;

	let selectedArtists: Artist[] = [];

	let error = {
		title: '',
		subtitle: ''
	};

	let errorTimer: NodeJS.Timer;
	let calculatingTimeout: NodeJS.Timer;

	$: if (error.title) {
		errorTimer = setTimeout(() => {
			error = {
				title: '',
				subtitle: ''
			};
		}, 4000);
	}

	$: if (calculating) {
		calculatingTimeout = setTimeout(() => {
			calculating = false;
			error = {
				title: 'Something went wrong',
				subtitle: 'Please try again'
			};
		}, 5000);
	}

	export const spotifyApi = new SpotifyApi();

	onMount(async () => {
		if (!code || !state) {
			console.log('No code or state found');
			goto('/');
			return;
		}

		if (
			localStorage.getItem('refreshToken') &&
			localStorage.getItem('refreshToken') !== 'undefined'
		) {
			const token = await getSpotifyAccessTokenFromRefreshToken();
			spotifyApi.setAccessToken(token);
			return;
		}

		const token = await getSpotifyToken(code, state);
		spotifyApi.setAccessToken(token);
	});

	const handleSubmit = async () => {
		calculating = true;

		if (selectedArtists.length < 3) {
			error = {
				title: 'Not enough artists selected',
				subtitle: 'Please select at least 3	artists'
			};
			calculating = false;
			return;
		}

		const res = await getRecommendation(selectedArtists, spotifyApi);

		generalRecommendations.set(res.generalRecommendations);
		artistRecommendations.set(res.recommendedArtists);
		calculating = false;

		goto('/results');
	};
</script>

<Layout bind:nonInteractable={calculating}>
	<div slot="section-left" class="left-container">
		<ArtistSearch {spotifyApi} {error} bind:selectedArtists />
	</div>

	<div slot="section-right" class="right-container">
		<PageTitle title="Line Up" color="green" />

		<div class="selected-artists-container">
			{#each selectedArtists as artist}
				<SelectedArtistTile {artist} bind:selectedArtists />
			{/each}
		</div>

		<div class="button-container">
			<Button
				skeleton={calculating}
				on:click={() => handleSubmit()}
				size="xl"
				kind="primary"
				class="submit-button"
			>
				Submit
			</Button>
		</div>

		{#if error.title}
			<div transition:fly={{ y: 100 }} class="error-toast">
				<ToastNotification
					kind="error"
					title={error.title}
					subtitle={error.subtitle}
					hideCloseButton
					lowContrast
				/>
			</div>
		{/if}
	</div>
</Layout>

<style lang="scss">
	.left-container {
		padding: 2rem;

		@media (max-width: 768px) {
			padding: 5px;
			padding-top: 2rem;
		}

		@media (max-width: 1023px) {
			width: 100vw;
			max-height: 50vh;
		}
	}

	.right-container {
		@media (max-width: 1023px) {
			width: 100vw;
			max-height: 50vh;
		}
	}

	.button-container {
		margin-top: auto;
		display: flex;
		align-self: flex-end;
		justify-self: flex-end;
		justify-content: flex-end;
	}

	.selected-artists-container {
		display: flex;
		flex-direction: column;
		overflow: auto;

		&::-webkit-scrollbar {
			width: 15px;
		}

		&::-webkit-scrollbar-thumb {
			background-color: lightgrey;
			border-radius: 0px;
		}
	}

	.error-toast {
		position: absolute;
		bottom: 10%;
		left: 25%;
		transform: translate(-50%, -50%);
		z-index: 100;

		@media (max-width: 768px) {
			left: 50%;
		}
	}
</style>
