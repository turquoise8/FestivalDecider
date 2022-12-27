import type SpotifyWebApi from 'spotify-web-api-js';

export type Artist = {
	external_urls: {
		spotify: string;
	};
	images: {
		url: string;
		width: number;
		height: number;
	}[];
	name: string;
	popularity: number;
	genres: string[];
	id: string;
};

enum ReccomendationReasons {
	LikeTopArtist = 'LikeTopArtist',
	LikeArtistFromTopTrack = 'LikeArtistFromTopTrack',
	LikeYourTopGenre = 'LikeYourTopGenre',
	LikeSoundsYouLike = 'LikeSoundsYouLike'
}

type RecommendedArtist = {
	artist: Artist | string;
	reasons: { code: ReccomendationReasons; relatedItem: string }[];
};

const recommendedArtists: RecommendedArtist[] = [];
let userTopArtists: Artist[] = [];

export const findRecommendedFromTopArtists = async (
	lineUpArtists: Artist[],
	api: SpotifyWebApi.SpotifyWebApiJs
) => {
	userTopArtists = await api
		.getMyTopArtists({ limit: 5 })
		.then((response) => response.items as Artist[]);

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
							code: ReccomendationReasons.LikeTopArtist,
							relatedItem: topArtist.name
						});
						return;
					}

					recommendedArtists.push({
						artist: similarArtist,
						reasons: [
							{
								code: ReccomendationReasons.LikeTopArtist,
								relatedItem: topArtist.name
							}
						]
					});
				}
			});
		});
	});

	return recommendedArtists;
};

export const findRecommendedFromTopTracks = async (
	lineUpArtists: Artist[],
	api: SpotifyWebApi.SpotifyWebApiJs
) => {
	const userTopTracks = await api.getMyTopTracks({ limit: 5 }).then((response) => response.items);

	lineUpArtists.map((lineUpArtist) => {
		userTopTracks.map(async (topTrack) => {
			const similarArtistsTopTracks = await api
				.getArtistRelatedArtists(topTrack.artists[0].id)
				.then((response) => response.artists as Artist[]);

			similarArtistsTopTracks.map((similarArtist: Artist) => {
				if (similarArtist.id === lineUpArtist.id) {
					const alreadyRecommendedArtist = recommendedArtists.find(
						(artist) => artist.artist.id === similarArtist.id
					);

					if (alreadyRecommendedArtist) {
						alreadyRecommendedArtist.reasons.push({
							code: ReccomendationReasons.LikeArtistFromTopTrack,
							relatedItem: topTrack.artists[0].name
						});
						return;
					} else {
						recommendedArtists.push({
							artist: similarArtist,
							reasons: [
								{
									code: ReccomendationReasons.LikeArtistFromTopTrack,
									relatedItem: topTrack.artists[0].name
								}
							]
						});
					}
				}
			});
		});
	});

	return recommendedArtists;
};

export const findRecommendedFromTopGenres = async (
	lineUpArtists: Artist[],
	api: SpotifyWebApi.SpotifyWebApiJs
) => {
	const userTopGenres: { [key: string]: number } = {};

	if (!userTopArtists.length) {
		userTopArtists = await api
			.getMyTopArtists({ limit: 5 })
			.then((response) => response.items as Artist[]);
	}

	userTopArtists.map((topArtist) => {
		topArtist.genres.map((genre) => {
			if (!userTopGenres[genre]) {
				userTopGenres[genre] = 1;
			}
			userTopGenres[genre] += 1;
		});
	});

	lineUpArtists.map((lineUpArtist) => {
		lineUpArtist.genres.map((genre) => {
			if (userTopGenres[genre]) {
				const alreadyRecommendedArtist = recommendedArtists.find(
					(artist) => artist.artist.id === lineUpArtist.id
				);

				if (alreadyRecommendedArtist) {
					alreadyRecommendedArtist.reasons.push({
						code: ReccomendationReasons.LikeYourTopGenre,
						relatedItem: genre + ' ' + userTopGenres[genre]
					});
					return;
				} else {
					recommendedArtists.push({
						artist: lineUpArtist,
						reasons: [
							{
								code: ReccomendationReasons.LikeYourTopGenre,
								relatedItem: genre + ' ' + userTopGenres[genre]
							}
						]
					});
				}
			}
		});
	});

	return recommendedArtists;
};

