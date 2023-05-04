import { TO_RADIAN, TILE_SIZE, TILE_HALF } from './Resource.js';

import SceneMap from './Map.js'
import Character from './Character.js'
import Obstacle from './Obstacle.js';
import Effect from './Effect.js';
import GameManager from './GameManager.js';
import SrcManager from './SrcManager.js';

export default class Scene {

    static IDLE = 0;
    static NN = 1;
    static NE = 2;
    static EE = 3;
    static SE = 4;
    static SS = 5;
    static SW = 6;
    static WW = 7;
    static NW = 8;

    constructor(name, map, width, height) {
        this.map = new SceneMap(map, width, height, this);
        this.character = new Character(name, this);
        this.enemyMark = SrcManager.getGroup('ui').get('enemy_mark');

        this.isStart = false;

        this.objectMap = new Map();
        this.objectMap.set(this.character.id, this.character);
       
        this.spellMap = new Map();
        this.enemyMap = new Map();

        this.setCoord();
        this.coordUpdator = setTimeout(function run(c) {
            c.updateCoord();
            c.coordUpdator = setTimeout(run, 16, c);
        }, 16, this);

        this.spellUpdator = setTimeout(function run(c) {
            c.updateSpellCoord();
            c.spellUpdator = setTimeout(run, 16, c);
        }, 16, this);
    }

    setCoord() {
        const x = this.map.img.width / 2;
        const y = this.map.img.height / 2;

        this.map.x = x;
        this.map.y = y;

        this.character.x = x;
        this.character.y = y;
        this.character.orthoX = this.#getOrthoX(x, y);
        this.character.orthoY = this.#getOrthoY(x, y);
    }

    updateCoord() {
        this.updateCharacterCoord();
        this.updateMapCoord();
        this.updateEnemyCoord();
        // this.updateSpellCoord();
    }

    updateCharacterCoord() {
        this.#updateCoordByDir(this.character);
    }

    updateMapCoord() {
        this.map.x = this.character.x;
        this.map.y = this.character.y;

        this.map.updateX();
        this.map.updateY();
    }

