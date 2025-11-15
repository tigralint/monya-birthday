document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const contentPanels = document.querySelectorAll('.content-area .content-panel');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Отменяем переход по якорю #

            // 1. Получаем ID целевой панели (например, "#dossier-001")
            const targetId = link.getAttribute('data-target');
            const targetPanel = document.querySelector(targetId);

            // 2. Снимаем класс 'active' со всех ссылок и панелей
            navLinks.forEach(nav => nav.classList.remove('active'));
            contentPanels.forEach(panel => panel.classList.remove('active'));

            // 3. Добавляем класс 'active' нужной ссылке и панели
            link.classList.add('active');
            
            if (targetPanel) {
                targetPanel.classList.add('active');

                // --- КОД ДЛЯ "ПИШУЩЕЙ МАШИНКИ" (ЧИНИТ КНОПКИ) ---
                const titleElement = targetPanel.querySelector('h2');
                if (titleElement) {
                    // Сохраняем оригинальный текст в data-атрибут, если его там нет
                    if (!titleElement.dataset.text) {
                        titleElement.dataset.text = titleElement.innerText;
                    }
                    const originalTitle = titleElement.dataset.text;
                    
                    // Скрываем, "печатаем" и показываем
                    titleElement.style.visibility = 'hidden'; // Прячем перед печатью
                    
                    // Проверяем, подключена ли функция typeText
                    if (typeof typeText === 'function') {
                        // Запускаем "печать"
                        typeText(titleElement, originalTitle, 30); // 30ms - cкорость
                    } else {
                        // Если скрипт не загрузился, просто показываем текст
                        titleElement.innerText = originalTitle;
                        titleElement.style.visibility = 'visible';
                    }
                }
                // --- КОНЕЦ КОДА "ПИШУЩЕЙ МАШИНКИ" ---
            }
        });
    });

    // Авто-клик по первой ссылке для инициализации "печати" при загрузке
    if (navLinks.length > 0) {
        navLinks[0].click();
    }

    // --- "Пасхалка 1488" (Идея 1) ---
    const egg1488 = document.getElementById('easter-egg-1488');
    if (egg1488) {
        egg1488.addEventListener('click', () => {
            alert('[ЗАМЕЧАНИЕ ИССЛЕДОВАТЕЛЯ]: Совпадение? Не думаю. - Т.М.');
        });
    }

    // --- НОВЫЙ КОД (Фикс Звука в Новых Вкладках) ---
    const mainAudio = document.getElementById('page-audio');
    // Находим ВСЕ ссылки, которые открываются в новой вкладке (target="_blank")
    const externalLinks = document.querySelectorAll('a[target="_blank"]');

    if (mainAudio && externalLinks.length > 0) {
        externalLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Приглушаем музыку в ЭТОЙ (старой) вкладке
                mainAudio.pause(); 
            });
        });
    }
    // --- КОНЕЦ НОВОГО КОДА ---
});