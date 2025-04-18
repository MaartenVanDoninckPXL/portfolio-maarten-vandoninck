<script lang="ts">
	import JigsawGame from '$lib/components/JigsawGame.svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let visible = false;
	let mouseX = 0;
	let mouseY = 0;

	function handleMouseMove(event: MouseEvent) {
		mouseX = event.clientX / window.innerWidth;
		mouseY = event.clientY / window.innerHeight;
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
							<JigsawGame />
						</div>
						<div class="mt-4 text-center">
							<a href="/games/jigsaw" class="play-link">Play full screen version →</a>
						</div>
					</div>
				</div>
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
</style>
