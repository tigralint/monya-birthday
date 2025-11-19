import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class Player {
    constructor(camera, domElement) {
        this.camera = camera;
        
        // Управление мышкой
        this.controls = new PointerLockControls(camera, domElement);
        
        // Параметры игрока
        this.speed = 5.0;
        this.runSpeed = 9.0;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        
        // Геймплей
        this.satisfaction = 100; // HP

        // Флаги клавиш
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.isRunning = false;

        this._initInput();
    }

    _initInput() {
        const onKeyDown = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW': this.moveForward = true; break;
                case 'ArrowLeft':
                case 'KeyA': this.moveLeft = true; break;
                case 'ArrowDown':
                case 'KeyS': this.moveBackward = true; break;
                case 'ArrowRight':
                case 'KeyD': this.moveRight = true; break;
                case 'ShiftLeft': this.isRunning = true; break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW': this.moveForward = false; break;
                case 'ArrowLeft':
                case 'KeyA': this.moveLeft = false; break;
                case 'ArrowDown':
                case 'KeyS': this.moveBackward = false; break;
                case 'ArrowRight':
                case 'KeyD': this.moveRight = false; break;
                case 'ShiftLeft': this.isRunning = false; break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    }

    lockCursor() {
        this.controls.lock();
    }

    unlockCursor() {
        this.controls.unlock();
    }

    update(delta, walls) {
        // Трение (остановка)
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;

        // Вектор направления
        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize(); // Чтобы по диагонали не бегал быстрее

        const currentSpeed = this.isRunning ? this.runSpeed : this.speed;

        if (this.moveForward || this.moveBackward) {
            this.velocity.z -= this.direction.z * 40.0 * delta * currentSpeed; // Ускорение
        }
        if (this.moveLeft || this.moveRight) {
            this.velocity.x -= this.direction.x * 40.0 * delta * currentSpeed;
        }

        // Применяем движение (боком и вперед)
        this.controls.moveRight(-this.velocity.x * delta);
        this.controls.moveForward(-this.velocity.z * delta);

        // --- Простейшая коллизия со стенами ---
        // (Если ушли за пределы карты, возвращаем)
        // В реальной игре тут нужен Raycasting, но для прототипа ограничим позицию
        if (this.camera.position.y < 1.6) this.camera.position.y = 1.6; // Пол
    }
}