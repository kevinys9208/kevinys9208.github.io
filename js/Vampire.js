import { RATIO, TO_RADIAN, IT, TILE_HALF, E_VF, ES, EW, EH } from './Resource.js';

import GameManager from "./GameManager.js";
import SrcManager from './SrcManager.js';
import Scene from "./scene.js";

import Spell from './Espell.js';

export default class Vampire {

    maxLife = 5;

    constructor(effect) {
        this.id = ++GameManager.id;
        this.scene = effect.scene;
        this.scene.isStart = true;

        this.lifeBar = SrcManager.getGroup('ui').get('life');
        this.lifeBack = SrcManager.getGroup('ui').get('life_back');
        this.shadow = SrcManager.getGroup('enemy').get('walk_shadow');

        this.width = EW;
        this.height = EH;

        this.rangeX = 1;
        this.rangeY = 1;

        this.x = effect.x;
        this.y = effect.y;

        this.orthoX = effect.orthoX;
        this.orthoY = effect.orthoY;

        this.#initPosition();

        this.life = this.maxLife;

        this.isDone = false;
        this.isDamaging = false;

        this.fIndex = 0;
        this.fIndexUpdator = setInterval(this.updateIndex, 28, this);
        
        this.scene.objectMap.set(this.id, this);
        this.scene.enemyMap.set(this.id, this);
    }

    #initPosition() {
        // this.orthoX = this.scene.getRandomInt(0, this.scene.map.width);
        // this.orthoY = this.scene.getRandomInt(0, this.scene.map.height);

        // this.x = this.scene.map.offsetX + this.orthoX - this.orthoY;
        // this.y = this.scene.map.offsetY + (this.orthoX + this.orthoY) / 2;

