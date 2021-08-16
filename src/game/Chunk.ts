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
        this.mapData[tileCoord.y * Chunk.SIZE + tileCoord.x] = tile; 
    }
    logMapData() {
        console.log(this.mapData); 
    }
}