    updateEnemyCoord() {
        this.enemyMap.forEach(e => this.#updateCoordByDir(e));
    }

    updateSpellCoord() {
        this.spellMap.forEach(s => this.#updateCoordByDir(s));
    }

    #updateCoordByDir(t) {
        switch (t.dir) {
            case Scene.NN:
                t.updateScreenCoord(Scene.NN, 1, Scene.EE, 0);
                break

            case Scene.NE:
                t.updateScreenCoord(Scene.NN, 0.45, Scene.EE, 0.9);
                break;

            case Scene.EE:
                t.updateScreenCoord(Scene.NN, 0, Scene.EE, 1);
                break;

            case Scene.SE:
                t.updateScreenCoord(Scene.SS, 0.45, Scene.EE, 0.9);
                break;

            case Scene.SS:
                t.updateScreenCoord(Scene.SS, 1, Scene.EE, 0);
                break;

            case Scene.SW:
                t.updateScreenCoord(Scene.SS, 0.45, Scene.WW, 0.9);
                break;

            case Scene.WW:
                t.updateScreenCoord(Scene.NN, 0, Scene.WW, 1);
                break;

            case Scene.NW:
                t.updateScreenCoord(Scene.NN, 0.45, Scene.WW, 0.9);
                break;

            default:
                t.updateScreenCoord(Scene.SS, 0, Scene.EE, 0);
                break;
        }
    }

    updateOrthoCoord(t) {
        let orthoX = this.#getOrthoX(t.x, t.y);
        let orthoY = this.#getOrthoY(t.x, t.y);

        let dir = 0;
        let obj = null;
        let isCollision = false;

        for (let index = 0; index < 4; index++) {
            dir = (index + 1) * 2;
            obj = this.#checkCollision(dir, t, orthoX, orthoY);

            if (obj.isCollision) {
                isCollision = obj.isCollision;
            }

            orthoX = obj.x;
            orthoY = obj.y;
        }

        if (orthoX < TILE_HALF) {
            orthoX = TILE_HALF;

            isCollision = true;

        } else if (orthoX > this.map.width - TILE_HALF) {
            orthoX = this.map.width - TILE_HALF;

            isCollision = true;
        }

        if (orthoY < TILE_HALF) {
            orthoY = TILE_HALF;

            isCollision = true;

        } else if (orthoY > this.map.height - TILE_HALF) {
            orthoY = this.map.height - TILE_HALF;

            isCollision = true;
        }

        t.orthoX = orthoX;
        t.orthoY = orthoY;
        t.x = this.#getScreenX(orthoX, orthoY);
        t.y = this.#getScreenY(orthoX, orthoY);

        return isCollision;
    }

    #checkCollision(dir, t, orthoX, orthoY) {
        let isCollision = false;

        let x = 0;
        let y = 0;
        
        let newOrthoX = orthoX;
        let newOrthoY = orthoY;
        
        let obstacle = null;

        const rangeX = TILE_HALF * t.rangeX;
        const rangeY = TILE_HALF * t.rangeY;

        try {
            switch (dir) {
                case Scene.NE:
                   x = parseInt((orthoX + rangeX) / TILE_SIZE);
                    if (x > (this.map.width / TILE_SIZE) - 1) {
                        break;
                    }
                    
                    y = parseInt((orthoY - rangeY) / TILE_SIZE);
                    if (y < 0) {
                        break;
                    }

                    if (this.map.resource[y][x] != 0) {
                        obstacle = this.objectMap.get(this.map.resource[y][x]);

                        if ((obstacle.coordY + obstacle.rangeY) * TILE_SIZE <= t.orthoY - rangeY) {
                            newOrthoY = (obstacle.coordY + obstacle.rangeY) * TILE_SIZE + rangeY;

                        } else {
                            newOrthoX = obstacle.coordX * TILE_SIZE - rangeX;
                        }

                        isCollision = true;
                    }
                    break;

                case Scene.SE:
                    x = parseInt((orthoX + rangeX) / TILE_SIZE);
                    if (x > (this.map.width / TILE_SIZE) - 1) {
                        break;
                    }

                    y = parseInt((orthoY + rangeY) / TILE_SIZE);
                    if (y > (this.map.height / TILE_SIZE) - 1) {
                        break;
                    }
            
                    if (this.map.resource[y][x] != 0) {
                        obstacle = this.objectMap.get(this.map.resource[y][x]);

                        if (obstacle.coordX * TILE_SIZE >= t.orthoX + rangeX) {
                            newOrthoX = obstacle.coordX * TILE_SIZE - rangeX;

                        } else {
                            newOrthoY = obstacle.coordY * TILE_SIZE - rangeY;
                        }

                        isCollision = true;
                    }
                    break;

                case Scene.SW:
                    x = parseInt((orthoX - rangeX) / TILE_SIZE);
                    if (x < 0) {
                        break;
                    }

                    y = parseInt((orthoY + rangeY) / TILE_SIZE);
                    if (y > (this.map.height / TILE_SIZE) - 1) {
                        break;
                    }
            
                    if (this.map.resource[y][x] != 0) {
                        obstacle = this.objectMap.get(this.map.resource[y][x]);

                        if (obstacle.coordY * TILE_SIZE >= t.orthoY + rangeY) {
                            newOrthoY = obstacle.coordY * TILE_SIZE - rangeY;

                        } else {
                            newOrthoX = (obstacle.coordX + obstacle.rangeX)  * TILE_SIZE + rangeX;
                        }

                        isCollision = true;
                    }
                    break;

                case Scene.NW:
                    x = parseInt((orthoX - rangeX) / TILE_SIZE);
                    if (x < 0) {
                        break;
                    }

                    y = parseInt((orthoY - rangeY) / TILE_SIZE);
                    if (y < 0) {
                        break;
                    }
            
                    if (this.map.resource[y][x] != 0) {
                        obstacle = this.objectMap.get(this.map.resource[y][x]);

                        if ((obstacle.coordX + obstacle.rangeX) * TILE_SIZE <= t.orthoX - rangeX) {
                            newOrthoX = (obstacle.coordX + obstacle.rangeX) * TILE_SIZE + rangeX;

                        } else {
                            newOrthoY = (obstacle.coordY + obstacle.rangeY)  * TILE_SIZE + rangeY;
                        }

                        isCollision = true;
                    }
                    break;
            }

        } catch (error) {
            console.log('Error is occured on checkCollision [ ' + error + ' ]');
        }

        return { x: newOrthoX, y: newOrthoY, isCollision: isCollision };
    }

