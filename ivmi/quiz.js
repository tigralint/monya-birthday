document.addEventListener('DOMContentLoaded', () => {

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

    // 1. Нажатие кнопки "НАЧАТЬ"
    if (startButton) {
        startButton.addEventListener('click', startQuiz);
    }

    // 2. Запуск Квеста
    function startQuiz() {
        if (!introBlock || !quizBlock) return;
        currentQuestionIndex = 0;
        introBlock.style.display = 'none'; // Скрываем интро
        resultBlock.style.display = 'none'; // Скрываем старый результат (если есть)
        quizBlock.style.display = 'block'; // Показываем квест
        showQuestion();
    }

    // 3. Показ Вопроса
    function showQuestion() {
        if (!questionElement || !optionsElement) return;

        // Очищаем старые варианты
        optionsElement.innerHTML = '';
        
        // Берем текущий вопрос
        const question = questions[currentQuestionIndex];
        questionElement.innerText = question.question;

        // Создаем кнопки для ответов
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('option-button');
            button.dataset.correct = answer.correct; // Сохраняем, правильный ли он
            button.addEventListener('click', selectAnswer);
            optionsElement.appendChild(button);
        });
    }

    // 4. Выбор Ответа
    function selectAnswer(e) {
        const selectedButton = e.target;
        const isCorrect = selectedButton.dataset.correct === 'true';

        // Блокируем все кнопки
        Array.from(optionsElement.children).forEach(button => {
            button.disabled = true;
            // Показываем, какой был верный, а какой нет
            if (button.dataset.correct === 'true') {
                button.classList.add('correct');
            } else {
                button.classList.add('incorrect');
            }
        });

        if (isCorrect) {
            // Если ВЕРНО
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    showQuestion(); // Следующий вопрос
                } else {
                    showResult(); // Квест пройден
                }
            }, 1000); // Пауза, чтобы увидеть результат
        } else {
            // Если НЕВЕРНО
            setTimeout(() => {
                alert("[ОШИБКА ВЕРИФИКАЦИИ] Протокол нарушен. Повторная калибровка...");
                startQuiz(); // Начинаем заново
            }, 1000);
        }
    }

    // 5. Показ Результата
    function showResult() {
        if (!quizBlock || !resultBlock) return;
        quizBlock.style.display = 'none'; // Скрываем квест
        resultBlock.style.display = 'block'; // Показываем пароль
    }

});