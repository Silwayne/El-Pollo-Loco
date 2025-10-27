class Coin extends DrawableObject {
  width = 100;
  height = 100;

  IMAGES_GROUND = ["img/8_coin/coin_1.png"];
  IMAGES_AIR = ["img/8_coin/coin_1.png"];

  constructor(type) {
    super();
    this.initializeCoin(type);
  }

  initializeCoin(type) {
    this.setCoinType(type);
    this.setRandomPosition();
  }

  setCoinType(type) {
    if (type === "ground") {
      this.setGroundCoin();
    } else {
      this.setAirCoin();
    }
  }

  setGroundCoin() {
    this.loadImage(this.IMAGES_GROUND[0]);
    this.y = 340;
  }

  setAirCoin() {
    this.loadImage(this.IMAGES_AIR[0]);
    this.y = 70;
  }

  setRandomPosition() {
    this.x = 400 + Math.random() * 2000;
  }
}
