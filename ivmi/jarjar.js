// --- НОВЫЙ КОД (Аудио Этап): Помощник и SFX ---
function playAudio(audioEl) {
    if (audioEl) {
        audioEl.currentTime = 0;
        audioEl.play().catch(e => console.error("Ошибка SFX:", e));
    }
}
const sfxSuccess = document.getElementById('audio-sfx-success');
const sfxFail = document.getElementById('audio-sfx-fail');
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

    const correctPassword = "СИТХ"; // Пароль квеста

    // --- ЛОГИКА МИНИ-КВЕСТА "ПЕДАЛЬНАЯ СЕМИОТИКА" ---
    pedalOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const choice = e.currentTarget.dataset.choice;
            pedalOptions.forEach(opt => opt.style.pointerEvents = 'none');

            if (choice === 'jarjar') {
                // ПРАВИЛЬНЫЙ ВЫБОР
                playAudio(sfxSuccess); // <-- SFX
                quizFeedback.textContent = "> ВЕРНО. ОБЪЕКТ-03 ИДЕНТИФИЦИРОВАН КАК УГРОЗА. ДЕШИФРОВКА КЛЮЧЕВОГО СЛОВА... 'С-И-Т-Х'.";
                loginPrompt.classList.remove('hidden');
                passwordInput.focus();
            } else {
                // НЕПРАВИЛЬНЫЙ ВЫБОР
                playAudio(sfxFail); // <-- SFX
                quizFeedback.textContent = "> ОШИБКА АНАЛИЗА. ВЫ НЕ ГОТОВЫ. СИСТЕМА БЛОКИРУЕТ ДОСТУП.";
                loginPrompt.classList.remove('hidden');
                loginPrompt.innerHTML = `<p class="system-message">${quizFeedback.textContent}</p><a href="index.html" style="color: #ffb000;">[ВЕРНУТЬСЯ В АРХИВ]</a>`;
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
            // УСПЕХ
            playAudio(sfxSuccess); // <-- SFX
            grantAccess();
        } else {
            // ПРОВАЛ
            playAudio(sfxFail); // <-- SFX
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
            })
            .catch(err => {
                reportContainer.innerHTML = `<p class="system-message">ОШИБКА ЗАГРУЗКИ ФАЙЛА 731-JJB. СВЯЖИТЕСЬ С АДМИНИСТРАТОРОМ СИНИКЗ.</p>`;
                reportContainer.classList.remove('hidden');
            });
    }
});