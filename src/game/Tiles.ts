import Color from "../mage-ascii-engine/Color";

export interface GameTileTexture {
    char: string, 
    color: Color,
    background: Color, 
    isVisible: boolean,
    
}

export interface GameTile {
    name: string, 
    isSolid: boolean,
    isDynamic: boolean,
    textureShiftInterval?: number,
    texture?: GameTileTexture,
    dynamicTexture?: Array<GameTileTexture>
}

export default class Tiles {
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
            isDynamic: false,
            texture: {
                char: '.',
                color: new Color(255, 255, 255, 1),
                background: new Color(0, 255, 0, 0.5),
                isVisible: true
            }
        }
    ]
}