import { RATIO } from './resource.js';

import GameManager from './GameManager.js';
import SrcManager from './SrcManager.js';

export default class Obstacle {

    constructor(img, x, y, coordX, coordY, rangeX, rangeY, scene) {
        this.id = ++GameManager.id;
        this.scene = scene;

        if (img != null) {
            this.img = SrcManager.getGroup('obstacle').get(img);
            
        } else {
            this.img = null;
        }

        this.x = x;
        this.y = y;

        this.coordX = coordX;
        this.coordY = coordY;

        this.rangeX = rangeX;
        this.rangeY = rangeY;
    }

    draw(map) {
        if (this.img == null) {
            return;
        }

        GameManager
            .ctx
            .drawImage(
                this.img,
                0,
                0,
                this.img.width,
                this.img.height,
                this.x - map.getOriginX() - (this.img.width / RATIO / 2),
                this.y - map.getOriginY() - (this.img.height / RATIO / 2),
                this.img.width / RATIO,
                this.img.height / RATIO
            );
    }


    removeFromMap() {
        this.scene.objectMap.delete(this.id);
    }
}