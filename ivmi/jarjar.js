const sfxSuccess = document.getElementById('audio-sfx-success');
const sfxFail = document.getElementById('audio-sfx-fail');
// --- НОВЫЙ КОД (Идея 6): Скример и Глитч ---
const sfxStinger = document.getElementById('audio-stinger');
const glitchOverlay = document.getElementById('glitch-overlay');
// --- КОНЕЦ НОВОГО КОДА ---

document.addEventListener('DOMContentLoaded', () => {
    // --- ЭЛЕМЕНТЫ DOM ---
    const questContainer = document.getElementById('quest-container');
    const reportContainer = document.getElementById('report-container');
    const quizFeedback = document.getElementById('quiz-feedback');
    const loginPrompt = document.getElementById('login-prompt');
    const passwordInput = document.getElementById('password-input');
    const loginButton = document.getElementById('login-button');
    const pedalOptions = document.querySelectorAll('.pedal-option');

    const correctPassword = "СИТХ"; 

    // --- ЛОГИКА МИНИ-КВЕСТА "ПЕДАЛЬНАЯ СЕМИОТИКА" ---
    pedalOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const choice = e.currentTarget.dataset.choice;
            pedalOptions.forEach(opt => opt.style.pointerEvents = 'none');

            if (choice === 'jarjar') {
                // ПРАВИЛЬНЫЙ ВЫБОР
                playAudio(sfxSuccess); 
                quizFeedback.textContent = "> ВЕРНО. ОБЪЕКТ-03 ИДЕНТИФИЦИРОВАН КАК УГРОЗА. ДЕШИФРОВКА КЛЮЧЕВОГО СЛОВА... 'С-И-Т-Х'.";
                loginPrompt.classList.remove('hidden');
                passwordInput.focus();
            } else {
                // --- НОВЫЙ КОД (Идея 6): НЕПРАВИЛЬНЫЙ ВЫБОР ---
                playAudio(sfxStinger); // Играем "скример"
                if(glitchOverlay) glitchOverlay.classList.add('active'); // Включаем "глитч"
                
                quizFeedback.textContent = "> ОШИБКА АНАЛИЗА. [СИСТЕМА НЕСТАБИЛЬНА]... ВЫ НЕ ГОТОВЫ. БЛОКИРОВКА...";
                loginPrompt.classList.remove('hidden');
                loginPrompt.innerHTML = `<p class="system-message" style="color: #ff4d4d;">${quizFeedback.textContent}</p><a href="index.html" style="color: #ffb000;">[ВЕРНУТЬСЯ В АРХИВ]</a>`;
                
                // Убираем класс "глитча" после анимации
                setTimeout(() => {
                    if(glitchOverlay) glitchOverlay.classList.remove('active');
                }, 500);
                // --- КОНЕЦ НОВОГО КОДА ---
            }
        });
    });

    // --- ЛОГИКА ПАРОЛЯ ---
    loginButton.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });

    function checkPassword() {
        const input = passwordInput.value.trim().toUpperCase();
        if (input === correctPassword) {
            playAudio(sfxSuccess); 
            grantAccess();
        } else {
            playAudio(sfxFail); 
            passwordInput.value = '';
            passwordInput.focus();
            alert("НЕВЕРНЫЙ КОД ДОСТУПА. ПОПЫТКА ЗАРЕГИСТРИРОВАНА.");
        }
    }

    // --- ЛОГИКА РАЗБЛОКИРОВКИ ОТЧЕТА ---
    function grantAccess() {
        questContainer.classList.add('hidden');
        
        fetch('jarjar_report.html')
            .then(response => response.text())
            .then(html => {
                reportContainer.innerHTML = html;
                reportContainer.classList.remove('hidden');
                window.scrollTo(0, 0);

                // --- Пасхалка "Клик-по-тексту" ---
                const jarjarEgg = document.getElementById('easter-egg-jarjar');
                if (jarjarEgg) {
                    let clickCount = 0;
                    jarjarEgg.addEventListener('click', () => {
                        clickCount++;
                        if (clickCount >= 5) {
                            alert('[СБОЙ СИСТЕМЫ! ОБНАРУЖЕНА НЕСАНКЦИОНИРОВАННАЯ ПОПЫТКА ДОСТУПА К ПРОТОКОЛУ "БЕЛКАРОТ"!]');
                            clickCount = 0; 
                        }
                    });
                }
            })
            .catch(err => {
                reportContainer.innerHTML = `<p class="system-message">ОШИБКА ЗАГРУЗКИ ФАЙЛА 731-JJB. СВЯЖИТЕСЬ С АДМИНИСТРОРОМ СИНИКЗ.</p>`;
                reportContainer.classList.remove('hidden');
            });
    }
});