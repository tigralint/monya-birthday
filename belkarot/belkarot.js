document.addEventListener('DOMContentLoaded', () => {

    // Функция, которая запускает "квест"
    function requestQuarantineCode() {
        
        // 1. Показываем всплывающее окно
        const code = prompt(
            "[ВНИМАНИЕ! ОБНАРУЖЕНО НЕСАНКЦИОНИРОВАННОЕ ПРОНИКНОВЕНИЕ.]\n\n" +
            "СИСТЕМА НЕСТАБИЛЬНА. АФФЕКТИВНЫЙ РЕЗОНАНС 'БЕЛКАРОТ' ДОСТИГ КРИТИЧЕСКОГО УРОВНЯ.\n\n" +
            "ТРЕБУЕТСЯ НЕМЕДЛЕННАЯ СТАБИЛИЗАЦИЯ.\n\n" +
            "ВВЕДИТЕ ПРОТОКОЛ СДЕРЖИВАНИЯ (4 ЦИФРЫ):", 
            "..."
        );

        // 2. Проверяем, что ввела София
        if (code === null) {
            
            // --- НАЧАЛО ИЗМЕНЕНИЙ ---
            // Пользователь нажал "Отмена". ЭТО НЕ ОПЦИЯ.
            // Принудительно запрашиваем код снова.
            alert(
                "[ОШИБКА! ЗАПРОС НА СТАБИЛИЗАЦИЮ ОТКЛОНЕН!]\n\n" +
                "Отказ от ввода протокола недопустим. Система впадает в неконтролируемый резонанс...\n\n" +
                "ПОВТОРНЫЙ ЗАПРОС ПРОТОКОЛА СДЕРЖИВАНИЯ."
            );
            requestQuarantineCode(); // Запускаем функцию снова
            // --- КОНЕЦ ИЗМЕНЕНИЙ ---

        } else if (code.trim() === '1488') {
            // УСПЕХ! Пароль верный.
            // 3. Добавляем класс "stabilized" к <body>
            document.body.classList.add('stabilized');
            
            // Меняем заголовок на "стабильный"
            const header = document.getElementById('main-glitch-header');
            header.innerText = "ПРОТОКОЛ 1488 ПРИНЯТ. СИСТЕМА СТАБИЛИЗИРОВАНА.";
            // Очищаем data-text, чтобы псевдо-элементы тоже исчезли
            header.dataset.text = "ПРОТОКОЛ 1488 ПРИНЯТ. СИСТЕМА СТАБИЛИЗИРОВАНА.";

            // 4. Находим и выключаем жуткий эмбиент
            const horrorAudio = document.getElementById('horror-audio');
            if (horrorAudio) {
                horrorAudio.pause();
                horrorAudio.currentTime = 0;
            }

            // --- НОВЫЙ КОД (ШАГ 3) ---
            // Сохраняем прогресс, чтобы "открыть" финал (Уровень 3)
            localStorage.setItem('belkarot_complete', 'true');
            // --- КОНЕЦ НОВОГО КОДА ---

        } else {
            // ПРОВАЛ! Пароль неверный.
            // 4. Показываем ошибку и запускаем квест заново (рекурсия)
            alert(
                "[ОШИБКА ДОСТУПА! НЕВЕРНЫЙ ПРОТОКОЛ!]\n\n" +
                "Аффективный резонанс 'Белкарот' усиливается...\n\n" +
                "Повторите ввод."
            );
            requestQuarantineCode(); // Запускаем функцию снова
        }
    }

    // --- НОВЫЙ КОД ДЛЯ "ПЕЧАТИ" ---
    
    // Асинхронная функция для "печати" по очереди
    async function typeAllTruths() {
        // Проверяем, есть ли у нас функция "печати"
        if (typeof typeText !== 'function') {
            console.error("Функция typeText не найдена. Не могу 'напечатать' истину.");
            // Все равно показываем текст, чтобы квест не сломался
            const truthTexts = document.querySelectorAll('.truth-file .truth-text');
            truthTexts.forEach(textEl => { textEl.style.visibility = 'visible'; });
            return;
        }

        const truthTexts = document.querySelectorAll('.truth-file .truth-text');
        
        // Прячем все тексты перед началом
        truthTexts.forEach(textEl => {
            // Сохраняем оригинальный HTML (включая <strong>)
            if (!textEl.dataset.text) {
                textEl.dataset.text = textEl.innerHTML;
            }
            textEl.innerHTML = ''; // Стираем
            textEl.style.visibility = 'hidden'; // Прячем
        });

        // "await" заставит код ждать, пока одна строка не "напечатается", 
        // прежде чем начать "печатать" следующую.
        for (const textEl of truthTexts) {
            const originalText = textEl.dataset.text;
            await typeText(textEl, originalText, 40); // 40ms - cкорость
            await new Promise(resolve => setTimeout(resolve, 300)); // Пауза 300ms между строками
        }
    }

    // Запускаем "квест" с паролем
    requestQuarantineCode();
    // И СРАЗУ ЖЕ запускаем "печать" истин
    typeAllTruths();

    // --- КОНЕЦ НОВОГО КОДА ---
});