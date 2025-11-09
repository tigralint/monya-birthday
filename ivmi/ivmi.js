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
            }
        });
    });
});