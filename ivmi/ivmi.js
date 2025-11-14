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

                // --- НОВЫЙ КОД ДЛЯ "ПЕЧАТИ" ---
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
                // --- КОНЕЦ НОВОГО КОДА ---
            }
        });
    });

    // Авто-клик по первой ссылке для инициализации "печати" при загрузке
    if (navLinks.length > 0) {
        navLinks[0].click();
    }
});
