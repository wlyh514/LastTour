import Tile from "../mage-ascii-engine/Tile";
import Vector from "../mage-ascii-engine/Vector";

export default abstract class Entity {
    pos: Vector;
    tile: Tile; 
}