import { RATIO, IT, TILE_HALF, C_WF, CS, CW, CH, SH } from './Resource.js';

import GameManager from './GameManager.js'
import SrcManager from './SrcManager.js';
import Scene from './Scene.js';
import Spell from './Spell.js';

export default class Character {

    maxLife = 10

    constructor(name, scene) {
        this.id = ++GameManager.id;
        this.name = name;
        this.scene = scene;

        this.lifeBar = SrcManager.getGroup('ui').get('life');
        this.lifeBack = SrcManager.getGroup('ui').get('life_back');
        this.shadow = SrcManager.getGroup('character').get('walk_shadow');

        this.width = CW;
        this.height = CH;

        this.rangeX = 1;
        this.rangeY = 1;

        this.offsetX = 0;
        this.offsetY = 0;

        this.viewDir = Scene.SS;
        this.dir = Scene.SS;
        this.isIdle = true;
        this.isDamaging = false;

        this.life = this.maxLife;

        this.fIndex = 0;
        this.fIndexUpdator = setInterval(this.updateIndex, 28, this);
    }

    updateIndex(ch) {
        if (!ch.isIdle) {
            if (++ch.fIndex > C_WF) {
                ch.fIndex = 1;
            }
        }
    }

    updateViewDir(x, y) {
        const angle = this.scene.getAngle(this.x, this.y, x + this.scene.map.getOriginX(), y + this.scene.map.getOriginY() + (SH / RATIO / 3));
        this.angle = angle;
    
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

    updateMoveDir(dir) {
        if (dir == Scene.IDLE) {
            this.isIdle = true;
            this.frameIndex = 1;
            return;
        }

        this.dir = dir;
        this.isIdle = false;
    }

    updateScreenCoord(dirY, weightY, dirX, weightX) {
        let isCollision = false;

        if (this.isIdle) {
            isCollision = this.#checkEnemyCollision();
            if (isCollision) {
                this.addDamage();
            }
            return;
        }
    
        this.#updateX(dirX, weightX);
        this.#updateY(dirY, weightY);

        this.scene.updateOrthoCoord(this);
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

    #updateX(dir, weight = 1) {
        this.x += (CS * weight * (dir == Scene.EE ? 1 : -1));
    }

    #updateY(dir, weight = 1) {
        this.y += (CS * weight * (dir == Scene.SS ? 1 : -1));
    }

    #checkEnemyCollision() {
        return Array.from(this.scene.enemyMap.values()).some((v) => {
            return v.isCollision(this);
        });
    }

    attack() {
        new Spell(this.viewDir, this.x, this.y, this.scene, this.angle);
    }

    addDamage() {
        if (this.isDamaging) {
            return;
        }

        this.isDamaging = true;
        this.life -= 1;

        if (this.life < 0) 
           GameManager.stop();
        else {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.isDamaging = false;
            }, IT);
        }
    }

    draw() {
        let img;
        if (this.isDamaging) 
            img = SrcManager.getGroup('character').get('dmg_' + this.viewDir);
        else
            img = SrcManager.getGroup('character').get('walk_' + this.viewDir);

        let index = this.fIndex;
        if (this.isIdle) {
            index = 0;
        }

        const ctx = GameManager.ctx;

        const pointX = this.x - this.scene.map.getOriginX();
        const pointY = this.y - this.scene.map.getOriginY();

        this.#drawShadow(ctx, pointX, pointY);
        this.#drawImage(ctx, img, index, pointX, pointY);
        this.#drawLifeBack(ctx, pointX,pointY)
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

    #drawImage(ctx, img, index, pointX, pointY) {
        ctx.drawImage(
            img,
            this.width * index,
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
            pointY + 20,
            (this.lifeBack.width / RATIO), 
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
            pointY + 20,
            (this.lifeBar.width / RATIO) * (this.life / this.maxLife), 
            (this.lifeBar.height / RATIO), 
        );
    }

    removeFromMap() {
        clearInterval(this.fIndexUpdator);
        this.scene.objectMap.delete(this.id);
    }
}