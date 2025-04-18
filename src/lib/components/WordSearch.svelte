<script lang="ts">
	import { onMount } from 'svelte';
	import { wordSearchCompleted, wordSearchPuzzle, wordSearchInitialized } from '$lib/stores';
	import type { WordSearchCell, WordToFind, WordSearchPuzzle } from '../models/WordSearch';
	import { fade, fly, scale } from 'svelte/transition';

	let grid: WordSearchCell[][] = [];
	let words: WordToFind[] = [];
	let selectedCells: WordSearchCell[] = [];
	let isDragging = false;
	let startCell: WordSearchCell | null = null;
	let endCell: WordSearchCell | null = null;
	let visible = false;

	const size = 12;

	const wordList = [
		'INNOVATIE',
		'DESIGN',
		'PARKEREN',
		'FIGMA',
		'WIREFRAME',
		'PROTOTYPE',
		'CAMPUS',
		'STUDENT'
	];

	const directions = [
		{ dx: 1, dy: 0, name: 'horizontal' },
		{ dx: 0, dy: 1, name: 'vertical' },
		{ dx: 1, dy: 1, name: 'diagonal-down' },
		{ dx: 1, dy: -1, name: 'diagonal-up' },
		{ dx: -1, dy: 0, name: 'horizontal-reverse' },
		{ dx: 0, dy: -1, name: 'vertical-reverse' },
		{ dx: -1, dy: -1, name: 'diagonal-down-reverse' },
		{ dx: -1, dy: 1, name: 'diagonal-up-reverse' }
	];

	const unsubscribe = wordSearchPuzzle.subscribe((value) => {
		if (value) {
			grid = value.grid;
			words = value.words;
			selectedCells = value.selectedCells;
		}
	});

	function generatePuzzle() {
		grid = Array(size)
			.fill(null)
			.map((_, row) =>
				Array(size)
					.fill(null)
					.map((_, col) => ({
						letter: '',
						row,
						col,
						selected: false,
						highlightedForWord: null
					}))
			);

		words = wordList.map((word) => ({
			word,
			found: false
		}));

		words.forEach((wordObj) => {
			placeWord(wordObj);
		});

		for (let row = 0; row < size; row++) {
			for (let col = 0; col < size; col++) {
				if (!grid[row][col].letter) {
					grid[row][col].letter = getRandomLetter();
				}
			}
		}

		wordSearchPuzzle.set({ grid, words, selectedCells: [] });
		wordSearchInitialized.set(true);
	}

	function getRandomLetter() {
		return String.fromCharCode(65 + Math.floor(Math.random() * 26));
	}

	function placeWord(wordObj: WordToFind) {
		const word = wordObj.word;
		let placed = false;
		let attempts = 0;
		const maxAttempts = 100;

		while (!placed && attempts < maxAttempts) {
			attempts++;

			const startRow = Math.floor(Math.random() * size);
			const startCol = Math.floor(Math.random() * size);

			const direction = directions[Math.floor(Math.random() * directions.length)];

			if (canPlaceWord(word, startRow, startCol, direction.dx, direction.dy)) {
				for (let i = 0; i < word.length; i++) {
					const row = startRow + i * direction.dy;
					const col = startCol + i * direction.dx;
					grid[row][col].letter = word[i];
				}

				wordObj.direction = direction.name;
				wordObj.startRow = startRow;
				wordObj.startCol = startCol;
				wordObj.endRow = startRow + (word.length - 1) * direction.dy;
				wordObj.endCol = startCol + (word.length - 1) * direction.dx;

				placed = true;
			}
		}

		if (!placed) {
			console.warn(`Could not place word: ${word}`);
		}
	}

	function canPlaceWord(word: string, startRow: number, startCol: number, dx: number, dy: number) {
		if (
			startRow < 0 ||
			startRow >= size ||
			startCol < 0 ||
			startCol >= size ||
			startRow + (word.length - 1) * dy < 0 ||
			startRow + (word.length - 1) * dy >= size ||
			startCol + (word.length - 1) * dx < 0 ||
			startCol + (word.length - 1) * dx >= size
		) {
			return false;
		}

		for (let i = 0; i < word.length; i++) {
			const row = startRow + i * dy;
			const col = startCol + i * dx;
			const existingLetter = grid[row][col].letter;

			if (existingLetter && existingLetter !== word[i]) {
				return false;
			}
		}

		return true;
	}

	function handleCellMouseDown(cell: WordSearchCell) {
		isDragging = true;
		startCell = cell;

		cell.selected = true;
		grid[cell.row][cell.col] = { ...cell };

		selectedCells = [cell];
	}

	function handleCellMouseEnter(cell: WordSearchCell) {
		if (!isDragging || !startCell) return;

		if (
			cell.row !== startCell.row &&
			cell.col !== startCell.col &&
			Math.abs(cell.row - startCell.row) !== Math.abs(cell.col - startCell.col)
		) {
			return;
		}

		clearSelection();

		if (startCell) {
			startCell.selected = true;
			grid[startCell.row][startCell.col] = { ...startCell };
			selectedCells = [startCell];
		}

		const dx = Math.sign(cell.col - startCell.col);
		const dy = Math.sign(cell.row - startCell.row);
		let currentRow = startCell.row;
		let currentCol = startCell.col;

		while (currentRow !== cell.row || currentCol !== cell.col) {
			currentRow += dy;
			currentCol += dx;
			if (currentRow >= 0 && currentRow < size && currentCol >= 0 && currentCol < size) {
				const currentCell = grid[currentRow][currentCol];
				currentCell.selected = true;
				grid[currentRow][currentCol] = { ...currentCell };
				selectedCells.push(currentCell);
			} else {
				break;
			}
		}

		endCell = cell;
	}

	function handleCellMouseUp(cell: WordSearchCell) {
		if (!isDragging) return;
		isDragging = false;

		checkForWord();

		wordSearchPuzzle.set({ grid, words, selectedCells });

		if (words.every((word) => word.found)) {
			wordSearchCompleted.set(true);
		}
	}

	function toggleCellSelection(cell: WordSearchCell) {
		cell.selected = !cell.selected;
		grid[cell.row][cell.col] = { ...cell };
	}

	function clearSelection() {
		grid.forEach((row) => {
			row.forEach((cell) => {
				if (cell.highlightedForWord === null) {
					cell.selected = false;
				}
			});
		});
		selectedCells = [];
	}

	function checkForWord() {
		if (!startCell || !endCell || selectedCells.length < 2) return;

		let selectedWord = '';
		selectedCells.forEach((cell) => {
			selectedWord += cell.letter;
		});

		let foundWord = words.find(
			(w) =>
				!w.found &&
				(w.word === selectedWord || w.word === selectedWord.split('').reverse().join(''))
		);

		if (foundWord) {
			foundWord.found = true;

			selectedCells.forEach((cell) => {
				const gridCell = grid[cell.row][cell.col];
				gridCell.highlightedForWord = foundWord!.word;
			});
		} else {
			clearSelection();
		}
	}

	function handleGlobalMouseUp() {
		if (isDragging) {
			isDragging = false;
			clearSelection();
		}
	}

	onMount(() => {
		wordSearchCompleted.set(false);
		visible = true;

		if (!$wordSearchInitialized) {
			generatePuzzle();
		} else {
			if ($wordSearchPuzzle && $wordSearchPuzzle.words.every((word) => word.found)) {
				wordSearchCompleted.set(true);
			}
		}

		window.addEventListener('mouseup', handleGlobalMouseUp);

		return () => {
			window.removeEventListener('mouseup', handleGlobalMouseUp);
			unsubscribe();
		};
	});
