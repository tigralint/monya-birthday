/*
 * СКРИПТ "ПИШУЩАЯ МАШИНКА"
 * Функция, которая "печатает" текст в указанном элементе.
 */
function typeText(element, text, speed = 40) {
    return new Promise((resolve) => {
        if (!element) {
            console.error("Элемент для 'печати' не найден.");
            resolve();
            return;
        }
        
        let i = 0;
        element.innerHTML = ""; // Сначала очищаем элемент
        element.style.visibility = 'visible'; // Делаем видимым (если был скрыт)

        const typing = setInterval(() => {
            if (i < text.length) {
                // Если символ - '<', ищем парный '>', чтобы вставить тэг целиком
                if (text.charAt(i) === '<') {
                    const closingTagIndex = text.indexOf('>', i);
                    if (closingTagIndex !== -1) {
                        element.innerHTML += text.substring(i, closingTagIndex + 1);
                        i = closingTagIndex;
                    }
                } else {
                    element.innerHTML += text.charAt(i);
                }
                i++;
            } else {
                clearInterval(typing);
                resolve(); // Сообщаем, что "печать" завершена
            }
        }, speed);
    });
}