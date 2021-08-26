import Color from "../mage-ascii-engine/Color";
import Tile from "../mage-ascii-engine/Tile";
import { TileTexture } from "../mage-ascii-engine/Tile";

export interface GameTile {
    name: string, 
    isSolid: boolean,
    isDynamic: boolean,
    textureShiftInterval?: number,
    texture?: TileTexture,
    dynamicTexture?: Array<TileTexture>
}

export default class Tiles {
    static getTileTexture(tileId: number, timestamp?: number): TileTexture {
        const gameTile: GameTile = Tiles.tileList[tileId]; 
        let texture: TileTexture; 
        
        if (gameTile.isDynamic) {
            texture = gameTile.dynamicTexture[ Math.floor(timestamp / gameTile.textureShiftInterval) % gameTile.dynamicTexture.length]; 
        }
        else {
            texture = gameTile.texture; 
        }

       return texture; 
    }
    static readonly tileList: Array<GameTile> = [
        // 0
        {
            name: 'void',
            isSolid: false,
            isDynamic: false,
            texture: {
                char: ' ',
                color: Color.Transparent(),
                background: Color.Transparent(),
                isVisible: true
            }
        }, 
        // 1
        {
            name: 'wall',
            isSolid: true,
            isDynamic: true,
            texture: {
                char: '\\',
                color: new Color(255, 255, 255, 1),
                background: new Color(0, 255, 0, 0.5),
                isVisible: true
            },
            textureShiftInterval: 1200, 
            dynamicTexture: [
                {
                    char: '?',
                    color: new Color(0, 255, 0, 1),
                    background: new Color(0, 128, 0, 1),
                    isVisible: true
                },
                {
                    char: '!',
                    color: new Color(128, 0, 0, 1),
                    background: Color.Transparent(),
                    isVisible: true
                }
            ]
        }, 
        // 2
        {
            'name': 'player',
            isSolid: true,
            isDynamic: false,
            texture: {
                char: '@', 
                color: new Color(255, 0, 0, 1),
                background: Color.Transparent(),
                isVisible: true
            }
        }, 
        // 3
        {
            name: 'road', 
            isSolid: false,
            isDynamic: false,
            texture: {
                char: ' ',
                color: Color.Transparent(), 
                background: new Color(150, 150, 150, 0.7), 
                isVisible: true
            }
        }
    ]
}