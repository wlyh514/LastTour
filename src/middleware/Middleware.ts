
/**
 * This class is responsible for using the mage-ascii-engine renderer to render 
 * the scene of a Game instance. 
 */

import Chunk from "../game/Chunk";
import Game from "../game/Game";
import Tiles from "../game/Tiles";
import Layer, { BitmapLayer } from "../mage-ascii-engine/Layer";
import Renderer from "../mage-ascii-engine/Renderer/Renderer";
import { TileTexture } from "../mage-ascii-engine/Tile";
import Vector from "../mage-ascii-engine/Vector";


export default class Middleware {
    private game: Game; 
    private renderer: Renderer; 

    private bitmapLayers: Record<string, BitmapLayer>; 
    private layers: Record<string, Layer>; 

    private chunksBuffer: Map<number, Chunk>; 
    private timestamp: number; 

    frameLastSecond: number; 


    constructor(game: Game, renderer: Renderer, dimension: Vector, fontSize: number) {
        this.game = game; 
        this.renderer = renderer; 
        this.chunksBuffer = new Map(); 
        this.bitmapLayers = {}; 
        this.layers = {}; 
        this.renderer.setSize(fontSize)

        const backgroundLayer = new BitmapLayer({ 
            size: new Vector(dimension.x - 20, dimension.y),
            z: 8
        }); 
        const entitiesLayer = new Layer({ 
            size: new Vector(dimension.x - 20, dimension.y),
            z: 9
        }); 
        const dialogueLayer = new BitmapLayer({
            size: new Vector(60, 6),
            pos: new Vector(0, 18),
            z: 10
        }); 
        this.game.dialogueEngine.injectLayer(dialogueLayer); 
        // Add layers
        this.bitmapLayers['background'] = backgroundLayer; 
        this.layers['entities'] = entitiesLayer; 
        this.bitmapLayers['dialogue'] = dialogueLayer; 

        this.renderer.addLayer('background', backgroundLayer); 
        this.renderer.addLayer('entities', entitiesLayer); 
        this.renderer.addLayer('dialogue', dialogueLayer); 

        this.renderer.onBeforeDraw(
            () => {
                // this.tileOverload(); 
                // lighting etc...
            }
        ); 
        this.timestamp = Date.now(); 
        this.frameLastSecond = 0; 
    }


    render= () => {
        this.timestamp = Date.now(); 
        const focusOn: Vector = this.game.focusOn; // Tile coord 
        // Get the chunk coord of the tile at the four corners
        const bgSize: Vector = this.bitmapLayers.background.size; 
        const leftTop: Vector = Vector.add(focusOn, Vector.multiply(bgSize, -0.5));
        const rightBottom: Vector = Vector.add(leftTop, bgSize);
        const leftTopChunkCoord: Vector = 
            new Vector(Math.floor(leftTop.x / Chunk.SIZE), Math.floor(leftTop.y / Chunk.SIZE)); 
        const rightBottomChunkCoord: Vector =
            new Vector(Math.floor(rightBottom.x / Chunk.SIZE), Math.floor(rightBottom.y / Chunk.SIZE)); 

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
                        const tileId: number = chunk.getTile(new Vector(
                            tileX - chunkStartCoord.x,
                            tileY - chunkStartCoord.y
                        ));
                        const indxOnBgLayer = (tileY - leftTop.y) * bgSize.x + (tileX - leftTop.x); 
                        const texture: TileTexture = Tiles.getTileTexture(tileId, this.timestamp); 
                        this.bitmapLayers.background.setTile(indxOnBgLayer, texture); 
                    }
                }
            }
        }
        this.bitmapLayers.background.draw(); 
        // Draw entities
        for (const entity of this.game.world.entities) {
            if (entity.pos.x < leftTop.x || entity.pos.x > rightBottom.x ||
                entity.pos.y < leftTop.y || entity.pos.y > rightBottom.y) {
                    // The entity is not in render distance. 
                    continue; 
                }
            // change tile.pos to the relative position of the entity on screen
            entity.tile.pos.x = entity.pos.x - leftTop.x; 
            entity.tile.pos.y = entity.pos.y - leftTop.y; 
            this.layers.entities.draw(entity.tile); 
        }
        // Draw Dialogue box
        this.bitmapLayers.dialogue.draw(); 

        this.renderer.commit(); 
    }
}