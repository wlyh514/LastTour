import Color from "../mage-ascii-engine/Color";
import Layer, { BitmapLayer } from "../mage-ascii-engine/Layer";
import Tile from "../mage-ascii-engine/Tile";
import Vector from "../mage-ascii-engine/Vector";
import Queue from "../utils/Queue";
import { Alert, Dialogue, MultipleChoice } from "./Dialogue";
import Textarea from "./Textarea";

// TODO: Refactor this. This looks really bad. :(
export default class DialogueEngine {
    static padding: Uint8Array = new Uint8Array([1, 1, 1, 1]); 
    // Top, right, bottom, left; 
    private dialogueQueue: Queue<Dialogue>; 
    private layer: BitmapLayer; 
    private textarea: Textarea; 
    private state: DialogueState; 
    
    constructor() {
        this.dialogueQueue = new Queue<Dialogue>(); 
        this.state = null; 
        this.layer = null; 
    }

    injectLayer(layer: BitmapLayer) {
        this.layer = layer; 
        const textareaSize = new Vector(
            this.layer.size.x - DialogueEngine.padding[1] - DialogueEngine.padding[3], 
            this.layer.size.y - DialogueEngine.padding[0] - DialogueEngine.padding[2]
        ); 

        for (let y = 0; y < layer.size.y; y++) {
            for (let x = 0; x < layer.size.x; x++) {
                const tileIndx = y * layer.size.x + x; 
                let char = ' ';
                let color: Color = new Color(255, 255, 255, 1); 
                if ((x === 0 || x === layer.size.x - 1) && (y === 0 || y === layer.size.y - 1)) {
                    char = '+'; 
                }
                else if (x === 0 || x === layer.size.x - 1) {
                    char = '|'; 
                }
                else if (y === 0 || y === layer.size.y - 1) {
                    char = '-'; 
                }
                layer.setTile(tileIndx, {
                    char,
                    color, 
                    background: new Color(0, 0, 0, 1)
                }); 
            }
        }
        const textareaPos: Vector = new Vector(DialogueEngine.padding[3], DialogueEngine.padding[0]); 
        this.textarea = new Textarea(layer, textareaPos, textareaSize.clone()); 
        this.state = new DialogueState(this.textarea); 
    }

    enqueueDialogue(dialogue: Dialogue) {
        this.dialogueQueue.enqueue(dialogue); 
    }

    hasDialogue() {
        return this.state !== null && this.state.dialogue !== null; 
    }

    /**
     * This will be called by the Middleware every frame 
     */
    tick() {
        if (this.layer === null) {
            return; 
        }
        // If the current state is empty, try to load a new dialogue from queue. 
        if (this.state.dialogue === null) {
            if (!this.dialogueQueue.isEmpty) {
                this.state.loadDialogue(this.dialogueQueue.dequeue()); 
                this.layer.isVisible = true; 
            }
            else {
                this.layer.isVisible = false; 
            }
        }
        else {
            if (!this.state.displayedAll) {
                this.state.nextChar(); 
            }
            this.textarea.updateTiles(); 
        }
    }

    proceed() {
        if (!this.hasDialogue()) {
            return; 
        }
        if (this.state.displayedAll) {
            if (this.state.lastPage) {  
                if (this.state.dialogue instanceof MultipleChoice) {
                    this.state.dialogue.choose(this.state.choiceIndx); 
                }       
                this.state.clear();
            }
            else {
                this.state.nextPage(); 
            }
        }
        else {
            this.state.displayAll(); 
        }
        
        this.textarea.updateTiles(); 
    }
}

/**
 * Holds all the states of the currently displayed dialogue. 
 */
class DialogueState {
    // Not very OO but whatever
    private textarea: Textarea;
    dialogue: Dialogue; 
    pageStart: number; 
    nowAt: number; 
    choiceIndx: number; 
    displayedAll: boolean; 
    lastPage: boolean; 
    // line[] 
    
    private reset() {
        this.pageStart = 0; 
        this.nowAt = 0;
        this.choiceIndx = 0; 
        this.displayedAll = false; 
        this.lastPage = false; 
    }

    clear() {
        this.dialogue = null; 
        this.reset(); 
    }

    constructor(textarea: Textarea) {
        this.textarea = textarea; 
        this.clear(); 
    }

    loadDialogue(dialogue: Dialogue) {
        dialogue.content = ` * ${dialogue.content}`; 
        this.dialogue = dialogue; 
        this.reset(); 
        if (this.textarea.attemptPutString(dialogue.content) >= dialogue.content.length - 1) {
            this.lastPage = true; 
        }
    }

    displayAll() {
        this.nowAt = this.textarea.putString(this.dialogue.content.slice(this.pageStart)) + this.pageStart; 
        this.displayedAll = true; 
    }

    nextPage() {
        if (this.lastPage) {
            return; 
        }
        this.nowAt = this.textarea.putString(this.dialogue.content.slice(this.pageStart)) + this.pageStart; 
        this.pageStart = this.nowAt; 
        
        if (this.textarea.attemptPutString(this.dialogue.content.slice(this.pageStart)) + this.pageStart >= this.dialogue.content.length - 1) {
            this.lastPage = true; 
        }
        this.displayedAll = false; 
    }

    nextChar() {
        const success: number = this.textarea.putString(this.dialogue.content.slice(this.pageStart, this.nowAt + 1));
        if (success === this.textarea.attemptPutString(this.dialogue.content.slice(this.pageStart, this.nowAt + 2))) {
            this.displayedAll = true; 
        }
        else {
            this.nowAt ++; 
        }
    }

    prevChoice() {
        if (!(this.dialogue instanceof MultipleChoice)) {
            return; 
        }
        this.choiceIndx --; 
        if (this.choiceIndx < 0) {
            this.choiceIndx = this.dialogue.choices.length - 1; 
        }
    }
    nextChoice() {
        if (!(this.dialogue instanceof MultipleChoice)) {
            return; 
        }
        this.choiceIndx ++; 
        if (this.choiceIndx >= this.dialogue.choices.length) {
            this.choiceIndx = 0; 
        }
    }

}