<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { jigsawCompleted, jigsawPieces, jigsawInitialized } from '$lib/stores';
	import type { Piece } from '../models/Piece';

	let rows = 4,
		cols = 6;
	let pieces: Piece[] = [];
	let shuffled: Piece[] = [];
	let imagesLoaded = 0;
	let allImagesLoaded = false;
	let containerWidth: number;

	const unsubscribe = jigsawPieces.subscribe((value) => {
		if (value && value.length > 0) {
			shuffled = value;
		}
	});

	onMount(() => {
		jigsawCompleted.set(false);

		if (!$jigsawInitialized) {
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
			jigsawPieces.set(shuffled);
			jigsawInitialized.set(true);
		} else {
			shuffled = $jigsawPieces;
		}

		checkCompletion();

		return () => {
			unsubscribe();
		};
	});

	function swapPieces(i: number, j: number) {
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		shuffled = shuffled;
		jigsawPieces.set(shuffled);
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

	$: gridStyle = `
        display: grid; 
        grid-template-columns: repeat(${cols}, minmax(0, 1fr));
        border: 2px solid #9ca3af;
        padding: 0.25rem;
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
    `;
</script>

<div style={gridStyle} class="jigsaw-grid">
	{#each shuffled as piece, index (piece.id)}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			animate:flip={{ duration: 150 }}
			class="puzzle-piece"
			class:selected={selectedIndex === index}
			on:click={() => handlePieceClick(index)}
			role="button"
			tabindex="0"
			aria-label="Jigsaw piece {index + 1}"
		>
			<img
				src={piece.imageUrl}
				alt={`Jigsaw piece ${index + 1}`}
				class="piece-image"
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

<style>
	.jigsaw-grid {
		aspect-ratio: 1.5 / 1;
	}

	.puzzle-piece {
		position: relative;
		display: flex;
		aspect-ratio: 1;
		cursor: pointer;
		align-items: center;
		justify-content: center;
		border: 1px solid #d1d5db;
		transition:
			box-shadow 0.15s ease-in-out,
			transform 0.15s ease-in-out;
	}

	.puzzle-piece.selected {
		box-shadow: 0 0 0 4px var(--primary);
		z-index: 1;
		transform: scale(1.02);
	}

	.puzzle-piece:hover:not(.selected) {
		box-shadow: 0 0 0 2px var(--secondary);
		z-index: 1;
	}

	.piece-image {
		position: absolute;
		inset: 0;
		height: 100%;
		width: 100%;
		object-fit: cover;
	}

	@media (max-width: 768px) {
		.jigsaw-grid {
			max-width: 95%;
		}
	}
</style>
