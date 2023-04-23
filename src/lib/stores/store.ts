import { writable } from 'svelte/store';
import type { GeneralRecommendation, RecommendedArtist } from '../types/types';

export const generalRecommendations = writable([] as GeneralRecommendation[]);
export const artistRecommendations = writable([] as RecommendedArtist[]);
