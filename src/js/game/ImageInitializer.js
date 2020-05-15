export class ImageInitializer { //Loads all images when game starts to avoid creating new image elements when creating a new instance of an item, all items of the class use the same image.
    constructor() {

        this.numberTreeImages = 1;
        
        this.sources = [
            "src/images/firefly-placeholder.png", //Player
            "src/images/star.png", //Star
            "src/images/allstar.png", //AllStar
            "src/images/snow.png", //Magnet
            "src/images/moon-placeholder.png", //Moon
            "src/images/sun-placeholder.png", //Sun
            "src/images/trees-placeholder.png" //TreeRow
        ]

        this.idTags = [
            "fireflyImage", //Player
            "starImage", //Star
            "allStarImage", //AllStar
            "snowImage", //Magnet
            "moonImage", //Moon
            "sunImage", //Sun
            "treeRowImage0" //TreeRow
        ]

        let imageClass = document.getElementById("images"); //Class where image elements will be created.

        for(let i = 0; i < this.sources.length; i++) {
            let image = document.createElement("img"); //Create element.
            image.src = this.sources[i]; //Assign source path.
            image.id = this.idTags[i]; //Set id to be able to get the image for draw methods.
            imageClass.appendChild(image); //Add image to class "images" in the HTML.
        }
    }
}