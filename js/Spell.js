import { RATIO, TO_RADIAN, S_MF, SS, SW, SH } from './Resource.js';

import GameManager from './GameManager.js';
import SrcManager from './SrcManager.js';

export default class Spell {

    offset = 24;

    constructor(dir, x, y, scene, angle) {
        this.id = ++GameManager.id;
        console.log(this.id);

        this.width = SW;
        this.height = SH;

        this.rangeX = 2;
        this.rangeY = 2;
        
        this.dir = dir;

        this.radian = angle * TO_RADIAN;
        this.diagonalX = Math.sin(this.radian);
        this.diagonalY = -Math.cos(this.radian);

        this.x = x + this.diagonalX * this.offset;
        this.y = y + this.diagonalY * this.offset;

        this.img = SrcManager.getGroup('spell').get('fireball');
        this.shadow = SrcManager.getGroup('spell').get('fireball_shadow');

        this.scene = scene;
        this.scene.objectMap.set(this.id, this);
        this.scene.spellMap.set(this.id, this);

        this.fIndex = 0;
        this.fIndexUpdator = setTimeout(function run(c) {
            c.updateIndex();
            c.fIndexUpdator = setTimeout(run, 24, c);
        }, 24, this);
    }

    updateIndex() {
        if (++this.fIndex > S_MF) {
            this.fIndex = S_MF - 40;
        }
    }

    updateScreenCoord() {
        this.#updateX();
        this.#updateY();
        
        let isCollision = false;
        isCollision = this.#checkEnemyCollision();
        if (isCollision) {
            this.removeFromMap();
        }
        isCollision = this.scene.updateOrthoCoord(this);
        if (isCollision) {
            this.removeFromMap();
        }
    }

    #updateX() {
        this.x += SS * this.diagonalX;
    }

    #updateY() {
        this.y += SS * this.diagonalY;
    }

    #checkEnemyCollision() {
        if (this.scene.enemyMap.values().size == 0) {
            return false;
        }

        return Array.from(this.scene.enemyMap.values()).some((v) => {
            let result = v.isCollision(this);
            if (result) {
                v.addDamage();
                return result;
            }
        });
    }

    removeFromMap() {
        clearTimeout(this.fIndexUpdator);
        this.scene.objectMap.delete(this.id);
        this.scene.spellMap.delete(this.id);
    }

    draw(map) {
        const ctx = GameManager.ctx;

        const pointX = this.x - map.getOriginX();
        let pointY = this.y - map.getOriginY();

        this.#drawShadow(ctx, pointX, pointY);

        pointY -= ((this.height / RATIO) / 3);

        this.#drawImage(ctx, pointX, pointY);
    }

    #drawShadow(ctx, pointX, pointY) {
        ctx.save();
        ctx.translate(pointX, pointY);
        ctx.rotate(this.radian);
        ctx.translate(-pointX, -pointY);

        ctx.drawImage(
            this.shadow,
            this.width * this.fIndex,
            0,
            this.width,
            this.height,
            pointX - ((this.width / RATIO)),
            pointY - ((this.height / RATIO)),
            (this.width / RATIO) * 2,
            (this.height / RATIO) * 2
        );

        ctx.restore();
    }

    #drawImage(ctx, pointX, pointY) {
        ctx.save();
        ctx.translate(pointX, pointY);
        ctx.rotate(this.radian);
        ctx.translate(-pointX, -pointY);

        ctx.drawImage(
            this.img,
            this.width * this.fIndex,
            0,
            this.width,
            this.height,
            pointX - (this.width / RATIO),
            pointY - (this.height / RATIO),
            (this.width / RATIO) * 2,
            (this.height / RATIO) * 2
        );

        ctx.restore();
    }
}