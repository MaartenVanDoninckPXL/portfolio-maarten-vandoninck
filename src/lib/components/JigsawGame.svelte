<script lang="ts">
	import { onMount } from 'svelte';
	import { jigsawCompleted } from '$lib/stores';
	import type { Piece } from '../models/Piece';

	let rows = 4,
		cols = 6;
	let pieces: Piece[] = [];
	let shuffled: Piece[] = [];

	onMount(() => {
		pieces = Array.from({ length: rows * cols }, (_, index) => {
			const row = Math.floor(index / cols) + 1;
			const col = (index % cols) + 1;
			return {
				id: index,
				correctIndex: index,
				imageUrl: `/jigsaw/row-${row}-column-${col}.jpg`
			};
		});
		shuffled = [...pieces].sort(() => Math.random() - 0.5);
	});

	function swapPieces(i: number, j: number) {
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		shuffled = shuffled;
		checkCompletion();
	}

	function checkCompletion() {
		const solved = shuffled.every((piece, idx) => piece.correctIndex === idx);
		if (solved) {
			jigsawCompleted.set(true);
		}
	}

	let selectedIndex: number | null = null;

	function handlePieceClick(index: number) {
		if (selectedIndex === null) {
			selectedIndex = index;
		} else {
			if (selectedIndex !== index) {
				swapPieces(selectedIndex, index);
			}
			selectedIndex = null;
		}
	}
</script>

<div class="grid grid-cols-{cols} mx-auto w-max select-none gap-1 border-2 border-gray-400 p-1">
	{#each shuffled as piece, index}
		<div
			class="h-24 w-24 cursor-pointer border border-gray-300 bg-cover bg-center {selectedIndex ===
			index
				? 'ring-2 ring-blue-500'
				: ''}"
			style="background-image: url('{piece.imageUrl}');"
			on:click={() => handlePieceClick(index)}
			role="button"
			tabindex="0"
			aria-label="Jigsaw piece {index + 1}"
		></div>
	{/each}
</div>

{#if $jigsawCompleted}
	<div class="mt-4 text-center text-2xl font-bold text-green-600">
		Congratulations! You solved the puzzle!
	</div>
{/if}
