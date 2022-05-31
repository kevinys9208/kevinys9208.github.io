import { RATIO, TO_RADIAN, S_MF, SS, SW, SH } from './Resource.js';

import GameManager from './GameManager.js';
import SrcManager from './SrcManager.js';

export default class Espell {

    offset = 24;

    constructor(dir, x, y, scene, angle) {
        this.id = ++GameManager.id;

        this.width = SW;
        this.height = SH;

        this.rangeX = 1;
        this.rangeY = 1;
        
        this.dir = dir;

        this.radian = angle * TO_RADIAN;
        this.diagonalX = Math.sin(this.radian);
        this.diagonalY = -Math.cos(this.radian);

        this.x = x + this.diagonalX * this.offset;
        this.y = y + this.diagonalY * this.offset;

        this.img = SrcManager.getGroup('spell').get('poisonball');
        this.shadow = SrcManager.getGroup('spell').get('fireball_shadow');

        this.scene = scene;
        this.scene.objectMap.set(this.id, this);
        this.scene.spellMap.set(this.id, this);

        this.fIndex = 0;
        this.fIndexUpdator = setInterval(this.updateIndex, 24, this);
    }

    updateIndex(s) {
        if (++s.fIndex > S_MF) {
            s.fIndex = S_MF - 40;
        }
    }

    updateScreenCoord() {
        this.#updateX();
        this.#updateY();
        
        let isCollision = false;
        isCollision = this.#checkCharacterCollision();
        if (isCollision) {
            this.scene.character.addDamage();
            this.removeFromMap();
        }
        isCollision = this.scene.updateOrthoCoord(this);
        if (isCollision) {
            this.removeFromMap();
        }
    }

    #updateX() {
        this.x += SS / 2 * this.diagonalX;
    }

    #updateY() {
        this.y += SS / 2 * this.diagonalY;
    }

    #checkCharacterCollision() {
        return this.scene.character.isCollision(this);
    }

    removeFromMap() {
        clearInterval(this.fIndexUpdator);
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
            pointX - ((this.width / RATIO) / 2),
            pointY - ((this.height / RATIO) / 2),
            (this.width / RATIO),
            (this.height / RATIO)
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
            pointX - ((this.width / RATIO) / 2),
            pointY - ((this.height / RATIO) / 2),
            (this.width / RATIO),
            (this.height / RATIO)
        );

        ctx.restore();
    }
}