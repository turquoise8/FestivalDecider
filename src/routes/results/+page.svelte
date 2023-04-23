<script lang="ts">
	import {
		ReasonsToMessageMap,
		type GeneralRecommendation,
		type RecommendedArtist
	} from '../../lib/types/types';
	import { generalRecommendations, artistRecommendations } from '../../lib/stores/store';
	import Tick from '../../lib/icons/Tick.svelte';
	import Cross from '../../lib/icons/Cross.svelte';
	import Layout from '../../lib/layouts/MainLayout.svelte';

	let artistsRec: RecommendedArtist[];
	let generalRec: GeneralRecommendation[];

	generalRecommendations.subscribe((val) => (generalRec = val));

	artistRecommendations.subscribe((val) => (artistsRec = val));
</script>

<Layout>
	<div slot="section-left" class="left-container">
		<span class="page-title">Recommendations</span>
		<div class="recommendations-container">
			{#each artistsRec as artistRec}
				<a class="artist-tile" href={artistRec.artist.uri} target="_blank" rel="noreferrer">
					<img
						src={artistRec.artist.images[0].url}
						alt={artistRec.artist.name}
						class="artist-image"
					/>
					<div class="artist-title">
						<h4>{artistRec.artist.name}</h4>
						<ul>
							{#each artistRec.reasons.slice(0, 3) as reason}
								<li>
									Because it's {ReasonsToMessageMap[reason.code]}:
									<b class="related-item">
										{reason.relatedItem}
									</b>
								</li>
							{/each}
						</ul>
					</div>
				</a>
			{/each}
			{#each generalRec as rec}
				<div class="artist-tile">
					<div class="artist-image" />
					<div class="artist-title">
						<h4>Festival</h4>
						<ul>
							<li>
								The festival generally has {ReasonsToMessageMap.LikeSoundsYouLike}:
								<b>{rec.name}</b>
							</li>
						</ul>
					</div>
				</div>
			{/each}

			{#if artistsRec.length + generalRec.length === 0}
				<p class="gray-text">We couldn't find any recommendations :(</p>
			{/if}
		</div>
	</div>

	<div slot="section-right" class="right-container">
		{#if artistsRec.length + generalRec.length >= 3}
			<h4 class="title-approve">We Recommend This Festival!</h4>
			<Tick
				props={{
					height: 150,
					width: 150,
					fill: '#1db954'
				}}
			/>
			<p class="description-approve">
				We think you're going to enjoy this festival! Whether it worths a quarter of your salary or
				not is up to you.
			</p>
		{/if}
		{#if artistsRec.length + generalRec.length < 3}
			<h4 class="title-reject">We Do not Recommend This Festival!</h4>
			<Cross
				props={{
					height: 150,
					width: 150,
					fill: '#b91d1d'
				}}
			/>
			<p class="description-reject">
				It doesn't seem like there are many artists you'll like at this festival (as far as we can
				tell). Consider another one or ask yourself: "Do I really want to hang out with that hot
				person who invited me <i>that</i> much?"
			</p>
		{/if}
	</div>
</Layout>

<style lang="scss">
	.right-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	@media (max-width: 1023px) {
		.right-container,
		.left-container {
			width: 100vw;
			max-height: 50vh;
		}
	}

	.recommendations-container {
		height: 80%;
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow: auto;

		&::-webkit-scrollbar {
			width: 0.5rem;
		}

		&::-webkit-scrollbar-track {
			background: var(--white);
		}

		&::-webkit-scrollbar-thumb {
			background: grey;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: var(--main-color-hover);
		}
	}

	.artist-tile {
		display: flex;
		width: 100%;
		align-items: center;
		padding: 1rem;
		transition: all ease-in-out 100ms;

		&:hover {
			background-color: var(--main-color-hover);
			cursor: pointer;
		}

		text-decoration: none;
	}

	.artist-image {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		margin-right: 1rem;
		background-color: lightgrey;
	}

	.page-title {
		color: white;
		height: 10%;
		width: 100%;
		text-transform: uppercase;
		font-size: 2.5rem;
		font-weight: 600;
		display: flex;
		justify-content: center;
		margin-top: 2rem;
		border-bottom: 5px solid var(--white);

		@media (max-width: 1023px) {
			font-size: 1.5rem;
		}
	}

	.artist-title {
		h4 {
			color: white;
			font-size: 2rem;
		}

		ul {
			background-color: var(--white);
			padding: 1rem 2rem;
			list-style-type: square;

			li {
				color: var(--main-color);
				font-size: 1.1rem;
				margin-bottom: 10px;

				&:last-child {
					margin-bottom: 0;
				}
			}
		}
	}

	.related-item {
		font-weight: 600;
		text-decoration: underline;
	}

	.title-approve {
		color: var(--main-color);
		font-size: 3rem;
		font-weight: 600;
		text-align: center;
		margin-bottom: 2rem;
	}

	.description-approve {
		color: var(--main-color);
		font-size: 1.2rem;
		padding: 1rem;
		text-align: center;
		margin-top: 2rem;
	}

	.title-reject {
		color: var(--error-color);
		font-size: 3rem;
		font-weight: 600;
		text-align: center;
		margin-bottom: 2rem;
	}

	.description-reject {
		color: var(--error-color);
		font-size: 1.2rem;
		padding: 1rem;
		text-align: center;
		margin-top: 2rem;
	}

	.gray-text {
		color: var(--whitesmoke);
		font-size: 1.2rem;
		padding: 1rem;
		margin-top: 2rem;
		text-align: center;
		font-weight: 300;
	}

	@media (max-width: 1023px) {
		.title-reject,
		.title-approve {
			font-size: 1.5rem;
			padding: 5px;
		}

		.right-container,
		.left-container {
			justify-content: unset;
		}

		.description-approve,
		.description-reject {
			font-size: 1rem;
		}
	}
</style>
