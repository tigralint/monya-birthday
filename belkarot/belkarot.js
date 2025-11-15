let stingerPlayed = false;

document.addEventListener('DOMContentLoaded', () => {

    const stinger = document.getElementById('audio-stinger');
    
    // *** НОВЫЙ КОД (Фикс Звука): Находим новую кнопку ***
    const showPromptButton = document.getElementById('show-prompt-button');

    // *** ИЗМЕНЕНИЕ (Фикс Звука): Окно пароля НЕ запускается само. ***
    // Оно ждет клика по кнопке.
    if (showPromptButton) {
        showPromptButton.addEventListener('click', (e) => {
            e.preventDefault(); // Не даем ссылке-кнопке прыгать
            requestQuarantineCode(); // Запускаем квест с паролем
        });
    }

    // "Квест" с паролем
    function requestQuarantineCode() {
        
        const code = prompt(
            "[ВНИМАНИЕ! ОБНАРУЖЕНО НЕСАНКЦИОНИРОВАННОЕ ПРОНИКНОВЕНИЕ.]\n\n" +
            "СИСТЕМА НЕСТАБИЛЬНА. АФФЕКТИВНЫЙ РЕЗОНАНС 'БЕЛКАРОТ' ДОСТИГ КРИТИЧЕСКОГО УРОВНЯ.\n\n" +
            "ТРЕБУЕТСЯ НЕМЕДЛЕННАЯ СТАБИЛИЗАЦИЯ.\n\n" +
            "ВВЕДИТЕ ПРОТОКОЛ СДЕРЖИВАНИЯ (4 ЦИФРЫ):", 
            "..."
        );

        if (code === null) {
            // (Пользователь нажал "Отмена")
            // Ничего не делаем, он остается на странице с играющей музыкой.
        } else if (code.trim() === '1488') {
            // УСПЕХ!
            document.body.classList.add('stabilized');
            const header = document.getElementById('main-glitch-header');
            header.innerText = "ПРОТОКОЛ 1488 ПРИНЯТ. СИСТЕМА СТАБИЛИЗИРОВАНА.";
            header.dataset.text = "ПРОТОКОЛ 1488 ПРИНЯТ. СИСТЕМА СТАБИЛИЗИРОВАНА.";

            const horrorAudio = document.getElementById('page-audio'); 
            if (horrorAudio) {
                horrorAudio.pause();
                horrorAudio.currentTime = 0;
            }
            localStorage.setItem('belkarot_complete', 'true');
            
            // Прячем кнопку, так как она больше не нужна
            if (showPromptButton) showPromptButton.style.display = 'none';

        } else {
            // ПРОВАЛ! 
            if (!stingerPlayed) {
                playAudio(stinger); // <-- SFX
                stingerPlayed = true;
            }
            
            alert(
                "[ОШИБКА ДОСТУПА! НЕВЕРНЫЙ ПРОТОКОЛ!]\n\n" +
                "Аффективный резонанс 'Белкарот' усиливается...\n\n" +
                "Повторите ввод."
            );
            // НЕ вызываем requestQuarantineCode() заново,
            // даем пользователю самому нажать кнопку еще раз.
        }
    }

    // "Печать" текста (запускается сразу при загрузке)
    async function typeAllTruths() {
        if (typeof typeText !== 'function') {
            console.error("Функция typeText не найдена. Не могу 'напечатать' истину.");
            const truthTexts = document.querySelectorAll('.truth-file .truth-text');
            truthTexts.forEach(textEl => { textEl.style.visibility = 'visible'; });
            return;
        }

        const truthTexts = document.querySelectorAll('.truth-file .truth-text');
        
        truthTexts.forEach(textEl => {
            if (!textEl.dataset.text) {
                textEl.dataset.text = textEl.innerHTML;
            }
            textEl.innerHTML = ''; 
            textEl.style.visibility = 'hidden'; 
        });

        for (const textEl of truthTexts) {
            const originalText = textEl.dataset.text;
            await typeText(textEl, originalText, 40); 
            await new Promise(resolve => setTimeout(resolve, 300)); 
        }
    }

    // Запускаем "печать" сразу. 'Prompt' ждет клика.
    typeAllTruths();
});