import { Inputs } from "./Inputs.js";
import { Menu } from "./Menu.js";
import { Starfall } from "./game/Starfall.js";

export class GameEngine {

    constructor(controls, screen, menu) {
        this.controls = controls;
        this.screen = screen;
        this.menu = new Menu(menu);

        this.setupCanvas();
        this.setupControls();
        this.showGameSelect();
    }

    loadGame(game, mode) {
        if (game) {
            this.game = new game(mode);
            this.gameLoop();
        }
    }

    loadGameWithMode(game) {
        let modeName = this.menu.activeItem.innerText,
            mode = GameEngine.getModeByName(game, modeName);
        this.menu.hide();
        this.loadGame(game, mode);
    }

    modeSelect() {
        let name = this.menu.activeItem.innerText,
            game = GameEngine.getGameByName(name),
            modes = game.MODES;
        if (modes.length === 0) {
            this.menu.hide();
            this.loadGame(game);
        } else {
            this.menu.load(modes, this.loadGameWithMode.bind(this, game))
        }
    }

    showGameSelect() {
        this.menu.load(GameEngine.availableGames, this.modeSelect.bind(this));
    }

    reset() {
        delete this.game;
        this.renderContext.clearRect(0, 0, this.screen.width, this.screen.height);
        this.showGameSelect();
    }

    setupControls() {
        this.setKeyMapping();
        this.populateKeyText();
        this.setupControlListeners();
    }

    setKeyMapping() {
        this.keyMapping = {};
        Object.keys(Inputs).forEach(inputName => {
            Inputs[inputName].keys.forEach(key => {
                this.keyMapping[key] = inputName;
            });
        });
    }

    populateKeyText() {
        this.controls.querySelectorAll("*").forEach(control => {
            control.innerText = Inputs[control.id].text;
        });
    }

    setupControlListeners() {
        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("keyup", this.onKeyUp.bind(this));
        this.controls.querySelectorAll("*").forEach(control => {
            control.addEventListener("mousedown", this.onControlMouseDown.bind(this));
            control.addEventListener("mouseup", this.onControlMouseUp.bind(this));
        });
    }

    setupCanvas() {
        this.renderContext = this.screen.getContext('2d');
        this.screen.classList.add("on");
    }

    gameLoop() {
        if (this.game !== undefined) {
            requestAnimationFrame(this.gameLoop.bind(this));
            this.renderContext.clearRect(0, 0, this.screen.width, this.screen.height);
            this.game.tick(this.renderContext);
        }
    }

    onKeyDown(event) {
        if(event.repeat) return;
        let key = event.which;
        this.input(this.keyMapping[key], true);
    }


    onKeyUp(event) {
        let key = event.which;
        this.input(this.keyMapping[key], false); 
    }

    onControlMouseDown(event) {
        this.input(event.target.id, true);
    }

    onControlMouseUp(event) {
        this.input(event.target.id, false);
    }

    input(type, active) {
        if (this.game !== undefined) {
            if (type === "reset") {
                this.reset();
            } else {
                this.game.input(type, active);
            }
        } else if (active && this.menuInteraction.hasOwnProperty(type)) {
            this.menuInteraction[type]();
        }
    }

    get menuInteraction() {
        return {
            "up": () => this.menu.changeActiveItem(1),
            "down": () => this.menu.changeActiveItem(-1),
            "confirm": () => this.menu.select(),
            "reset": () => this.showGameSelect(),
        }
    }

    static get availableGames() {
        return [Starfall];
    }

    static getGameByName(name) {
        for (let i = GameEngine.availableGames.length; i--;) {
            let game = GameEngine.availableGames[i];
            if (game.NAME.toLowerCase() === name.toLowerCase()) {
                return game;
            }
        }
        return false;
    }

    static getModeByName(game, modeName) {
        for (let i = game.MODES.length; i--;) {
            let mode = game.MODES[i];
            if (mode.NAME.toLowerCase() === modeName.toLowerCase()) {
                return mode;
            }
        }
        return false;
    }
}

export class Mode {
    constructor(name, parameters) {
        this.NAME = name;
        this.parameters = parameters;
    }
}

