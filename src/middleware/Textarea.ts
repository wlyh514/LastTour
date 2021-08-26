import { BitmapLayer } from "../mage-ascii-engine/Layer";
import Tile from "../mage-ascii-engine/Tile";
import Vector from "../mage-ascii-engine/Vector";

export default class Textarea {
    private layer: BitmapLayer; 
    private pos: Vector;
    private size: Vector; 
    private lines: string[][]; 
    full: boolean; 
    
    constructor(layer: BitmapLayer, pos: Vector, size: Vector) {
        this.layer = layer;
        this.pos = pos; 
        this.size = size; 
        this.full = this.size.x * this.size.y === 0; 
        this.lines = new Array(); 
        // Initialize the matrix of char (this.lines)
        for (let y = 0; y < size.y; y++) {
            const line = new Array(); 
            for (let x = 0; x < size.x; x++) {
                line.push(' ');
            }
            this.lines.push(line); 
        }
    }

    /**
     * 
     * @param str the string to be placed in the textarea
     * @returns max index of the char being successfully put into the textarea
     */
    putString(str: string): number {
        let nowAtIndx: number = 0; 
        let done: boolean = false; 
        for (const line of this.lines) {
            for (let col = 0; col < line.length; col ++) {

                if (nowAtIndx === str.length) {
                    done = true; 
                }

                if (done) {
                    line[col] = ' '; 
                    continue; 
                }

                const char: string = str[nowAtIndx]; 
                
                if (char ==='\n') {
                    nowAtIndx ++; 
                    break; 
                }
                line[col] = str[nowAtIndx]; 
                nowAtIndx ++; 
            }
        }
        return nowAtIndx; 
    }

    /**
     * This method will not actually change the character in the lines buffer
     * It will only tell how much characters will be successfully put into the textarea
     * @param str the string to be tested
     * @returns max index of the char being successfully put into the textarea
     */
    attemptPutString(str: string): number {
        let nowAtIndx = 0; 
        for (const line of this.lines) {
            for (let col = 0; col < line.length; col ++) {
                if (nowAtIndx === str.length) {
                    return nowAtIndx; 
                }
                nowAtIndx ++; 
            }
        }
        return nowAtIndx; 
    }

    updateTiles() {
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                const tileIndx = (y + this.pos.y) * this.layer.size.x + x + this.pos.x; 
                this.layer.setTile(tileIndx, {char: this.lines[y][x]}); 
            }
        }
    }
}