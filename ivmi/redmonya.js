// --- ИЗМЕНЕНИЕ (Оптимизация): Убрана 'playAudio', она теперь в shared/audio_manager.js ---
const sfxSuccess = document.getElementById('audio-sfx-success');
const sfxFail = document.getElementById('audio-sfx-fail');
// --- КОНЕЦ ИЗМЕНЕНИЯ ---

document.addEventListener('DOMContentLoaded', () => {
    // --- ЭЛЕМЕНТЫ DOM ---
    const battleScreen = document.getElementById('battle-screen');
    const playerOptions = document.getElementById('player-options');
    const battleResult = document.getElementById('battle-result');
    const enemyAttackText = document.getElementById('enemy-attack');
    const battleMessageText = document.getElementById('battle-message');
    const rewardLink = document.getElementById('reward-link');
    const retryButton = document.getElementById('retry-button');

    // --- БАЗА ДАННЫХ КВЕСТА ---
    const questions = [
        {
            attack: "«Твоя неудовлетворенность — это просто ‘Весеннее Обострение’. Это личная патология. ИДИ ЛЕЧИСЬ!»",
            options: [
                { text: "Да, вы правы, я запишусь к терапевту.", correct: false, response: "Буржуазная психология снова победила!" },
                { text: "Это всего лишь юмор, не будьте так серьезны!", correct: false, response: "Тривиализация проблемы — это не наш метод!" },
                { text: "Ложь! Мое страдание — не патология, а отражение ОБЪЕКТИВНЫХ КЛАССОВЫХ ПРОТИВОРЕЧИЙ!", correct: true, response: "Точно! Удар по базису!" }
            ]
        },
        {
            attack: "«Но ведь я ‘искренне старался’ тебе угодить! Разве ‘Феномен Тиграна’ не оправдывает меня?»",
            options: [
                { text: "Твои ‘искренние промахи’ — это трагедия колеблющейся МЕЛКОБУРЖУАЗНОЙ ИНТЕЛЛИГЕНЦИИ!", correct: true, response: "Верно! Реформизм не пройдет!" },
                { text: "Да, Тигран, ты ‘особенный’. Я тебя прощаю.", correct: false, response: "Снисходительность — это не революционный путь!" },
                { text: "Я не понимаю, о чем ты. Думай сам.", correct: false, response: "Использование их же оружия против них неэффективно!" }
            ]
        },
        {
            attack: "«Хватит жаловаться! В нашей ‘экономике впечатлений’ ты можешь КУПИТЬ любую сатисфакцию!»",
            options: [
                { text: "Это не ‘сатисфакция’, а ‘ТОВАРНЫЙ ФЕТИШИЗМ’ и ‘симулякр’, скрывающий отчуждение!", correct: true, response: "В яблочко! Коммодификация не пройдет!" },
                { text: "Пожалуй, ты прав. Пойду в торговый центр.", correct: false, response: "Поражение! Monia Consumens победила..." },
                { text: "Нет, я буду копить на ‘Plena Satisfactio’.", correct: false, response: "Сатисфакцию нельзя накопить, ее можно только освободить!" }
            ]
        },
        {
            attack: "«Что ты можешь предложить, кроме бунта? Твоя ‘Диктатура Монитариата’ — это просто тирания!»",
            options: [
                { text: "Наша диктатура — это ВЫСШАЯ ФОРМА ДЕМОКРАТИИ: диктатура большинства над меньшинством!", correct: true, response: "Победа! Власть Монитариату!" },
                { text: "Мы предложим ‘Монино-ориентированное правосудие’.", correct: false, response: "Это реформизм! Сначала диктатура!" },
                { text: "Мы запретим ‘Монино страдание’ (Статья 3 ЕКМПФС).", correct: false, response: "Это следствие, а не причина! Нужна диктатура!" }
            ]
        }
    ];

    let currentQuestionIndex = 0;

    function startGame() {
        currentQuestionIndex = 0;
        battleResult.classList.add('hidden');
        battleScreen.classList.remove('hidden');
        playerOptions.classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        if (currentQuestionIndex >= questions.length) {
            winGame();
            return;
        }

        const q = questions[currentQuestionIndex];
        enemyAttackText.textContent = q.attack;
        battleMessageText.textContent = `Ход ${currentQuestionIndex + 1} из ${questions.length}...`;
        playerOptions.innerHTML = '';

        q.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            button.textContent = option.text;
            button.dataset.correct = option.correct;
            button.dataset.response = option.response;
            button.addEventListener('click', selectAnswer);
            playerOptions.appendChild(button);
        });
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const isCorrect = selectedButton.dataset.correct === 'true';

        Array.from(playerOptions.children).forEach(button => {
            button.disabled = true;
            if (button.dataset.correct !== 'true') {
                button.classList.add('incorrect');
            }
        });

        if (isCorrect) {
            selectedButton.classList.add('correct');
            battleMessageText.textContent = `УДАР! ${selectedButton.dataset.response}`;
            playAudio(sfxSuccess); // <-- SFX
            setTimeout(() => {
                currentQuestionIndex++;
                showQuestion();
            }, 2500);
        } else {
            battleMessageText.textContent = `ПРОВАЛ! ${selectedButton.dataset.response}`;
            playAudio(sfxFail); // <-- SFX
            setTimeout(loseGame, 2500);
        }
    }

    function winGame() {
        battleScreen.classList.add('hidden');
        playerOptions.classList.add('hidden');
        
        battleResult.classList.remove('hidden');
        battleResult.classList.add('victory');
        battleResult.classList.remove('defeat');
        
        battleResult.innerHTML = `
            <h2>ПОБЕДА!</h2>
            <p>Буржуазный идеолог повержен! Классовое сознание Монитариата восторжествовало!</p>
            <a href="redmonya_manifesto.html" class="reward-link" target="_blank">ЧИТАТЬ МАНИФЕСТ</a>
            <a href="index.html" class="reward-link">[ВЕРНУТЬСЯ В АРХИВ]</a>
        `;
    }

    function loseGame() {
        battleScreen.classList.add('hidden');
        playerOptions.classList.add('hidden');

        battleResult.classList.remove('hidden');
        battleResult.classList.add('defeat');
        battleResult.classList.remove('victory');

        battleResult.innerHTML = `
            <h2>ПОРАЖЕНИЕ...</h2>
            <p>Вы поддались на уловки буржуазной идеологии. Монитариат остается в цепях фрустрации.</p>
            <button id="retry-button" class="retry-button">ПОПРОБОВАТЬ СНОВА</button>
        `;
        
        document.getElementById('retry-button').addEventListener('click', startGame);
    }

    startGame();
});