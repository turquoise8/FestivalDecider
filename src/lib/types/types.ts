export type Artist = SpotifyApi.ArtistObjectFull;

export enum RecomendationReasons {
	LikeTopArtist = 'LikeTopArtist',
	LikeArtistFromTopTrack = 'LikeArtistFromTopTrack',
	LikeYourTopGenre = 'LikeYourTopGenre',
	LikeSoundsYouLike = 'LikeSoundsYouLike'
}

export const ReasonsToMessageMap: Record<keyof typeof RecomendationReasons, string> = {
	LikeTopArtist: 'like one of your top artists',
	LikeArtistFromTopTrack: 'like the artist from one of your top tracks',
	LikeYourTopGenre: 'like one of your top genres',
	LikeSoundsYouLike: 'like sounds you love'
};

export type RecommendedArtist = {
	artist: SpotifyApi.ArtistObjectFull;
	reasons: { code: RecomendationReasons; relatedItem: string }[];
};

export type GeneralRecommendation = {
	name: string;
};

export const audioFeatures = ['acousticness', 'danceability', 'energy', 'instrumentalness', 'tempo'] as const;
export type AudioFeature = typeof audioFeatures[number];

export const ranges = ['high', 'medium', 'low'] as const;
export type Range = typeof ranges[number];

export class AudioFeatureAnalysis {
	public acousticness: Record<Range, number>;
	public danceability: Record<Range, number>;
	public energy: Record<Range, number>;
	public instrumentalness: Record<Range, number>;
	public tempo: Record<Range, number>;

	constructor() {
		this.acousticness = {
			high: 0,
			medium: 0,
			low: 0
		};
		this.danceability = {
			high: 0,
			medium: 0,
			low: 0
		};
		this.energy = {
			high: 0,
			medium: 0,
			low: 0
		};
		this.instrumentalness = {
			high: 0,
			medium: 0,
			low: 0
		};
		this.tempo = {
			high: 0,
			medium: 0,
			low: 0
		};
	}
}
