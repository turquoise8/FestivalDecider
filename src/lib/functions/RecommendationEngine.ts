import type SpotifyWebApi from 'spotify-web-api-js';
import {
	RecomendationReasons,
	type RecommendedArtist,
	type GeneralRecommendation,
	type Artist,
	AudioFeatureAnalysis,
	audioFeatures,
	type AudioFeature,
	ranges
} from '../types/types';

const recommendedArtists: RecommendedArtist[] = [];
const generalRecommendations: GeneralRecommendation[] = [];

let user: SpotifyApi.CurrentUsersProfileResponse;
let userTopArtists: Artist[] = [];
let userTopTracks: SpotifyApi.TrackObjectFull[] = [];
const userTopGenres: { [key: string]: number } = {};

export const getRecommendation = async (
	lineUpArtists: Artist[],
	api: SpotifyWebApi.SpotifyWebApiJs
) => {
	const getUserStatistics = async () => {
		userTopArtists = await api
			.getMyTopArtists({ limit: 10 })
			.then((response) => response.items as Artist[]);

		userTopTracks = await api.getMyTopTracks({ limit: 20 }).then((response) => response.items);

		// Get all genres from top artists
		userTopArtists.map((topArtist) => {
			topArtist.genres.map((genre) => {
				if (!userTopGenres[genre]) {
					userTopGenres[genre] = 1;
				}
				userTopGenres[genre] += 1;
			});
		});
	};

	const findRecommendedFromTopArtists = async () => {
		lineUpArtists.map((lineUpArtist) => {
			userTopArtists.map(async (topArtist) => {
				const similarArtists = await api
					.getArtistRelatedArtists(topArtist.id)
					.then((response) => response.artists as Artist[]);

				similarArtists.map((similarArtist: Artist) => {
					if (similarArtist.id === lineUpArtist.id) {
						const alreadyRecommendedArtist = recommendedArtists.find(
							(artist) => artist.artist.id === similarArtist.id
						);

						if (alreadyRecommendedArtist) {
							alreadyRecommendedArtist.reasons.push({
								code: RecomendationReasons.LikeTopArtist,
								relatedItem: topArtist.name
							});
							return;
						}

						recommendedArtists.push({
							artist: similarArtist,
							reasons: [
								{
									code: RecomendationReasons.LikeTopArtist,
									relatedItem: topArtist.name
								}
							]
						});
					}
				});
			});
		});
	};

	const findRecommendedFromTopTracks = async () => {
		lineUpArtists.map((lineUpArtist) => {
			userTopTracks.map(async (topTrack) => {
				const similarArtists = await api
					.getArtistRelatedArtists(topTrack.artists[0].id)
					.then((response) => response.artists as Artist[]);

				similarArtists.map((similarArtist: Artist) => {
					if (similarArtist.id === lineUpArtist.id) {
						const alreadyRecommendedArtist = recommendedArtists.find(
							(artist) => artist.artist.id === similarArtist.id
						);

						if (alreadyRecommendedArtist) {
							alreadyRecommendedArtist.reasons.push({
								code: RecomendationReasons.LikeArtistFromTopTrack,
								relatedItem: topTrack.artists[0].name
							});
							return;
						} else {
							recommendedArtists.push({
								artist: similarArtist,
								reasons: [
									{
										code: RecomendationReasons.LikeArtistFromTopTrack,
										relatedItem: topTrack.artists[0].name
									}
								]
							});
						}
					}
				});
			});
		});
	};

	const findRecommendedFromTopGenres = async () => {
		lineUpArtists.map((lineUpArtist) => {
			lineUpArtist.genres.map((genre) => {
				if (userTopGenres[genre]) {
					const alreadyRecommendedArtist = recommendedArtists.find(
						(artist) => artist.artist.id === lineUpArtist.id
					);

					if (alreadyRecommendedArtist) {
						alreadyRecommendedArtist.reasons.push({
							code: RecomendationReasons.LikeYourTopGenre,
							relatedItem: genre
						});
						return;
					} else {
						recommendedArtists.push({
							artist: lineUpArtist,
							reasons: [
								{
									code: RecomendationReasons.LikeYourTopGenre,
									relatedItem: genre
								}
							]
						});
					}
				}
			});
		});
	};

	const findRecommendedFromAudioFeatures = async () => {
		const userAudioFeaturesAnalysis = new AudioFeatureAnalysis();
		const lineUpAudioFeaturesAnalysis = new AudioFeatureAnalysis();

		const lineUpSortedByPopularity = lineUpArtists.sort((a, b) => b.popularity - a.popularity);

		// This number is important to calculate the weight of each artist, so we can compare it with the user's audio features
		const noOfArtistsToAnalyse = 5;

		// Get the top artists from line up, get their top tracks, then get those tracks' audio features
		lineUpSortedByPopularity.slice(0, noOfArtistsToAnalyse).forEach(async (artist) => {
			await api
				.getArtistTopTracks(artist.id, user.country)
				.then((response) => response.tracks)
				.then((tracks) =>
					tracks.map(async (track) => {
						await api.getAudioFeaturesForTrack(track.id).then((response) => {
							// We divide each track's audio feature to three ranks: high, medium and low
							// We calculate the frequency of each ranking for each feature by one divided by the number of artists we are analysing
							// This way we can compare the user's audio features with the line up's audio features
							audioFeatures.forEach((feature) => {
								userAudioFeaturesAnalysis[feature].high +=
									response[feature] > 0.7 ? 1 / noOfArtistsToAnalyse : 0;
								userAudioFeaturesAnalysis[feature].medium +=
									response[feature] > 0.3 && response[feature] < 0.7 ? 1 / noOfArtistsToAnalyse : 0;
								userAudioFeaturesAnalysis[feature].low +=
									response[feature] < 0.3 ? 1 / noOfArtistsToAnalyse : 0;
							});

							// We can not include tempo in the audio features array because it is not a number between 0 and 1
							lineUpAudioFeaturesAnalysis.tempo.high +=
								response.tempo > 120 ? 1 / noOfArtistsToAnalyse : 0;
							lineUpAudioFeaturesAnalysis.tempo.medium +=
								response.tempo > 80 && response.tempo < 120 ? 1 / noOfArtistsToAnalyse : 0;
							lineUpAudioFeaturesAnalysis.tempo.low +=
								response.tempo < 80 ? 1 / noOfArtistsToAnalyse : 0;
						});
					})
				);
		});

		const userTopTracksAudioFeatures = await api
			.getAudioFeaturesForTracks(userTopTracks.map((track) => track.id))
			.then((response) => response.audio_features);

		userTopTracksAudioFeatures.forEach((track) => {
			audioFeatures.forEach((feature) => {
				userAudioFeaturesAnalysis[feature].high += track[feature] > 0.7 ? 0.25 : 0;
				userAudioFeaturesAnalysis[feature].medium +=
					track[feature] > 0.3 && track[feature] < 0.7 ? 0.25 : 0;
				userAudioFeaturesAnalysis[feature].low += track[feature] < 0.3 ? 0.25 : 0;
			});

			userAudioFeaturesAnalysis.tempo.high += track.tempo > 120 ? 0.25 : 0;
			userAudioFeaturesAnalysis.tempo.medium += track.tempo > 80 && track.tempo < 120 ? 0.25 : 0;
			userAudioFeaturesAnalysis.tempo.low += track.tempo < 80 ? 0.25 : 0;
		});

		// This number can be decreased to make the comparison more strict
		const stdDev = 3;

		const checkAnalysisSimilarity = (type: AudioFeature) => {
			return ranges.every((range) => {
				if (
					userAudioFeaturesAnalysis[type][range] >
						lineUpAudioFeaturesAnalysis[type][range] - stdDev &&
					userAudioFeaturesAnalysis[type][range] < lineUpAudioFeaturesAnalysis[type][range] + stdDev
				) {
					return true;
				} else {
					return false;
				}
			});
		};

		// Check if the user's audio features are similar to the line up's audio features
		audioFeatures.forEach((feature) => {
			if (checkAnalysisSimilarity(feature)) {
				generalRecommendations.push({
					name: feature
				});
			}
		});
	};

	user = await api.getMe().then((response) => response as SpotifyApi.CurrentUsersProfileResponse);
	await getUserStatistics();

	await findRecommendedFromTopArtists();
	await findRecommendedFromTopTracks();
	await findRecommendedFromTopGenres();
	await findRecommendedFromAudioFeatures();

	return {
		recommendedArtists,
		generalRecommendations
	};
};