export const findRecommendedFromSoundAnalysis = async (
	lineUpArtists: Artist[],
	api: SpotifyWebApi.SpotifyWebApiJs
) => {
	const userAudioFeaturesAnalysis = {
		acousticness: {
			high: 0,
			medium: 0,
			low: 0
		},
		danceability: {
			high: 0,
			medium: 0,
			low: 0
		},
		energy: {
			high: 0,
			medium: 0,
			low: 0
		},
		instrumentalness: {
			high: 0,
			medium: 0,
			low: 0
		},
		tempo: {
			high: 0,
			medium: 0,
			low: 0
		}
	};

	const lineUpAudioFeaturesAnalysis = {
		acousticness: {
			high: 0,
			medium: 0,
			low: 0
		},
		danceability: {
			high: 0,
			medium: 0,
			low: 0
		},
		energy: {
			high: 0,
			medium: 0,
			low: 0
		},
		instrumentalness: {
			high: 0,
			medium: 0,
			low: 0
		},
		tempo: {
			high: 0,
			medium: 0,
			low: 0
		}
	};

	const user = await api.getMe().then((response) => response);
	const userTopTracks = await api.getMyTopTracks({ limit: 20 }).then((response) => response.items);

	const lineUpSortedByPopularity = lineUpArtists.sort((a, b) => b.popularity - a.popularity);

	const noOfArtistsToAnalyse = 5;

	lineUpSortedByPopularity.slice(0, noOfArtistsToAnalyse).forEach(async (artist) => {
		await api
			.getArtistTopTracks(artist.id, user.country)
			.then((response) => response.tracks)
			.then((tracks) =>
				tracks.map(async (track) => {
					await api.getAudioFeaturesForTrack(track.id).then((response) => {
						lineUpAudioFeaturesAnalysis.acousticness.high +=
							response.acousticness > 0.7 ? 1 / noOfArtistsToAnalyse : 0;
						lineUpAudioFeaturesAnalysis.acousticness.medium +=
							response.acousticness > 0.3 && response.acousticness < 0.7
								? 1 / noOfArtistsToAnalyse
								: 0;
						lineUpAudioFeaturesAnalysis.acousticness.low +=
							response.acousticness < 0.3 ? 1 / noOfArtistsToAnalyse : 0;

						lineUpAudioFeaturesAnalysis.danceability.high +=
							response.danceability > 0.7 ? 1 / noOfArtistsToAnalyse : 0;
						lineUpAudioFeaturesAnalysis.danceability.medium +=
							response.danceability > 0.3 && response.danceability < 0.7
								? 1 / noOfArtistsToAnalyse
								: 0;
						lineUpAudioFeaturesAnalysis.danceability.low +=
							response.danceability < 0.3 ? 1 / noOfArtistsToAnalyse : 0;

						lineUpAudioFeaturesAnalysis.energy.high +=
							response.energy > 0.7 ? 1 / noOfArtistsToAnalyse : 0;
						lineUpAudioFeaturesAnalysis.energy.medium +=
							response.energy > 0.3 && response.energy < 0.7 ? 1 / noOfArtistsToAnalyse : 0;
						lineUpAudioFeaturesAnalysis.energy.low +=
							response.energy < 0.3 ? 1 / noOfArtistsToAnalyse : 0;

						lineUpAudioFeaturesAnalysis.instrumentalness.high +=
							response.instrumentalness > 0.7 ? 1 / noOfArtistsToAnalyse : 0;
						lineUpAudioFeaturesAnalysis.instrumentalness.medium +=
							response.instrumentalness > 0.3 && response.instrumentalness < 0.7
								? 1 / noOfArtistsToAnalyse
								: 0;
						lineUpAudioFeaturesAnalysis.instrumentalness.low +=
							response.instrumentalness < 0.3 ? 1 / noOfArtistsToAnalyse : 0;

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
		userAudioFeaturesAnalysis.acousticness.high += track.acousticness > 0.7 ? 0.5 : 0;
		userAudioFeaturesAnalysis.acousticness.medium +=
			track.acousticness > 0.3 && track.acousticness < 0.7 ? 0.5 : 0;
		userAudioFeaturesAnalysis.acousticness.low += track.acousticness < 0.3 ? 0.5 : 0;

		userAudioFeaturesAnalysis.danceability.high += track.danceability > 0.7 ? 0.5 : 0;
		userAudioFeaturesAnalysis.danceability.medium +=
			track.danceability > 0.3 && track.danceability < 0.7 ? 0.5 : 0;
		userAudioFeaturesAnalysis.danceability.low += track.danceability < 0.3 ? 0.5 : 0;

		userAudioFeaturesAnalysis.energy.high += track.energy > 0.7 ? 0.5 : 0;
		userAudioFeaturesAnalysis.energy.medium += track.energy > 0.3 && track.energy < 0.7 ? 0.5 : 0;
		userAudioFeaturesAnalysis.energy.low += track.energy < 0.3 ? 0.5 : 0;

		userAudioFeaturesAnalysis.instrumentalness.high += track.instrumentalness > 0.7 ? 0.5 : 0;
		userAudioFeaturesAnalysis.instrumentalness.medium +=
			track.instrumentalness > 0.3 && track.instrumentalness < 0.7 ? 0.5 : 0;
		userAudioFeaturesAnalysis.instrumentalness.low += track.instrumentalness < 0.3 ? 0.5 : 0;

		userAudioFeaturesAnalysis.tempo.high += track.tempo > 120 ? 0.5 : 0;
		userAudioFeaturesAnalysis.tempo.medium += track.tempo > 80 && track.tempo < 120 ? 0.5 : 0;
		userAudioFeaturesAnalysis.tempo.low += track.tempo < 80 ? 0.5 : 0;
	});

	const stdDev = 5;

	const checkAnalysisSimilarity = (type: keyof typeof userAudioFeaturesAnalysis) => {
		if (
			userAudioFeaturesAnalysis[type].high > lineUpAudioFeaturesAnalysis[type].high - stdDev &&
			userAudioFeaturesAnalysis[type].high < lineUpAudioFeaturesAnalysis[type].high + stdDev &&
			userAudioFeaturesAnalysis[type].medium > lineUpAudioFeaturesAnalysis[type].medium - stdDev &&
			userAudioFeaturesAnalysis[type].medium < lineUpAudioFeaturesAnalysis[type].medium + stdDev &&
			userAudioFeaturesAnalysis[type].low > lineUpAudioFeaturesAnalysis[type].low - stdDev &&
			userAudioFeaturesAnalysis[type].low < lineUpAudioFeaturesAnalysis[type].low + stdDev
		) {
			return true;
		} else {
			return false;
		}
	};

	const results = {
		danceability: checkAnalysisSimilarity('danceability'),
		energy: checkAnalysisSimilarity('energy'),
		acousticness: checkAnalysisSimilarity('acousticness'),
		instrumentalness: checkAnalysisSimilarity('instrumentalness'),
		tempo: checkAnalysisSimilarity('tempo')
	};

	Object.keys(results).forEach((key) => {
		if (results[key as keyof typeof results]) {
			recommendedArtists.push({
				artist: 'festival',
				reasons: [
					{
						code: ReccomendationReasons.LikeSoundsYouLike,
						relatedItem: key
					}
				]
			});
		}
	});

	return recommendedArtists;
};
