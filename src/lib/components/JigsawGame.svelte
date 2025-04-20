<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { jigsawCompleted, jigsawPieces, jigsawInitialized } from '$lib/stores';
	import type { Piece } from '../models/Piece';
	import { fade, fly, scale } from 'svelte/transition';

	let rows = 4,
		cols = 6;
	let pieces: Piece[] = [];
	let shuffled: Piece[] = [];
	let imagesLoaded = 0;
	let allImagesLoaded = false;
	let visible = false;
	let showCelebration = false;

	const unsubscribe = jigsawPieces.subscribe((value) => {
		if (value && value.length > 0) {
			shuffled = value;
		}
	});

	$: if ($jigsawCompleted && allImagesLoaded) {
		setTimeout(() => {
			showCelebration = true;
		}, 300);
	}

	function loadPuzzleState() {
		try {
			const savedPieces = localStorage.getItem('jigsawPieces');
			const savedCompleted = localStorage.getItem('jigsawCompleted');
			const savedInitialized = localStorage.getItem('jigsawInitialized');

			if (savedPieces) {
				jigsawPieces.set(JSON.parse(savedPieces));
			}

			if (savedCompleted === 'true') {
				jigsawCompleted.set(true);
			}

			if (savedInitialized === 'true') {
				jigsawInitialized.set(true);
			}
		} catch (error) {
			console.error('Error loading puzzle state:', error);
		}
	}

	function savePuzzleState() {
		try {
			localStorage.setItem('jigsawPieces', JSON.stringify($jigsawPieces));
			localStorage.setItem('jigsawCompleted', $jigsawCompleted.toString());
			localStorage.setItem('jigsawInitialized', $jigsawInitialized.toString());
		} catch (error) {
			console.error('Error saving puzzle state:', error);
		}
	}

	onMount(() => {
		visible = true;
		loadPuzzleState();

		if (!$jigsawInitialized) {
			pieces = Array.from({ length: rows * cols }, (_, index) => {
				const row = Math.floor(index / cols) + 1;
				const col = (index % cols) + 1;
				const imageUrl = new URL(
					`${import.meta.env.BASE_URL}/jigsaw/row-${row}-column-${col}.jpg`,
					window.location.origin
				).href;
				return {
					id: index,
					correctIndex: index,
					imageUrl
				};
			});

			shuffled = [...pieces].sort(() => Math.random() - 0.5);
			jigsawPieces.set(shuffled);
			jigsawInitialized.set(true);
			jigsawCompleted.set(false);
			savePuzzleState();
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

<div class="game-wrapper">
	{#if !$jigsawCompleted || !allImagesLoaded}
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
	{:else}
		<div class="completion-container">
			<div class="revealed-content mt-8" in:fade={{ duration: 800, delay: 300 }}>
				<h2 class="mb-4 text-center text-2xl font-bold">Studiereis</h2>

				<h3 class="mt-6 text-xl font-bold" in:fly={{ y: 20, duration: 500, delay: 400 }}>
					Omschrijving
				</h3>
				<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
					De studentenreis naar Linz en Salzburg was erop gericht om studenten kennis te laten maken
					met een internationale IT-omgeving, waarbij zowel professionele als culturele aspecten
					centraal stonden. Zo bezochten we de Fachhochschule Oberösterreich (FH OÖ) of University
					of Applied Sciences Upper Austria in Hagenberg en het Ars Electronica Center in Linz,
					terwijl we ook de stad Salzburg hebben bezocht om Oostenrijk verder te ontdekken. Mijn
					doel voor deze reis was om IT in een ander land en een andere cultuur te ontdekken.
				</p>

				<div class="image-container" in:scale={{ duration: 600, delay: 800, start: 0.9 }}>
					<img
						src="{import.meta.env.BASE_URL}/studiereis/PLX_AEC-min.jpg"
						alt="PXL studenten bij het Ars Electronica Center"
						class="content-image"
					/>
					<p class="image-caption">PXL studenten bij het Ars Electronica Center in Linz</p>
				</div>

				<h3 class="mt-6 text-xl font-bold" in:fly={{ y: 20, duration: 500, delay: 800 }}>Kern</h3>
				<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
					De studentenreis begon vroeg op woensdagochtend 19 maart, toen we in Hasselt opstapten
					voor een lange busrit richting Linz. Na een dag op de weg kwamen we 's avonds aan in het
					Sommerhaus Hotel, gelegen in een studentenwijk op zo'n vijf kilometer van het
					stadscentrum. Deze eerste avond konden we vrij invullen, voor ons bestond dit uit samen
					een plek zoeken om avondeten te eten en rustig de avond eindigen in het hotelcafé met wat
					kaarten.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
					De volgende dag, donderdag 20 maart, stond geheel in het teken van het verkennen van Linz,
					met bijzondere aandacht voor het Ars Electronica Center (AEC). We begonnen de dag met een
					gezamenlijk ontbijt in ons hotel en vertrokken rond negen uur naar het stadscentrum. De
					ochtend konden we vrij besteden aan het verkennen van de stad, waar wij een prachtige
					historische omgeving omgeven door adembenemende natuur ontdekten. Om kwart voor twaalf
					verzamelden wij ons bij het AEC voor een begeleide rondleiding.
				</p>

				<div class="image-container" in:scale={{ duration: 600, delay: 800, start: 0.9 }}>
					<img
						src="{import.meta.env.BASE_URL}/studiereis/AEC.webp"
						alt="Ars Electronica Center"
						class="content-image"
					/>
					<p class="image-caption">Ars Electronica Center in Linz</p>
				</div>

				<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
					Tijdens deze rondleiding werden wij ondergedompeld in een wereld waarin technologie en
					samenleving op een indrukwekkende en originele manier tentoongesteld werden. De
					interactieve installaties boden een uitstekende demonstratie van hoe Virtual en Augmented
					Reality, robotica en creatieve wetenschap elkaar kunnen aanvullen. Deze middag bood mij
					een nieuw perspectief op de rol van technologie, deze is niet enkel praktisch, maar kan
					ook artistieke en sociale dimensies omvatten. Na afloop van de rondleiding hadden we de
					mogelijkheid om langer te blijven om de diverse tentoonstellingen verder te verkennen of
					terug te keren naar de binnenstad. Dit bood ons een waardevolle gelegenheid om het museum
					verder te ontdekken. 's Avonds hadden we opnieuw vrije tijd en konden we lokale
					eetgelegenheden bezoeken om samen de avond af te sluiten.
				</p>

				<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
					Op vrijdag 21 maart richtten we onze blik op het FH OÖ in Hagenberg. Na het ontbijt
					vertrokken we opnieuw met de bus en kregen we bij aankomst verschillende presentaties,
					onder meer over de studie- en onderzoekmogelijkheden en het IM.ma-programma (Interactive
					Media). Er volgde ook een toelichting over de internationale context voor studenten die
					interesse hebben in een uitwisselingsproject. De voormiddag werd afgesloten met een
					campusrondleiding, waarbij duidelijk werd hoeveel aandacht er is voor praktijklokalen,
					labs en projectruimtes.
				</p>

				<div class="image-container" in:scale={{ duration: 600, delay: 800, start: 0.9 }}>
					<img
						src="{import.meta.env.BASE_URL}/studiereis/FHOO.jpg"
						alt="Fachhochschule Oberösterreich"
						class="content-image"
					/>
					<p class="image-caption">Fachhochschule Oberösterreich (FH OÖ) in Hagenberg</p>
				</div>

				<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
					In de namiddag konden we deelnemen aan een workshop. Deze was "Computer Graphics and
					Visualization," waar we samen met een lokale docent/student een applicatie tot stand
					brachten met behulp van AI. Daarna konden we nog verder de tentoonstelling en standjes van
					de lokale studenten verkennen. Dit gaf een beeld dat er veel gelijkenissen zijn tussen
					onze manieren van werken, maar toch enkele interessante verschillen.
				</p>

				<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
					Zaterdag 22 maart bestond uit een culturele uitstap naar Salzburg. Na een rit van enkele
					uren bereikten we rond de middag het centrum van Salzburg, waar we de rest van de dag vrij
					konden invullen. Hier konden we een prachtige historische stad verkennen. Het was
					onmogelijk om alles te verkennen, aangezien het de 2e grootste stad van Oostenrijk is,
					maar wat we konden zien was prachtig. Het contrast tussen de hypermoderne sfeer in Linz en
					het historisch erfgoed van Salzburg kon niet groter zijn, wat de ervaring extra bijzonder
					maakte. We proefden lokale specialiteiten en verkenden bezienswaardigheden zoals de
					Hohensalzburg-fortress en de oever van de Salzach-rivier.
				</p>

				<div class="image-container" in:scale={{ duration: 600, delay: 800, start: 0.9 }}>
					<img
						src="{import.meta.env.BASE_URL}/studiereis/Salzburg.jpg"
						alt="Salzburg stad"
						class="content-image"
					/>
					<p class="image-caption">Historisch centrum van Salzburg</p>
				</div>

				<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
					Op zondag 23 maart keerden we na een vroeg ontbijt terug naar Hasselt. De terugrit was een
					stuk rustiger na een vermoeiende reis, maar toch had je het gevoel dat je de personen die
					om je heen zaten net een beetje beter kenden.
				</p>

				<h3 class="mt-6 text-xl font-bold" in:fly={{ y: 20, duration: 500, delay: 800 }}>
					Reflectie
				</h3>
				<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
					Tijdens deze studiereis heb ik niet alleen nieuwe dingen geleerd, maar ook mijn eigen
					vaardigheden en interesses beter leren kennen. Ik merkte bijvoorbeeld dat taal soms een
					barrière kon vormen, in Linz en Hagenberg sprak men wel Engels, maar alle tekst is
					voorzien voor personen die Duits spreken. Dit dwong me om mijn beperkte kennis van het
					Duits toch eens te benutten of om online tools te gebruiken, dit was natuurlijk niet
					altijd even handig.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
					Bij de rondleidingen en workshops in Hagenberg zag ik hoe onze opleiding Toegepaste
					Informatica sterk aansluit bij wat de FH OÖ aanbiedt. We hebben een vergelijkbare focus op
					praktijkopdrachten en projectwerk. De verschillen zitten in de gespecialiseerde modules,
					zoals Interactive Media, die een andere insteek hadden dan ik gewend ben. Dit vond ik
					bijzonder interessant, omdat het me liet zien dat je met je IT-skills in diverse
					richtingen kunt evolueren, zowel technisch als creatief.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
					Terwijl een situatie waar samenwerking niet direct nodig was zich voordeed, is het toch
					belangrijk om een team te zijn, dit maakt namelijk de reis een veel aangenamere en
					leerzamere ervaring. Achteraf kreeg je dan ook het gevoel dat je elkaar beter begreep en
					kende, wat toekomstige projecten en ervaringen een stuk makkelijker gaat maken.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
					Ik koos voor deze opdracht in mijn portfolio omdat het een mooie mix is van internationale
					ervaring, culturele uitwisseling en professionele oriëntatie. Ik heb ervaren hoe
					verrijkend het is om in een internationale context. Deze reis was voor mij dus een groot
					succes en ik zou het zeker opnieuw doen als ik de kans kreeg.
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

	.jigsaw-grid {
		position: relative;
		z-index: 5;
		transition: opacity 1s ease;
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

	.image-container {
		margin: 2rem 0;
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}

	.content-image {
		width: 100%;
		height: auto;
		display: block;
		transition: transform 0.3s ease;
	}

	.content-image:hover {
		transform: scale(1.02);
	}

	.image-caption {
		padding: 0.75rem;
		text-align: center;
		font-style: italic;
		color: var(--gray);
		background-color: #f9fafb;
		margin-bottom: 0;
	}

	@media (max-width: 768px) {
		.revealed-content {
			padding: 1.5rem;
		}
	}

	@keyframes pulse {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.05);
		}
	}

	@keyframes confetti-fall {
		0% {
			transform: translateY(-5%) rotate(0deg);
			opacity: 1;
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: translateY(1000%) rotate(720deg);
			opacity: 0;
		}
	}

	.revealed-content {
		background-color: white;
		border-radius: 0.5rem;
		padding: 2rem;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		max-width: 90%;
		margin: 0 auto 3rem;
		line-height: 1.6;
		position: relative;
	}

	.revealed-content h2 {
		color: var(--primary);
		margin-bottom: 1rem;
	}

	.completion-container {
		width: 100%;
		position: relative;
		z-index: 10;
	}
</style>
