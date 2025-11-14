document.addEventListener('DOMContentLoaded', () => {

    // --- НОВЫЙ КОД (Аудио Этап): Помощник и SFX ---
    function playAudio(audioEl) {
        if (audioEl) {
            audioEl.currentTime = 0;
            audioEl.play().catch(e => console.error("Ошибка SFX:", e));
        }
    }
    const sfxSuccess = document.getElementById('audio-sfx-success');
    const sfxFail = document.getElementById('audio-sfx-fail');
    // --- КОНЕЦ НОВОГО КОДА ---

    // --- БАЗА ДАННЫХ ВОПРОСОВ (ИЗ ЛОРА) ---
    const questions = [
        {
            question: "Как, согласно 'Досье-001', звали 'Исток' и 'первый Сосуд'?",
            answers: [
                { text: "Красная Моня", correct: false },
                { text: "Праматерь Мония Горловская", correct: true },
                { text: "София Горлицкая", correct: false },
                { text: "Объект-777", correct: false }
            ]
        },
        {
            question: "Что, согласно 'Досье-002', категорически запрещает Статья 3 ЕКМПФС?",
            answers: [
                { text: "Непостижение Animus Moniae", correct: false },
                { text: "Молчание Мони", correct: false },
                { text: "Монино страдание", correct: true },
                { text: "Феномен Тиграна", correct: false }
            ]
        },
        {
            question: "Как в 'Досье-004' называется 'парадокс искреннего промаха', когда Тигран не может угодить Моне?",
            answers: [
                { text: "Феномен Тиграна (ФТ)", correct: true },
                { text: "Осенний экзистенциальный кризис", correct: false },
                { text: "Praeceptum Sanitatis", correct: false },
                { text: "Синдром Биба", correct: false }
            ]
        },
        {
            question: "Какой номер носит ключевое 'Дело M. (София) против T. (Тигран)' в 'Досье-004'?",
            answers: [
                { text: "001/25", correct: false },
                { text: "777/25", correct: false },
                { text: "1488/25", correct: true },
                { text: "007/25", correct: false }
            ]
        }
    ];

    // --- ЭЛЕМЕНТЫ DOM ---
    const startButton = document.getElementById('start-quiz-button');
    const introBlock = document.getElementById('quiz-intro');
    const quizBlock = document.getElementById('quiz-container');
    const questionElement = document.getElementById('quiz-question');
    const optionsElement = document.getElementById('quiz-options');
    const resultBlock = document.getElementById('quiz-result');

    let currentQuestionIndex = 0;

    // --- ЛОГИКА ---
    if (startButton) {
        startButton.addEventListener('click', startQuiz);
    }

    function startQuiz() {
        if (!introBlock || !quizBlock) return;
        currentQuestionIndex = 0;
        introBlock.style.display = 'none'; 
        resultBlock.style.display = 'none'; 
        quizBlock.style.display = 'block'; 
        showQuestion();
    }

    function showQuestion() {
        if (!questionElement || !optionsElement) return;

        optionsElement.innerHTML = '';
        const question = questions[currentQuestionIndex];
        questionElement.innerText = question.question;

        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('option-button');
            button.dataset.correct = answer.correct; 
            button.addEventListener('click', selectAnswer);
            optionsElement.appendChild(button);
        });
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const isCorrect = selectedButton.dataset.correct === 'true';

        Array.from(optionsElement.children).forEach(button => {
            button.disabled = true;
            if (button.dataset.correct === 'true') {
                button.classList.add('correct');
            } else {
                button.classList.add('incorrect');
            }
        });

        if (isCorrect) {
            // --- НОВЫЙ КОД (Аудио Этап): Звук успеха ---
            playAudio(sfxSuccess);
            // --- КОНЕЦ НОВОГО КОДА ---
            
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    showQuestion(); 
                } else {
                    showResult(); 
                }
            }, 1000); 
        } else {
            // --- НОВЫЙ КОД (Аудио Этап): Звук провала ---
            playAudio(sfxFail);
            // --- КОНЕЦ НОВОГО КОДА ---

            setTimeout(() => {
                alert("[ОШИБКА ВЕРИФИКАЦИИ] Протокол нарушен. Повторная калибровка...");
                startQuiz(); 
            }, 1000);
        }
    }

    function showResult() {
        if (!quizBlock || !resultBlock) return;
        quizBlock.style.display = 'none'; 
        resultBlock.style.display = 'block'; 
        localStorage.setItem('ivmi_quiz_complete', 'true');
    }

});