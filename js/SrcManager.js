let SRC_MANAGER;

class SrcManager {

    constructor() {
        this.groupMap = new Map();
    }

    async createGroup(name, list = null) {
        this.groupMap.set(name, new Map());

        if (list != null) {
            await this.loadGroup(name, list);
        }
    }

    async loadGroup(name, list) {
        const group = this.groupMap.get(name);

        list.forEach(o => {
            let img = new Image();
            img.src = o.src;
            img.onload = function () {
                group.set(o.key, img);
                console.log(o.key + ' 리소스가 로드되었습니다. => ' + name);
            };
        });

        while (group.size != list.length) {
            await new Promise(r => setTimeout(r, 100));
        }
    }

    getGroup(name) {
        if (!this.groupMap.has(name)) {
            throw new Error('해당 이름의 리소스 그룹이 존재하지 않습니다. => ' + name);
        }
        return this.groupMap.get(name);
    }
}

export default SRC_MANAGER = new SrcManager();