    #getOrthoX(x, y) {
        return (2 * (y - this.map.offsetY) + (x - this.map.offsetX)) / 2; 
    }

    #getOrthoY(x, y) {
        return (2 * (y - this.map.offsetY) - (x - this.map.offsetX)) / 2; 
    }

    #getScreenX(x, y) {
        return (x - y) + this.map.offsetX;
    }

    #getScreenY(x, y) {
        return ((x + y) / 2) + this.map.offsetY;
    }

    getAngle(x1, y1, x2, y2) {
        let a;
        if(y1 == y2) {
            if(x2 < x1) {
                a = -90;
    
            } else {
                a = 90;
            }
    
        } else if(x1 == x2 && y2 > y1) {
            a = 180;
    
        } else {
            const rad = Math.atan((x2 -x1) / (y1 - y2));
            a = rad / TO_RADIAN;
            
            if(y2 > y1 && x2 > x1) {
                a = 180 + a;
    
            } else if(y2 > y1 && x2 < x1) {
                a = -180 + a;
            }
        }

        return a;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    createObstacle(img, coordX, coordY, rangeX, rangeY) {
        const x = (coordX * TILE_SIZE + (coordX + rangeX) * TILE_SIZE) / 2;
        const y = (coordY * TILE_SIZE + (coordY + rangeY) * TILE_SIZE) / 2;

        let obstacle = new Obstacle(
                                img, 
                                this.#getScreenX(x, y),
                                this.#getScreenY(x, y),
                                coordX,
                                coordY,
                                rangeX,
                                rangeY,
                                this
                            );

        this.objectMap.set(obstacle.id, obstacle);
        this.map.setObstacle(obstacle);
    }

    createEnemy(amount) {
        for (let index = 0; index < amount; index++) {
            if (index % 4 == 0 && GameManager.stage > 2)
                new Effect('smoke', 'vampire', this);
            else
                new Effect('smoke', 'skeleton', this);
        }
    }

    stop() {
        clearInterval(this.coordUpdator);
        Array
            .from(this.objectMap.values())
            .forEach(o => o.removeFromMap());
    }

    draw() {
        this
            .map
            .draw();

        Array
            .from(this.objectMap.values())
            .sort((a, b) => {
                let aX = this.#getOrthoX(a.x, a.y) + (a.rangeX * TILE_HALF);
                let aY = this.#getOrthoY(a.x, a.y) + (a.rangeY * TILE_HALF);
                
                let bX = this.#getOrthoX(b.x, b.y) + (b.rangeX * TILE_HALF);
                let bY = this.#getOrthoY(b.x, b.y) + (b.rangeY * TILE_HALF);

                return (aX**2 + aY**2) - (bX**2 + bY**2);
            })
            .forEach((o) => o.draw(this.map));

        this.#drawCount();
    }

    #drawCount() {
        let ctx = GameManager.ctx;
        let enemyCount = this.enemyMap.size;

        ctx.drawImage(
            this.enemyMark, 
            (GameManager.canvas.width - this.enemyMark.width) / 2, 
            70
        );

        ctx.fillText(
            enemyCount, 
            GameManager.canvas.width / 2, 
            this.enemyMark.height + 140);

        if (this.isStart && enemyCount == 0) {
            this.isStart = false;
            GameManager.next();
        }
    }
}