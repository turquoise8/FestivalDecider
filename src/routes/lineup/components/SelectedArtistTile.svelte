<script lang="ts">
	import type { Artist } from '$lib/types/types';
	import { ClickableTile } from 'carbon-components-svelte';
	import { fly } from 'svelte/transition';
	export let selectedArtists: Artist[];
	export let artist: Artist;
</script>

<div in:fly>
	<ClickableTile>
		<div
			class="tile-content"
			on:click={() => (selectedArtists = selectedArtists.filter((a) => a.id !== artist.id))}
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					selectedArtists = selectedArtists.filter((a) => a.id !== artist.id);
				}
			}}
		>
			<img src={artist.images[0].url} alt={artist.name} class="artist-image" />
			<div class="title">
				<h4>{artist.name}</h4>
			</div>
			<div class="delete-icon">
				<svg width="16" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg">
					<line x1="1" y1="15" x2="15" y2="1" stroke="red" stroke-width="2" />
					<line x1="1" y1="1" x2="15" y2="15" stroke="red" stroke-width="2" />
				</svg>
			</div>
		</div>
	</ClickableTile>
</div>

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

	.title {
		h4 {
			color: var(--color-main);
			font-size: 1.5rem;
			font-weight: 600;
		}
	}

	.delete-icon {
		visibility: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: auto;
		width: 50px;
		height: 50px;
	}

	.tile-content:hover {
		.delete-icon {
			visibility: visible;
		}
	}
</style>
