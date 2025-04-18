<script lang="ts">
	import JigsawGame from '$lib/components/JigsawGame.svelte';
	import MemoryGame from '$lib/components/MemoryGame.svelte';
	import WordSearch from '$lib/components/WordSearch.svelte';
	import { jigsawCompleted, memoryCompleted, wordSearchCompleted } from '$lib/stores';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let visible = false;
	let mouseX = 0;
	let mouseY = 0;
	let showFullStudiereisContent = false;
	let showFullHackathonContent = false;
	let showFullInnovationContent = false;

	function handleMouseMove(event: MouseEvent) {
		mouseX = event.clientX / window.innerWidth;
		mouseY = event.clientY / window.innerHeight;
	}

	function toggleStudiereisContent() {
		showFullStudiereisContent = !showFullStudiereisContent;
	}

	function toggleHackathonContent() {
		showFullHackathonContent = !showFullHackathonContent;
	}

	function toggleInnovationContent() {
		showFullInnovationContent = !showFullInnovationContent;
	}

	onMount(() => {
		visible = true;
		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<svelte:head>
	<title>Maarten Van Doninck | Portfolio</title>
	<meta
		name="description"
		content="ITalent Portfolio of Maarten Van Doninck - PXL Projects and Skills"
	/>
</svelte:head>

<div class="hero-background" style="--mouse-x: {mouseX}; --mouse-y: {mouseY}">
	<div class="bg-shape shape1"></div>
	<div class="bg-shape shape2"></div>
	<div class="bg-shape shape3"></div>
	<div class="bg-shape shape4"></div>
	<div class="bg-shape shape5"></div>

	<div class="container relative z-10 mx-auto my-5">
		{#if visible}
			<header class="mb-12 text-center" in:fade={{ duration: 800 }}>
				<div class="title-container">
					<h1 class="gradient-text text-5xl font-bold">Portfolio Maarten Van Doninck</h1>
					<div class="title-decoration"></div>
				</div>
				<p class="mt-4 text-xl text-gray-600">ITalent 2024-2025</p>
			</header>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<div class="animated-card" in:fly={{ x: -20, duration: 800, delay: 600 }}>
					<div class="card-body">
						<h2 class="card-title mb-4 text-2xl font-bold">Welcome to my Portfolio</h2>
						<p class="mb-3">
							This portfolio showcases my projects and skills developed during my ITalent trajectory
							at PXL.
						</p>
						<p class="mb-3">
							Explore the different sections to learn more about my work, or try out the interactive
							games I've created.
						</p>
						<p>The portfolio demonstrates my skills in:</p>
						<ul class="skill-list">
							<li>SvelteKit development</li>
							<li>TypeScript programming</li>
							<li>Responsive design</li>
							<li>Interactive web applications</li>
						</ul>
					</div>
				</div>

				<div class="animated-card" in:fly={{ x: 20, duration: 800, delay: 900 }}>
					<div class="card-body">
						<h2 class="card-title mb-4 text-2xl font-bold">Jigsaw Puzzle Game</h2>
						<p class="mb-4">
							Try out this interactive jigsaw puzzle! Click on pieces to select them, then click on
							another piece to swap their positions. Can you solve it?
						</p>

						<div class="game-instructions mb-4">
							<h3 class="mb-2 text-lg font-semibold">How to play:</h3>
							<ol class="ml-6 list-decimal">
								<li>Click on a piece to select it</li>
								<li>Click on another piece to swap positions</li>
								<li>Continue until the image is complete</li>
							</ol>
						</div>

						<div class="game-container">
							<div class="game-wrapper" class:expanded={showFullStudiereisContent}>
								<JigsawGame />
								{#if $jigsawCompleted}
									<div class="content-fade-overlay" class:hidden={showFullStudiereisContent}>
										<button class="toggle-content-btn" on:click={toggleStudiereisContent}>
											Show full story
										</button>
									</div>
									{#if showFullStudiereisContent}
										<div class="content-footer">
											<button class="toggle-content-btn" on:click={toggleStudiereisContent}>
												Hide content
											</button>
										</div>
									{/if}
								{/if}
							</div>
						</div>
						<div class="mt-4 text-center">
							<a href="/games/jigsaw" class="play-link">Play full screen version →</a>
						</div>
					</div>
				</div>

				<div class="animated-card" in:fly={{ x: -20, duration: 800, delay: 1200 }}>
					<div class="card-body">
						<h2 class="card-title mb-4 text-2xl font-bold">Memory Game</h2>
						<p class="mb-4">
							Test your memory with this matching card game! Click on cards to flip them and find
							matching pairs. Can you match all the cards?
						</p>

						<div class="game-instructions mb-4">
							<h3 class="mb-2 text-lg font-semibold">How to play:</h3>
							<ol class="ml-6 list-decimal">
								<li>Click on a card to flip it</li>
								<li>Find matching pairs of cards</li>
								<li>Match all pairs to complete the game</li>
							</ol>
						</div>

						<div class="game-container">
							<div class="game-wrapper" class:expanded={showFullHackathonContent}>
								<MemoryGame />
								{#if $memoryCompleted}
									<div class="content-fade-overlay" class:hidden={showFullHackathonContent}>
										<button class="toggle-content-btn" on:click={toggleHackathonContent}>
											Show full story
										</button>
									</div>
									{#if showFullHackathonContent}
										<div class="content-footer">
											<button class="toggle-content-btn" on:click={toggleHackathonContent}>
												Hide content
											</button>
										</div>
									{/if}
								{/if}
							</div>
						</div>
						<div class="mt-4 text-center">
							<a href="/games/memory" class="play-link">Play full screen version →</a>
						</div>
					</div>
				</div>

				<div class="animated-card" in:fly={{ x: 20, duration: 800, delay: 1500 }}>
					<div class="card-body">
						<h2 class="card-title mb-4 text-2xl font-bold">Word Search Puzzle</h2>
						<p class="mb-4">
							Challenge your word-finding skills with this interactive word search! Find words
							related to innovation and design hidden in the grid. Can you find them all?
						</p>

						<div class="game-instructions mb-4">
							<h3 class="mb-2 text-lg font-semibold">How to play:</h3>
							<ol class="ml-6 list-decimal">
								<li>Find words from the list in the grid</li>
								<li>Click and drag to select letters</li>
								<li>Words can run in any direction</li>
								<li>Find all words to complete the puzzle</li>
							</ol>
						</div>

						<div class="game-container">
							<div class="game-wrapper" class:expanded={showFullInnovationContent}>
								<WordSearch />
								{#if $wordSearchCompleted}
									<div class="content-fade-overlay" class:hidden={showFullInnovationContent}>
										<button class="toggle-content-btn" on:click={toggleInnovationContent}>
											Show full story
										</button>
									</div>
									{#if showFullInnovationContent}
										<div class="content-footer">
											<button class="toggle-content-btn" on:click={toggleInnovationContent}>
												Hide content
											</button>
										</div>
									{/if}
								{/if}
							</div>
						</div>
						<div class="mt-4 text-center">
							<a href="/games/wordsearch" class="play-link">Play full screen version →</a>
						</div>
					</div>
				</div>

				{#if ($jigsawCompleted || $memoryCompleted || $wordSearchCompleted) && !($jigsawCompleted && $memoryCompleted && $wordSearchCompleted)}
					<div class="col-span-full" in:fade={{ duration: 800, delay: 300 }}>
						<div class="animated-card final-reflection-teaser">
							<div class="card-body">
								<h2
									class="card-title mb-4 text-2xl font-bold"
									in:fly={{ y: 20, duration: 500, delay: 400 }}
								>
									Unlocking Eindreflectie...
								</h2>

								<div class="progress-container">
									<div
										class="progress-bar"
										style="--progress: {([
											$jigsawCompleted,
											$memoryCompleted,
											$wordSearchCompleted
										].filter(Boolean).length /
											3) *
											100}%"
									></div>
									<div class="progress-text">
										{[$jigsawCompleted, $memoryCompleted, $wordSearchCompleted].filter(Boolean)
											.length}/3 games completed
									</div>
								</div>

								<p class="mt-4 text-center">
									Complete all three games to reveal my final reflection on my ITalent journey.
								</p>

								<div class="game-status">
									<div class="status-item {$jigsawCompleted ? 'completed' : 'pending'}">
										<span class="status-icon">{$jigsawCompleted ? '✓' : '○'}</span>
										<span>Jigsaw Puzzle</span>
									</div>
									<div class="status-item {$memoryCompleted ? 'completed' : 'pending'}">
										<span class="status-icon">{$memoryCompleted ? '✓' : '○'}</span>
										<span>Memory Game</span>
									</div>
									<div class="status-item {$wordSearchCompleted ? 'completed' : 'pending'}">
										<span class="status-icon">{$wordSearchCompleted ? '✓' : '○'}</span>
										<span>Word Search</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}

				{#if $jigsawCompleted && $memoryCompleted && $wordSearchCompleted}
					<div class="col-span-full" in:fade={{ duration: 800, delay: 300 }}>
						<div class="animated-card final-reflection">
							<div class="card-body">
								<h2
									class="card-title mb-4 text-2xl font-bold"
									in:fly={{ y: 20, duration: 500, delay: 400 }}
								>
									Eindreflectie
								</h2>

								<p in:fly={{ y: 20, duration: 500, delay: 500 }}>
									Als ik terugblik op alle activiteiten die ik de afgelopen jaren heb ondernomen,
									besef ik hoezeer ik ben gegroeid als student en als toekomstig IT-professional.
									Aan het begin van dit traject had ik als doel om een goede programmeur te worden
									die klaar is om de stap te maken naar de professionele wereld. Hier heb ik zeker
									vooruitgang op geboekt. Zo heb ik door het volgen van seminaries en
									innovatieroutes niet alleen mijn technische kennis vergroot, maar ook geleerd om
									mijn ideeën met meer zelfvertrouwen te presenteren.
								</p>

								<p in:fly={{ y: 20, duration: 500, delay: 600 }}>
									In de loop van dit traject ben ik me steeds bewuster geworden van wie ik ben als
									beginnend developer. Waar ik me vroeger vooral richtte op technische vaardigheden,
									zie ik nu in hoe belangrijk soft skills zijn, zoals communicatie, samenwerking en
									het vermogen om te blijven leren. Door bijvoorbeeld deel te nemen aan hackathons
									en innovatieroutes heb ik ervaren dat innovatie niet alleen om technische
									oplossingen draait, maar ook om creatief denkwerk, goed projectmanagement en het
									plaatsen in de schoenen van de eindgebruiker.
								</p>

								<p in:fly={{ y: 20, duration: 500, delay: 700 }}>
									Tijdens deze periode ontdekte ik ook mijn sterke punten: ik ben leergierig, durf
									initiatief te nemen, kan creatief denken en kan vlot samenwerken. Tegelijkertijd
									merkte ik dat ik soms kan ontwikkelen met mezelf als gebruiker in plaats van mij
									in de schoenen te plaatsen van wie effectief de applicatie gaat gebruiken. Daar
									wil ik in de toekomst bewuster mee omgaan.
								</p>

								<p in:fly={{ y: 20, duration: 500, delay: 800 }}>
									De X-Factor draait om de combinatie van kennis, vaardigheden en de juiste
									attitude. Ik voel dat ik op alle drie de vlakken duidelijk ben gegroeid. Ik durf
									uit mijn comfortzone te stappen, zoek actief naar nieuwe perspectieven in een
									internationale of bedrijfscontext en ben bereid om met een open instelling aan
									mijn eigen zwakke punten te werken. Die mentaliteit, een can-do-houding, gekoppeld
									aan engagement en empathie, wil ik blijven koesteren in mijn verdere ontwikkeling.
								</p>

								<p in:fly={{ y: 20, duration: 500, delay: 900 }}>
									Ter bevordering van mijn persoonlijke en professionele ontwikkeling ben ik
									voornemens mij verder te verdiepen in opkomende technologieën, onder andere door
									het volgen van onlinecursussen of het realiseren van eigen projecten. Ook streef
									ik ernaar mijn communicatieve vaardigheden te verfijnen, aangezien ik ervan
									overtuigd ben dat een IT-professional met sterke sociale en
									presentatievaardigheden een aanzienlijke impact kan uitoefenen. Door actief te
									werken aan de uitbreiding van mijn netwerk, bijvoorbeeld via een stage of het
									ontmoeten van andere IT'ers met gelijkaardige interesses, hoop ik nieuwe kansen te
									ontdekken die mijn carrière als IT-professional kunnen versterken.
								</p>

								<p in:fly={{ y: 20, duration: 500, delay: 1000 }}>
									In de nabije toekomst zie ik mezelf aan de slag gaan in een omgeving waarin ik
									zowel technische als creatieve uitdagingen kan aangaan. Ik wil blijven zoeken naar
									innovatieve projecten waaraan ik met een multidisciplinair team kan samenwerken en
									waarin mijn X-Factor, die combinatie van vakinhoudelijke kennis, eigen initiatief
									en een empathische aanpak, goed tot zijn recht komt. Uiteindelijk hoop ik door
									deze houding niet alleen mezelf te blijven ontwikkelen, maar ook een positieve,
									blijvende bijdrage te leveren aan de organisatie waarvoor ik werk en aan de
									IT-sector in het algemeen.
								</p>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.hero-background {
		position: relative;
		min-height: 100vh;
		padding: 2rem 0;
		overflow: hidden;
		background: linear-gradient(-45deg, #f3f4f6, #e5e7eb, #e0f2fe, #f0f9ff);
		background-size: 400% 400%;
		animation: gradient 15s ease infinite;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.bg-shape {
		position: absolute;
		opacity: 0.06;
		background-repeat: no-repeat;
		background-size: contain;
		will-change: transform;
		transition: transform 0.3s ease-out;
		filter: blur(1px);
	}

	.shape1 {
		top: 5%;
		left: 5%;
		width: 200px;
		height: 200px;
		border-radius: 53% 47% 32% 68% / 27% 74% 26% 73%;
		background: var(--primary);
		animation: float 12s ease-in-out infinite;
		transform: translate(calc(var(--mouse-x, 0.5) * -30px), calc(var(--mouse-y, 0.5) * -30px))
			rotate(15deg);
	}

	.shape2 {
		top: 15%;
		right: 10%;
		width: 240px;
		height: 240px;
		border-radius: 39% 61% 70% 30% / 61% 40% 60% 39%;
		background: var(--secondary);
		animation: float 15s ease-in-out infinite reverse;
		transform: translate(calc(var(--mouse-x, 0.5) * 25px), calc(var(--mouse-y, 0.5) * -25px))
			rotate(-10deg);
	}

	.shape3 {
		bottom: 10%;
		right: 8%;
		width: 180px;
		height: 180px;
		border-radius: 51% 49% 48% 52% / 62% 44% 56% 38%;
		background: var(--primary);
		animation: float 18s ease-in-out infinite 2s;
		transform: translate(calc(var(--mouse-x, 0.5) * 20px), calc(var(--mouse-y, 0.5) * 20px))
			rotate(45deg);
	}

	.shape4 {
		bottom: 15%;
		left: 8%;
		width: 220px;
		height: 220px;
		border-radius: 42% 58% 65% 35% / 30% 45% 55% 70%;
		background: var(--secondary);
		animation: float 10s ease-in-out infinite 1s;
		transform: translate(calc(var(--mouse-x, 0.5) * -25px), calc(var(--mouse-y, 0.5) * 25px))
			rotate(-15deg);
	}

	.shape5 {
		top: 40%;
		left: 2%;
		width: 150px;
		height: 150px;
		border-radius: 60% 40% 40% 60% / 60% 30% 70% 40%;
		background: linear-gradient(45deg, var(--primary), var(--secondary));
		animation: float 14s ease-in-out infinite 1.5s;
		transform: translate(calc(var(--mouse-x, 0.5) * -15px), calc(var(--mouse-y, 0.5) * 20px))
			rotate(60deg);
	}

	@keyframes float {
		0% {
			transform: translate(calc(var(--mouse-x, 0.5) * -20px), calc(var(--mouse-y, 0.5) * -20px))
				rotate(0deg);
		}
		50% {
			transform: translate(calc(var(--mouse-x, 0.5) * 20px), calc(var(--mouse-y, 0.5) * 20px))
				rotate(10deg);
		}
		100% {
			transform: translate(calc(var(--mouse-x, 0.5) * -20px), calc(var(--mouse-y, 0.5) * -20px))
				rotate(0deg);
		}
	}

	.title-container {
		position: relative;
		display: inline-block;
		padding-bottom: 1rem;
	}

	.title-decoration {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 120px;
		height: 4px;
		background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
		border-radius: 2px;
	}

	.gradient-text {
		background: linear-gradient(90deg, var(--dark) 0%, var(--primary) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05));
	}

	.animated-card {
		background: white;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.08),
			0 0 0 1px rgba(0, 0, 0, 0.01);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		margin-bottom: 2rem;
		border: none;
		backdrop-filter: blur(5px);
		z-index: 10;
		position: relative;
	}

	.animated-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
	}

	.card-title {
		position: relative;
		padding-bottom: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.card-title::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 60px;
		height: 3px;
		background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
		border-radius: 1.5px;
	}

	.skill-list {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
	}

	.skill-list li {
		padding: 0.5rem 0 0.5rem 2rem;
		position: relative;
	}

	.skill-list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		height: 20px;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%233b82f6'%3E%3Cpath fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/%3E%3C/svg%3E");
	}

	.game-container {
		position: relative;
		display: flex;
		justify-content: center;
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.5rem;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.game-wrapper {
		width: 100%;
		max-height: 1000px;
		overflow: hidden;
		position: relative;
		transition: max-height 0.5s ease;
	}

	.content-fade-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 200px;
		background: linear-gradient(to bottom, transparent, #f9fafb 80%);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		padding-bottom: 1rem;
		transition: opacity 0.3s ease;
	}

	.content-fade-overlay.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.content-footer {
		display: flex;
		justify-content: center;
		padding: 1rem 0;
	}

	.toggle-content-btn {
		background-color: var(--primary);
		color: white;
		border: none;
		padding: 0.5rem 1.5rem;
		border-radius: 2rem;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
		z-index: 31;
	}

	.toggle-content-btn:hover {
		background-color: var(--primary-dark);
		transform: translateY(-2px);
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
	}

	.game-wrapper.expanded {
		max-height: none;
	}

	.game-wrapper::-webkit-scrollbar {
		width: 6px;
	}

	.game-wrapper::-webkit-scrollbar-track {
		background: transparent;
	}

	.game-wrapper::-webkit-scrollbar-thumb {
		background-color: var(--gray-light);
		border-radius: 6px;
	}

	.play-link {
		display: inline-block;
		color: var(--primary);
		font-weight: 600;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		transition: all 0.3s ease;
		text-decoration: none;
	}

	.play-link:hover {
		background: rgba(59, 130, 246, 0.1);
		transform: translateX(5px);
	}

	@media (max-width: 640px) {
		.title-container h1 {
			font-size: 2rem;
		}

		.bg-shape {
			opacity: 0.04;
		}

		.shape1,
		.shape5 {
			display: none;
		}
	}

	.col-span-full {
		grid-column: 1 / -1;
		width: 100%;
	}

	.final-reflection-teaser {
		margin-top: 2rem;
		width: 100%;
		text-align: center;
	}

	.final-reflection-teaser .card-title {
		text-align: center;
		padding-bottom: 0.75rem;
		margin-bottom: 1.5rem;
		color: var(--primary);
	}

	.final-reflection-teaser .card-title::after {
		content: '';
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 0;
		width: 80px;
		height: 3px;
		background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
		border-radius: 1.5px;
	}

	.progress-container {
		position: relative;
		height: 20px;
		background: #f3f4f6;
		border-radius: 10px;
		margin: 2rem auto;
		max-width: 400px;
		overflow: hidden;
	}

	.progress-bar {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: var(--progress);
		background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
		border-radius: 10px;
		transition: width 1s ease;
	}

	.progress-text {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--dark);
		font-weight: bold;
		font-size: 0.875rem;
	}

	.game-status {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 2rem;
		max-width: 300px;
		margin-left: auto;
		margin-right: auto;
	}

	.status-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		background: #f9fafb;
		transition: all 0.3s ease;
	}

	.status-item.completed {
		background: #ecfdf5;
		color: var(--secondary);
	}

	.status-item.pending {
		opacity: 0.7;
	}

	.status-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		font-weight: bold;
	}

	.status-item.completed .status-icon {
		color: white;
		background-color: var(--secondary);
	}

	.status-item.pending .status-icon {
		color: var(--gray);
		border: 2px solid var(--gray-light);
	}

	.final-reflection {
		margin-top: 2rem;
		width: 100%;
	}

	.final-reflection .card-title {
		text-align: center;
		padding-bottom: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.final-reflection .card-title::after {
		content: '';
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 0;
		width: 80px;
		height: 3px;
		background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
		border-radius: 1.5px;
	}
</style>
