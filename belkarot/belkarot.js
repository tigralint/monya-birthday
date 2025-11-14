// *** НОВЫЙ КОД (Фикс Звука Белкарота) ***
let stingerPlayed = false;
let horrorAudioStarted = false; // Флаг, чтобы музыка запустилась 1 раз

// Помощник для SFX
function playAudio(audioEl) {
    if (audioEl) {
        audioEl.currentTime = 0;
        audioEl.play().catch(e => console.error("Ошибка SFX:", e));
    }
}

// Помощник для фоновой музыки (она должна запуститься только 1 раз)
function playHorrorAudio() {
    if (horrorAudioStarted) return; // Не запускать, если уже играет
    
    const horrorAudio = document.getElementById('horror-audio');
    if (horrorAudio) {
        horrorAudio.play().catch(e => console.error("Не удалось запустить хоррор-аудио:", e));
        horrorAudioStarted = true;
    }
}
// *** КОНЕЦ НОВОГО КОДА ***

document.addEventListener('DOMContentLoaded', () => {

    const stinger = document.getElementById('audio-stinger');

    // Функция, которая запускает "квест"
    function requestQuarantineCode() {
        
        const code = prompt(
            "[ВНИМАНИЕ! ОБНАРУЖЕНО НЕСАНКЦИОНИРОВАННОЕ ПРОНИКНОВЕНИЕ.]\n\n" +
            "СИСТЕМА НЕСТАБИЛЬНА. АФФЕКТИВНЫЙ РЕЗОНАНС 'БЕЛКАРОТ' ДОСТИГ КРИТИЧЕСКОГО УРОВНЯ.\n\n" +
            "ТРЕБУЕТСЯ НЕМЕДЛЕННАЯ СТАБИЛИЗАЦИЯ.\n\n" +
            "ВВЕДИТЕ ПРОТОКОЛ СДЕРЖИВАНИЯ (4 ЦИФРЫ):", 
            "..."
        );

        // --- ИЗМЕНЕНИЕ (Фикс Звука): Запускаем музыку СРАЗУ ПОСЛЕ клика на prompt ---
        playHorrorAudio();

        if (code === null) {
            alert(
                "[ОШИКА! ЗАПРОС НА СТАБИЛИЗАЦИЮ ОТКЛОНЕН!]\n\n" +
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

            // --- ИЗМЕНЕНИЕ (Фикс Звука): Теперь мы должны ОСТАНОВИТЬ музыку, которую включили вручную ---
            const horrorAudio = document.getElementById('horror-audio');
            if (horrorAudio) {
                horrorAudio.pause();
                horrorAudio.currentTime = 0;
            }
            localStorage.setItem('belkarot_complete', 'true');

        } else {
            // ПРОВАЛ! 
            if (!stingerPlayed) {
                playAudio(stinger);
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

    requestQuarantineCode();
    typeAllTruths();
});