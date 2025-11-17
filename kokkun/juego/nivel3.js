let score = 0;
let time = 60; // Límite de tiempo de 60 segundos
let timerInterval;
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const imagesContainer = document.getElementById('images-container');
const endGameButton = document.getElementById('end-game-button'); // Nuevo elemento

// **********************************************
// NUEVA CONSTANTE: Puntuación mínima requerida
// **********************************************
const MIN_SCORE_REQUIRED = 13; 

// **********************************************
// Definición de imágenes que restan puntos (del código anterior)
// **********************************************
const negativeScoreImages = [
    'lindo', // ID del gato
    'perro', // ID del perro
    'dios' , // ID del capigod
    'abcd' // ID del gato
];
const pointsToSubtract = 1; 
const pointsToAward = 5;    

// Inicializar la funcionalidad de arrastrar
const draggableImages = document.querySelectorAll('.draggable-image');
draggableImages.forEach(img => {
    img.addEventListener('dragstart', dragStart);
});

// **********************************************
// EVENT LISTENER PARA EL BOTÓN "TERMINAR JUEGO"
// **********************************************
endGameButton.addEventListener('click', () => {
    // Detiene el temporizador y llama a la función endGame
    clearInterval(timerInterval);
    endGame(); 
});


// Inicia el juego
startGame();

function startGame() {
    // Reiniciar variables
    score = 0;
    time = 60;
    scoreElement.textContent = score;
    timerElement.textContent = time;

    // Mostrar todas las imágenes
    draggableImages.forEach(img => {
        img.classList.remove('hidden');
    });

    // Iniciar el temporizador
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    time--;
    timerElement.textContent = time;

    if (time <= 0) {
        clearInterval(timerInterval);
        endGame(); // Llama a endGame cuando el tiempo termina
    }
}

// **********************************************
// FUNCIÓN ENDGAME MODIFICADA
// **********************************************
function endGame() {
    // 1. Muestra la puntuación final (Opcional, se quitará al redirigir)
    // alert(`¡Juego Terminado! Tu puntuación final es: ${score}.`);

    // 2. Comprueba la puntuación y redirige
    if (score >= MIN_SCORE_REQUIRED) {
        // Puntuación suficiente (o más)
        alert(`¡Felicidades! Lograste ${score} puntos. ¡Has ganado!`);
        // Redirige a la página de éxito
        window.location.href = 'nivel4.html'; 
    } else {
        // Puntuación insuficiente
        alert(`Juego terminado. Tu puntuación final es ${score}. Necesitas ${MIN_SCORE_REQUIRED} para pasar.`);
        // Redirige a la página de fracaso
        window.location.href = 'pagina_A.html'; 
    }
}

// Evento: Al empezar a arrastrar
function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

// Evento: Cuando un elemento arrastrable está sobre la zona de soltar (Tacho)
function allowDrop(event) {
    event.preventDefault();
}

// Evento: Al soltar un elemento en la zona de soltar (Tacho)
function drop(event) {
    event.preventDefault();

    const data = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(data);
    const dropTarget = event.target.closest('#trash-can');

    if (draggedElement && dropTarget) {
        
        // Lógica de suma/resta de puntos
        if (negativeScoreImages.includes(draggedElement.id)) {
            score -= pointsToSubtract;
        } else {
            score += pointsToAward;
        }
        
        scoreElement.textContent = score;

        // Ocultar la imagen
        draggedElement.classList.add('hidden');

        // Opcional: Verificar si quedan imágenes para arrastrar
        const remainingImages = imagesContainer.querySelectorAll('.draggable-image:not(.hidden)').length;
        if (remainingImages === 0) {
            clearInterval(timerInterval);
            alert("¡Has tirado toda la basura!");
            endGame(); // Termina el juego si ya no hay más basura
        }
    }
}