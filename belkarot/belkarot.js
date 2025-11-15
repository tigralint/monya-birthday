let stingerPlayed = false;

document.addEventListener('DOMContentLoaded', () => {

    const stinger = document.getElementById('audio-stinger');
    const showPromptButton = document.getElementById('show-prompt-button');

    if (showPromptButton) {
        showPromptButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            requestQuarantineCode(); 
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
        } else if (code.trim() === '1488') {
            // УСПЕХ!
            document.body.classList.add('stabilized');
            const header = document.getElementById('main-glitch-header');
            header.innerText = "ПРОТОКОЛ 1488 ПРИНЯТ. СИСТЕМА СТАБИЛИЗИРОВАНА.";
            header.dataset.text = "ПРОТОКОЛ 1488 ПРИНЯТ. СИСТЕМА СТАБИЛИЗИРОВАНА.";

            localStorage.setItem('belkarot_complete', 'true');
            if (showPromptButton) showPromptButton.style.display = 'none';

            // *** ИЗМЕНЕНИЕ: "Печать" запускается ТОЛЬКО ПОСЛЕ УСПЕХА ***
            typeAllTruths();

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
        }
    }

    // "Печать" текста (теперь это просто функция, которая ждет вызова)
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

    // *** ИЗМЕНЕНИЕ: Мы БОЛЬШЕ НЕ запускаем "печать" при загрузке. ***
    // typeAllTruths(); 
});