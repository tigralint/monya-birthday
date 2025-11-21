document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const contentPanels = document.querySelectorAll('.content-area .content-panel');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 

            const targetId = link.getAttribute('data-target');
            const targetPanel = document.querySelector(targetId);

            navLinks.forEach(nav => nav.classList.remove('active'));
            contentPanels.forEach(panel => panel.classList.remove('active'));

            link.classList.add('active');
            
            if (targetPanel) {
                targetPanel.classList.add('active');

                // --- ОБНОВЛЕННЫЙ КОД: ЭФФЕКТ ДЕШИФРОВКИ ---
                const titleElement = targetPanel.querySelector('h2');
                if (titleElement) {
                    // Сохраняем оригинал
                    if (!titleElement.dataset.text) {
                        titleElement.dataset.text = titleElement.innerText;
                    }
                    const originalTitle = titleElement.dataset.text;
                    
                    // Проверяем наличие функции
                    if (typeof decryptText === 'function') {
                        // Запускаем эффект "взлома"
                        decryptText(titleElement, originalTitle, 30);
                    } else {
                        titleElement.innerText = originalTitle;
                        titleElement.style.visibility = 'visible';
                    }
                }
                // --- КОНЕЦ ОБНОВЛЕНИЯ ---
            }
        });
    });

    // Авто-клик по первой ссылке
    if (navLinks.length > 0) {
        navLinks[0].click();
    }

    // Пасхалка 1488
    const egg1488 = document.getElementById('easter-egg-1488');
    if (egg1488) {
        egg1488.addEventListener('click', () => {
            alert('[ЗАМЕЧАНИЕ ИССЛЕДОВАТЕЛЯ]: Совпадение? Не думаю. - Т.М.');
        });
    }

    // Фикс звука
    const mainAudio = document.getElementById('page-audio');
    const externalLinks = document.querySelectorAll('a[target="_blank"]');

    if (mainAudio && externalLinks.length > 0) {
        externalLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainAudio.pause(); 
            });
        });
    }
    
    // Кнопка Стабилизации
    const stabilizeButton = document.getElementById('stabilize-button');
    const bodyElement = document.body; 

    if (stabilizeButton && bodyElement) {
        stabilizeButton.addEventListener('click', () => {
            bodyElement.classList.toggle('stabilized');
        });
    }
});