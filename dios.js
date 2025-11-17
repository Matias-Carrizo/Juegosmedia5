// dios.js (Script Principal)

const words = ["REUTILIZAR", "RECICLAR", "REDUCIR", "BASURA", "ECOLOGIA"]; 
const gridSize = 10;
let wordGrid; 
let currentSelection = []; 
let wordsFound = []; 

// Función para mostrar/ocultar el indicador de carga
function toggleLoading(show) {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'block' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateNew');
    if (generateBtn) {
        generateBtn.addEventListener('click', startNewGame);
    }
    // Llama a startNewGame para generar la sopa al cargar la página
    startNewGame();
});

// **********************************************
// ********* LÓGICA ASÍNCRONA (WORKER) **********
// **********************************************

function startNewGame() {
    const container = document.getElementById('wordSearchContainer');
    const wordsListContainer = document.getElementById('wordsList');
    
    // 1. Mostrar estado de carga (Feedback al usuario)
    container.innerHTML = '';
    wordsListContainer.innerHTML = '<h2>Palabras a Encontrar</h2>';
    toggleLoading(true); // Muestra el indicador de carga
    
    const worker = new Worker('sopaWorker.js'); 
    
    // 2. Enviar datos al Worker
    worker.postMessage({ words: words, gridSize: gridSize });

    // 3. Recibir el resultado
    worker.onmessage = function(event) {
        const { grid, placedWords } = event.data;
        
        // Actualizar el estado global
        wordGrid = grid; 
        wordsFound = []; 
        
        toggleLoading(false); // Oculta el indicador
        renderGrid(wordGrid);
        renderWordsList(placedWords);
        worker.terminate(); 
    };

    worker.onerror = function(error) {
        console.error('Error en la generación asíncrona:', error);
        toggleLoading(false);
        container.innerHTML = '<h2>Error al generar la sopa.</h2>';
        worker.terminate();
    };
}

// **********************************************
// ******** LÓGICA DE INTERFAZ Y JUEGO **********
// **********************************************

function renderGrid(grid) {
    const container = document.getElementById('wordSearchContainer');
    container.innerHTML = '';
    
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            const displayChar = cell === '_' ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : cell; 
            
            cellElement.textContent = displayChar; 
            cellElement.dataset.row = rowIndex;
            cellElement.dataset.col = colIndex;
            cellElement.dataset.index = rowIndex * gridSize + colIndex;
            cellElement.addEventListener('click', () => selectCell(rowIndex, colIndex, cellElement));
            container.appendChild(cellElement);
        });
    });
}

function renderWordsList(wordsToFind) {
    const wordsListContainer = document.getElementById('wordsList');
    wordsListContainer.innerHTML = '<h2></h2>'; 
    
    wordsToFind.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.textContent = word;
        wordElement.setAttribute('data-word', word);
        wordsListContainer.appendChild(wordElement);
    });
}

function selectCell(rowIndex, colIndex, cellElement) {
    const index = rowIndex * gridSize + colIndex;
    
    if (currentSelection.includes(index) || cellElement.classList.contains('found')) return; 
    
    // Si la nueva celda rompe la secuencia, limpia la selección anterior y empieza de nuevo
    if (currentSelection.length > 0 && !isSequential(rowIndex, colIndex)) {
        clearSelection();
    }
    
    cellElement.classList.add('selected');
    
    // Efecto de toque (reacción)
    cellElement.style.transform = 'scale(0.9)';
    setTimeout(() => {
        cellElement.style.transform = '';
    }, 100); 
    
    currentSelection.push(index);

    const selectedWord = currentSelection.map(idx => {
        const row = Math.floor(idx / gridSize);
        const col = idx % gridSize;
        return wordGrid[row][col];
    }).join(''); 

    // 1. ¡Palabra Encontrada!
    if (words.includes(selectedWord) && !wordsFound.includes(selectedWord)) {
        wordsFound.push(selectedWord);
        
        currentSelection.forEach(idx => {
            const el = document.querySelector(`[data-index="${idx}"]`);
            if (el) {
                 el.classList.remove('selected');
                 el.classList.add('found');
            }
        });
        
        const listEl = document.querySelector(`.wordsList div[data-word="${selectedWord}"]`);
        if (listEl) {
            listEl.classList.add('found');
        }
        
        currentSelection = [];

        // 2. ¡Juego Terminado!
        if (wordsFound.length === words.length) {
            setTimeout(() => {
                alert('¡Felicidades! ¡Has ganado! 🏆');
                startNewGame();
            }, 1000);
        }
    } 
    // 3. Selección Inválida (no es prefijo de ninguna palabra)
    else if (currentSelection.length > 1 && !words.some(word => word.startsWith(selectedWord))) {
        clearSelection();
    }
}

function clearSelection() {
    currentSelection.forEach(idx => {
        const el = document.querySelector(`[data-index="${idx}"]`);
        if (el) {
             el.classList.remove('selected');
        }
    });
    currentSelection = [];
}

/**
 * Verifica si la nueva celda es adyacente y mantiene la dirección de la selección.
 */
function isSequential(newRow, newCol) {
    if (currentSelection.length === 0) return true;

    const lastIndex = currentSelection[currentSelection.length - 1];
    const lastRow = Math.floor(lastIndex / gridSize);
    const lastCol = lastIndex % gridSize;

    const dRow = newRow - lastRow;
    const dCol = newCol - lastCol;
    
    // 1. Debe ser adyacente (distancia 1) y no puede ser (0, 0)
    if (Math.abs(dRow) > 1 || Math.abs(dCol) > 1 || (dRow === 0 && dCol === 0)) {
        return false;
    }

    // 2. Si hay más de una seleccionada, la dirección debe ser consistente
    if (currentSelection.length >= 1) {
        const antepenultIndex = currentSelection.length > 1 ? currentSelection[currentSelection.length - 2] : null;

        if (antepenultIndex !== null) {
            const anteRow = Math.floor(antepenultIndex / gridSize);
            const anteCol = antepenultIndex % gridSize;

            const prevDRow = lastRow - anteRow;
            const prevDCol = lastCol - anteCol;
            
            // Comprueba si la dirección actual (dRow, dCol) es la misma que la previa (prevDRow, prevDCol)
            if (dRow !== prevDRow || dCol !== prevDCol) {
                return false;
            }
        }
    }
    
    return true;
}