document.addEventListener('DOMContentLoaded', () => {

    // --- БАЗА ДАННЫХ ИГРЫ (Основано на moryapsychology.docx и Мония.docx) ---
    const gameData = [
        {
            season: "СЕЗОН 1: ЛЕТО",
            message: "«Летняя Шизофрения». Я хочу ВСЕГО и СРАЗУ! И тишины, и музыки, и уединения, и толпы!",
            options: [
                { text: "Устроить грандиозный пир.", isCorrect: false },
                { text: "Принести охапку разных цветов (Дар 'Свободы Выбора').", isCorrect: true },
                { text: "Запереть ее в тихой комнате для медитации.", isCorrect: false }
            ],
            feedback_correct: "Идеально! Предоставление выбора - это то, что нужно!",
            feedback_incorrect: "Не то! Ты выбрал только одно из моих желаний! Сатисфакция падает..."
        },
        {
            season: "СЕЗОН 2: ОСЕНЬ",
            message: "«Осенний Экзистенциальный Кризис». Все суета. Все поверхностно. Мне нужна... ГЛУБИНА.",
            options: [
                { text: "Принести свиток Гераклита (Дар 'Со-размышления').", isCorrect: true },
                { text: "Попытаться развеселить ее шутками и танцами.", isCorrect: false },
                { text: "Подарить самое дорогое золотое ожерелье.", isCorrect: false }
            ],
            feedback_correct: "Да... это то, что нужно. Ты понял мой настрой.",
            feedback_incorrect: "Фальшь! Ты пытаешься отвлечь меня или откупиться! Мне нужна ПОДЛИННОСТЬ!"
        },
        {
            season: "СЕЗОН 3: ЗИМА",
            message: "«Зимняя Депрессия». (Объект молчит. В комнате холодно. Она ничего не хочет).",
            options: [
                { text: "Устроить вечеринку-сюрприз, чтобы ее расшевелить!", isCorrect: false },
                { text: "Требовать ответа: 'Скажи, что не так?!'", isCorrect: false },
                { text: "Молча подбросить дров в очаг (Дар 'Покоя').", isCorrect: true }
            ],
            feedback_correct: " (Она, кажется, не заметила, но в комнате стало теплее. Покой сохранен.)",
            feedback_incorrect: "НЕТ! ОСТАВЬ МЕНЯ В ПОКОЕ! Ты нарушил тишину!"
        },
        {
            season: "СЕЗОН 4: ВЕСНА",
            message: "«Весеннее Обострение». Ненавижу все старое! Требую немедленных, РАДИКАЛЬНЫХ ПЕРЕМЕН!",
            options: [
                { text: "Принести один росток в горшке (Дар 'Управляемой Новизны').", isCorrect: true },
                { text: "Сказать, что старое - это хорошо и надежно.", isCorrect: false },
                { text: "Согласиться и немедленно сжечь весь дом.", isCorrect: false }
            ],
            feedback_correct: "О... Новое. Маленькое. Да, это... дает надежду. Энергия направлена в созидание.",
            feedback_incorrect: "Ты либо споришь со мной, либо потакаешь хаосу! Ты не понимаешь!"
        }
    ];

    // --- ЭЛЕМЕНТЫ DOM ---
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const seasonDisplay = document.getElementById('season-display');
    const monyaAvatar = document.getElementById('monya-avatar');
    const satisfactionBar = document.getElementById('satisfaction-bar');
    const monyaMessage = document.getElementById('monya-message');
    const feedbackMessage = document.getElementById('feedback-message');
    const optionButtons = [
        document.getElementById('option-a'),
        document.getElementById('option-b'),
        document.getElementById('option-c')
    ];
    const resultTitle = document.getElementById('result-title');
    const resultText = document.getElementById('result-text');
    
    let satisfaction = 50;
    let currentSeason = 0;

    // --- ЛОГИКА ИГРЫ ---
    function startGame() {
        satisfaction = 50;
        currentSeason = 0;
        gameScreen.classList.remove('hidden');
        resultScreen.classList.add('hidden');
        displaySeason();
    }

    function displaySeason() {
        if (currentSeason >= gameData.length) {
            winGame();
            return;
        }

        const season = gameData[currentSeason];
        
        seasonDisplay.textContent = season.season;
        monyaMessage.textContent = season.message;
        feedbackMessage.textContent = "";
        updateBar();

        optionButtons.forEach((button, index) => {
            button.textContent = season.options[index].text;
            button.dataset.correct = season.options[index].isCorrect;
            button.disabled = false;
        });
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const isCorrect = selectedButton.dataset.correct === 'true';

        // Блокируем кнопки
        optionButtons.forEach(button => button.disabled = true);
        
        const season = gameData[currentSeason];

        if (isCorrect) {
            satisfaction += 25;
            feedbackMessage.textContent = `> СИСТЕМА: ${season.feedback_correct}`;
            monyaAvatar.classList.remove('damage');
        } else {
            satisfaction -= 30;
            feedbackMessage.textContent = `> СИСТЕМА: ${season.feedback_incorrect}`;
            monyaAvatar.classList.add('damage');
            // Убираем класс анимации
            setTimeout(() => monyaAvatar.classList.remove('damage'), 300);
        }

        if (satisfaction > 100) satisfaction = 100;
        updateBar();

        if (satisfaction <= 0) {
            setTimeout(loseGame, 2000);
        } else {
            currentSeason++;
            setTimeout(displaySeason, 3000);
        }
    }

    function updateBar() {
        satisfactionBar.style.width = `${satisfaction}%`;
        if (satisfaction < 30) {
            satisfactionBar.style.backgroundColor = 'var(--color-bar-damage)';
        } else {
            satisfactionBar.style.backgroundColor = 'var(--color-bar-fill)';
        }
    }

    function winGame() {
        gameScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        resultTitle.textContent = "СИМУЛЯЦИЯ УСПЕШНА";
        resultText.textContent = `Plena Satisfactio: ${satisfaction}%. Вы выдержали годичный цикл. Вы обладаете базовыми навыками "Садовника" и "Монианской Эмпатии".`;
    }

    function loseGame() {
        gameScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        resultTitle.textContent = "СИМУЛЯЦИЯ ПРОВАЛЕНА";
        resultText.textContent = `Plena Satisfactio: ${satisfaction}%. Достигнуто "Монино Страдание" (Нарушение Статьи 3 ЕКМПФС). Рекомендуется повторное изучение "Феномена Тиграна".`;
    }

    // --- ЗАПУСК ---
    optionButtons.forEach(button => button.addEventListener('click', selectAnswer));
    startGame();
})