import Renderer from "./mage-ascii-engine/Renderer/Renderer";
import Vector from "./mage-ascii-engine/Vector";
import CanvasRenderer from "./mage-ascii-engine/Renderer/CanvasRenderer";
import Game from "./game/Game";
import Middleware from "./middleware/Middleware";
import Controller from "./controller/Controller";

const WIDTH = 80;
const HEIGHT = 24;
const SIZE = 30;

const game: Game = new Game(); 
const renderer: Renderer = new CanvasRenderer(); 
const middleware: Middleware = new Middleware(game, renderer, new Vector(WIDTH, HEIGHT), SIZE);

const defaultKeyMapping: Record<string, Array<string>> = {
  'playerMoveRight': ['d', 'ArrowRight'], 
  'playerMoveDown': ['s', 'ArrowDown'],
  'playerMoveLeft': ['a', 'ArrowLeft'],
  'playerMoveUp': ['w', 'ArrowUp'],
  'dialogueProceed': ['z', 'Enter']
}

const controller: Controller = new Controller(game.getFocusedPanel, game.getOperations(), defaultKeyMapping); 
controller.setControls(); 

let fps = 0; 
const render = () => {
  middleware.render(); 
  fps ++; 
  window.requestAnimationFrame(render); 
}
render(); 

const fpsDisplay: HTMLElement = document.getElementById('asc-engine-fps'); 
const countFPS = () => {
  fpsDisplay.textContent = fps.toString(); 
  fps = 0; 
}

setInterval(game.tick, 16); 
setInterval(countFPS, 1000); 

document.addEventListener('click', render); 