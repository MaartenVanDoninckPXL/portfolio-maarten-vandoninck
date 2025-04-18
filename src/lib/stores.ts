import { writable } from 'svelte/store';
import type { Piece } from './models/Piece';
import type { MemoryCard } from './models/MemoryCard';
import type { WordSearchPuzzle } from './models/WordSearch';

export const jigsawCompleted = writable(false);
export const jigsawPieces = writable<Piece[]>([]);
export const jigsawInitialized = writable(false);

export const memoryCompleted = writable(false);
export const memoryCards = writable<MemoryCard[]>([]);
export const memoryInitialized = writable(false);

export const wordSearchCompleted = writable(false);
export const wordSearchPuzzle = writable<WordSearchPuzzle | null>(null);
export const wordSearchInitialized = writable(false);