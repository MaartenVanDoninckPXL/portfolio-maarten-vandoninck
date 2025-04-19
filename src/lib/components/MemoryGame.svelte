<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { memoryCompleted, memoryCards, memoryInitialized } from '$lib/stores';
	import type { MemoryCard } from '../models/MemoryCard';
	import { fade, fly, scale } from 'svelte/transition';

	let gridSize = 16;
	let cards: MemoryCard[] = [];
	let shuffledCards: MemoryCard[] = [];
	let imagesLoaded = 0;
	let allImagesLoaded = true;
	let visible = false;

	let flippedCards: number[] = [];
	let canFlip = true;
	let matchedPairs = 0;
	let totalPairs = 8;

	const unsubscribe = memoryCards.subscribe((value) => {
		if (value && value.length > 0) {
			shuffledCards = value;
		}
	});

	onMount(() => {
		memoryCompleted.set(false);
		visible = true;

		if (!$memoryInitialized) {
			const cardValues = ['💻', '🖥️', '⌨️', '📱', '💾', '🌐', '🔒', '⚙️'];
			cards = [];

			cardValues.forEach((value, index) => {
				cards.push({
					id: index * 2,
					value: value,
					isMatched: false,
					isFlipped: false
				});

				cards.push({
					id: index * 2 + 1,
					value: value,
					isMatched: false,
					isFlipped: false
				});
			});

			shuffledCards = [...cards].sort(() => Math.random() - 0.5);
			memoryCards.set(shuffledCards);
			memoryInitialized.set(true);
		} else {
			shuffledCards = $memoryCards;
			matchedPairs = shuffledCards.filter((card) => card.isMatched).length / 2;

			if (matchedPairs === totalPairs) {
				memoryCompleted.set(true);
			}
		}

		return () => {
			unsubscribe();
		};
	});

	function handleCardClick(index: number) {
		if (!canFlip || shuffledCards[index].isMatched || shuffledCards[index].isFlipped) {
			return;
		}

		shuffledCards[index].isFlipped = true;
		flippedCards.push(index);
		shuffledCards = [...shuffledCards];
		memoryCards.set(shuffledCards);

		if (flippedCards.length === 2) {
			canFlip = false;

			const [firstIndex, secondIndex] = flippedCards;
			const firstCard = shuffledCards[firstIndex];
			const secondCard = shuffledCards[secondIndex];

			if (firstCard.value === secondCard.value) {
				setTimeout(() => {
					shuffledCards[firstIndex].isMatched = true;
					shuffledCards[secondIndex].isMatched = true;
					matchedPairs++;

					if (matchedPairs === totalPairs) {
						memoryCompleted.set(true);
					}

					flippedCards = [];
					canFlip = true;

					shuffledCards = [...shuffledCards];
					memoryCards.set(shuffledCards);
				}, 500);
			} else {
				setTimeout(() => {
					shuffledCards[firstIndex].isFlipped = false;
					shuffledCards[secondIndex].isFlipped = false;
					flippedCards = [];
					canFlip = true;

					shuffledCards = [...shuffledCards];
					memoryCards.set(shuffledCards);
				}, 1000);
			}
		}
	}

	$: gridStyle = `
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.75rem;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
    `;
</script>

