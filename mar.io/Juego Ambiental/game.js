 
document.addEventListener("DOMContentLoaded", function() {

    // 🌟 CORRECCIÓN DE MÁRGENES DEL NAVEGADOR (Resuelve la franja azul/blanca)
    document.documentElement.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100%';
    document.body.style.minHeight = '100vh'; // Asegura que el cuerpo cubra el viewport

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Dimensiones del canvas (deben coincidir con el HTML)
    const INITIAL_WIDTH = 900;
    const INITIAL_HEIGHT = 700;

    canvas.width = INITIAL_WIDTH;
    canvas.height = INITIAL_HEIGHT;

    // 🎯 CONSTANTES DEL JUEGO
    const CURRENT_ACTIVATION_THRESHOLD = 800;
    const CURRENT_DURATION_MS = 6000;
    const MAX_PLAYER_RADIUS = 80;

    // 💥 CONSTANTES DE REUBICACIÓN RECURRENTE
    const INITIAL_REPOSITION_THRESHOLD = 1800;
    const REPOSITION_INTERVAL = 500;

    // 🛡️ CONSTANTE DE ZONA DE EXCLUSIÓN (Jugador)
    const PLAYER_EXCLUSION_RADIUS = 150;
    // 🗑️ CONSTANTE DE EXCLUSIÓN PARA LA BASURA (Punto peligro vs Basura)
    const TRASH_EXCLUSION_RADIUS = 50; 

    // ⏰ CONSTANTES DE TIEMPO
    const REPOSITION_PAUSE_DURATION_MS = 1500;

    // 🧲 CONSTANTES DE REPETICIÓN DEL IMÁN
    const POWERUP_INITIAL_THRESHOLD = 1800; 
    const POWERUP_REPETITION_INTERVAL = 1300; 

    // 🧲 CONSTANTES DEL POWER-UP IMÁN
    const POWERUP_DURATION_MS = 4000;
    const POWERUP_RADIUS = 30;
    const MAGNET_STRENGTH = 4;

    // 🌀 CONSTANTES DE CORRIENTES
    const FLOW_STRENGTH = 2.5;
    const FLOW_RADIUS = 250;
    const FLOW_COLOR = 'rgba(0, 150, 255, 0.2)';

    const SWIRL_STRENGTH = 5;
    const SWIRL_RADIUS = 350;
    const SWIRL_COLOR = 'rgba(255, 200, 0, 0.15)';

    // 🌀 CONSTANTES DE REMOLINO (Para animación de partículas)
    const SWIRL_PARTICLE_COUNT = 30;
    let rotationOffset = 0; 

    let currentsAreActive = false;
    let nextRepositionScore = INITIAL_REPOSITION_THRESHOLD;
    let isPausedForReposition = false;

    // 🧲 ESTADO DEL POWER-UP IMÁN
    let powerUp = null;
    let powerUpEffectActive = false;
    let powerUpTimer = null;
    let effectTimeout = null;
    let powerUpStartTime = 0;
    let nextPowerUpScore = POWERUP_INITIAL_THRESHOLD; 


    // Elementos de la UI
    const gameOverScreen = document.getElementById("gameOverScreen");
    const finalScoreDisplay = document.getElementById("finalScoreDisplay");
    const retryBtn = document.getElementById("retryBtn");
    const magnetStatus = document.getElementById("magnetStatus");
    const magnetProgressBar = document.getElementById("magnetProgressBar");
    const timerDisplay = document.getElementById('timer');
    const scoreBoard = document.getElementById("scoreBoard");
    const startScreen = document.getElementById("startScreen"); 

    // 🎨 Fondo e Imágenes
    const backgroundImage = new Image();
    backgroundImage.src = "fondoagua.jpg";
    let backgroundLoaded = false;
    backgroundImage.onload = () => { backgroundLoaded = true; checkAllAssetsLoaded(); };

    const waveImage = new Image();
    waveImage.src = "pecesito.png";
    let waveImageLoaded = false;
    waveImage.onload = () => { waveImageLoaded = true; checkAllAssetsLoaded(); };

    const startScreenImage = new Image();
    startScreenImage.src = "iniciofondo.png"; 
    let startScreenBackgroundLoaded = false;
    startScreenImage.onload = () => { startScreenBackgroundLoaded = true; checkAllAssetsLoaded(); };
    startScreenImage.onerror = () => { startScreenBackgroundLoaded = true; checkAllAssetsLoaded(); }; 

    // 🚀 CONSTANTES DE VELOCIDAD
    const NORMAL_SPEED = 5;
    const BOOST_SPEED = 10;

    let player = { x: 400, y: 300, radius: 20, speed: NORMAL_SPEED };
    let score = 0;
    let trash = [];
    // 🗑️ NUEVA VARIABLE: Para evitar la repetición de basura
    let lastTrashType = null; 

    // 🔴 Puntos de Peligro (Enemigos)
    let dangerPoints = [];
    const DANGER_RADIUS_STATIC = 9;
    const DANGER_SPEED = 14;

    // 🌊 ESTADOS DE OLEADAS Y UMBRALES
    const WAVE_INTERVAL = 1000;
    let nextWaveScore = WAVE_INTERVAL;
    const WAVE_POINTS = 3;
    const WAVE_COLLISION_RADIUS = 15;
    const WAVE_IMAGE_SIZE = 100;
    const WAVE_POINT_RADIUS = WAVE_COLLISION_RADIUS;
    const WAVE_DIRECTIONS = ['NORTH', 'SOUTH', 'EAST', 'WEST'];
    const HALF_PI = Math.PI / 2;

    let keys = {};
    let isGameRunning = false;

    // --- Variables y funciones del temporizador ---
    let timeLeft = 20;
    let gameTimer;

    // 🌀 SISTEMA DE CORRIENTES DE AGUA
    let currents = [];
    let currentTimeoutId = null;

    // Lógica de carga de imágenes de basura (Añadiendo los nuevos tipos)
    const trashTypes = [
        { type: "papel", img: "papeldeljuego.png", radius: 20, points: 10, time: 1 },
        { type: "plastico", img: "botellaplastico.png", radius: 30, points: 11, time: 2 },
        { type: "carton", img: "cartondeljuego.png", radius: 25, points: 45, time: 3 },
        { type: "bolsa", img: "bolsadeljuego.png", radius: 42, points: 103, time: 4 },
        { type: "vaso", img: "vaso.png", radius: 35, points: 29, time: 1 },
        { type: "balde", img: "descarga.png", radius: 18, points: 24, time: 1 },
        { type: "neumatico", img: "neumaticodeljuego.png", radius: 40, points: 88, time: 3 },
    ];
    let loadedImages = {};
    let imagesToLoad = trashTypes.length;

    const startBtn = document.getElementById("startBtn");
    if (startBtn) startBtn.disabled = true;

    trashTypes.forEach(t => {
        const image = new Image();
        image.onload = () => { imagesToLoad--; checkAllAssetsLoaded(); };
        image.onerror = () => { imagesToLoad--; checkAllAssetsLoaded(); };
        image.src = t.img;
        loadedImages[t.type] = image;
    });
    // --- Fin de Lógica de Carga de Imágenes ---


    // ------------------------------------
    // Funciones de UI y Estado
    // ------------------------------------

    function checkAllAssetsLoaded() {
        if (imagesToLoad === 0 && backgroundLoaded && waveImageLoaded && startScreenBackgroundLoaded && startBtn) {
            startBtn.disabled = false;

            // 🎨 APLICAR ESTILOS DE FONDO AL DIV DE INICIO (JS)
            if (startScreen) {
                startScreen.style.backgroundImage = `url('${startScreenImage.src}')`;
                startScreen.style.backgroundSize = "cover";
                startScreen.style.backgroundPosition = "center";
                startScreen.style.backgroundRepeat = "no-repeat";
                startScreen.style.width = "100vw"; // Asegura ancho 100% del viewport
                startScreen.style.height = "100vh"; // Asegura alto 100% del viewport
                startScreen.style.position = "absolute"; // Posicionamiento para evitar franjas
                startScreen.style.top = "0";
                startScreen.style.left = "0";
            }
        }
    }

    function startTimer() {
        timeLeft = 20;
        timerDisplay.innerText = 'Tiempo: ' + timeLeft;
        gameTimer = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = 'Tiempo: ' + timeLeft;
            if (timeLeft <= 0) {
                clearInterval(gameTimer);
                endGame();
            }
        }, 1000);
    }

    function updateScore() {
        scoreBoard.innerText = "Puntos: " + score;
    }

    function saveScore() {
        let history = JSON.parse(localStorage.getItem("scoreHistory")) || [];
        history.push(score);
        localStorage.setItem("scoreHistory", JSON.stringify(history));
    }

    function loadHistory() {
        let history = JSON.parse(localStorage.getItem("scoreHistory")) || [];

        history.sort((a, b) => b - a);

        let listStart = document.getElementById("scoreHistory");
        let listGameOver = document.getElementById("scoreHistoryGameOver");

        listStart.innerHTML = "";
        if (listGameOver) {
            listGameOver.innerHTML = "";
        }

        history.slice(0, 5).forEach((s, index) => {
            let li = document.createElement("li");
            li.innerText = `#${index + 1}: ${s} puntos`;
            listStart.appendChild(li);

            if (listGameOver) {
                let li2 = document.createElement("li");
                li2.innerText = `#${index + 1}: ${s} puntos`;
                listGameOver.appendChild(li2);
            }
        });
    }

    function endGame() {
        if (!isGameRunning) return;
        isGameRunning = false;
        clearInterval(gameTimer);

        currentsAreActive = false;
        currents = [];
        if (currentTimeoutId) clearTimeout(currentTimeoutId);
        if (powerUpTimer) clearTimeout(powerUpTimer);
        if (effectTimeout) clearTimeout(effectTimeout);
        powerUpEffectActive = false;
        isPausedForReposition = false;
        magnetStatus.style.display = "none";

        saveScore();
        loadHistory(); 

        document.getElementById("gameScreen").style.display = "none";
        finalScoreDisplay.innerText = "Tu puntuación final es: " + score;

        gameOverScreen.style.display = "flex";
    }

    // ------------------------------------
    // Funciones de Corrientes (Flow y Swirl)
    // ------------------------------------

    function generateRandomDirectionVector(strength) {
        const angle = Math.random() * Math.PI * 2;
        let x = Math.cos(angle);
        let y = Math.sin(angle);
        return { x: x, y: y };
    }

    function deactivateCurrents() {
        currentsAreActive = false;
        currents = [];
    }

    function setupCurrents() {
        if (currentTimeoutId) clearTimeout(currentTimeoutId);
        currentsAreActive = true;
        currents = [];

        const flowPos1 = generateSafePosition();
        const flowDir1 = generateRandomDirectionVector(FLOW_STRENGTH);
        currents.push({
            x: flowPos1.x, y: flowPos1.y, radius: FLOW_RADIUS,
            strength: FLOW_STRENGTH, direction: flowDir1, color: FLOW_COLOR, type: 'flow'
        });

        const flowPos2 = generateSafePosition();
        const flowDir2 = generateRandomDirectionVector(FLOW_STRENGTH);
        currents.push({
            x: flowPos2.x, y: flowPos2.y, radius: FLOW_RADIUS,
            strength: FLOW_STRENGTH + 1.0, direction: flowDir2, color: 'rgba(0, 200, 255, 0.3)', type: 'flow'
        });

        // Remolino siempre en el centro
        currents.push({
            x: canvas.width / 2, y: canvas.height / 2, radius: SWIRL_RADIUS,
            strength: SWIRL_STRENGTH, color: SWIRL_COLOR, type: 'swirl'
        });

        currentTimeoutId = setTimeout(deactivateCurrents, CURRENT_DURATION_MS);
    }

    // ------------------------------------
    // Funciones de Power-Up Imán
    // ------------------------------------

    function deactivatePowerUpEffect() {
        powerUpEffectActive = false;
        effectTimeout = null;
        magnetStatus.style.display = "none";
    }

    function activatePowerUpEffect() {
        if (powerUpEffectActive) {
            clearTimeout(effectTimeout);
        } else {
            powerUpEffectActive = true;
        }
        powerUpStartTime = performance.now();
        magnetStatus.style.display = "block";
        effectTimeout = setTimeout(deactivatePowerUpEffect, POWERUP_DURATION_MS);
    }

    function updateMagnetBar() {
        if (!powerUpEffectActive) return;

        const currentTime = performance.now();
        const elapsedTime = currentTime - powerUpStartTime;
        const remainingTime = Math.max(0, POWERUP_DURATION_MS - elapsedTime);

        const percentage = (remainingTime / POWERUP_DURATION_MS) * 100;

        magnetProgressBar.style.width = percentage + "%";
    }

    // ------------------------------------
    // Generación y Movimiento
    // ------------------------------------

    /**
     * FUNCIÓN MODIFICADA: Genera una posición para un punto de peligro estático 
     * que esté seguro del jugador Y de la basura.
     */
    function generateSafePosition() {
        let newX, newY, distance;
        let safe = false;

        do {
            newX = Math.random() * (canvas.width - DANGER_RADIUS_STATIC * 2) + DANGER_RADIUS_STATIC;
            newY = Math.random() * (canvas.height - DANGER_RADIUS_STATIC * 2) + DANGER_RADIUS_STATIC;

            // 1. Verificar la distancia con el jugador
            distance = Math.sqrt((newX - player.x) ** 2 + (newY - player.y) ** 2);
            safe = distance >= (PLAYER_EXCLUSION_RADIUS + player.radius + DANGER_RADIUS_STATIC);

            // 2. 🌟 NUEVA VERIFICACIÓN: Distancia con la basura 🌟
            if (safe) {
                for (const t of trash) {
                    const dx_t = newX - t.x;
                    const dy_t = newY - t.y;
                    const distance_t = Math.sqrt(dx_t ** 2 + dy_t ** 2);
                    
                    // Asegura que haya una separación mínima
                    if (distance_t < (t.radius + DANGER_RADIUS_STATIC + TRASH_EXCLUSION_RADIUS)) {
                        safe = false;
                        break; 
                    }
                }
            }

        } while (!safe); 

        return { x: newX, y: newY };
    }

    function repositionStaticDangers(isInitial) {
        isPausedForReposition = true;
        clearInterval(gameTimer);

        dangerPoints.forEach(point => {
            if (!point.isWave) {
                const safePos = generateSafePosition();
                point.x = safePos.x;
                point.y = safePos.y;
            }
        });

        setTimeout(() => {
            isPausedForReposition = false;
            startTimer();

            if (isInitial) {
                // Lógica de aparición inicial del PowerUp aquí si fuera necesario
            }

            nextRepositionScore += REPOSITION_INTERVAL;
        }, REPOSITION_PAUSE_DURATION_MS);
    }

    function spawnPowerUp() {
        if (powerUp !== null) return;
        powerUp = { x: Math.random() * (canvas.width - POWERUP_RADIUS * 2) + POWERUP_RADIUS, y: Math.random() * (canvas.height - POWERUP_RADIUS * 2) + POWERUP_RADIUS, radius: POWERUP_RADIUS };
        powerUpTimer = setTimeout(() => { powerUp = null; powerUpTimer = null; }, POWERUP_DURATION_MS * 2.5); 
    }

    function spawnDangerPoint() {
        const safePos = generateSafePosition();
        dangerPoints.push({ x: safePos.x, y: safePos.y, radius: DANGER_RADIUS_STATIC, isWave: false, });
    }

    /**
     * FUNCIÓN MODIFICADA: Genera basura asegurando que no se repita el tipo de basura inmediatamente anterior.
     */
    function spawnTrash() {
        // 1. Filtrar los tipos de basura para excluir el último generado
        const availableTrashTypes = trashTypes.filter(t => t.type !== lastTrashType);

        // 2. Seleccionar un nuevo tipo de basura aleatoriamente de la lista filtrada
        const selectionArray = availableTrashTypes.length > 0 ? availableTrashTypes : trashTypes;
        
        let t = selectionArray[Math.floor(Math.random() * selectionArray.length)];

        // 3. Registrar este nuevo tipo de basura como el último generado
        lastTrashType = t.type;
        
        // 4. Generar y añadir el objeto de basura
        trash.push({ 
            x: Math.random() * (canvas.width - t.radius * 2) + t.radius, 
            y: Math.random() * (canvas.height - t.radius * 2) + t.radius, 
            radius: t.radius, 
            type: t.type, 
            img: loadedImages[t.type], 
            points: t.points, 
            time: t.time 
        });
    }

    function calculateWaveDirection() {
        const direction = WAVE_DIRECTIONS[Math.floor(Math.random() * WAVE_DIRECTIONS.length)];
        let startX, startY, velX, velY, rotation;
        const offset = WAVE_POINT_RADIUS + WAVE_IMAGE_SIZE / 2;
        switch (direction) {
            case 'NORTH': startX = Math.random() * canvas.width; startY = -offset; velX = 0; velY = DANGER_SPEED; rotation = HALF_PI; break;
            case 'SOUTH': startX = Math.random() * canvas.width; startY = canvas.height + offset; velX = 0; velY = -DANGER_SPEED; rotation = -HALF_PI; break;
            case 'WEST': startX = -offset; startY = Math.random() * canvas.height; velX = DANGER_SPEED; velY = 0; rotation = Math.PI; break;
            case 'EAST': default: startX = canvas.width + offset; startY = Math.random() * canvas.height; velX = -DANGER_SPEED; velY = 0; rotation = 0; break;
        }
        return { x: startX, y: startY, velX: velX, velY: velY, rotation: rotation, direction: direction };
    }

    function spawnWave() {
        for (let i = 0; i < WAVE_POINTS; i++) {
            const { x, y, velX, velY, rotation, direction } = calculateWaveDirection();
            dangerPoints.push({
                x: x, y: y, radius: WAVE_POINT_RADIUS, isWave: true,
                velX: velX, velY: velY, rotation: rotation, direction: direction
            });
        }
    }

    function movePlayer() {
        if (!isGameRunning || isPausedForReposition) return;
        let dx = 0; let dy = 0;
        const isBoostActive = keys["Shift"] || keys["ShiftLeft"] || keys["ShiftRight"];
        player.speed = isBoostActive ? BOOST_SPEED : NORMAL_SPEED;

        if (keys["ArrowUp"] || keys["w"]) dy -= player.speed;
        if (keys["ArrowDown"] || keys["s"]) dy += player.speed;
        if (keys["ArrowLeft"] || keys["a"]) dx -= player.speed;
        if (keys["ArrowRight"] || keys["d"]) dx += player.speed;

        if (currentsAreActive) {
            currents.forEach(current => {
                const dx_to_current = current.x - player.x;
                const dy_to_current = current.y - player.y;
                const distSq = dx_to_current ** 2 + dy_to_current ** 2;

                if (distSq < current.radius ** 2) {
                    if (current.type === 'flow') {
                        dx += current.strength * current.direction.x;
                        dy += current.strength * current.direction.y;
                    }
                    else if (current.type === 'swirl') {
                        const dist = Math.sqrt(distSq);
                        if (dist > 0) {
                            const tanX = dy_to_current / dist;
                            const tanY = -dx_to_current / dist;
                            const strengthFactor = (current.radius - dist) / current.radius;
                            dx += tanX * current.strength * strengthFactor;
                            dy += tanY * current.strength * strengthFactor;
                        }
                    }
                }
            });
        }
        player.x += dx; player.y += dy;
        player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
        player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
    }

    function applyMagnetAttraction() {
        if (!isGameRunning || isPausedForReposition || !powerUpEffectActive) return;
        trash.forEach(t => {
            let dx = player.x - t.x; let dy = player.y - t.y; let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0) { let nx = dx / distance; let ny = dy / distance; t.x += nx * MAGNET_STRENGTH; t.y += ny * MAGNET_STRENGTH; }
        });
    }

    function moveDangerPoints() {
        if (!isGameRunning || isPausedForReposition) return;
        for (let i = dangerPoints.length - 1; i >= 0; i--) {
            let point = dangerPoints[i];
            if (point.isWave) {
                point.x += point.velX; point.y += point.velY;
                const margin = WAVE_IMAGE_SIZE;
                if (point.x < -margin || point.x > canvas.width + margin || point.y < -margin || point.y > canvas.height + margin) {
                    dangerPoints.splice(i, 1);
                }
            }
        }
    }

    function checkCollisions() {
        if (!isGameRunning || isPausedForReposition) return;

        // Lógica de Reubicación
        if (score >= nextRepositionScore) {
            const isInitial = nextRepositionScore === INITIAL_REPOSITION_THRESHOLD;
            repositionStaticDangers(isInitial);
            return;
        }

        // 🧲 Lógica de Aparición de Power-Up
        if (score >= nextPowerUpScore && powerUp === null) {
            spawnPowerUp();
        }

        // Lógica de Recolección de Power-Up
        if (powerUp) {
            let dx = player.x - powerUp.x; let dy = player.y - powerUp.y; let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < player.radius + powerUp.radius) { 
                clearTimeout(powerUpTimer); 
                powerUpTimer = null; 
                activatePowerUpEffect(); 
                powerUp = null; 
                nextPowerUpScore = score + POWERUP_REPETITION_INTERVAL; 
            }
        }

        const currentThresholdReached = score >= CURRENT_ACTIVATION_THRESHOLD && (score % CURRENT_ACTIVATION_THRESHOLD < 100);
        if (currentThresholdReached && !currentsAreActive) { setupCurrents(); }
        if (score >= nextWaveScore) { spawnWave(); nextWaveScore += WAVE_INTERVAL; }
        
        // Lógica de Recolección de Basura
        for (let i = trash.length - 1; i >= 0; i--) {
            let t = trash[i]; let dx = player.x - t.x; let dy = player.y - t.y; let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < player.radius + t.radius) {
                score += t.points; timeLeft += t.time;
                if (player.radius < MAX_PLAYER_RADIUS) { player.radius += 1; if (player.radius > MAX_PLAYER_RADIUS) { player.radius = MAX_PLAYER_RADIUS; } }
                timerDisplay.innerText = 'Tiempo: ' + timeLeft; 
                trash.splice(i, 1); 
                updateScore(); 
                spawnTrash(); // Genera nuevo spawn, respetando la restricción de no repetición.
            }
        }
    }

    function checkDangerCollision() {
        if (!isGameRunning || isPausedForReposition) return;
        for (let i = 0; i < dangerPoints.length; i++) {
            let point = dangerPoints[i];
            let dx = player.x - point.x; let dy = player.y - point.y; let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < player.radius + point.radius) { endGame(); return; }
        }
    }

    // ------------------------------------
    // Funciones de Dibujo (Draw)
    // ------------------------------------

    function drawSwirlParticles(current) {
        const totalRotation = rotationOffset;

        for (let i = 0; i < SWIRL_PARTICLE_COUNT; i++) {
            const radius = current.radius * (i / SWIRL_PARTICLE_COUNT);
            const angle = (i * (360 / SWIRL_PARTICLE_COUNT)) * (Math.PI / 180) + totalRotation;

            const particleX = current.x + radius * Math.cos(angle);
            const particleY = current.y + radius * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fill();
            ctx.closePath();
        }
    }


    function draw() {
        if (backgroundLoaded) { ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); } else { ctx.clearRect(0, 0, canvas.width, canvas.height); }

        if (currentsAreActive) {
            currents.forEach(current => {
                ctx.beginPath();
                ctx.arc(current.x, current.y, current.radius, 0, Math.PI * 2);
                ctx.fillStyle = current.color;
                ctx.fill();
                ctx.closePath();

                if (current.type === 'swirl') {
                    drawSwirlParticles(current);
                }
            });
        }

        if (powerUp) { ctx.beginPath(); ctx.arc(powerUp.x, powerUp.y, powerUp.radius, 0, Math.PI * 2); ctx.fillStyle = "gold"; ctx.shadowColor = "yellow"; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0; ctx.closePath(); }

        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fillStyle = powerUpEffectActive ? "deepskyblue" : "lime";
        ctx.fill();
        ctx.closePath();

        dangerPoints.forEach(point => {
            if (point.isWave && waveImageLoaded) {
                const size = WAVE_IMAGE_SIZE; const offset = size / 2;
                ctx.save(); ctx.translate(point.x, point.y); ctx.rotate(point.rotation); ctx.drawImage(waveImage, -offset, -offset, size, size); ctx.restore();
            } else {
                ctx.beginPath();
                ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
                ctx.fillStyle = isPausedForReposition ? "orange" : "red";
                ctx.fill();
                ctx.closePath();
            }
        });

        trash.forEach(t => { ctx.drawImage(t.img, t.x - t.radius, t.y - t.radius, t.radius * 2, t.radius * 2); });

        if (isPausedForReposition) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; ctx.fillRect(0, canvas.height / 2 - 50, canvas.width, 100);
            ctx.textAlign = 'center'; ctx.fillStyle = 'white';
            ctx.font = '48px Arial'; ctx.fillText('¡PELIGROS REUBICADOS!', canvas.width / 2, canvas.height / 2 + 15);
            ctx.font = '24px Arial'; ctx.fillText('Prepárate...', canvas.width / 2, canvas.height / 2 + 50);
        }
    }

    function gameLoop() {
        if (!isGameRunning) return;

        rotationOffset += 0.05; 

        if (!isPausedForReposition) {
            movePlayer();
            applyMagnetAttraction();
            moveDangerPoints();
            checkCollisions();
            checkDangerCollision();

            updateMagnetBar(); 
        }

        draw();
        requestAnimationFrame(gameLoop);
    }

    // ------------------------------------
    // Inicialización y Eventos
    // ------------------------------------

    function startGame() {
        gameOverScreen.style.display = "none";
        document.getElementById("startScreen").style.display = "none";
        document.getElementById("gameScreen").style.display = "block";

        score = 0; currentsAreActive = false; currents = [];

        if (currentTimeoutId) clearTimeout(currentTimeoutId);
        if (powerUpTimer) clearTimeout(powerUpTimer);
        if (effectTimeout) clearTimeout(effectTimeout);
        magnetStatus.style.display = "none";

        nextRepositionScore = INITIAL_REPOSITION_THRESHOLD;
        isPausedForReposition = false;
        powerUpEffectActive = false;
        powerUp = null;

        nextPowerUpScore = POWERUP_INITIAL_THRESHOLD; 

        player = { x: 400, y: 300, radius: 20, speed: NORMAL_SPEED };
        trash = []; 
        dangerPoints = []; 
        nextWaveScore = WAVE_INTERVAL;
        
        lastTrashType = null; // Reiniciar el contador de repetición

        // Se generan las piezas de basura ANTES que los puntos de peligro
        for (let i = 0; i < 30; i++) spawnTrash();
        
        // Los puntos de peligro estáticos ahora utilizan la lógica de generateSafePosition
        for (let i = 0; i < 9; i++) spawnDangerPoint();


        updateScore();
        isGameRunning = true;
        startTimer();
        gameLoop();
    }

    // Manejadores de Eventos
    document.getElementById("startBtn").addEventListener("click", () => {
        startGame();
    });
    retryBtn.addEventListener("click", () => { startGame(); });

    document.addEventListener("keydown", e => {
        if (e.key === "Enter" && !isGameRunning && !startBtn.disabled) {
            e.preventDefault();
            startGame();
            return;
        }
        keys[e.key] = true;
    });
    document.addEventListener("keyup", e => (keys[e.key] = false));

    window.addEventListener("beforeunload", saveScore);

    // Inicialización al cargar la página
    loadHistory();
});