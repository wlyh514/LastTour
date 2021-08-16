import Vector from "../mage-ascii-engine/Vector";
import Player from "./Player";
import World from "./World";



export default class Game {
    world: World; 
    player: Player; 
    paused: boolean; 
    focusOn: Vector; 

    constructor () {
        this.world = new World(); 
        this.player = new Player(); 
        this.paused = false; 
        this.focusOn = Vector.Zero(); 
    }
    
    tick() {

    }
}