<div class="game-wrapper">
	{#if !$memoryCompleted}
		<div style={gridStyle} class="memory-grid">
			{#each shuffledCards as card, index (card.id)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div
					class="memory-card"
					class:flipped={card.isFlipped}
					class:matched={card.isMatched}
					on:click={() => handleCardClick(index)}
					animate:flip={{ duration: 150 }}
					role="button"
					tabindex="0"
					aria-label="Memory card {index + 1}"
				>
					<div class="card-inner">
						<div class="card-front"></div>
						<div class="card-back">{card.value}</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="completion-container">
			<div class="revealed-content mt-8" in:fade={{ duration: 800, delay: 300 }}>
				<h2 class="mb-4 text-center text-2xl font-bold">Hackathon</h2>

				<h3 class="mt-6 text-xl font-bold" in:fly={{ y: 20, duration: 500, delay: 400 }}>
					Omschrijving
				</h3>
				<p in:fly={{ y: 20, duration: 500, delay: 500 }}>
					De hackathon vond plaats op 10 en 11 februari in Corda Campus (Corda 7). De algemene
					doelstelling was om in kleine teams een applicatie te ontwikkelen die een maatschappelijk
					probleem aanpakt. In mijn geval ging het om het bouwen van de WeRK-app, een toepassing
					gericht op een efficiëntere terugkeer naar het werk voor personen die tijdelijk uit de
					arbeidsmarkt zijn, bijvoorbeeld door ziekte of een ongeval. Mijn persoonlijke doelstelling
					was om de volledige ontwikkelcyclus van zo'n app op korte tijd te doorlopen, van
					conceptontwikkeling en UX-design tot het programmeren van een werkende demo.
				</p>

				<h3 class="mt-6 text-xl font-bold" in:fly={{ y: 20, duration: 500, delay: 550 }}>Kern</h3>
				<p in:fly={{ y: 20, duration: 500, delay: 600 }}>
					De hackathon begon op maandagochtend 10 februari met een korte introductie door de
					organisatie. We leerden dat we twee dagen de tijd zouden hebben om een werkend prototype
					te bouwen van de WeRK-app, een idee dat tot doel had om mensen te ondersteunen bij hun
					terugkeer naar het werk na een periode van inactiviteit. De uitdaging lag in het feit dat
					we met een beperkt team in een korte tijdspanne een intuïtieve en stabiele applicatie
					wilden opleveren.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 650 }}>
					Wij begonnen de dag met een brainstormsessie, waarin wij de essentiële functionaliteiten
					in kaart brachten. Er waren tal van benodigde functionaliteiten, waardoor het noodzakelijk
					was om eerst te bepalen of wij veel functionaliteiten met beperkte uitwerking wilden
					ontwikkelen, of enkele functionaliteiten met meer focus. Uiteindelijk hebben wij gekozen
					voor de tweede optie, wij hebben twee functionaliteiten geselecteerd en deze meer aandacht
					gegeven. Wij waren van mening dat dit voordeliger zou zijn dan meerdere snel gerealiseerde
					functionaliteiten. De keuze viel op een timeline-functie om de voortgang te volgen en een
					methode om stappen toe te voegen.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 700 }}>
					Aangezien wij binnen twee dagen resultaat wilden presenteren, besloten wij gebruik te
					maken van een platform waarmee wij vertrouwd zijn en waarop wij snel functionaliteit
					kunnen implementeren. Daarom kozen wij voor het webframework Vue.js in combinatie met de
					light weight database MariaDB.
				</p>

				<div class="logos-container" in:scale={{ duration: 600, delay: 800, start: 0.9 }}>
					<div class="logo-item">
						<img src="/hackathon/Vue_js_logo.png" alt="Vue.js Logo" class="logo-image" />
						<p class="image-caption">
							Vue.js werd gebruikt als front-end framework voor de applicatie
						</p>
					</div>

					<div class="logo-item">
						<img src="/hackathon/mariadb_logo.png" alt="MariaDB Logo" class="logo-image" />
						<p class="image-caption">MariaDB werd gebruikt als lichtgewicht database-oplossing</p>
					</div>
				</div>

				<p in:fly={{ y: 20, duration: 500, delay: 750 }}>
					Mijn voornaamste taak bestond uit het ontwerpen en implementeren van de time-line
					functionaliteit. Sinds we maar met 2 applicatieontwikkelaars zaten in onze groep en het
					nogal een applicatieontwikkeling gerichte hackathon was, moest ook de bulk van de
					implementatie van ons komen. Ik begon met het opzoeken van tijdlijnen op het internet om
					inspiratie op te doen. Hierna schetste ik een paar mockups over hoe we het gingen
					implementeren in deze applicatie.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
					Nadat we onze twee belangrijkste functionaliteiten hadden gedefinieerd en de eerste
					mockups voor de tijdlijn klaar waren, gingen we op de eerste dag ook meteen aan de slag
					met het opzetten van de basisstructuur en de database in onze Vue.js-omgeving met MariaDB.
					We overlegden regelmatig over de manier waarop data door de applicatie zou stromen, zodat
					de front-end en de back-end goed op elkaar aansloten. Aan het einde van deze eerste dag
					hadden we een goed begin met een algemene startpagina en een start aan de implementaties.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 850 }}>
					Op de tweede dag zijn we verdergegaan met de twee functionaliteiten. Terwijl ik in Vue.js
					de tijdlijncomponent verfijnde, werkte mijn mede applicatieontwikkelaar aan de
					functionaliteit om nieuwe stappen toe te voegen en bestaande stappen te bewerken.
					Tussendoor hielpen we elkaar regelmatig om bugs op te lossen of de dataflow op elkaar af
					te stemmen. Dit was heel zinvol, want telkens als iemand vastliep, kon de ander snel
					bijspringen met suggesties. Wat zeer belangrijk was om tot een goed resultaat te komen.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 900 }}>
					Tegen het einde van de tweede dag hadden we een demo klaarliggen die we met trots konden
					tonen. Gebruikers konden zich aanmelden, een persoonlijke tijdlijn zien en nieuwe stappen
					toevoegen die hun re-integratieproces visualiseerden. Hoewel we in deze korte periode niet
					alles tot in de puntjes konden perfectioneren, hadden we wel een degelijk basisprototype.
					Tijdens de afsluitende presentatie kregen we positieve feedback van zowel medestudenten
					als juryleden, die onze functionaliteiten er zeer professioneel en gebruiksvriendelijk uit
					vonden zien.
				</p>

				<h3 class="mt-6 text-xl font-bold" in:fly={{ y: 20, duration: 500, delay: 950 }}>
					Reflectie
				</h3>
				<p in:fly={{ y: 20, duration: 500, delay: 1000 }}>
					De hackathon vormde voor mij een intensieve, maar uiterst waardevolle ervaring. Gedurende
					slechts twee dagen diende ik, samen met een andere ontwikkelaar, een functioneel prototype
					van de WeRK-app op te leveren. Mijn voornaamste verantwoordelijkheid bestond uit het
					ontwerpen en implementeren van de tijdlijnfunctie, die gebruikers in staat stelt hun
					re-integratieproces te visualiseren. Door te beginnen met een brainstormsessie konden wij
					de meest essentiële onderdelen identificeren en onze aandacht verdelen over twee
					kernfunctionaliteiten. Het resultaat hiervan was dat wij efficiënter konden werken en een
					degelijk basisniveau bereikten, in plaats van ons te verliezen in talrijke kleine functies
					en uiteindelijk een minder mooi resultaat te krijgen.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 1050 }}>
					Natuurlijk stuitten wij ook op verschillende obstakels, vooral in de communicatie tussen
					de frontend in Vue.js en de database in MariaDB. In deze momenten realiseerde ik me hoe
					belangrijk het is om regelmatig overleg te plegen en gezamenlijk bugs op te lossen.
					Telkens wanneer iemand vastliep, konden we snel elkaars hulp inschakelen, dit zorgde niet
					alleen voor minder problemen maar zorgde ook voor een betere samenwerking binnen het team.
					Dit heb ik als zeer positief ervaren, aangezien het onze samenwerking versterkte en ons
					hielp om snel vooruitgang te boeken.
				</p>
				<p in:fly={{ y: 20, duration: 500, delay: 1100 }}>
					Ik heb geleerd hoe cruciaal het is om gedurende de beperkte tijd van een hackathon een
					duidelijke focus te behouden. Het prioriteren van de belangrijkste functionaliteiten, in
					ons geval de tijdlijn en de mogelijkheid om stappen toe te voegen, bleek achteraf gezien
					een verstandige keuze. Tegelijkertijd besef ik dat ik soms te lang kan blijven hangen in
					bepaalde details.
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

	.memory-grid {
		position: relative;
		z-index: 5;
		transition: opacity 1s ease;
		aspect-ratio: 1;
		padding: 1rem;
	}

	.memory-card {
		position: relative;
		height: 0;
		padding-bottom: 100%;
		cursor: pointer;
		perspective: 1000px;
	}

	.card-inner {
		position: absolute;
		width: 100%;
		height: 100%;
		transition: transform 0.6s;
		transform-style: preserve-3d;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.memory-card.flipped .card-inner {
		transform: rotateY(180deg);
	}

	.memory-card.matched .card-inner {
		transform: rotateY(180deg);
		box-shadow: 0 0 0 2px var(--secondary);
	}

	.card-front,
	.card-back {
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2.5rem;
		font-weight: bold;
	}

	.card-front {
		background-color: var(--primary);
		background-image: linear-gradient(
			45deg,
			var(--primary) 25%,
			var(--primary-dark) 25%,
			var(--primary-dark) 50%,
			var(--primary) 50%,
			var(--primary) 75%,
			var(--primary-dark) 75%,
			var(--primary-dark)
		);
		background-size: 56px 56px;
		color: white;
	}

	.card-back {
		background-color: white;
		color: var(--dark);
		transform: rotateY(180deg);
		border: 2px solid var(--gray-light);
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

	.logos-container {
		display: flex;
		justify-content: space-around;
		gap: 1.5rem;
		margin: 1.5rem auto;
		max-width: 700px;
	}

	.logo-item {
		flex: 1;
		text-align: center;
		background-color: white;
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
		padding: 1rem;
		transition: transform 0.3s ease;
	}

	.logo-item:hover {
		transform: translateY(-5px);
	}

	.logo-image {
		width: 60%;
		height: auto;
		margin: 1.5rem auto;
		display: block;
		transition: transform 0.3s ease;
	}

	.logo-image:hover {
		transform: scale(1.05);
	}

	@media (max-width: 768px) {
		.revealed-content {
			padding: 1.5rem;
		}

		.memory-grid {
			gap: 0.5rem;
		}

		.card-front,
		.card-back {
			font-size: 2rem;
		}
	}
</style>
