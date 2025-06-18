let canvas;
let world;


function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas);

    console.log("Hier könnte ein Bild sein", world.character);

}