import Vector from "../mage-ascii-engine/Vector";
import VectorMap from "../utils/VectorMap";
import Chunk from "./Chunk";
import Entity from "./Entity";
import Player from "./Player";
import Tiles, { GameTile } from "./Tiles";


export default class World {
    chunks: VectorMap<Chunk>; 
    entities: Array<Entity>; 
    
    constructor(player: Player, initChunkPos: Vector = Vector.Zero()) {
        this.chunks =  new VectorMap(); 
        const relativeVectors = [
            new Vector(0, 0),
            new Vector(0, -1),
            new Vector(-1, 0),
            new Vector(-1, -1)
        ]
        for (const vector of relativeVectors) {
            this.generateChunk(Vector.add(vector, initChunkPos)); 
        }
        this.entities = new Array(); 
        this.entities.push(player); 
    }

    private generateChunk(chunkPos: Vector) {
        const chunk = new Chunk(); 
        this.chunks.set(chunkPos.clone(), chunk); 
        this.populateChunk(chunkPos.clone()); 
    }

    getChunk(chunkPos: Vector): Chunk {
        return this.chunks.get(chunkPos); 
    }

    getTile(tilePos: Vector): GameTile {
        const chunkPos: Vector = Chunk.tilePosToChunkPos(tilePos); 
        const chunk: Chunk = this.getChunk(chunkPos); 
        const tileId: number = chunk.getTile(
            Vector.add(tilePos, Vector.multiply(chunkPos, -Chunk.SIZE))
        ); 
        return Tiles.tileList[tileId];
    }

    private populateChunk(chunkPos: Vector) {
        const chunk = this.getChunk(chunkPos); 
        for (let y = 0; y < Chunk.SIZE; y++) {
            for (let x = 0; x < Chunk.SIZE; x++) {
                const pos = new Vector(x, y); 
                let tile = 0; 
                if (y % 10 === 0 || x % 10 === 0) {
                    tile = 3; 
                }
                if (y % 10 === 0 && x % 10 === 0) {
                    tile = 1; 
                }
                chunk.setTile(pos, tile);
            }
        }
    }
}

export class Time {
    day: number; 
    hour: number; 
    minute: number; 
}