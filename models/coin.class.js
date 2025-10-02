class Coin extends DrawableObject {
    width = 100;
    height = 100;

    IMAGES_GROUND = [
        "img/8_coin/coin_1.png", // Dein Coin-Bild
    ];

    IMAGES_AIR = [
        "img/8_coin/coin_1.png", // Dein Coin-Bild
    ];

    constructor(type) {
        super();

        if (type === "ground") {
            this.loadImage(this.IMAGES_GROUND[0]);
            this.y = 340;
        } else {
            this.loadImage(this.IMAGES_AIR[0]);
            this.y = 70;
        }
        this.x = 400 + Math.random() * 2000; 
    }
}