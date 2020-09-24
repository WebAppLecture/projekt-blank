import { GameEngine } from "./GameEngine.js";
import { ImageInitializer } from "./ImageInitializer.js";

window.imageInitializer = new ImageInitializer();

window.gameEngine = new GameEngine(
    document.querySelector(".controls"), 
    document.querySelector(".screen"),
    document.querySelector(".menu"));


