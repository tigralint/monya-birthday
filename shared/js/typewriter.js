/*
 * УЛУЧШЕННЫЙ МОДУЛЬ ТЕКСТОВЫХ ЭФФЕКТОВ
 * Включает:
 * 1. typeText - обычная печать (для диалогов).
 * 2. decryptText - эффект "взлома/дешифровки" (для заголовков ИВМИ).
 */

// 1. Классическая печать (для диалогов)
function typeText(element, text, speed = 40) {
    return new Promise((resolve) => {
        if (!element) {
            resolve();
            return;
        }
        
        // Если у элемента уже есть таймер (чтобы не накладывались)
        if (element.typingInterval) clearInterval(element.typingInterval);

        let i = 0;
        element.innerHTML = ""; 
        element.style.visibility = 'visible'; 

        element.typingInterval = setInterval(() => {
            if (i < text.length) {
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
                clearInterval(element.typingInterval);
                resolve(); 
            }
        }, speed);
    });
}

// 2. Эффект Дешифровки (Matrix/Cipher Style)
// Текст сначала состоит из случайных символов, которые постепенно заменяются на правильные
function decryptText(element, originalText, speed = 50) {
    return new Promise((resolve) => {
        if (!element) {
            resolve();
            return;
        }

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&?<>[]{}"; // "Шум"
        let iterations = 0;
        
        // Сохраняем оригинальный текст, если он не передан
        if (!originalText) originalText = element.dataset.text || element.innerText;
        
        element.style.visibility = 'visible';
        
        // Если у элемента уже есть таймер
        if (element.decryptInterval) clearInterval(element.decryptInterval);

        element.decryptInterval = setInterval(() => {
            element.innerText = originalText
                .split("")
                .map((letter, index) => {
                    if (index < iterations) {
                        return originalText[index]; // Уже расшифрованная часть
                    }
                    return chars[Math.floor(Math.random() * chars.length)]; // "Шум"
                })
                .join("");

            if (iterations >= originalText.length) {
                clearInterval(element.decryptInterval);
                resolve();
            }

            iterations += 1 / 3; // Скорость "проявки" (чем меньше делитель, тем быстрее)
        }, speed);
    });
}