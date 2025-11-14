/*
 * ЕДИНЫЙ СКРИПТ "ЭКРАНА ВХОДА" (АУДИО-ГЕЙТА)
 * Запускает фоновую музыку на любой странице
 * при первом клике пользователя.
 */

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('audio-gate-overlay');
    const wrapper = document.getElementById('content-wrapper');
    const audio = document.getElementById('page-audio'); // Ищет главный <audio>

    if (!overlay || !wrapper || !audio) {
        // Если на странице нет гейта или музыки, ничего не делаем
        // (но прячем гейт, если он вдруг есть, а музыки нет)
        if (overlay) overlay.classList.add('hidden');
        if (wrapper) wrapper.classList.add('unlocked');
        return;
    }

    // Обработчик клика
    function unlockAudio() {
        audio.play().then(() => {
            // Музыка успешно запущена
            overlay.classList.add('hidden');
            wrapper.classList.add('unlocked');

            // *** ИСПРАВЛЕНИЕ ЗДЕСЬ (Фикс "Белкарота") ***
            // Мы должны дать музыке 100 мс, чтобы ОНА УСПЕЛА ЗАИГРАТЬ,
            // ПРЕЖДЕ ЧЕМ 'prompt()' "заморозит" страницу.
            if (typeof belkarot_prompt === 'function') {
                setTimeout(belkarot_prompt, 100); // 100ms задержка
            }
            // *** КОНЕЦ ИСПРАВЛЕНИЯ ***

        }).catch(error => {
            // Если браузер все еще блокирует (очень редкий случай)
            console.error("Не удалось запустить аудио:", error);
            // Оставляем гейт, чтобы пользователь мог кликнуть еще раз
        });
    }

    overlay.addEventListener('click', unlockAudio, { once: true });
});