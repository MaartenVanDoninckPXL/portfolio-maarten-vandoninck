<script lang="ts">
	import JigsawGame from '$lib/components/JigsawGame.svelte';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

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
	<title>Puzzelspel | Maarten Van Doninck</title>
	<meta name="description" content="Play an interactive jigsaw puzzle game" />
</svelte:head>

<div class="game-background" style="--mouse-x: {mouseX}; --mouse-y: {mouseY}">
	<div class="puzzle-bg-piece piece1"></div>
	<div class="puzzle-bg-piece piece2"></div>
	<div class="puzzle-bg-piece piece3"></div>
	<div class="puzzle-bg-piece piece4"></div>
	<div class="puzzle-bg-piece piece5"></div>
	<div class="puzzle-bg-piece piece6"></div>

	{#if visible}
		<div class="container relative z-10 mx-auto my-5" in:fade={{ duration: 800 }}>
			<header class="mb-8 text-center" in:fly={{ y: -20, duration: 800 }}>
				<h1 class="text-gradient text-4xl font-bold">Puzzelspel</h1>
				<p class="mt-3 text-gray-600">Verplaats de stukken om de afbeelding te voltooien</p>
			</header>

			<div class="game-card" in:fly={{ y: 20, duration: 800, delay: 300 }}>
				<div class="card-body">
					<div class="game-instructions mb-6">
						<h2 class="mb-2 text-xl font-bold">Hoe moet ik spelen:</h2>
						<ol class="ml-6 list-decimal">
							<li>Klik op een stuk om het te selecteren</li>
							<li>Klik op een ander stuk om posities te wisselen</li>
							<li>Ga door tot de afbeelding compleet is</li>
						</ol>
					</div>

					<div class="game-container">
						<JigsawGame />
					</div>

					<div class="mt-8 text-center">
						<a href="/" class="back-button" in:fade={{ delay: 800, duration: 300 }}>
							← Ga Terug
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.game-background {
		position: relative;
		min-height: 100vh;
		padding: 2rem 0;
		overflow: hidden;
		background: linear-gradient(-45deg, #f3f4f6, #e5e7eb, #dbeafe, #ede9fe);
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

	.puzzle-bg-piece {
		position: absolute;
		opacity: 0.1;
		background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%233b82f6' d='M50 0 L75 25 L100 25 L100 75 L75 75 L50 100 L25 75 L0 75 L0 25 L25 25 Z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-size: contain;
		will-change: transform;
		transition: transform 0.3s ease-out;
	}

	.piece1 {
		top: 10%;
		left: 5%;
		width: 80px;
		height: 80px;
		animation: float 8s ease-in-out infinite;
		transform: translate(calc(var(--mouse-x, 0.5) * -30px), calc(var(--mouse-y, 0.5) * -30px))
			rotate(15deg);
	}

	.piece2 {
		top: 20%;
		right: 10%;
		width: 120px;
		height: 120px;
		animation: float 12s ease-in-out infinite reverse;
		transform: translate(calc(var(--mouse-x, 0.5) * 20px), calc(var(--mouse-y, 0.5) * -25px))
			rotate(-10deg);
	}

	.piece3 {
		bottom: 15%;
		right: 5%;
		width: 100px;
		height: 100px;
		animation: float 10s ease-in-out infinite 2s;
		transform: translate(calc(var(--mouse-x, 0.5) * 25px), calc(var(--mouse-y, 0.5) * 20px))
			rotate(45deg);
	}

	.piece4 {
		bottom: 10%;
		left: 10%;
		width: 90px;
		height: 90px;
		animation: float 11s ease-in-out infinite 1s;
		transform: translate(calc(var(--mouse-x, 0.5) * -20px), calc(var(--mouse-y, 0.5) * 30px))
			rotate(-25deg);
	}

	.piece5 {
		top: 40%;
		left: 20%;
		width: 70px;
		height: 70px;
		animation: float 9s ease-in-out infinite 1.5s;
		transform: translate(calc(var(--mouse-x, 0.5) * -15px), calc(var(--mouse-y, 0.5) * 15px))
			rotate(60deg);
	}

	.piece6 {
		top: 60%;
		right: 15%;
		width: 110px;
		height: 110px;
		animation: float 14s ease-in-out infinite 1s;
		transform: translate(calc(var(--mouse-x, 0.5) * 15px), calc(var(--mouse-y, 0.5) * -15px))
			rotate(-55deg);
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

	.text-gradient {
		background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
	}

	.game-card {
		background: white;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.1),
			0 0 0 1px rgba(0, 0, 0, 0.05);
		max-width: 1300px;
		margin: 0 auto;
		position: relative;
		z-index: 5;
		backdrop-filter: blur(5px);
	}

	.game-container {
		position: relative;
		padding: 1.5rem;
		background: #f9fafb;
		border-radius: 0.5rem;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: center;
		width: 100%;
		max-width: 1100px;
		margin: 0 auto;
		overflow: hidden;
	}

	.back-button {
		display: inline-block;
		background: var(--primary);
		color: white;
		font-weight: 600;
		padding: 0.75rem 1.5rem;
		border-radius: 2rem;
		transition: all 0.3s ease;
		text-decoration: none;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.back-button:hover {
		background: var(--primary-dark);
		transform: translateY(-2px);
		box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
		text-decoration: none;
		color: white;
	}

	@media (max-width: 768px) {
		.game-card {
			max-width: 95%;
		}

		.game-container {
			padding: 0.75rem;
		}

		.piece5,
		.piece6 {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.game-container {
			padding: 0.5rem;
		}

		.piece3,
		.piece4 {
			display: none;
		}
	}
</style>
