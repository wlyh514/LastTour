import Vector from "../mage-ascii-engine/Vector";
import { Operation } from "../controller/Controller";
import { Alert, Dialogue } from "../middleware/Dialogue";
import DialogueEngine from "../middleware/DialogueEngine";
import Player from "./Player";
import World from "./World";

export enum Direction {
    Right, 
    Down, 
    Left, 
    Up
}

export default class Game {
    world: World; 
    player: Player; 
    paused: boolean; 
    focusOn: Vector; 
    dialogueEngine: DialogueEngine; 
    focusedPanel: string; 

    constructor () {
        this.player = new Player(); 
        this.world = new World(this.player); 
        this.paused = false; 
        this.focusOn = Vector.Zero(); 
        this.dialogueEngine = new DialogueEngine(); 
        this.dialogueEngine.enqueueDialogue(new Alert('Hello! '))
        this.dialogueEngine.enqueueDialogue(new Alert(`The bullet pierced the window shattering it before missing Danny's head by mere millimeters. She could hear him in the shower singing with a joy she hoped he'd retain after she delivered the news. The shooter says goodbye to his love. Lightning Paradise was the local hangout joint where the group usually ended up spending the night.
Please put on these earmuffs because I can't you hear.`)); 
        this.focusedPanel = 'world'; 
    }

    private movePlayer = (direction: Direction): void => {
        const pos: Vector = this.player.pos.clone(); 
        let velocity: Vector; 
        switch (direction) {
            case Direction.Right: 
                velocity = new Vector(1, 0); break; 
            case Direction.Down:
                velocity = new Vector(0, 1); break; 
            case Direction.Left:
                velocity = new Vector(-1, 0); break; 
            case Direction.Up: 
                velocity = new Vector(0, -1); break; 
            default: return; 
        }
        pos.add(velocity);         
        if (this.world.getTile(pos).isSolid) {
            return; 
        }
        this.player.pos = pos; 
        this.focusOn = pos.clone(); 
    }

    getOperations = (): Array<Operation> => {
        return [
            {
                name: 'playerMoveRight', 
                panel: 'world', 
                exec: () => this.movePlayer(Direction.Right)
            }, 
            {
                name: 'playerMoveDown', 
                panel: 'world', 
                exec: () => this.movePlayer(Direction.Down)
            }, 
            {
                name: 'playerMoveLeft', 
                panel: 'world', 
                exec: () => this.movePlayer(Direction.Left)
            }, 
            {
                name: 'playerMoveUp', 
                panel: 'world', 
                exec: () => this.movePlayer(Direction.Up)
            }, 
            {
                name: 'dialogueProceed', 
                panel: 'dialogue', 
                exec: () => this.dialogueEngine.proceed()
            }
        ]
    }

    getFocusedPanel = (): string => {
        return this.focusedPanel; 
    }
    
    tick = () => {
        this.focusedPanel = 'world'; 
        if (this.dialogueEngine.hasDialogue()) {
            this.focusedPanel = 'dialogue'; 
        }
        this.dialogueEngine.tick(); 
    }
}