
/**
 * This class is responsible for using the mage-ascii-engine renderer to render 
 * the scene of a Game instance. 
 */

import Chunk from "../game/Chunk";
import Game from "../game/Game";
import Tiles, { GameTile, GameTileTexture } from "../game/Tiles";
import Color from "../mage-ascii-engine/Color";
import Layer from "../mage-ascii-engine/Layer";
import Renderer from "../mage-ascii-engine/Renderer/Renderer";
import Tile from "../mage-ascii-engine/Tile";
import Vector from "../mage-ascii-engine/Vector";

export default class Middleware {
    private game: Game; 
    private renderer: Renderer; 
    private dimension: Vector; 
    private namedLayers: Record<string, Layer>; 

    private chunksBuffer: Map<number, Chunk>; 
    private tilesBuffer: Uint8Array;

    private backgroundTiles: Array<Tile>; 
    frameLastSecond: number; 


    constructor(game: Game, renderer: Renderer, dimension: Vector, fontSize: number) {
        this.game = game; 
        this.renderer = renderer; 
        this.dimension = dimension; 
        this.chunksBuffer = new Map(); 
        this.namedLayers = {}; 
        this.renderer.setSize(fontSize)

        const backgroundLayer = new Layer({ size: dimension }); 
        const entitiesLayer = new Layer({ size: dimension }); 

        // Add layers
        this.namedLayers['background'] = backgroundLayer; 
        this.renderer.addLayer('background', backgroundLayer); 
        this.namedLayers['entities'] = entitiesLayer; 
        this.renderer.addLayer('entities', entitiesLayer); 
        this.renderer.onBeforeDraw(
            () => {
                this.tileOverload(); 
                // lighting etc...
            }
        ); 
        this.backgroundTiles = Array.from({ length: this.dimension.x * this.dimension.y }, (_, i) => {
            const x = i % this.dimension.x;
            const y = Math.floor(i / this.dimension.x);
          
            return new Tile({
              char: ' ',
              pos: new Vector(x, y),
              background: Color.Transparent(),
              color: Color.Transparent()
            });
        });
        this.frameLastSecond = 0; 
    }

    tileOverload() {
        const bgOps = this.namedLayers.background.operations; 
        for (let i = 0; i < this.tilesBuffer.length; i++) {
            const gameTile: GameTile = Tiles.tileList[this.tilesBuffer[i]]; 
            const op = bgOps[i]; 
            let texture: GameTileTexture; 
            
            if (gameTile.isDynamic) {
                texture = gameTile.dynamicTexture[ Math.floor(this.renderer.frames / gameTile.textureShiftInterval) % gameTile.dynamicTexture.length]; 
            }
            else {
                texture = gameTile.texture; 
            }

            op.char = texture.char; 
            op.color = texture.color; 
            op.background = texture.background; 
            op.isVisible = texture.isVisible; 
        }
        // console.log(this.namedLayers.background.operations); 
    }

    render() {
        const focusOn: Vector = this.game.focusOn; // Tile coord 
        // Get the chunk coord of the tile at the four corners
        const leftTop: Vector = Vector.add(focusOn, Vector.multiply(this.dimension, -0.5));
        const rightBottom: Vector = Vector.add(leftTop, this.dimension);

        const leftTopChunkCoord: Vector = 
            new Vector(Math.floor(leftTop.x / Chunk.SIZE), Math.floor(leftTop.y / Chunk.SIZE)); 
        const rightBottomChunkCoord: Vector =
            new Vector(Math.floor(rightBottom.x / Chunk.SIZE), Math.floor(rightBottom.y / Chunk.SIZE)); 
        this.tilesBuffer = new Uint8Array(this.dimension.x * this.dimension.y); 

        // If the a chunk in the display area is not in chunkbuffer
        // Load it in
        for (let x = leftTopChunkCoord.x; x <= rightBottomChunkCoord.x; x++) {
            for (let y = leftTopChunkCoord.y; y <= rightBottomChunkCoord.y; y++) {
                const key = x + y * 100; 
                let chunk = this.chunksBuffer.get(key); 
                if (chunk === undefined) {
                    chunk = this.game.world.getChunk(new Vector(x, y)); 
                    this.chunksBuffer.set(key, chunk); 
                }
                chunk.lastRendered = this.renderer.frames; 

                const chunkStartCoord = new Vector(x * Chunk.SIZE, y * Chunk.SIZE); 
                const start = new Vector(
                    Math.max(chunkStartCoord.x, leftTop.x ),
                    Math.max(chunkStartCoord.y, leftTop.y )
                )
                const end =  new Vector(
                    Math.min(chunkStartCoord.x + Chunk.SIZE, rightBottom.x), 
                    Math.min(chunkStartCoord.y + Chunk.SIZE, rightBottom.y)
                )

                for (let tileX = start.x; tileX < end.x; tileX ++) {
                    for (let tileY = start.y; tileY < end.y; tileY ++) {
                        const tile: number = chunk.getTile(new Vector(
                            tileX - chunkStartCoord.x,
                            tileY - chunkStartCoord.y
                        ));
                        this.tilesBuffer[(tileY - leftTop.y) * this.dimension.x + (tileX - leftTop.x)] = tile; 
                    }
                }
            }
        }
        this.backgroundTiles.forEach(tile => this.namedLayers.background.draw(tile)); 
        this.renderer.commit(); 
    }
}