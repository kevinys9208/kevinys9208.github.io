let RATIO = 1.5

let TO_RADIAN = Math.PI / 180;

let IT = 100;

let C_WF = 24;
let E_SF = 23;
let E_VF = 31;
let S_MF = 59;

let CS = 8 / RATIO;
let CW = 144;
let CH = 288;
let CR = [
    { key: 'walk_1', src: './resources/character/walk_nn.png' },
    { key: 'walk_2', src: './resources/character/walk_ne.png' },
    { key: 'walk_3', src: './resources/character/walk_ee.png' },
    { key: 'walk_4', src: './resources/character/walk_se.png' },
    { key: 'walk_5', src: './resources/character/walk_ss.png' },
    { key: 'walk_6', src: './resources/character/walk_sw.png' },
    { key: 'walk_7', src: './resources/character/walk_ww.png' },
    { key: 'walk_8', src: './resources/character/walk_nw.png' },
    { key: 'dmg_1', src: './resources/character/dmg_nn.png' },
    { key: 'dmg_2', src: './resources/character/dmg_ne.png' },
    { key: 'dmg_3', src: './resources/character/dmg_ee.png' },
    { key: 'dmg_4', src: './resources/character/dmg_se.png' },
    { key: 'dmg_5', src: './resources/character/dmg_ss.png' },
    { key: 'dmg_6', src: './resources/character/dmg_sw.png' },
    { key: 'dmg_7', src: './resources/character/dmg_ww.png' },
    { key: 'dmg_8', src: './resources/character/dmg_nw.png' },
    { key: 'walk_shadow', src: './resources/character/walk_shadow.png' }
];

let SS = 27 / RATIO;
let SW = 288;
let SH = 288;
let SR = [
    { key: 'fireball', src: './resources/spell/fireball.png' },
    { key: 'poisonball', src: './resources/spell/poisonball.png' },
    { key: 'fireball_shadow', src: './resources/spell/fireball_shadow.png' }
];

let ES = 6 / RATIO;
let EW = 144;
let EH = 288;
let ER = [
    { key: 's_walk_1', src: './resources/enemy/skeleton/walk_nn.png' },
    { key: 's_walk_2', src: './resources/enemy/skeleton/walk_ne.png' },
    { key: 's_walk_3', src: './resources/enemy/skeleton/walk_ee.png' },
    { key: 's_walk_4', src: './resources/enemy/skeleton/walk_se.png' },
    { key: 's_walk_5', src: './resources/enemy/skeleton/walk_ss.png' },
    { key: 's_walk_6', src: './resources/enemy/skeleton/walk_sw.png' },
    { key: 's_walk_7', src: './resources/enemy/skeleton/walk_ww.png' },
    { key: 's_walk_8', src: './resources/enemy/skeleton/walk_nw.png' },
    { key: 's_dmg_1', src: './resources/enemy/skeleton/dmg_nn.png' },
    { key: 's_dmg_2', src: './resources/enemy/skeleton/dmg_ne.png' },
    { key: 's_dmg_3', src: './resources/enemy/skeleton/dmg_ee.png' },
    { key: 's_dmg_4', src: './resources/enemy/skeleton/dmg_se.png' },
    { key: 's_dmg_5', src: './resources/enemy/skeleton/dmg_ss.png' },
    { key: 's_dmg_6', src: './resources/enemy/skeleton/dmg_sw.png' },
    { key: 's_dmg_7', src: './resources/enemy/skeleton/dmg_ww.png' },
    { key: 's_dmg_8', src: './resources/enemy/skeleton/dmg_nw.png' },
    { key: 'v_walk_1', src: './resources/enemy/vampire/walk_nn.png' },
    { key: 'v_walk_2', src: './resources/enemy/vampire/walk_ne.png' },
    { key: 'v_walk_3', src: './resources/enemy/vampire/walk_ee.png' },
    { key: 'v_walk_4', src: './resources/enemy/vampire/walk_se.png' },
    { key: 'v_walk_5', src: './resources/enemy/vampire/walk_ss.png' },
    { key: 'v_walk_6', src: './resources/enemy/vampire/walk_sw.png' },
    { key: 'v_walk_7', src: './resources/enemy/vampire/walk_ww.png' },
    { key: 'v_walk_8', src: './resources/enemy/vampire/walk_nw.png' },
    { key: 'v_dmg_1', src: './resources/enemy/vampire/dmg_nn.png' },
    { key: 'v_dmg_2', src: './resources/enemy/vampire/dmg_ne.png' },
    { key: 'v_dmg_3', src: './resources/enemy/vampire/dmg_ee.png' },
    { key: 'v_dmg_4', src: './resources/enemy/vampire/dmg_se.png' },
    { key: 'v_dmg_5', src: './resources/enemy/vampire/dmg_ss.png' },
    { key: 'v_dmg_6', src: './resources/enemy/vampire/dmg_sw.png' },
    { key: 'v_dmg_7', src: './resources/enemy/vampire/dmg_ww.png' },
    { key: 'v_dmg_8', src: './resources/enemy/vampire/dmg_nw.png' },
    { key: 'walk_shadow', src: './resources/enemy/walk_shadow.png' }
];

let TILE_SIZE = 36 / RATIO;
let TILE_HALF = 18 / RATIO;

let MR = [
    { key: 'map_001', src: './resources/map/map_001.png' },
    { key: 'map_002', src: './resources/map/map_002.png' }
];

let OR = [
    { key: 'pedestal', src: './resources/obstacle/pedestal.png' },
    { key: 'grave', src: './resources/obstacle/grave.png' }
];

let UR = [
    { key: 'life', src: './resources/ui/life.png' },
    { key: 'life_back', src: './resources/ui/life_back.png' },
    { key: 'enemy_mark', src: './resources/ui/enemy_mark.png' }
];

let FR = [
    { key: 'smoke', src: './resources/effect/smoke.png' }
];

export { RATIO, TO_RADIAN, IT, TILE_SIZE, TILE_HALF, C_WF, E_SF, E_VF, S_MF, CS, CW, CH, CR, SS, SW, SH, SR, ES, EW, EH, ER, MR, OR, UR, FR };