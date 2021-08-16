import Vector from "../mage-ascii-engine/Vector";


export default class Player {
    stats: PlayerStats; 
    pos: Vector; 

    constructor(pos: Vector = Vector.Zero()) {
        this.stats = new PlayerStats(); 
        this.pos = pos; 
    }
}

export class PlayerStats {
    health: number;
    hunger: number; 
    thirst: number; 
    sanity: number; 
}