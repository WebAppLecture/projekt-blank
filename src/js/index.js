import { GameEngine } from "./GameEngine.js";

window.gameEngine = new GameEngine(
    document.querySelector(".controls"), 
    document.querySelector(".screen"),
    document.querySelector(".menu"));
