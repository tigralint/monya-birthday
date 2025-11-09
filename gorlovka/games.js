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

    let satisfaction = 50; // Начинаем с 50%
    let customersServed = 0;
    const customersToWin = 10;
    let currentCustomer = null;
    let game1Active = false;

    startDonMakButton.addEventListener('click', () => {
        donMakGameContainer.classList.remove('hidden');
        startDonMakButton.classList.add('hidden');
        game1Active = true;
        satisfaction = 50;
        customersServed = 0;
        updateSatisfactionBar();
        donMakMessage.textContent = 'Приготовьтесь...';
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
            }
            
            if (satisfaction > 100) satisfaction = 100;
            updateSatisfactionBar();
            clearCustomer();

            if (satisfaction <= 0) {
                loseDonMak();
            } else if (customersServed >= customersToWin) {
                winDonMak();
            } else {
                setTimeout(spawnCustomer, 1500); // Следующий клиент
            }
        });
    });

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

    function loseDonMak() {
        game1Active = false;
        donMakMessage.textContent = 'ПРОВАЛ! "Монино страдание" достигнуто! Попробуйте снова.';
        clearCustomer();
        startDonMakButton.classList.remove('hidden');
    }

    function winDonMak() {
        game1Active = false;
        donMakGameContainer.classList.add('hidden');
        challenge1.classList.add('hidden'); // Скрываем первый квест
        challenge2.classList.remove('hidden'); // Показываем второй квест
    }

    // --- ЛОГИКА ИГРЫ 2: "Прото-Плитки-Фортепіано" (Piano Tiles) ---
    const startPianoButton = document.getElementById('start-piano');
    const pianoGameContainer = document.getElementById('piano-game');
    const pianoTrack = document.getElementById('piano-track');
    const pianoScoreDisplay = document.getElementById('piano-score');
    const pianoMessage = document.getElementById('piano-message');
    
    let score = 0;
    const scoreToWin = 20;
    let game2Active = false;
    let tileInterval;

    startPianoButton.addEventListener('click', () => {
        pianoGameContainer.classList.remove('hidden');
        startPianoButton.classList.add('hidden');
        game2Active = true;
        score = 0;
        pianoScoreDisplay.textContent = score;
        pianoMessage.textContent = 'Играйте!';
        tileInterval = setInterval(spawnTile, 1000); // Спавн плиток
    });

    pianoTrack.addEventListener('click', (e) => {
        if (!game2Active) return;
        
        if (e.target.classList.contains('piano-tile')) {
            // ПОПАЛ
            score++;
            pianoScoreDisplay.textContent = score;
            e.target.remove(); // Удаляем плитку
            
            if (score >= scoreToWin) {
                winPianoTiles();
            }
        } else {
            // ПРОМАХ
            pianoMessage.textContent = 'Фальшь! -5 очков!';
            score -= 5;
            if (score < 0) score = 0;
            pianoScoreDisplay.textContent = score;
        }
    });

    function spawnTile() {
        if (!game2Active) return;
        
        const tile = document.createElement('div');
        tile.classList.add('piano-tile');
        
        // Рандомная позиция по горизонтали (0, 75, 150, 225)
        const trackWidth = pianoTrack.offsetWidth;
        const tileWidth = 75;
        const positions = (trackWidth - tileWidth) / tileWidth; // (300-75)/75 = 3
        const randomPosIndex = Math.floor(Math.random() * (positions + 1)); // 0, 1, 2, or 3
        tile.style.left = `${randomPosIndex * tileWidth}px`;
        
        pianoTrack.appendChild(tile);

        // Удаляем плитку, если она ушла вниз
        setTimeout(() => {
            if (tile.parentElement && !tile.classList.contains('hit')) {
                // Плитка не была нажата - это промах
                pianoMessage.textContent = 'Пропуск! -3 очка!';
                score -= 3;
                if (score < 0) score = 0;
                pianoScoreDisplay.textContent = score;
                tile.remove();
            }
        }, 3000); // Время анимации
    }

    function winPianoTiles() {
        game2Active = false;
        clearInterval(tileInterval);
        pianoGameContainer.classList.add('hidden');
        challenge2.classList.add('hidden'); // Скрываем второй квест
        reward.classList.remove('hidden'); // Показываем ФИНАЛ
        pianoTrack.innerHTML = ''; // Очищаем поле
    }

});