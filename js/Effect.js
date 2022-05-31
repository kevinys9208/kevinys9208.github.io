import { RATIO, SW, SH } from './resource.js';

import GameManager from "./GameManager.js";
import SrcManager from "./SrcManager.js";

import Skeleton from "./Skeleton.js";
import Vampire from "./Vampire.js";

export default class Effect {
    
    constructor(effect, enemy, scene) {
        this.id = ++GameManager.id;
        this.scene = scene;
        this.img = SrcManager.getGroup('effect').get(effect);

        this.enemy = enemy;

        this.#initPosition();

        this.fIndex = 0;
        this.fIndexUpdator = setInterval(this.updateIndex, 28, this);

        this.scene.objectMap.set(this.id, this);
    }

    #initPosition() {
        this.orthoX = this.scene.getRandomInt(0, this.scene.map.width);
        this.orthoY = this.scene.getRandomInt(0, this.scene.map.height);

        this.x = this.scene.map.offsetX + this.orthoX - this.orthoY;
        this.y = this.scene.map.offsetY + (this.orthoX + this.orthoY) / 2;
    }

    updateIndex(e) {
        ++e.fIndex;

        if (e.fIndex > 40)
            e.removeFromMap();
        else if (e.fIndex == 20)
            if (e.enemy == 'skeleton')
                new Skeleton(e);
            else if (e.enemy == 'vampire')
                new Vampire(e);
    }

    removeFromMap() {
        clearInterval(this.fIndexUpdator);
        this.scene.objectMap.delete(this.id);
    }

    draw() {
        const ctx = GameManager.ctx;

        const pointX = this.x - this.scene.map.getOriginX();
        const pointY = this.y - this.scene.map.getOriginY();

        ctx.drawImage(
            this.img,
            SW * this.fIndex,
            0,
            SW,
            SH,
            pointX - ((SW / RATIO) / 2),
            pointY - ((SH / RATIO) / 2),
            (SW / RATIO),
            (SH / RATIO)
        );
    }
}