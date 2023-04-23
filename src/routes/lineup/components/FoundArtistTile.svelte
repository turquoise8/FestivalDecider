<script lang="ts">
	import type { Artist } from '$lib/types/types';
	import { ClickableTile } from 'carbon-components-svelte';

	export let handleArtistSelect: (artist: Artist) => void;
	export let artist: Artist;
</script>

<ClickableTile class="tile" on:click={() => handleArtistSelect(artist)}>
	<div class="tile-content">
		<img src={artist.images[0]?.url} alt={artist.name} class="artist-image" />
		<h4>{artist.name}</h4>
	</div>
</ClickableTile>

<style lang="scss">
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
</style>
