class Bottle extends DrawableObject {
    height = 100;

    IMAGES_GROUND = [
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png"
    ];

    IMAGES_AIR = [
        "img/6_salsa_bottle/salsa_bottle.png"
    ];

    constructor(type) {
        super();

        if (type === "ground") {
            this.loadImage(this.IMAGES_GROUND[0]);
            this.y = 340;
        } else {
            this.loadImage(this.IMAGES_AIR[0]);
            this.y = 50;
        }
        this.x = 400 + Math.random() * 2000; 
    }
}