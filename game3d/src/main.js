import * as THREE from 'three';
import { Player } from './player.js';
import { World } from './world.js';

// --- Глобальные переменные ---
let camera, scene, renderer;
let player, world;
let lastTime = performance.now();
let isGameActive = false;
let burgersCollected = 0;
const TOTAL_BURGERS = 5; // Сколько нужно собрать для победы

// Элементы UI
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const hud = document.getElementById('hud');
const deathScreen = document.getElementById('death-screen');
const crosshair = document.getElementById('crosshair');

// Аудио
const bgMusic = new Audio('../audio/level1_hum.mp3');
bgMusic.loop = true; 
bgMusic.volume = 0.4;

const sfxCollect = new Audio('../audio/sfx_success.mp3');
const sfxScream = new Audio('../audio/sfx_belkarot_stinger.mp3');

init();
animate();

function init() {
    // 1. Инициализация Three.js
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.035); // Плотный туман

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // 2. Создаем мир и игрока
    player = new Player(camera, document.body);
    world = new World(scene);
    
    world.generate();      // Строим коридоры
    world.spawnLoot(TOTAL_BURGERS); // Спавним бургеры
    world.spawnEnemy();    // Призываем Белкарота

    // 3. Слушатели
    startButton.addEventListener('click', startGame);
    window.addEventListener('resize', onWindowResize);
}

function startGame() {
    startScreen.classList.add('hidden');
    hud.classList.remove('hidden');
    crosshair.style.display = 'block';
    
    player.lockCursor();
    bgMusic.play().catch(e => console.log("Audio error:", e));
    
    isGameActive = true;
    lastTime = performance.now();
}

function gameOver(reason) {
    isGameActive = false;
    player.unlockCursor();
    hud.classList.add('hidden');
    crosshair.style.display = 'none';
    deathScreen.classList.remove('hidden');
    bgMusic.pause();
    
    const title = deathScreen.querySelector('h1');
    const msg = deathScreen.querySelector('p');

    if (reason === 'win') {
        title.innerText = "СИСТЕМА СТАБИЛИЗИРОВАНА";
        title.style.color = "#39FF14";
        msg.innerText = "Все артефакты собраны. Выход из симуляции...";
        sfxCollect.play();
        // Через 3 секунды перенаправляем на финальную страницу
        setTimeout(() => {
            window.location.href = "../core/index.html"; 
        }, 3000);
    } else {
        title.innerText = "СИГНАЛ ПОТЕРЯН";
        title.style.color = "red";
        msg.innerText = "Белкарот поглотил ваше сознание.";
        sfxScream.play();
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    if (!isGameActive) return;

    const time = performance.now();
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    // 1. Обновляем игрока
    player.update(delta, world.walls);

    // 2. Логика Сбора Предметов (Простая проверка дистанции)
    // Идем с конца массива, чтобы безопасно удалять
    for (let i = world.collectables.length - 1; i >= 0; i--) {
        const loot = world.collectables[i];
        loot.rotation.y += loot.userData.rotateSpeed; // Вращаем предмет

        const dist = player.camera.position.distanceTo(loot.position);
        if (dist < 1.5) {
            // ПОДНЯЛИ ПРЕДМЕТ
            scene.remove(loot);
            world.collectables.splice(i, 1);
            
            player.satisfaction = Math.min(100, player.satisfaction + 20); // Лечимся
            burgersCollected++;
            sfxCollect.currentTime = 0;
            sfxCollect.play();

            // Обновляем текст в HUD (можно добавить счетчик в HTML, но пока хватит шкалы)
            console.log("Collected:", burgersCollected);

            if (burgersCollected >= TOTAL_BURGERS) {
                gameOver('win');
            }
        }
    }

    // 3. Логика Врага (Белкарот)
    if (world.enemy) {
        const enemySpeed = 3.5; // Чуть медленнее игрока (игрок ~5.0)
        const enemyPos = world.enemy.position;
        const playerPos = player.camera.position;

        // Вектор к игроку
        const dir = new THREE.Vector3().subVectors(playerPos, enemyPos).normalize();
        
        // Двигаем врага (игнорируем стены для жути - он призрак)
        enemyPos.add(dir.multiplyScalar(enemySpeed * delta));
        
        // Он всегда смотрит на игрока
        world.enemy.lookAt(playerPos);

        // Проверка смерти
        if (enemyPos.distanceTo(playerPos) < 1.2) {
            gameOver('dead');
        }
    }

    // 4. Шкала Сатисфакции (тает со временем)
    player.satisfaction -= 3 * delta; // Теряем 3% в секунду
    updateHUD();

    if (player.satisfaction <= 0) {
        gameOver('dead');
    }

    renderer.render(scene, camera);
}

function updateHUD() {
    const bar = document.getElementById('satisfaction-bar');
    let width = Math.max(0, player.satisfaction);
    bar.style.width = width + '%';
    
    if (width < 30) {
        bar.style.backgroundColor = '#B22222'; // Красный
    } else {
        bar.style.backgroundColor = '#39FF14'; // Зеленый
    }
}