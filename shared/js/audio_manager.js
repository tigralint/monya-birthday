/*
 * ЕДИНЫЙ МЕНЕДЖЕР ЗВУКОВЫХ ЭФФЕКТОВ (SFX)
 * Содержит ОДНУ глобальную функцию playAudio,
 * чтобы не дублировать ее в 5 разных файлах.
 */

function playAudio(audioEl) {
    if (audioEl) {
        audioEl.currentTime = 0;
        audioEl.play().catch(e => console.error("Ошибка SFX:", e));
    }
}