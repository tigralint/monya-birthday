/*
 * ЛОГИКА ДЛЯ ВСПЛЫВАЮЩЕГО ОКНА (ЛАЙТБОКСА)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Создаем HTML для Лайтбокса и добавляем его на страницу
    const lightboxHTML = `
        <div id="lightbox-overlay">
            <span class="lightbox-close">&times;</span>
            <img id="lightbox-image" src="" alt="Полный просмотр">
            <div class="lightbox-caption"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    const overlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeButton = document.querySelector('.lightbox-close');

    // 2. Находим ВСЕ ссылки, которые ведут на картинки
    // (Это ссылки, которые ты уже сделал в Фотопленке, Дневнике и т.д.)
    const imageLinks = document.querySelectorAll('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"]');

    imageLinks.forEach(link => {
        link.addEventListener('click', e => {
            // 3. Отменяем стандартное открытие в новой вкладке
            e.preventDefault(); 
            
            const imageURL = link.getAttribute('href');
            lightboxImage.setAttribute('src', imageURL);
            
            // 4. Показываем подпись (из `alt` или `title` картинки-превью)
            const previewImage = link.querySelector('img');
            let captionText = '';
            if (previewImage) {
                captionText = previewImage.getAttribute('title') || previewImage.getAttribute('alt');
            }
            if (captionText) {
                lightboxCaption.innerText = captionText;
                lightboxCaption.style.display = 'block';
            } else {
                lightboxCaption.style.display = 'none';
            }

            // 5. Показываем Лайтбокс
            overlay.classList.add('visible');
        });
    });

    // 6. Функция закрытия
    const closeLightbox = () => {
        overlay.classList.remove('visible');
    };

    closeButton.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', e => {
        // Закрываем по клику *только* на фон (а не на саму картинку)
        if (e.target === overlay) {
            closeLightbox();
        }
    });
});