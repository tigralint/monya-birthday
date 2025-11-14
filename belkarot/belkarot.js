// --- ИЗМЕНЕНИЕ (Оптимизация): Убрана 'playAudio', она теперь в shared/audio_manager.js ---
let stingerPlayed = false;
// --- КОНЕЦ ИЗМЕНЕНИЯ ---

document.addEventListener('DOMContentLoaded', () => {

    const stinger = document.getElementById('audio-stinger');
    
    // --- ИЗМЕНЕНИЕ (Фикс Звука): Эта функция теперь вызывается из gate.js ПОСЛЕ клика ---
    window.belkarot_prompt = function() {
        requestQuarantineCode();
    }

    function requestQuarantineCode() {
        
        const code = prompt(
            "[ВНИМАНИЕ! ОБНАРУЖЕНО НЕСАНКЦИОНИРОВАННОЕ ПРОНИКНОВЕНИЕ.]\n\n" +
            "СИСТЕМА НЕСТАБИЛЬНА. АФФЕКТИВНЫЙ РЕЗОНАНС 'БЕЛКАРОТ' ДОСТИГ КРИТИЧЕСКОГО УРОВНЯ.\n\n" +
            "ТРЕБУЕТСЯ НЕМЕДЛЕННАЯ СТАБИЛИЗАЦИЯ.\n\n" +
            "ВВЕДИТЕ ПРОТОКОЛ СДЕРЖИВАНИЯ (4 ЦИФРЫ):", 
            "..."
        );

        if (code === null) {
            alert(
                "[ОШИБКА! ЗАПРОС НА СТАБИЛИЗАЦИЮ ОТКЛОНЕН!]\n\n" +
                "Отказ от ввода протокола недопустим. Система впадает в неконтролируемый резонанс...\n\n" +
                "ПОВТОРНЫЙ ЗАПРОС ПРОТОКОЛА СДЕРЖИВАНИЯ."
            );
            requestQuarantineCode(); 

        } else if (code.trim() === '1488') {
            // УСПЕХ!
            document.body.classList.add('stabilized');
            const header = document.getElementById('main-glitch-header');
            header.innerText = "ПРОТОКОЛ 1488 ПРИНЯТ. СИСТЕМА СТАБИЛИЗИРОВАНА.";
            header.dataset.text = "ПРОТОКОЛ 1488 ПРИНЯТ. СИСТЕМА СТАБИЛИЗИРОВАНА.";

            const horrorAudio = document.getElementById('page-audio'); // <-- ID изменен
            if (horrorAudio) {
                horrorAudio.pause();
                horrorAudio.currentTime = 0;
            }
            localStorage.setItem('belkarot_complete', 'true');

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
            requestQuarantineCode(); 
        }
    }

    // "Печать" текста
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

    // --- ИЗМЕНЕНИЕ (Фикс Звука): Запускаем "печать" сразу. 'Prompt' ждет клика. ---
    typeAllTruths();
});