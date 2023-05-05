import { TILE_SIZE, CR, SR, MR, ER, OR, UR, FR } from './Resource.js'

import SrcManager from './SrcManager.js'
import Scene from './Scene.js';

let GAME_MANAGER;

class GameManager {

    constructor() {
        this.id = 0;
        this.stage = 1;

        this.canvas = document.getElementById('mainCanvas');
        this.canvas.width = document.body.clientWidth - 10;
        this.canvas.height = document.body.clientHeight - 10;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.textAlign = 'center';
        this.ctx.font = '48px Gallant'
        this.ctx.fillStyle = '#f0f8ff';
        this.controlMap = new Map();

        this.isStart = false;
    }

    async init() {
        await this.#initResource();
        this.#initControl();
        this.#initUiControl();
    }

    async #initResource() {
        await SrcManager.createGroup('character', CR);
        await SrcManager.createGroup('enemy', ER);
        await SrcManager.createGroup('map', MR);
        await SrcManager.createGroup('obstacle', OR);
        await SrcManager.createGroup('spell', SR);
        await SrcManager.createGroup('ui', UR);
        await SrcManager.createGroup('effect', FR);
    }

    #initControl() {
        this.#initKeyboardControl();
        this.#initMouseControl();
    }

    #initKeyboardControl() {
        document.addEventListener('keydown', (e) => {
            if (e.repeat) {
                return;
            }
            this.controlMap.set(e.code, true);
        });
        document.addEventListener('keyup', (e) => {
            this.controlMap.set(e.code, false);
        });
    }

    #initMouseControl() {
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button == 0) {
                this.controlMap.set('onclick', true);
            }
        });
        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button == 0) {
                this.controlMap.set('onclick', false);
            }
        });
        this.canvas.addEventListener('mousemove', (e) => {
            this.readView(e.clientX, e.clientY);
        });
        this.canvas.addEventListener('transitionend', () => {
            if (this.canvas.style.opacity == 1)
                this.mainScene.createEnemy(this.stage * 20);

            else if (this.canvas.style.opacity == 0)
                this.uiBox.style.zIndex = 2;
        });
        document.addEventListener('dblclick', (e) => {
            e.preventDefault();
        });
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    #initUiControl() {
        this.uiBox = document.getElementById('uiBox');

        this.startBtn = document.getElementById('startBtn');
        this.startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.start();
            console.log('Game Start.');
        });
    }

    start(name) {
        if (this.isStart) {
            return;
        }

        const mapX = 2160;
        const mapY = 2160;

        this.mainScene = new Scene(name,'map_002', mapX, mapY);

        const a = 6;
        const rangeX = (mapX / TILE_SIZE) / a;
        const rangeY = (mapY / TILE_SIZE) / a;

        let x;
        let y;

        let coordX;
        let coordY;

        // obstacle
        for (let index = 0; index < a**2; index++) {
            x = (index % a) * (rangeX) + 4;
            y = parseInt(index / a) * (rangeY) + 4;

            coordX = this.mainScene.getRandomInt(x, x + rangeX - 8);
            coordY = this.mainScene.getRandomInt(y, y + rangeY - 8);

            this.mainScene.createObstacle('grave', coordX, coordY, 2, 1);
        }

        this.controlReader = setTimeout(function run(cr) {
            cr.readControl();
            cr.controlReader = setTimeout(run, 100, cr);
        }, 100, this);
        
        this.isStart = true;

        this.frameRequest = requestAnimationFrame(this.render);

        this.canvas.style.opacity = 1;
        this.uiBox.style.zIndex = -1;
    }    

    readControl() {
        this.readMovement();
        this.readAttack();
    }
    
    readView(x, y) {
        if (this.isStart) {
            this.mainScene.character.updateViewDir(x, y);
        }
    }

    readMovement() {
        let dir = Scene.IDLE;

        if (this.controlMap.get('KeyW') && this.controlMap.get('KeyD')) {
            dir = Scene.NE;
        } else if (this.controlMap.get('KeyW') && this.controlMap.get('KeyA')) {
            dir = Scene.NW;
        } else if (this.controlMap.get('KeyS') && this.controlMap.get('KeyD')) {
            dir = Scene.SE;
        } else if (this.controlMap.get('KeyS') && this.controlMap.get('KeyA')) {
            dir = Scene.SW;
        } else if (this.controlMap.get('KeyW')) {
            dir = Scene.NN;
        } else if (this.controlMap.get('KeyS')) {
            dir = Scene.SS;
        } else if (this.controlMap.get('KeyD')) {
            dir = Scene.EE;
        } else if (this.controlMap.get('KeyA')) {
            dir = Scene.WW;
        }

        this.mainScene.character.updateMoveDir(dir);
    }

    readAttack() {
        if (this.controlMap.get('onclick')) {
            this.mainScene.character.attack();
        }
    }

    stop() {
        this.isStart = false;
        this.mainScene.stop();

        clearTimeout(this.timeout);
        clearTimeout(this.controlReader);
        cancelAnimationFrame(this.frameRequest);

        this.stage = 1;
        this.startBtn.innerText = 'Into the nightmare';
        this.canvas.style.opacity = 0;
    }

    next() {
        this.stage++;
        this.#setHtmlText();

        if (this.stage > 7) {
            this.stop();
            return;
        }

        this.canvas.style.opacity = 0;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.canvas.style.opacity = 1;
        }, 1200);
    }

    #setHtmlText() {
        switch (this.stage) {
            case 2:
                this.startBtn.innerText = 'w... ...';
                break;
            case 3:
                this.startBtn.innerText = 'wa.. ...';
                break;
            case 4:
                this.startBtn.innerText = 'wak. ...';
                break;
            case 5:
                this.startBtn.innerText = 'wake ...';
                break;
            case 6:
                this.startBtn.innerText = 'wake u..';
                break;
            case 7:
                this.startBtn.innerText = 'wake up.';
                break;
            default:
                this.startBtn.innerText = 'Into the nightmare';
                break;
        }
    }
 
    render() {
        GAME_MANAGER
            .ctx
            .clearRect(
                0, 
                0, 
                GAME_MANAGER.canvas.width, 
                GAME_MANAGER.canvas.height
            );

        GAME_MANAGER.mainScene.draw();

        GAME_MANAGER.frameRequest = requestAnimationFrame(GAME_MANAGER.render);
    }
}

export default GAME_MANAGER = new GameManager();