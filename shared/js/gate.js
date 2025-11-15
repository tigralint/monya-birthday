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

            // *** ИЗМЕНЕНИЕ: Мы УБИРАЕМ отсюда вызов 'belkarot_prompt()' ***
            // Он больше не нужен, так как 'prompt' теперь вызывается
            // отдельной кнопкой ВНУТРИ страницы.
            // *** КОНЕЦ ИЗМЕНЕНИЯ ***

        }).catch(error => {
            // Если браузер все еще блокирует
            console.error("Не удалось запустить аудио:", error);
            // Оставляем гейт, чтобы пользователь мог кликнуть еще раз
        });
    }

    overlay.addEventListener('click', unlockAudio, { once: true });
});