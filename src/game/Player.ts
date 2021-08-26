import Color from "../mage-ascii-engine/Color";
import Tile from "../mage-ascii-engine/Tile";
import Vector from "../mage-ascii-engine/Vector";
import Entity from "./Entity";


export default class Player extends Entity{
    stats: PlayerStats; 

    constructor(pos: Vector = Vector.Zero()) {
        super(); 
        this.stats = new PlayerStats(); 
        this.pos = pos; 
        this.tile = new Tile({
            char: '@', 
            color: new Color(255, 0, 0, 1),
            background: Color.Transparent(), 
            isVisible: true,
            pos: pos.clone()
        }); 
    }
}

export class PlayerStats {
    health: number;
    hunger: number; 
    thirst: number; 
    sanity: number; 
}