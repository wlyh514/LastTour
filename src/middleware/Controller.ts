import Game from "../game/Game";



export default class Controller {

    private game: Game; 
    constructor(game: Game) {
        this.game = game; 
    }

    setControls() {
        document.addEventListener('keydown', e => {
            const playerPos = this.game.player.pos; 
            switch (e.key) {
                case 'w': case 'ArrowUp':  playerPos.y --; break;
                case 'a': case 'ArrowLeft': playerPos.x --; break; 
                case 's': case 'ArrowDown': playerPos.y ++; break; 
                case 'd': case 'ArrowRight': playerPos.x ++; break; 
                default: break; 
            }
            this.game.focusOn.x = playerPos.x; 
            this.game.focusOn.y = playerPos.y; 
        }); 
    }
}