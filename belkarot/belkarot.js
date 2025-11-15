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
            stopGlitchScroll(); // <-- НОВЫЙ КОД: Отключаем глючный скролл

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

    // --- НОВЫЙ КОД (Глючный скроллинг) ---
    let lastScrollY = window.scrollY;
    let isGlitching = false;

    function glitchScroll() {
        // Если система стабилизирована, не делаем ничего
        if (document.body.classList.contains('stabilized')) return;
        
        // C вероятностью 30% "сопротивляемся" скроллу
        if (Math.random() < 0.3 && !isGlitching) {
            isGlitching = true;
            const currentScroll = window.scrollY;
            
            // Если скроллит вниз, дергаем вверх
            if (currentScroll > lastScrollY) {
                window.scrollBy(0, -Math.random() * 100 - 50); 
            }
            
            lastScrollY = window.scrollY;
            
            setTimeout(() => { isGlitching = false; }, 100); // Кулдаун
        } else {
            lastScrollY = window.scrollY;
        }
    }

    // Функция, чтобы отключить этот эффект после победы
    function stopGlitchScroll() {
        window.removeEventListener('scroll', glitchScroll);
    }
    
    // Вешаем "слушатель" на скролл
    window.addEventListener('scroll', glitchScroll);
    // --- КОНЕЦ НОВОГО КОДА ---

    // Запускаем "печать" сразу. 'Prompt' ждет клика.
    typeAllTruths();
});