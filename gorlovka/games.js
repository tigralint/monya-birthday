// --- НОВАЯ ФУНКЦИЯ "ТРЯСКИ" ---
function triggerShake() {
    const container = document.querySelector('.game-container');
    if (!container) return;
    
    // Убираем класс, если он уже есть, чтобы анимация перезапустилась
    container.classList.remove('screen-shake');
    // Эта "хитрость" (void) заставляет браузер применить изменения немедленно
    void container.offsetWidth; 
    container.classList.add('screen-shake');
}
// --- КОНЕЦ НОВОЙ ФУНКЦИИ ---


document.addEventListener('DOMContentLoaded', () => {

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
    const timerDisplay = document.getElementById('don-mak-timer'); // Элемент таймера

    let satisfaction = 50;
    let customersServed = 0;
    const customersToWin = 10;
    let currentCustomer = null;
    let game1Active = false;
    let gameTimer; // Переменная для интервала таймера
    let timeLeft = 60; // 60 секунд

    startDonMakButton.addEventListener('click', () => {
        donMakGameContainer.classList.remove('hidden');
        startDonMakButton.classList.add('hidden');
        game1Active = true;
        satisfaction = 50;
        customersServed = 0;
        timeLeft = 60;
        timerDisplay.textContent = `ВРЕМЯ: ${timeLeft}`;
        updateSatisfactionBar();
        donMakMessage.textContent = 'Приготовьтесь...';
        
        // Запускаем таймер
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
            } else {
                // НЕПРАВИЛЬНО
                satisfaction -= 20;
                donMakMessage.textContent = 'Не тот заказ! (-20)';
                triggerShake(); // <-- ТРЯСКА
            }
            
            if (satisfaction > 100) satisfaction = 100;
            updateSatisfactionBar();
            clearCustomer();

            if (satisfaction <= 0) {
                loseDonMak('ПРОВАЛ! "Монино страдание" достигнуто!');
            } else if (customersServed >= customersToWin) {
                winDonMak();
            } else {
                setTimeout(spawnCustomer, Math.random() * 1000 + 1000); // Следующий клиент (чуть быстрее)
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
        clearInterval(gameTimer); // Останавливаем таймер
        donMakMessage.textContent = `${message} Попробуйте снова.`;
        triggerShake(); // <-- ТРЯСKA
        clearCustomer();
        startDonMakButton.classList.remove('hidden');
    }

    function winDonMak() {
        game1Active = false;
        clearInterval(gameTimer); // Останавливаем таймер
        donMakGameContainer.classList.add('hidden');
        challenge1.classList.add('hidden'); 
        challenge2.classList.remove('hidden'); 
    }

    // --- ЛОГИКА ИГРЫ 2: "Прото-Плитки-Фортепіано" (УЛУЧШЕНА) ---
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
        pianoGameContainer.classList.remove('hidden');
        startPianoButton.classList.add('hidden');
        game2Active = true;
        score = 0;
        pianoScoreDisplay.textContent = score;
        pianoMessage.textContent = 'Играйте!';
        spawnTile(); // Запускаем первый спавн
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
        
        // --- УЛУЧШЕНИЕ: Динамическая скорость ---
        // Скорость падения увеличивается с очками
        const duration = Math.max(1.2, 3 - score * 0.1); // от 3с до 1.2с
        tile.style.animation = `drop ${duration}s linear`;
        
        // --- УЛУЧШЕНИЕ: Надежный клик ---
        tile.addEventListener('click', hitTile);
        
        pianoTrack.appendChild(tile);

        // Проверка на промах (плитка долетела до низа)
        setTimeout(() => {
            if (game2Active && tile.parentElement) {
                // Плитка все еще на поле и не была нажата = промах
                pianoMessage.textContent = 'Пропуск! -1 очко';
                score--;
                if (score < 0) score = 0;
                pianoScoreDisplay.textContent = score;
                tile.remove();
                triggerShake(); // <-- ТРЯСКА
            }
        }, duration * 1000 - 50); // Удаляем за 50мс до конца анимации

        // --- УЛУЧШЕНИЕ: Рандомный интервал спавна ---
        const nextSpawnTime = Math.random() * (1200 - score * 20) + 500; // от ~1.7с до 0.5с
        tileSpawnTimeout = setTimeout(spawnTile, Math.max(400, nextSpawnTime));
    }

    function hitTile(e) {
        if (!game2Active) return;
        
        const tile = e.target;
        
        // Предотвращаем двойное нажатие
        if (tile.classList.contains('hit')) return; 

        score++;
        pianoScoreDisplay.textContent = score;
        tile.classList.add('hit'); // Помечаем как "нажатую"
        
        // Визуально останавливаем анимацию и "тушим" плитку
        const computedStyle = window.getComputedStyle(tile);
        const top = computedStyle.getPropertyValue("top");
        tile.style.animation = 'none';
        tile.style.top = top;
        
        // Удаляем через мгновение
        setTimeout(() => tile.remove(), 100);

        if (score >= scoreToWin) {
            winPianoTiles();
        }
    }

    function winPianoTiles() {
        game2Active = false;
        clearTimeout(tileSpawnTimeout); // Останавливаем спавн
        pianoGameContainer.classList.add('hidden');
        challenge2.classList.add('hidden');
        reward.classList.remove('hidden');
        pianoTrack.innerHTML = ''; // Очищаем поле
        
        // --- НОВЫЙ КОД (ШАГ 3) ---
        // Сохраняем прогресс, чтобы "открыть" следующий уровень
        localStorage.setItem('gorlovka_complete', 'true');
        // --- КОНЕЦ НОВОГО КОДА ---
    }

});