class Coin extends DrawableObject {
    width = 80;
    height = 80;

    IMAGES = [
        "img/8_coin/coin_1.png", // Dein Coin-Bild
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES[0]);

        // Zufällige Position der Coins
        this.x = 200 + Math.random() * 2000;
        this.y = 300 + Math.random() * 80; // leicht unterschiedliche Höhen
    }
}