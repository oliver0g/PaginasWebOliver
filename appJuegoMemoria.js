const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const restartBtn = document.getElementById('restartBtn');
const winMessage = document.getElementById('winMessage');
const finalScore = document.getElementById('finalScore');
const finalTime = document.getElementById('finalTime');
const closeModal = document.getElementById('closeModal');

let cardsArray = ['🍎','🍌','🍇','🍉','🍓','🥝'];
let cards = [];
let firstCard = null;
let secondCard = null;
let score = 0;
let time = 60;
let timer;

// Crear tablero
function createBoard() {
  cards = [...cardsArray, ...cardsArray];
  cards.sort(() => 0.5 - Math.random());
  gameBoard.innerHTML = '';
  cards.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
  score = 0;
  scoreDisplay.textContent = score;
  time = 60;
  timeDisplay.textContent = time;
  startTimer();
}

// Voltear carta
function flipCard() {
  if (this.classList.contains('flipped') || this.classList.contains('matched')) return;

  this.textContent = this.dataset.symbol;
  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    checkMatch();
  }
}

// Revisar coincidencia
function checkMatch() {
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    score++;
    scoreDisplay.textContent = score;
    resetFlipped();

    if(score === cardsArray.length){
      endGame(true);
    }
  } else {
    setTimeout(() => {
      firstCard.textContent = '';
      secondCard.textContent = '';
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetFlipped();
    }, 800);
  }
}

// Resetear cartas volteadas
function resetFlipped() {
  firstCard = null;
  secondCard = null;
}

// Timer regresivo
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    time--;
    timeDisplay.textContent = time;
    if(time <= 0){
      endGame(false);
    }
  }, 1000);
}

// Fin del juego
function endGame(won){
  clearInterval(timer);
  finalScore.textContent = score;
  finalTime.textContent = time;
  winMessage.querySelector('h2').textContent = won ? '🎉 ¡Ganaste!' : '⏰ Tiempo terminado';
  winMessage.style.display = 'flex';
}

// Reiniciar juego
restartBtn.addEventListener('click', createBoard);
closeModal.addEventListener('click', () => {
  winMessage.style.display = 'none';
  createBoard();
});

// Iniciar al cargar
createBoard();