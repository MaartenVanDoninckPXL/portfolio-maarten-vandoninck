import { writable } from 'svelte/store';
import type { Piece } from './models/Piece';

export const jigsawCompleted = writable(false);
export const jigsawPieces = writable<Piece[]>([]);
export const jigsawInitialized = writable(false);