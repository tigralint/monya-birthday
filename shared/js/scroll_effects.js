/*
 * Эффект "Плавное появление при прокрутке"
 * Ищем все элементы с классом "fade-in-section"
 * и добавляем им класс "is-visible", когда они
 * появляются в окне просмотра.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    const elementsToFadeIn = document.querySelectorAll('.fade-in-section');

    if (elementsToFadeIn.length === 0) return;

    // Функция, которая проверяет, виден ли элемент
    const checkVisibility = () => {
        elementsToFadeIn.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Проверяем, что элемент хотя бы на 150px "вошел" в экран
            const isVisible = (rect.top <= window.innerHeight - 150) && (rect.bottom >= 150);
            
            if (isVisible) {
                el.classList.add('is-visible');
            }
        });
    };

    // Слушаем события прокрутки и изменения размера окна
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);

    // Проверяем видимость сразу при загрузке
    checkVisibility();
});