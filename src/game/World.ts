import Vector from "../mage-ascii-engine/Vector";
import Chunk from "./Chunk";


export default class World {
    chunks: Map<Vector, Chunk>; 
    
    
    constructor(initChunkPos: Vector = Vector.Zero()) {
        this.chunks =  new Map(); 
        const relativeVectors = [
            new Vector(0, 0),
            new Vector(0, -1),
            new Vector(-1, 0),
            new Vector(-1, -1)
        ]
        for (const vector of relativeVectors) {
            this.generateChunk(Vector.add(vector, initChunkPos)); 
        }
    }

    private generateChunk(chunkPos: Vector) {
        const chunk = new Chunk(); 
        this.chunks.set(chunkPos.clone(), chunk); 
        this.populateChunk(chunkPos.clone()); 
    }

    getChunk(chunkPos: Vector): Chunk {
        for (const [key, value] of this.chunks) {
            if (key.equals(chunkPos)) {
                return value; 
            }
        }
        return null; 
    }

    private populateChunk(chunkPos: Vector) {
        const chunk = this.getChunk(chunkPos); 
        for (let y = 0; y < Chunk.SIZE; y++) {
            for (let x = 0; x < Chunk.SIZE; x++) {
                const pos = new Vector(x, y); 
                chunk.setTile(pos, Math.round(Math.random()))
            }
        }
    }
}

export class Time {
    day: number; 
    hour: number; 
    minute: number; 
}