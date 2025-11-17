const words = ["REUTILIZAR", "RECICLAR", "REDUCIR", "BASURA", "ECOLOGIA"]; 
const gridSize = 10
let wordGrid;
let currentSelection = []; 
let wordsFound = []; 

// Definimos las direcciones posibles: [deltaRow, deltaCol]
const directions = [
    [0, 1],   // Horizontal derecha (izquierda a derecha)
    [0, -1],  // Horizontal izquierda (derecha a izquierda)
    [1, 0],  // Vertical abajo (arriba a abajo)
    [-1, 0],  // Vertical arriba (abajo a arriba)
    [1, 1],   // Diagonal abajo-derecha
    [1, -1],  // Diagonal abajo-izquierda
    [-1, 1],  // Diagonal arriba-derecha
    [-1, -1]  // Diagonal arriba-izquierda
];

document.addEventListener('DOMContentLoaded', () => {
    startNewGame();
    document.getElementById('generateNew').addEventListener('click', startNewGame);
});

function startNewGame() {
    wordGrid = generateEmptyGrid(gridSize);
    currentSelection = []; 
    wordsFound = [];
    placeWordsInGrid(words, wordGrid);
    renderGrid(wordGrid);
    renderWordsList(words); 
}

function generateEmptyGrid(size) {
    return Array(size).fill(null).map(() => Array(size).fill('_'));
}

function placeWordsInGrid(words, grid) {
    words.forEach(word => {
        let placed = false;
        const direction = directions[Math.floor(Math.random() * directions.length)];  // Elige una dirección al azar
        const [deltaRow, deltaCol] = direction;
        
        while (!placed) {
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            
            if (canPlaceWordAt(word, grid, row, col, deltaRow, deltaCol)) {
                for (let i = 0; i < word.length; i++) {
                    const currentRow = row + i * deltaRow;
                    const currentCol = col + i * deltaCol;
                    grid[currentRow][currentCol] = word[i];
                }
                placed = true;
            }
        }
    });
}

function canPlaceWordAt(word, grid, startRow, startCol, deltaRow, deltaCol) {
    for (let i = 0; i < word.length; i++) {
        const currentRow = startRow + i * deltaRow;
        const currentCol = startCol + i * deltaCol;
        
        // Verifica si está dentro de los límites
        if (currentRow < 0 || currentRow >= gridSize || currentCol < 0 || currentCol >= gridSize) {
            return false;
        }
        
        // Verifica si la celda está vacía
        if (grid[currentRow][currentCol] !== '_') {
            return false;
        }
    }
    return true;
}

function renderGrid(grid) {
    const container = document.getElementById('wordSearchContainer');
    container.innerHTML = '';
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.textContent = cell === '_' ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : cell;  // Rellena con letra aleatoria
            cellElement.dataset.index = rowIndex * gridSize + colIndex;
            cellElement.addEventListener('click', () => selectCell(rowIndex, colIndex, cellElement));
            container.appendChild(cellElement);
        });
    });
}

function renderWordsList(words) {
    const wordsListContainer = document.getElementById('wordsList');
    wordsListContainer.innerHTML = '';
    words.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.textContent = word;
        wordElement.setAttribute('data-word', word);
        wordsListContainer.appendChild(wordElement);
    });
}

function selectCell(rowIndex, colIndex, cellElement) {
    const index = rowIndex * gridSize + colIndex;
    if (currentSelection.includes(index)) return;  // Evita seleccionar lo mismo dos veces
    cellElement.classList.add('selected');
    
    // Agregar efecto de movimiento pequeño (toque de reacción)
    cellElement.style.transform = 'translate(2px, 2px)';
    setTimeout(() => {
        cellElement.style.transform = '';
    }, 100);  // Duración del efecto: 100ms
    
    currentSelection.push(index);

    const selectedWord = currentSelection.map(idx => {
        const row = Math.floor(idx / gridSize);
        const col = idx % gridSize;
        return wordGrid[row][col];
    }).join('').toUpperCase();  // Convierte a mayúsculas para comparación

    if (words.includes(selectedWord) && !wordsFound.includes(selectedWord)) {
        wordsFound.push(selectedWord);
        alert(`¡Has encontrado la palabra "${selectedWord}"!`);
        currentSelection.forEach(idx => {
            document.querySelector(`[data-index="${idx}"]`).classList.add('found');
        });
        
        document.querySelector(`[data-word="${selectedWord}"]`).classList.add('found');
        currentSelection = [];

        if (wordsFound.length === words.length) {
            setTimeout(() => {
                alert('¡Has ganado!');
                startNewGame();
            }, 1000);
        }
    } else if (!words.some(word => word.startsWith(selectedWord.toUpperCase()))) {
        currentSelection.forEach(idx => {
            document.querySelector(`[data-index="${idx}"]`).classList.remove('selected');
        });
        currentSelection = [];
    }
}