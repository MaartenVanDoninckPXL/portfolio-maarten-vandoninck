<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { jigsawCompleted } from '$lib/stores';
	import type { Piece } from '../models/Piece';

	let rows = 4,
		cols = 6;
	let pieces: Piece[] = [];
	let shuffled: Piece[] = [];
	let imagesLoaded = 0;
	let allImagesLoaded = false;

	onMount(() => {
		jigsawCompleted.set(false); // Reset on mount
		pieces = Array.from({ length: rows * cols }, (_, index) => {
			const row = Math.floor(index / cols) + 1;
			const col = (index % cols) + 1;
			const imageUrl = `/jigsaw/row-${row}-column-${col}.jpg`;
			return {
				id: index,
				correctIndex: index,
				imageUrl
			};
		});
		shuffled = [...pieces].sort(() => Math.random() - 0.5);
		checkCompletion(); // Check if solved after shuffle
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

	function handleImageLoad() {
		imagesLoaded++;
		if (imagesLoaded === rows * cols) {
			allImagesLoaded = true;
		}
	}

	function handleImageError(imageUrl: string): void {
		console.error(`Failed to load image: ${imageUrl}`);
	}

	$: gridStyle = `display: grid; grid-template-columns: repeat(${cols}, minmax(0, 1fr)); border: 2px solid #9ca3af; padding: 0.25rem; width: fit-content; margin: 0 auto;`;
</script>

<div style={gridStyle}>
	{#each shuffled as piece, index (piece.id)}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			animate:flip={{ duration: 150 }}
			style="position: relative; display: flex; height: 10rem; width: 10rem; cursor: pointer; align-items: center; justify-content: center; border: 1px solid #d1d5db;{selectedIndex ===
			index
				? ' box-shadow: 0 0 0 4px #3b82f6; z-index: 1;'
				: ''}"
			on:click={() => handlePieceClick(index)}
			role="button"
			tabindex="0"
			aria-label="Jigsaw piece {index + 1}"
		>
			<img
				src={piece.imageUrl}
				alt={`Jigsaw piece ${index + 1}`}
				style="position: absolute; inset: 0; height: 100%; width: 100%; object-fit: cover;"
				on:load={handleImageLoad}
				on:error={() => handleImageError(piece.imageUrl)}
			/>
		</div>
	{/each}
</div>

{#if $jigsawCompleted && allImagesLoaded}
	<div class="mt-4 text-center text-2xl font-bold text-green-600">
		Congratulations! You solved the puzzle!
	</div>
{/if}