</script>

<svelte:window on:mouseup={handleGlobalMouseUp} />

<div class="game-wrapper">
	{#if !$wordSearchCompleted}
		<div class="word-search-container">
			<div class="word-list">
				{#each words as word}
					<div class="word-item" class:found={word.found}>
						{word.word}
					</div>
				{/each}
			</div>

			<div class="grid-container">
				<div class="word-search-grid">
					{#each grid as row, rowIndex}
						<div class="grid-row">
							{#each row as cell, colIndex}
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<div
									class="grid-cell"
									class:selected={cell.selected}
									class:highlighted={cell.highlightedForWord !== null}
									on:mousedown={() => handleCellMouseDown(cell)}
									on:mouseenter={() => handleCellMouseEnter(cell)}
									on:mouseup={() => handleCellMouseUp(cell)}
								>
									{cell.letter}
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<div class="completion-container">
			<div class="revealed-content mt-8" in:fade={{ duration: 800, delay: 300 }}>
				<h2 class="mb-4 text-center text-2xl font-bold">Innovatie Route</h2>

				<h3 class="mt-6 text-xl font-bold" in:fly={{ y: 20, duration: 500, delay: 400 }}>
					Inleiding
				</h3>
				<p in:fly={{ y: 20, duration: 500, delay: 500 }}>
					Tijdens de innovatieroute, gegeven door Christoph van Ochten van Appfoundry, kregen we de
					opdracht om een probleem te identificeren waarmee veel studenten geconfronteerd worden, en
					hiervoor een passende UI/UX-oplossing te ontwerpen. In ons geval richtten we ons op het
					vinden van een parkeerplaats aan de hogeschool, een herkenbare frustratie voor studenten.
					Ons uiteindelijke doel was om een parkeerapp te bedenken en te ontwerpen die een overzicht
					geeft van beschikbare parkeerplaatsen, zodat gebruikers tijd en stress zouden besparen.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 550 }}>
					Ikzelf had als persoonlijke doelstelling om mijn denkmethode bij het ontwerpen van UI/UX
					te verbeteren. Ik was nieuwsgierig naar de manier waarop professionals te werk gaan om tot
					een gebruiksvriendelijk en aantrekkelijk design te komen, en wilde deze kennis graag
					toepassen op toekomstige projecten.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 600 }}>
					We werkten in een team van vier studenten, waarbij iedereen zich focuste op UI/UX. De
					innovatieroute was immers volledig gericht op het creatief bedenken en vormgeven van
					digitale oplossingen.
				</p>

				<h3 class="mt-6 text-xl font-bold" in:fly={{ y: 20, duration: 500, delay: 650 }}>Kern</h3>
				<p in:fly={{ y: 20, duration: 500, delay: 700 }}>
					De innovatieroute begon met een inleiding door Christoph van Ochten van Appfoundry, die
					ons liet zien hoe je van een idee naar een concreet UX/UI-ontwerp kunt gaan. Hij
					behandelde de kernstappen: het definiëren van het probleem, het bedenken van oplossingen,
					het uitwerken van wireframes, het opstellen van een designsysteem en het maken van een
					interactief prototype. Dit gaf ons meteen duidelijkheid over wat ons te doen stond.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 750 }}>
					Als eerste stap bepaalden we het concrete probleem. Omdat we allemaal frustratie ervaarden
					rond het vinden van een parkeerplek op de campus, besloten we ons te richten op een
					dynamisch overzicht van beschikbare plaatsen, inclusief een routefunctie om snel naar een
					vrije plek te navigeren. We hielden een brainstorm waarin iedereen afzonderlijk ideeën
					noteerde, die we vervolgens gezamenlijk beoordeelden. Zo kwamen we uit op een concept dat
					zich vooral focust op realtime informatie, zodat gebruikers niet onnodig rondjes hoeven te
					rijden.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
					Daarna zetten we ons in de schoenen van een gebruiker van de app, een student die vaak wat
					krap in de tijd zit en dus niet de tijd heeft om rond te rijden en te zoeken naar een
					vrije parkeerplaats. Door ons in deze situatie te plaatsen, werd al snel duidelijk dat de
					app eenvoudig en to-the-point moest zijn. We willen immers direct weten waar we kunnen
					parkeren, of welke alternatieve locaties beschikbaar zijn bij volle parkeerplaatsen.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 850 }}>
					De volgende stap betrof het creëren van wireframes, kleine schematische illustraties die
					de fundamentele structuur van de applicatie weergeven. We begonnen met een scherm dat het
					aantal beschikbare plaatsen toont, een gedetailleerd overzicht en de mogelijkheid om via
					Google Maps te navigeren. Ieder lid van het team maakte enkele schetsen, welke we
					samenvoegden tot een definitief ontwerp. Vervolgens startten we in Figma met het visuele
					ontwerp en ontwikkelden we een designsysteem bestaande uit kleuren, knoppen en een
					eenvoudig design. Hoewel dit voor ons allen een leerproces was, aangezien wij nog niet
					vaak met Figma hadden gewerkt, bleek het een toegankelijke tool te zijn, vooral nadat we
					de basistechnieken hadden verworven.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 900 }}>
					Tijdens het ontwerpproces voerden wij regelmatig tests uit onderling en bij Christoph.
					Hierdoor ontdekten wij dat bepaalde iconen niet onmiddellijk duidelijk waren of dat de
					positionering van specifieke elementen kon worden verbeterd. Door deze inzichten toe te
					passen, werd de applicatie steeds gebruiksvriendelijker. Uiteindelijk beschikten wij over
					een prototype met klikbare hotspots, waarmee wij een realistische indruk van de
					gebruiksflow konden verschaffen.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 950 }}>
					In de laatste sessie presenteerden we deze versie aan Christoph en onze medestudenten, wat
					positief werd opgenomen. Het heldere overzicht en het consistente design werden vooral
					goed ontvangen.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 1000 }}>
					Door deze innovatieroute besefte ik dat UX/UI-ontwerp veel meer inhoudt dan het maken van
					een mooi scherm. Het draait om de juiste vragen stellen, de behoeften van de gebruiker in
					kaart brengen en die omzetten in een helder concept. Elke stap, van probleemdefiniëring
					tot het eindprototype, is van belang om tot een samenhangende oplossing te komen. Dankzij
					de focus op feedback en iteratie konden we binnen korte tijd een werkbaar prototype
					neerzetten, wat voor mij bewijst dat een doordacht proces en gebruikersgericht denken de
					sleutel zijn tot succes.
				</p>

				<h3 class="mt-6 text-xl font-bold" in:fly={{ y: 20, duration: 500, delay: 1050 }}>
					Reflectie
				</h3>
				<p in:fly={{ y: 20, duration: 500, delay: 1100 }}>
					Terugkijkend op de innovatieroute die we hebben afgelegd bij het ontwikkelen van een
					parkeerapp, realiseer ik me hoezeer mijn perspectief op UI/UX-ontwerp is veranderd.
					Voorheen concentreerde ik mij voornamelijk op het creëren van een aantrekkelijk scherm,
					maar inmiddels begrijp ik dat een degelijk ontwerpproces begint met het stellen van de
					juiste vragen en het grondig begrijpen van de doelgroep waarvoor men ontwerpt. Door ons in
					te leven in de gebruiker werd duidelijk wat onze vereisten waren: wat hebben we nodig,
					onder welke omstandigheden opereren we, en hoe zullen we de app daadwerkelijk gebruiken?
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 1150 }}>
					Een aanzienlijk obstakel was onze beperkte ervaring met Figma. In het begin maakten we
					vaak omwegen omdat we niet alle functionaliteiten goed beheersden. Desondanks bleek deze
					uitdaging leerzaam: gaandeweg ontdekten we hoe we componenten, bibliotheken en diverse
					schermen konden creëren en integreren. Daarnaast realiseerde ik me dat effectieve
					communicatie met teamleden essentieel is voor het bereiken van een consistent en bruikbaar
					ontwerp. Wanneer bijvoorbeeld iemand een specifiek icoon toevoegde, was het erg nuttig dat
					iedereen wist waar dit icoon te vinden was binnen onze gedeelde designbibliotheek.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 1200 }}>
					Ik leerde dat mijn sterke punt ligt in het ontwerpen van een mooi design, maar soms kan
					een mooi design de gebruikerservaring tegenwerken. Daarom was het belangrijk om een balans
					te vinden tussen UI/UX. Ik kies deze opdracht voor mijn portfolio omdat het een mooi
					voorbeeld is van hoe je een praktijkgericht vraagstuk kunt aanpakken met UI/UX-technieken,
					en hoe feedback en iteratie leiden tot een beter eindresultaat. Het is namelijk ook een
					onderwerp dat ik zelf interessant vind.
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.game-wrapper {
		position: relative;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.word-search-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
	}

	.word-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background-color: #f3f4f6;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		width: 100%;
	}

	.word-item {
		padding: 0.5rem 1rem;
		background-color: white;
		border-radius: 0.5rem;
		font-weight: bold;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.word-item.found {
		background-color: var(--secondary);
		color: white;
		text-decoration: line-through;
		transform: scale(1.05);
	}

	.grid-container {
		padding: 1.5rem;
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		max-width: 100%;
		overflow-x: auto;
	}

	.word-search-grid {
		display: flex;
		flex-direction: column;
		gap: 2px;
		user-select: none;
		-webkit-user-select: none;
	}

	.grid-row {
		display: flex;
		gap: 2px;
	}

	.grid-cell {
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f9fafb;
		border-radius: 0.25rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.15s ease-in-out;
	}

	.grid-cell:hover {
		background-color: #e5e7eb;
	}

	.grid-cell.selected {
		background-color: var(--primary);
		color: white;
		transform: scale(1.05);
		z-index: 5;
	}

	.grid-cell.highlighted {
		background-color: var(--secondary);
		color: white;
	}

	.revealed-content {
		background-color: white;
		border-radius: 0.5rem;
		padding: 2rem;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		max-width: 90%;
		margin: 0 auto 3rem;
		line-height: 1.6;
	}

	.revealed-content h2 {
		color: var(--primary);
		margin-bottom: 1rem;
	}

	.revealed-content h3 {
		color: var(--secondary);
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}

	.revealed-content p {
		margin-bottom: 1rem;
		text-align: justify;
	}

	.completion-container {
		width: 100%;
		position: relative;
		z-index: 10;
	}

	@media (max-width: 768px) {
		.word-item {
			padding: 0.4rem 0.8rem;
			font-size: 0.9rem;
		}

		.grid-cell {
			width: 2rem;
			height: 2rem;
			font-size: 0.9rem;
		}

		.revealed-content {
			padding: 1.5rem;
		}
	}

	@media (max-width: 480px) {
		.word-item {
			padding: 0.3rem 0.6rem;
			font-size: 0.8rem;
		}

		.grid-cell {
			width: 1.8rem;
			height: 1.8rem;
			font-size: 0.8rem;
		}
	}
</style>
