document.addEventListener('DOMContentLoaded', () => {
    const logOutput = document.getElementById('log-output');
    const redirectMessage = document.getElementById('redirect-message');
    const terminal = document.getElementById('terminal');

    // 1. Получаем целевой URL (как и раньше)
    const params = new URLSearchParams(window.location.search);
    const target = params.get('target');
    const targetName = target ? target.toUpperCase() : 'UNKNOWN_SECTOR';

    if (!target) {
        logOutput.innerHTML += `<p class="fail">[ОШИБКА]: ЦЕЛЬ НЕ УКАЗАНА. ЗАГРУЗКА ОСТАНОВЛЕНА.</p>`;
        return;
    }

    // 2. Список "умных" сообщений для терминала
    const bootMessages = [
        'ЗАГРУЗКА ЯДРА ИВМИ...',
        'ПРОВЕРКА ПАМЯТИ... <span class="success">[ OK ]</span>',
        'ИНИЦИАЛИЗАЦИЯ "IUS MONIUS"... <span class="success">[ OK ]</span>',
        'ПОИСК ПРОТОКОЛА 1488...',
        '...ПРОТОКОЛ НАЙДЕН. СТАТУС: <span class="highlight">АКТИВЕН</span>',
        'ЗАГРУЗКА МОДУЛЯ "ANIMUS MONIAE"...',
        'ПРОВЕРКА СЕЗОННЫХ ЦИКЛОВ (МСЧ)... <span class="success">[ СТАБИЛЬНО ]</span>',
        'ПОИСК "БЕЛКАРОТ-ВЕКТОРА"...',
        '...ОБНАРУЖЕН АФФЕКТИВНЫЙ РЕЗОНАНС... <span class="fail">[ FAILED ]</span>',
        '...ПОПЫТКА ИЗОЛЯЦИИ...',
        '...ИЗОЛЯЦИЯ НЕ УДАЛАСЬ. ПРОТОКОЛ СДЕРЖИВАНИЯ АКТИВЕН.',
        'ПРОВЕРКА "ФЕНОМЕНА ТИГРАНА" (ФТ)... <span class="highlight">НЕСТАБИЛЬНО</span>',
        'ЗАГРУЗКА АРХИВОВ "ДРЕВНЕЙ ГОРЛОВКИ"... <span class="success">[ OK ]</span>',
        'ПОДКЛЮЧЕНИЕ К СЕКТОРУ: ' + targetName + '...',
        'ВЕРИФИКАЦИЯ ДОСТУПА... <span class="success">[ РАЗРЕШЕН ]</span>',
        'ПОСТРОЕНИЕ ВИРТУАЛЬНОЙ СРЕДЫ...',
        'ЗАВЕРШЕНИЕ...'
    ];

    // 3. Функция-помощник для "сна"
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 4. Функция-помощник для "печати"
    function log(message) {
        // Убираем 'active' со всех предыдущих строк
        const oldMessages = logOutput.querySelectorAll('p');
        oldMessages.forEach(p => p.classList.remove('active'));

        // Добавляем новую 'active' строку
        const p = document.createElement('p');
        p.innerHTML = message;
        p.classList.add('active');
        logOutput.appendChild(p);

        // Авто-прокрутка терминала вниз
        terminal.scrollTop = terminal.scrollHeight;
    }

    // 5. Главная асинхронная функция загрузки
    async function runBootSequence() {
        await sleep(500); // Небольшая пауза вначале

        for (const message of bootMessages) {
            log(message);
            // Скорость "печати" (50ms - очень быстро, 200ms - читаемо)
            await sleep(80); 
        }

        await sleep(1000); // Пауза перед переходом

        // Показываем финальное сообщение
        redirectMessage.innerHTML = `ПЕРЕНАПРАВЛЕНИЕ В СЕКТОР: ${targetName}`;
        redirectMessage.style.display = 'block';

        await sleep(1500); // Даем пользователю прочитать

        // Переходим на целевую страницу
        window.location.href = target;
    }

    // Запускаем!
    runBootSequence();
});