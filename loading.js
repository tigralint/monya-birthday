document.addEventListener('DOMContentLoaded', () => {
    const loadingText = document.getElementById('loading-text');
    
    // 1. Получаем целевой URL из параметра "?target=..."
    const params = new URLSearchParams(window.location.search);
    const target = params.get('target');

    if (!target) {
        loadingText.textContent = "ОШИБКА: ЦЕЛЬ НЕ УКАЗАНА.";
        return;
    }

    // 2. Массив сообщений (можешь добавить свои)
    const messages = [
        'ЗАГРУЗКА ЯДРА...',
        'ПОИСК СЕКТОРА ' + target.toUpperCase() + '...',
        'СТАБИЛИЗАЦИЯ КАНАЛА...',
        'ПЕРЕНАПРАВЛЕНИЕ...'
    ];
    
    let i = 0;
    // 3. "Печатаем" сообщения по очереди
    const interval = setInterval(() => {
        if (i < messages.length) {
            loadingText.textContent = messages[i];
            i++;
        } else {
            // 4. Когда сообщения кончились - переходим на целевую страницу
            clearInterval(interval);
            window.location.href = target;
        }
    }, 1000); // 1 секунда на каждое сообщение
});