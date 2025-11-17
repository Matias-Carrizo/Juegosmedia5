// sopaWorker.js

// --- 1. Definición de Constantes y Direcciones ---
const directions = [
    [0, 1],   // Horizontal derecha
    [0, -1],  // Horizontal izquierda
    [1, 0],   // Vertical abajo
    [-1, 0],  // Vertical arriba
    [1, 1],   // Diagonal abajo-derecha
    [1, -1],  // Diagonal abajo-izquierda
    [-1, 1],  // Diagonal arriba-derecha
    [-1, -1]  // Diagonal arriba-izquierda
];

// --- 2. Función de Generación de Cuadrícula Vacía ---
function generateEmptyGrid(size) {
    return Array(size).fill(null).map(() => Array(size).fill('_'));
}

// --- 3. Función de Comprobación de Posición (Optimización: permite cruces si la letra coincide) ---
function canPlaceWordAt(word, grid, startRow, startCol, deltaRow, deltaCol, gridSize) {
    for (let i = 0; i < word.length; i++) {
        const currentRow = startRow + i * deltaRow;
        const currentCol = startCol + i * deltaCol;
        
        // Verifica si está dentro de los límites
        if (currentRow < 0 || currentRow >= gridSize || currentCol < 0 || currentCol >= gridSize) {
            return false;
        }
        
        // Verifica si la celda está vacía O si la letra coincide (permitiendo cruces)
        const currentCell = grid[currentRow][currentCol];
        if (currentCell !== '_' && currentCell !== word[i]) {
            return false; // Conflicto, la letra no es la misma
        }
    }
    return true;
}

// --- 4. FUNCIÓN CRÍTICA CON LÍMITE DE INTENTOS ---
function placeWordsInGrid(words, grid, gridSize) {
    // Ordenar palabras por longitud descendente ayuda a colocarlas mejor
    const sortedWords = [...words].sort((a, b) => b.length - a.length); 
    const placedWords = [];
    
    // Límite de intentos, ajustado para evitar bucles infinitos
    const MAX_ATTEMPTS_TOTAL = gridSize * gridSize * directions.length * 3;
    let totalAttempts = 0;

    sortedWords.forEach(word => {
        if (totalAttempts > MAX_ATTEMPTS_TOTAL) return; // Salir si se supera el límite global
        
        let placed = false;
        let attemptsForWord = 0;
        
        // Bucle para intentar todas las 8 direcciones hasta encontrar una posición
        while (!placed && attemptsForWord < MAX_ATTEMPTS_TOTAL) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const [deltaRow, deltaCol] = direction;
            
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            
            if (canPlaceWordAt(word, grid, row, col, deltaRow, deltaCol, gridSize)) {
                // Colocar la palabra
                for (let i = 0; i < word.length; i++) {
                    const currentRow = row + i * deltaRow;
                    const currentCol = col + i * deltaCol;
                    grid[currentRow][currentCol] = word[i];
                }
                placed = true;
                placedWords.push(word);
            }
            attemptsForWord++;
            totalAttempts++;
        }
    });
    
    return { grid, placedWords };
}


// --- 5. Punto de Entrada del Worker ---
onmessage = function(event) {
    const { words, gridSize } = event.data;
    
    // Inicia el proceso de generación
    const wordGrid = generateEmptyGrid(gridSize);
    const result = placeWordsInGrid(words, wordGrid, gridSize);
    
    // Devuelve la cuadrícula generada y las palabras que sí se pudieron colocar.
    postMessage(result); 
};