import * as THREE from 'three';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.walls = [];       // Препятствия для игрока
        this.collectables = []; // Предметы для сбора
        this.enemy = null;      // Объект врага
        
        this.textureLoader = new THREE.TextureLoader();
    }

    generate() {
        // --- 1. Пол и Потолок (как было) ---
        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a, roughness: 0.8, metalness: 0.2 
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        this.scene.add(floor);

        const ceilGeometry = new THREE.PlaneGeometry(100, 100);
        const ceilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const ceil = new THREE.Mesh(ceilGeometry, ceilMaterial);
        ceil.rotation.x = Math.PI / 2;
        ceil.position.y = 5;
        this.scene.add(ceil);

        // --- 2. Стены (Коридор ИВМИ) ---
        // Используем текстуру из папки ИВМИ
        const portraitTexture = this.textureLoader.load('../ivmi/images/professor_selfie.jpg');
        
        // Генерируем случайные колонны-стены
        for (let i = 0; i < 30; i++) {
            const x = (Math.random() - 0.5) * 60;
            const z = (Math.random() - 0.5) * 60;
            // Не ставим стены в центре (где спавнится игрок)
            if (Math.abs(x) < 5 && Math.abs(z) < 5) continue;
            this.createColumn(x, z, portraitTexture);
        }

        // --- 3. Освещение ---
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // Зловещий красный свет в центре
        const redLight = new THREE.PointLight(0xff0000, 1, 30);
        redLight.position.set(0, 4, 0);
        this.scene.add(redLight);
    }

    createColumn(x, z, texture) {
        const geo = new THREE.BoxGeometry(3, 6, 3);
        const matDark = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const matPortrait = new THREE.MeshStandardMaterial({ map: texture });

        // Портрет только с одной стороны
        const materials = [matDark, matDark, matDark, matDark, matPortrait, matDark];
        const column = new THREE.Mesh(geo, materials);
        
        column.position.set(x, 3, z);
        column.castShadow = true;
        this.scene.add(column);
        this.walls.push(column); // Добавляем в массив для коллизий
    }

    // --- НОВАЯ ФУНКЦИЯ: Спавн предметов (Бургеры) ---
    spawnLoot(count) {
        const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const mat = new THREE.MeshStandardMaterial({ 
            color: 0xffff00, // Желтый цвет
            emissive: 0xffff00, // Светится
            emissiveIntensity: 0.5
        });

        for (let i = 0; i < count; i++) {
            const loot = new THREE.Mesh(geo, mat);
            // Случайная позиция
            loot.position.x = (Math.random() - 0.5) * 50;
            loot.position.z = (Math.random() - 0.5) * 50;
            loot.position.y = 1; // Висит в воздухе
            
            // Анимация вращения (сохраним скорость в объекте)
            loot.userData = { rotateSpeed: Math.random() * 0.05 + 0.01 };
            
            this.scene.add(loot);
            this.collectables.push(loot);
        }
    }

    // --- НОВАЯ ФУНКЦИЯ: Спавн Врага (Белкарот) ---
    spawnEnemy() {
        // Белкарот - это высокая красная капсула
        const geo = new THREE.CapsuleGeometry(0.7, 2, 4, 8);
        const mat = new THREE.MeshStandardMaterial({ 
            color: 0x8B0000, 
            roughness: 0.1,
            emissive: 0x220000
        });
        
        this.enemy = new THREE.Mesh(geo, mat);
        this.enemy.position.set(20, 1.5, 20); // Спавнится вдалеке
        
        // Добавим ему "глаза" (свет)
        const eyeLight = new THREE.PointLight(0xff0000, 2, 10);
        eyeLight.position.set(0, 1, 0.5);
        this.enemy.add(eyeLight);

        this.scene.add(this.enemy);
    }
}