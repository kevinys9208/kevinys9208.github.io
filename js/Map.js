import { TILE_SIZE } from './Resource.js';

import SrcManager from './SrcManager.js';
import GameManager from './GameManager.js';

export default class Map {

    static create

    constructor(img, width, height, scene) {
        this.img = SrcManager.getGroup('map').get(img);
        this.scene = scene;

        this.width = width;
        this.height = height;

        this.resource = Array.from(Array(height / TILE_SIZE), () => Array(width / TILE_SIZE).fill(0));

        this.offsetX = (this.img.width - (width - height)) / 2;
        this.offsetY = (this.img.height - (width + height) / 2) / 2;

        console.log('Map size => ' + width / TILE_SIZE + ' X ' + height / TILE_SIZE);
        console.log('Screen offset => x: ' + this.offsetX + ', y: ' + this.offsetY);
    }

    setObstacle(o) {
        for (let i = 0; i < o.rangeY; i++) {
            for (let j = 0; j < o.rangeX; j++) {
                this.resource[o.coordY + i][o.coordX + j] = o.id;
            }
        }
    }

    getOriginX() {
        return this.x - (GameManager.canvas.width / 2);
    }

    getOriginY() {
        return this.y - (GameManager.canvas.height / 2);
    }

    updateX() {
        if (this.x <= GameManager.canvas.width / 2) {
            this.x = GameManager.canvas.width / 2;

        } else if (this.x >= this.img.width - (GameManager.canvas.width / 2)) {
            this.x = this.img.width - (GameManager.canvas.width / 2);
        }
    }

    updateY() {
        if (this.y <= GameManager.canvas.height / 2) {
            this.y = GameManager.canvas.height / 2;

        } else if (this.y >= this.img.height - (GameManager.canvas.height / 2)) {
            this.y = this.img.height - (GameManager.canvas.height / 2);
        }
    }

    draw() {
        GameManager
            .ctx
            .drawImage(
                this.img,
                this.x - (GameManager.canvas.width / 2),
                this.y - (GameManager.canvas.height / 2),
                GameManager.canvas.width,
                GameManager.canvas.height,
                0,
                0,
                GameManager.canvas.width,
                GameManager.canvas.height
            );
    }
}