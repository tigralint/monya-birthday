const sfxSuccess = document.getElementById('audio-sfx-success');
const sfxFail = document.getElementById('audio-sfx-fail');

document.addEventListener('DOMContentLoaded', () => {

    // --- ЭЛЕМЕНТЫ DOM ---
    const gameScreen = document.getElementById('game-screen');
    const winScreen = document.getElementById('win-screen');
    const monyaDialogue = document.getElementById('monya-dialogue');
    const tigranThought = document.getElementById('tigran-thought');
    const optionsContainer = document.getElementById('options-container');
    const feedbackWindow = document.getElementById('feedback-window');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackMonyaResponse = document.getElementById('feedback-monya-response');

    // --- НОВЫЙ КОД (Идея 4): Элементы "Шкалы Психики" ---
    const psycheBar = document.getElementById('psyche-bar');
    let tigranPsyche = 100;
    // --- КОНЕЦ НОВОГО КОДА ---

    const scenario = {
        monyaSpeech: "Ты... ты опять все сделал не так. Я не это имела в виду.",
        options: [
            {
                text: "«Так скажи мне прямо, ЧТО ты хочешь, и я это сделаю!»",
                isCorrect: false,
                feedback: "ОШИБКА: 'Речь-Приказ'. Вы перекладываете ответственность.",
                monyaResponse: "«Думай сам!»"
            },
            {
                text: "«Я не понимаю, что тебе не нравится. По-моему, все отлично».",
                isCorrect: false,
                feedback: "ОШИБКА: 'Речь-Обесценивание'. Вы объявили ее чувства иррациональными.",
                monyaResponse: "«Ты не понимаешь? Иди лечись!»"
            },
            {
                text: "«Я так старался! Я так несчастен, что тебе не понравилось!»",
                isCorrect: false,
                feedback: "ОШИБКА: 'Речь-Жалоба'. Вы требуете, чтобы она утешала вас.",
                monyaResponse: "«Не ной!»"
            },
            {
                text: "«Ой, да ладно, это же мелочи! Это всего лишь юмор!»",
                isCorrect: false,
                feedback: "ОШИБКА: 'Речь-Тривиализация'. Вы обесценили ее святыню.",
                monyaResponse: "«(Ледяное молчание)... Ты невыносим»."
            },
            {
                text: "(Молчать 5 секунд)... «Я вижу твою боль. Я признаю ее. Я хочу научиться видеть мир твоими глазами».",
                isCorrect: true,
                feedback: "УСПЕХ: 'Здоровая Речь'. Вы победили свое Эго (Доксона) и стали 'Садовником'.",
                monyaResponse: "«...Это... хорошее начало, Тигран»."
            }
        ]
    };

    // --- НОВЫЙ КОД (Идея 4): Обновление шкалы ---
    function updatePsycheBar() {
        if (psycheBar) {
            psycheBar.style.width = `${tigranPsyche}%`;
        }
    }

    function loadScenario() {
        monyaDialogue.textContent = scenario.monyaSpeech;
        tigranThought.textContent = "Я совершил 'искренний промах'. Она расстроена. Что я должен сказать?";
        optionsContainer.innerHTML = '';
        feedbackWindow.classList.add('hidden');

        // Сброс шкалы
        tigranPsyche = 100;
        updatePsycheBar();

        scenario.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            button.textContent = option.text;
            button.dataset.correct = option.isCorrect;
            button.dataset.feedback = option.feedback;
            button.dataset.response = option.monyaResponse;
            button.addEventListener('click', selectAnswer);
            optionsContainer.appendChild(button);
        });
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const isCorrect = selectedButton.dataset.correct === 'true';

        Array.from(optionsContainer.children).forEach(button => {
            button.disabled = true;
            if (button !== selectedButton) {
                button.style.opacity = '0.4';
            }
        });

        feedbackWindow.classList.remove('hidden');
        feedbackTitle.textContent = selectedButton.dataset.feedback;
        feedbackMonyaResponse.textContent = `МОНЯ: ${selectedButton.dataset.response}`;

        if (isCorrect) {
            feedbackWindow.classList.add('correct');
            feedbackWindow.classList.remove('error');
            playAudio(sfxSuccess); 
            setTimeout(winGame, 3000);
        } else {
            feedbackWindow.classList.add('error');
            feedbackWindow.classList.remove('correct');
            playAudio(sfxFail); 
            
            // --- НОВЫЙ КОД (Идея 4): Урон психике ---
            tigranPsyche -= 34; // 3 удара (34*3 > 100)
            updatePsycheBar();
            
            if (tigranPsyche <= 0) {
                setTimeout(loseGame, 2000);
            } else {
                setTimeout(loadScenario, 4000); // Перезапуск (как было)
            }
            // --- КОНЕЦ НОВОГО КОДА ---
        }
    }

    // --- НОВЫЙ КОД (Идея 4): Функция проигрыша ---
    function loseGame() {
        alert("[СИСТЕМНЫЙ СБОЙ]\n\nКритическое повреждение рассудка исследователя.\nФЕНОМЕН ТИГРАНА НЕИЗЛЕЧИМ.\n\n...Перезапуск симуляции...");
        loadScenario();
    }
    
    function winGame() {
        gameScreen.classList.add('hidden');
        winScreen.classList.remove('hidden');
        localStorage.setItem('ft_sim_complete', 'true');
    }

    loadScenario();
});