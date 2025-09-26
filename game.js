// --- CONFIGURACIÓN Y VARIABLES GLOBALES ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const API_URL = '/api/scores'; // CORRECCIÓN: Ruta correcta del servidor Node.js

// Elementos del DOM
const currentScoreEl = document.getElementById('current-score');
const currentLevelEl = document.getElementById('current-level');
const highScoreEl = document.getElementById('high-score');
const startMessage = document.getElementById('start-message');
const gameOverMessage = document.getElementById('game-over-message');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restartBtn');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const playerNameInput = document.getElementById('playerName');
const leaderboardBody = document.querySelector('#leaderboard tbody');

// Variables del juego
let score = 0;
let level = 1;
let highScore = 0;
let gameSpeed = 5;
let isPlaying = false;
let isGameOver = false;
let animationId = null;
let obstacles = [];
let frameCount = 0;

// Configuración del jugador
const player = {
    x: 50,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    dy: 0,
    gravity: 0.6,
    jumpForce: -12,
    isJumping: false,
    draw() {
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    update() {
        if (this.isJumping) {
            this.y += this.dy;
            this.dy += this.gravity;
            if (this.y >= canvas.height - this.height) {
                this.y = canvas.height - this.height;
                this.isJumping = false;
                this.dy = 0;
            }
        }
        this.draw();
    },
    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.dy = this.jumpForce;
        }
    }
};

// --- CLASES Y OBJETOS DEL JUEGO ---
class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = '#ff4136';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= gameSpeed;
        this.draw();
    }
}

// --- FUNCIONES PRINCIPALES DEL JUEGO ---
function spawnObstacle() {
    const spawnRate = 120 - level * 5;
    if (frameCount % Math.max(spawnRate, 50) === 0) {
        const height = Math.random() * 50 + 20;
        const width = 20;
        const y = canvas.height - height;
        obstacles.push(new Obstacle(canvas.width, y, width, height));
    }
}

function checkCollision(obs) {
    return (
        player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y
    );
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

    player.update();
    spawnObstacle();
    obstacles.forEach((obstacle, index) => {
        obstacle.update();
        if (checkCollision(obstacle)) gameOver();
        if (obstacle.x + obstacle.width < 0) obstacles.splice(index, 1);
    });

    score++;
    currentScoreEl.textContent = score;
    updateLevel();
    frameCount++;
}

function updateLevel() {
    const nextLevelScore = level * 1000;
    if (score > nextLevelScore) {
        level++;
        gameSpeed += 0.5;
        currentLevelEl.textContent = level;
    }
}

function gameLoop() {
    if (isGameOver) return;
    updateGame();
    animationId = requestAnimationFrame(gameLoop);
}

function startGame() {
    if (isPlaying) return;
    resetGame();
    isPlaying = true;
    isGameOver = false;
    startMessage.style.display = 'none';
    gameOverMessage.style.display = 'none';
    gameLoop();
}

function gameOver() {
    if (isGameOver) return;
    isGameOver = true;
    isPlaying = false;
    cancelAnimationFrame(animationId);

    if (score > highScore) {
        highScore = score;
        highScoreEl.textContent = highScore;
    }

    finalScoreEl.textContent = score;
    gameOverMessage.style.display = 'flex';
}

function resetGame() {
    score = 0;
    level = 1;
    gameSpeed = 5;
    obstacles = [];
    frameCount = 0;
    player.y = canvas.height - player.height;
    player.isJumping = false;
    currentScoreEl.textContent = score;
    currentLevelEl.textContent = level;
}

// --- MANEJO DE PUNTUACIONES (API) ---
async function fetchScores() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener puntuaciones');
        const scores = await response.json();

        if (scores.length > 0) {
            highScore = scores[0].score;
            highScoreEl.textContent = highScore;
        }

        leaderboardBody.innerHTML = '';
        scores.slice(0, 10).forEach((s, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${index + 1}</td><td>${s.name}</td><td>${s.score}</td><td>${s.level}</td>`;
            leaderboardBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching scores:', error);
        leaderboardBody.innerHTML = `<tr><td colspan="4">No se pudo cargar el leaderboard.</td></tr>`;
    }
}

async function saveScore() {
    const playerName = playerNameInput.value.trim();
    if (!playerName) return alert('Por favor, ingresa tu nombre.');

    const scoreData = { name: playerName, score, level };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scoreData)
        });
        if (!response.ok) throw new Error('Error al guardar la puntuación');

        saveScoreBtn.disabled = true;
        saveScoreBtn.textContent = 'Guardado';

        fetchScores();
    } catch (error) {
        console.error('Error saving score:', error);
        alert('No se pudo guardar la puntuación.');
    }
}

// --- EVENT LISTENERS ---
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!isPlaying && !isGameOver) startGame();
        else if (isPlaying) player.jump();
    }
});

canvas.addEventListener('click', () => {
    if (!isPlaying && !isGameOver) startGame();
    else if (isPlaying) player.jump();
});

restartBtn.addEventListener('click', () => {
    gameOverMessage.style.display = 'none';
    saveScoreBtn.disabled = false;
    saveScoreBtn.textContent = 'Guardar';
    playerNameInput.value = '';
    startGame();
});

saveScoreBtn.addEventListener('click', saveScore);

// --- INICIALIZACIÓN ---
window.addEventListener('load', fetchScores);
