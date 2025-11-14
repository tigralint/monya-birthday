/*
 * ЭТАП 2: "ТАЙНЫЙ КОД" (Мастер-доступ)
 * Этот скрипт отслеживает ввод кода "0507"
 */
document.addEventListener('DOMContentLoaded', () => {
    let keySequence = [];
    const cheatCode = ['0', '5', '0', '7'];

    document.addEventListener('keydown', (e) => {
        // Добавляем нажатую клавишу в массив
        keySequence.push(e.key);

        // Оставляем в массиве только 4 последних нажатия
        // (чтобы не хранить всю историю)
        if (keySequence.length > cheatCode.length) {
            keySequence.shift(); // Удаляем самый старый элемент
        }

        // Сравниваем текущую последовательность с чит-кодом
        if (keySequence.join('') === cheatCode.join('')) {
            // УСПЕХ!
            try {
                localStorage.setItem('gorlovka_complete', 'true');
                localStorage.setItem('ivmi_quiz_complete', 'true');
                localStorage.setItem('belkarot_complete', 'true');
                
                // Сообщаем пользователю и перезагружаемся
                alert('...БЭКДОР АКТИВИРОВАН...\n\n...ДОСТУП УРОВНЯ "АДМИН" ПОЛУЧЕН...\n\n...СИСТЕМА ПЕРЕЗАГРУЖАЕТСЯ С НОВЫМИ ПРАВАМИ...');
                
                window.location.reload();

            } catch (error) {
                alert('ОШИБКА: Не удалось активировать. (' + error.message + ')');
            }
            
            // Сбрасываем последовательность
            keySequence = [];
        }
    });
});