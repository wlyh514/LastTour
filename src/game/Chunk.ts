import Vector from "../mage-ascii-engine/Vector";


export default class Chunk {
    private mapData: Uint8Array; 
    lastRendered: number;
    static SIZE = 128; 

    constructor() {
        this.mapData = new Uint8Array(Chunk.SIZE * Chunk.SIZE); 
        this.lastRendered = 0; 
    }

    getTile(tileCoord: Vector): number {
        return this.mapData[tileCoord.y * Chunk.SIZE + tileCoord.x]; 
    }
    setTile(tileCoord: Vector, tile: number) {
        const indx: number = tileCoord.y * Chunk.SIZE + tileCoord.x; 
        if (indx < 0 || indx >= this.mapData.length) {
            return; 
        }
        this.mapData[indx] = tile; 
    }
    logMapData() {
        console.log(this.mapData); 
    }

    static tilePosToChunkPos(tilePos: Vector): Vector {
        return new Vector(
            Math.floor(tilePos.x / Chunk.SIZE),
            Math.floor(tilePos.y / Chunk.SIZE)
        ); 
    }
}