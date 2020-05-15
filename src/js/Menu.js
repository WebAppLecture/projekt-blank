export class Menu {

    constructor(domElement) {
        this.domElement = domElement;
        this.domElement.addEventListener("wheel", event => this.changeActiveItem(event.wheelDelta));
    }

    hide() {
        this.domElement.classList.add("hidden");
        document.querySelector(".controls").classList.add("hidden"); //Game: Hide menu screen and tutorial.
        document.querySelector(".sideHeadings").classList.add("hidden"); 
    }

    show() {
        this.domElement.classList.remove("hidden"); //Starting screen: Show start menu.
        document.querySelector(".controls").classList.remove("hidden"); //Show tutorial.
        document.querySelector(".sideHeadings").classList.remove("hidden"); 
        document.getElementById("progress").style.marginTop = "-110vh"; //Show game name; value see comment in CSS (progress box).
    }

    load(items, callback) {
        this.domElement.innerHTML = "";
        this.show();

        items.forEach(item => {
            let listElement = document.createElement("ul");
            listElement.innerText = item.NAME;
            this.domElement.appendChild(listElement);
        });
    
        this.activeItem = this.domElement.firstElementChild;    
        this.onSelect = callback;
    }

    select() {
        this.onSelect();
    }

    changeActiveItem(indexChange) {
        if(indexChange > 0) {
            let newActive = this.activeItem.previousElementSibling;
            this.activeItem = newActive || this.domElement.lastElementChild;
            
        } else {
            let newActive = this.activeItem.nextElementSibling;
            this.activeItem = newActive || this.domElement.firstElementChild;
        }
    }

    set activeItem(domReference) {
        if(this._activeItem) {
            this._activeItem.classList.remove("active");
        }
        this._activeItem = domReference;
        this._activeItem.classList.add("active");
    }

    get activeItem() {
        return this._activeItem;
    }
}