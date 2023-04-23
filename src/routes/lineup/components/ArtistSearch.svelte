<script lang="ts">
	import { debouncedSearch } from '$lib/functions/debouncedSearch';
	import type { Artist } from '$lib/types/types';
	import { Search } from 'carbon-components-svelte';
	import type SpotifyWebApi from 'spotify-web-api-js';
	import { slide } from 'svelte/transition';
	import FoundArtistTile from './FoundArtistTile.svelte';

	export let spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
	export let selectedArtists: Artist[];
	export let error: { title: string; subtitle: string };

	let searchTerm = '';
	let foundArtists: Artist[] = [];

	const handleArtistSelect = (artist: Artist) => {
		if (selectedArtists.find((a) => a.id === artist.id)) {
			error = {
				title: 'Artist already selected',
				subtitle: 'Please select a different artist'
			};
			return;
		}
		searchTerm = '';
		foundArtists = [];
		selectedArtists = [...selectedArtists, artist];
		console.log(selectedArtists);
	};

	const handleSearch = async (val: string) => {
		if (!val) {
			foundArtists = [];
			return;
		} else {
			const res = await spotifyApi.searchArtists(val, { limit: 10 });
			foundArtists = res.artists.items as Artist[];
		}
	};
</script>

<div class="search-container">
	<Search
		on:clear={() => (foundArtists = [])}
		on:keyup={(e) =>
			e.key === 'Enter' ? handleSearch(searchTerm) : debouncedSearch(searchTerm, handleSearch)}
		bind:value={searchTerm}
		placeholder="Search artists..."
	/>

	{#if foundArtists.length > 0}
		<div class="tiles-container" in:slide={{ duration: 200 }}>
			{#each foundArtists as artist (artist.id)}
				<FoundArtistTile {artist} {handleArtistSelect} />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.tiles-container {
		max-height: 60vh;
		overflow: scroll;

		&::-webkit-scrollbar {
			width: 0;
		}

		@media (max-width: 1023px) {
			max-height: 40vh;
		}
	}
</style>
