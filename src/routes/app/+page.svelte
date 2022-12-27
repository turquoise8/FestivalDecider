<script lang="ts">
	import { page } from '$app/stores';
	import SpotifyApi from 'spotify-web-api-js';
	import { onMount } from 'svelte';
	import { Search, ClickableTile, Button, Theme } from 'carbon-components-svelte';
	import { slide, crossfade } from 'svelte/transition';
	import { findRecommendedFromSoundAnalysis, type Artist } from './algorithm';
	import { quintOut } from 'svelte/easing';

	const code = $page.url.searchParams.get('code');
	const state = $page.url.searchParams.get('state');
	let loading = false;
	let foundArtists: Artist[] = [];
	let selectedArtists: Artist[] = [];
	let search: HTMLInputElement;
	let searchTerm = '';

	export const spotifyApi = new SpotifyApi();

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
				`
			};
		}
	});

	onMount(async () => {
		if (!code || !state) return;
		const res = await fetch('/api', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				code,
				state
			})
		});
		const data = await res.json();
		spotifyApi.setAccessToken(data.data.access_token);
	});

	let timer: NodeJS.Timeout;
	const debouncedSearch = (val: string) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			handleSearch(val);
		}, 500);
	};

	const handleSearch = async (val: string) => {
		loading = true;
		if (!val) {
			foundArtists = [];
			return;
		} else {
			const res = await spotifyApi.searchArtists(val, { limit: 15 });
			foundArtists = res.artists.items as Artist[];
		}

		loading = false;
	};

	const handleArtistSelect = (artist: Artist) => {
		searchTerm = '';
		foundArtists = [];
		selectedArtists = [...selectedArtists, artist];
	};
</script>

<Theme
	theme="white"
	tokens={{
		focus: '#1aa84c',
		'interactive-01': '#1db954',
		'hover-primary': '#1aa84c',
		'active-primary': '#119740'
	}}
/>

<div class="left">
	<div class="search-container">
		<Search
			on:clear={() => (foundArtists = [])}
			on:keyup={(e) => (e.key === 'Enter' ? handleSearch(searchTerm) : debouncedSearch(searchTerm))}
			bind:value={searchTerm}
			bind:this={search}
			placeholder="Search artists..."
		/>
		{#if foundArtists.length > 0}
			<div class="tiles-container" in:slide>
				{#each foundArtists as artist (artist.id)}
					<div>
						<ClickableTile class="tile" on:click={() => handleArtistSelect(artist)}>
							<div class="tile-content">
								<img src={artist.images[0]?.url} alt={artist.name} class="artist-image" />
								<h4>{artist.name}</h4>
							</div>
						</ClickableTile>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
<div class="right">
	<span class="page-title">Line Up</span>

	<div class="selected-artists-container">
		{#each [...selectedArtists].reverse() as artist}
			<div in:receive={{ key: artist.name }} out:send={{ key: artist.name }}>
				<ClickableTile class="selected-artist-tile">
					<div class="tile-content">
						<img src={artist.images[0].url} alt={artist.name} class="artist-image" />
						<div class="title">
							<h4>{artist.name}</h4>
							<p>{artist.genres.join(', ')}</p>
						</div>
					</div>
				</ClickableTile>
			</div>
		{/each}
	</div>

	<div class="button-container">
		<Button
			on:click={() => console.log(findRecommendedFromSoundAnalysis(selectedArtists, spotifyApi))}
			size="xl"
			kind="primary"
			class="submit-button">Submit</Button
		>
	</div>
</div>

<style lang="scss">
	.left {
		background-color: #1db954;
		height: 100%;
		width: 50vw;
		z-index: 2;
		padding: 2rem;
	}

	.right {
		background-color: rgb(239, 239, 239);
		height: 100%;
		width: 50vw;
		display: flex;
		flex-direction: column;
	}

	.tile-content {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.artist-image {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		margin-right: 1rem;
	}

	.tiles-container {
		max-height: 50vh;
		overflow: scroll;

		&::-webkit-scrollbar {
			width: 0;
		}
	}

	.page-title {
		color: #1db954;
		height: 10%;
		width: 100%;
		text-transform: uppercase;
		font-size: 3rem;
		font-weight: 600;
		display: flex;
		justify-content: center;
		margin-top: 2rem;
		border-bottom: 5px solid #1db954;
	}

	.title {
		h4 {
			color: #1db954;
			font-size: 1.5rem;
			font-weight: 600;
		}
	}

	.button-container {
		margin-top: auto;
		display: flex;
		align-self: flex-end;
		justify-self: flex-end;
	}

	.selected-artists-container {
		display: flex;
		flex-direction: column;
		height: 80%;
		overflow: auto;

		&::-webkit-scrollbar {
			width: 0;
		}
	}
</style>
