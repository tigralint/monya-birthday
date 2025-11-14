// --- НОВЫЙ КОД (Аудио Этап): Центральный Аудио Менеджер ---

// 1. Помощники для управления звуком
function playAudio(audioEl, loop = false) {
    if (audioEl) {
        audioEl.currentTime = 0;
        audioEl.loop = loop;
        audioEl.play().catch(e => console.error("Ошибка воспроизведения аудио:", e));
    }
}
function stopAudio(audioEl) {
    if (audioEl) {
        audioEl.pause();
        audioEl.currentTime = 0;
    }
}

// 2. Функция "Тряски"
function triggerShake() {
    const container = document.querySelector('.game-container');
    if (!container) return;
    container.classList.remove('screen-shake');
    void container.offsetWidth; 
    container.classList.add('screen-shake');
}
// --- КОНЕЦ НОВОГО КОДА ---

document.addEventListener('DOMContentLoaded', () => {

    // --- НОВЫЙ КОД (Аудио Этап): Получаем все аудио-элементы ---
    const audioBg = document.getElementById('audio-bg');
    const audioDonMak = document.getElementById('audio-donmak');
    const audioPiano = document.getElementById('audio-piano');
    const sfxSuccess = document.getElementById('audio-sfx-success');
    const sfxFail = document.getElementById('audio-sfx-fail');

    // 3. Запускаем фоновую музыку Горловки
    playAudio(audioBg, true);
    // --- КОНЕЦ НОВОГО КОДА ---

    // --- ОБЩИЕ ЭЛЕМЕНТЫ ---
    const challenge1 = document.getElementById('challenge-1');
    const challenge2 = document.getElementById('challenge-2');
    const reward = document.getElementById('gorlovka-reward');

    // --- ЛОГИКА ИГРЫ 1: "Дон-Макъ" (Don-Mak) ---
    const startDonMakButton = document.getElementById('start-don-mak');
    const donMakGameContainer = document.getElementById('don-mak-game');
    const satisfactionBar = document.getElementById('satisfaction-bar');
    const customerArea = document.getElementById('customer-area');
    const donMakMessage = document.getElementById('don-mak-message');
    const foodButtons = document.querySelectorAll('.food-button');
    const timerDisplay = document.getElementById('don-mak-timer'); 

    let satisfaction = 50;
    let customersServed = 0;
    const customersToWin = 10;
    let currentCustomer = null;
    let game1Active = false;
    let gameTimer; 
    let timeLeft = 60; 

    startDonMakButton.addEventListener('click', () => {
        // --- НОВЫЙ КОД (Аудио Этап): Меняем музыку ---
        stopAudio(audioBg);
        playAudio(audioDonMak, true);
        // --- КОНЕЦ НОВОГО КОДА ---

        donMakGameContainer.classList.remove('hidden');
        startDonMakButton.classList.add('hidden');
        game1Active = true;
        satisfaction = 50;
        customersServed = 0;
        timeLeft = 60;
        timerDisplay.textContent = `ВРЕМЯ: ${timeLeft}`;
        updateSatisfactionBar();
        donMakMessage.textContent = 'Приготовьтесь...';
        
        gameTimer = setInterval(updateTimer, 1000);
        setTimeout(spawnCustomer, 2000);
    });

    foodButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!game1Active || !currentCustomer) return;
            
            const foodType = button.dataset.food;
            if (foodType === currentCustomer.order) {
                // ПРАВИЛЬНО
                satisfaction += 15;
                customersServed++;
                donMakMessage.textContent = `Клиент доволен! (+15) Подано: ${customersServed}/${customersToWin}`;
                playAudio(sfxSuccess); // <-- SFX
            } else {
                // НЕПРАВИЛЬНО
                satisfaction -= 20;
                donMakMessage.textContent = 'Не тот заказ! (-20)';
                triggerShake(); 
                playAudio(sfxFail); // <-- SFX
            }
            
            if (satisfaction > 100) satisfaction = 100;
            updateSatisfactionBar();
            clearCustomer();

            if (satisfaction <= 0) {
                loseDonMak('ПРОВАЛ! "Монино страдание" достигнуто!');
            } else if (customersServed >= customersToWin) {
                winDonMak();
            } else {
                setTimeout(spawnCustomer, Math.random() * 1000 + 1000); 
            }
        });
    });

    function updateTimer() {
        if (!game1Active) return;
        timeLeft--;
        timerDisplay.textContent = `ВРЕМЯ: ${timeLeft}`;
        if (timeLeft <= 0) {
            loseDonMak('ВРЕМЯ ВЫШЛО! Вы не успели!');
        }
    }

    function spawnCustomer() {
        if (!game1Active) return;
        
        const orderType = Math.random() > 0.5 ? 'lepeshka' : 'burger';
        const orderText = orderType === 'lepeshka' ? 'Лепешку!' : 'Бургер!';
        
        currentCustomer = { order: orderType };
        
        customerArea.innerHTML = `
            <div class="customer">
                <div class="customer-order">${orderText}</div>
            </div>
        `;
        donMakMessage.textContent = 'Новый клиент!';
    }

    function clearCustomer() {
        currentCustomer = null;
        customerArea.innerHTML = '';
    }

    function updateSatisfactionBar() {
        satisfactionBar.style.width = `${satisfaction}%`;
    }

    function loseDonMak(message) {
        game1Active = false;
        clearInterval(gameTimer); 
        donMakMessage.textContent = `${message} Попробуйте снова.`;
        triggerShake(); 
        clearCustomer();
        startDonMakButton.classList.remove('hidden');

        // --- НОВЫЙ КОД (Аудио Этап): Меняем музыку обратно ---
        stopAudio(audioDonMak);
        playAudio(audioBg, true);
        // --- КОНЕЦ НОВОГО КОДА ---
    }

    function winDonMak() {
        game1Active = false;
        clearInterval(gameTimer); 
        donMakGameContainer.classList.add('hidden');
        challenge1.classList.add('hidden'); 
        challenge2.classList.remove('hidden'); 

        // --- НОВЫЙ КОД (Аудио Этап): Меняем музыку обратно ---
        stopAudio(audioDonMak);
        playAudio(audioBg, true);
        playAudio(sfxSuccess);
        // --- КОНЕЦ НОВОГО КОДА ---
    }

    // --- ЛОГИКА ИГРЫ 2: "Прото-Плитки-Фортепіано" ---
    const startPianoButton = document.getElementById('start-piano');
    const pianoGameContainer = document.getElementById('piano-game');
    const pianoTrack = document.getElementById('piano-track');
    const pianoScoreDisplay = document.getElementById('piano-score');
    const pianoMessage = document.getElementById('piano-message');
    
    let score = 0;
    const scoreToWin = 20;
    let game2Active = false;
    let tileSpawnTimeout;

    startPianoButton.addEventListener('click', () => {
        // --- НОВЫЙ КОД (Аудио Этап): Меняем музыку ---
        stopAudio(audioBg);
        playAudio(audioPiano, true);
        // --- КОНЕЦ НОВОГО КОДА ---

        pianoGameContainer.classList.remove('hidden');
        startPianoButton.classList.add('hidden');
        game2Active = true;
        score = 0;
        pianoScoreDisplay.textContent = score;
        pianoMessage.textContent = 'Играйте!';
        spawnTile(); 
    });

    function spawnTile() {
        if (!game2Active) return;
        
        const tile = document.createElement('div');
        tile.classList.add('piano-tile');
        
        const trackWidth = pianoTrack.offsetWidth;
        const tileWidth = 75;
        const positions = (trackWidth - tileWidth) / tileWidth;
        const randomPosIndex = Math.floor(Math.random() * (positions + 1));
        tile.style.left = `${randomPosIndex * tileWidth}px`;
        
        const duration = Math.max(1.2, 3 - score * 0.1); 
        tile.style.animation = `drop ${duration}s linear`;
        
        tile.addEventListener('click', hitTile);
        
        pianoTrack.appendChild(tile);

        // Проверка на промах
        setTimeout(() => {
            if (game2Active && tile.parentElement) {
                pianoMessage.textContent = 'Пропуск! -1 очко';
                score--;
                if (score < 0) score = 0;
                pianoScoreDisplay.textContent = score;
                tile.remove();
                triggerShake(); 
                playAudio(sfxFail); // <-- SFX
            }
        }, duration * 1000 - 50); 

        const nextSpawnTime = Math.random() * (1200 - score * 20) + 500; 
        tileSpawnTimeout = setTimeout(spawnTile, Math.max(400, nextSpawnTime));
    }

    function hitTile(e) {
        if (!game2Active) return;
        
        const tile = e.target;
        if (tile.classList.contains('hit')) return; 

        score++;
        pianoScoreDisplay.textContent = score;
        tile.classList.add('hit'); 
        playAudio(sfxSuccess); // <-- SFX
        
        const computedStyle = window.getComputedStyle(tile);
        const top = computedStyle.getPropertyValue("top");
        tile.style.animation = 'none';
        tile.style.top = top;
        
        setTimeout(() => tile.remove(), 100);

        if (score >= scoreToWin) {
            winPianoTiles();
        }
    }

    function winPianoTiles() {
        game2Active = false;
        clearTimeout(tileSpawnTimeout); 
        pianoGameContainer.classList.add('hidden');
        challenge2.classList.add('hidden');
        reward.classList.remove('hidden');
        pianoTrack.innerHTML = ''; 
        
        localStorage.setItem('gorlovka_complete', 'true');
        
        // --- НОВЫЙ КОД (Аудио Этап): Меняем музыку обратно ---
        stopAudio(audioPiano);
        playAudio(audioBg, true);
        playAudio(sfxSuccess);
        // --- КОНЕЦ НОВОГО КОДА ---
    }
});