        this.updateViewDir();
        this.#updateMoveDir();
    }

    updateScreenCoord(dirY, weightY, dirX, weightX) {
        this.#updateX(dirX, weightX);
        this.#updateY(dirY, weightY);
        
        let isCollision = this.scene.updateOrthoCoord(this);
        if (isCollision) {
            this.#updateMoveDir();
        }
    }

    #updateMoveDir() {
        const angle = this.scene.getAngle(this.x, this.y, this.scene.character.x, this.scene.character.y);

        this.radian = angle * TO_RADIAN;
        this.diagonalX = Math.sin(this.radian);
        this.diagonalY = -Math.cos(this.radian);

        if (angle > -22.5 && angle <= 22.5) {
            this.dir = Scene.NN;
        } else if (angle > 22.5 && angle <= 67.5) {
            this.dir = Scene.NE;
        } else if (angle > 67.5 && angle <= 112.5) {
            this.dir = Scene.EE;
        } else if (angle > 112.5 && angle <= 157.5) {
            this.dir = Scene.SE;
        } else if ((angle > 157.5 && angle <= 180) || (angle <= -157.5 && angle >= -180)) {
            this.dir = Scene.SS;
        } else if (angle <= -112.5 && angle > -157.5) {
            this.dir = Scene.SW;
        } else if (angle <= -67.5 && angle > -112.5) {
            this.dir = Scene.WW;
        } else if (angle <= -22.5 && angle > -67.5) {
            this.dir = Scene.NW;
        }
    }

    updateViewDir() {
        const angle = this.scene.getAngle(this.x, this.y, this.scene.character.x, this.scene.character.y);

        if (angle > -22.5 && angle <= 22.5) {
            this.viewDir = Scene.NN;
        } else if (angle > 22.5 && angle <= 67.5) {
            this.viewDir = Scene.NE;
        } else if (angle > 67.5 && angle <= 112.5) {
            this.viewDir = Scene.EE;
        } else if (angle > 112.5 && angle <= 157.5) {
            this.viewDir = Scene.SE;
        } else if ((angle > 157.5 && angle <= 180) || (angle <= -157.5 && angle >= -180)) {
            this.viewDir = Scene.SS;
        } else if (angle <= -112.5 && angle > -157.5) {
            this.viewDir = Scene.SW;
        } else if (angle <= -67.5 && angle > -112.5) {
            this.viewDir = Scene.WW;
        } else if (angle <= -22.5 && angle > -67.5) {
            this.viewDir = Scene.NW;
        }
    }

    #updateX() {
        this.x += ES / 3 * this.diagonalX;
    }

    #updateY() {
        this.y += ES / 3 * this.diagonalY;
    }

    updateIndex(v) {
        if (++v.fIndex > E_VF) {
            v.fIndex = 0;
            v.updateViewDir();
            v.attack();
        }
    }

    isCollision(s) {
        if (this.orthoX - TILE_HALF * this.rangeX < s.orthoX + TILE_HALF * s.rangeX &&
            this.orthoX + TILE_HALF * this.rangeX > s.orthoX - TILE_HALF * s.rangeX &&
            this.orthoY - TILE_HALF * this.rangeY < s.orthoY + TILE_HALF * s.rangeY &&
            this.orthoY + TILE_HALF * this.rangeY > s.orthoY - TILE_HALF * s.rangeY) {
        
            return true;
        }
        return false;
    }

    draw() {
        let img;
        if (this.isDamaging) 
            img = SrcManager.getGroup('enemy').get('v_dmg_' + this.viewDir);
        else
            img = SrcManager.getGroup('enemy').get('v_walk_' + this.viewDir);

        const ctx = GameManager.ctx;

        const pointX = this.x - this.scene.map.getOriginX();
        const pointY = this.y - this.scene.map.getOriginY();

        this.#drawShadow(ctx, pointX, pointY);
        this.#drawImage(ctx, img, pointX, pointY);
        this.#drawLifeBack(ctx, pointX, pointY);
        this.#drawLifeBar(ctx, pointX, pointY);  
    }

    #drawShadow(ctx, pointX, pointY) {
        ctx.drawImage(
            this.shadow,
            0,
            0,
            this.width,
            this.height,
            pointX - ((this.width / RATIO) / 2),
            pointY - ((this.height / RATIO) / 2),
            (this.width / RATIO),
            (this.height / RATIO)
        );
    }

    #drawImage(ctx, img, pointX, pointY) {
        ctx.drawImage(
            img, 
            this.width * this.fIndex, 
            0, 
            this.width, 
            this.height, 
            pointX - ((this.width / RATIO) / 2),
            pointY - ((this.height / RATIO) / 2),
            (this.width / RATIO),
            (this.height / RATIO)
        );
    }

    #drawLifeBack(ctx, pointX, pointY) {
        ctx.drawImage(
            this.lifeBack, 
            0,
            0, 
            this.lifeBack.width, 
            this.lifeBack.height, 
            pointX - ((this.lifeBack.width / RATIO) / 2),
            pointY + (20 / RATIO),
            (this.lifeBack.width  / RATIO), 
            (this.lifeBack.height / RATIO), 
        );
    }

    #drawLifeBar(ctx, pointX, pointY) {
        ctx.drawImage(
            this.lifeBar, 
            0,
            0, 
            this.lifeBar.width, 
            this.lifeBar.height, 
            pointX - ((this.lifeBar.width / RATIO) / 2),
            pointY + (20 / RATIO),
            (this.lifeBar.width / RATIO) * (this.life / this.maxLife), 
            (this.lifeBar.height / RATIO), 
        );
    }

    addDamage() {
        if (this.isDamaging) {
            return;
        }

        this.isDamaging = true;
        this.life -= 1;

        if (this.life < 0) 
           this.removeFromMap();
        else {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.isDamaging = false;
            }, IT);
        }
    }

    removeFromMap() {
        clearInterval(this.fIndexUpdator);
        this.scene.objectMap.delete(this.id);
        this.scene.enemyMap.delete(this.id);
    }

    attack() {
        const angle = this.scene.getAngle(this.x, this.y, this.scene.character.x, this.scene.character.y);
        new Spell(this.viewDir, this.x, this.y, this.scene, angle);
    }
}