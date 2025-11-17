
const menu = document.getElementById('menu');
const startButton = document.getElementById('start-button');
const gameBoard = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');


let score = 0;
let timeLeft = 60; 
let gameInterval;
let imageTimeout;
let gameIsRunning = false;
let currentImage = null; 

const imageFiles = [
    'basura.jpg', 
    'perro-basura.jpg', 
    'bolsa.jpg'  
]
function startGame() {
    if (gameIsRunning) return; 
    gameIsRunning = true;
    score = 0;
    timeLeft = 60;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    gameBoard.innerHTML = ''; 

    
    startButton.disabled = true;
    startButton.textContent = 'Jugando...';

    
    gameInterval = setInterval(updateTimer, 1000);

   
    showRandomImage();
}
function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
        endGame();
    }
}
function showRandomImage() {
    
    if (currentImage) {
        currentImage.remove();
        currentImage = null;
    }

    if (!gameIsRunning) return;

    
    const imageElement = document.createElement('img'); 
    imageElement.classList.add('target-image'); 
    
    
    const randomIndex = Math.floor(Math.random() * imageFiles.length);
    imageElement.src = imageFiles[randomIndex]; 

    

    
    const maxX = gameBoard.clientWidth - 50; 
    const maxY = gameBoard.clientHeight - 50; 
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    imageElement.style.left = `${x}px`;
    imageElement.style.top = `${y}px`;

    
    imageElement.addEventListener('click', handleImageClick);

   
    gameBoard.appendChild(imageElement);
    currentImage = imageElement;

    
    const timeVisible = Math.random() * 1000 + 500; 
    imageTimeout = setTimeout(showRandomImage, timeVisible);
}
function handleImageClick(event) {
    if (event.target === currentImage) {
       
        score++;
        scoreDisplay.textContent = score;

        
        clearTimeout(imageTimeout);
        showRandomImage();
    }
}
function endGame() {
    gameIsRunning = false;
    clearInterval(gameInterval);
    clearTimeout(imageTimeout);

    // Limpiar el tablero y referencias
    if (currentImage) {
        currentImage.remove();
        currentImage = null;
    }
    gameBoard.innerHTML = '';

    alert(`¡Juego Terminado! Tu puntuación final es: ${score}`);

    // Restaurar el botón de inicio
    startButton.disabled = false;
    startButton.textContent = 'Comenzar Juego';
}
startButton.addEventListener('click', startGame);


window.onload = () => {
    
    gameBoard.style.width = '800px'; 
    gameBoard.style.height = '650px';
};
