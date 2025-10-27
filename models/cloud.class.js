class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.initializeCloud();
    this.animate();
  }

  initializeCloud() {
    this.setRandomPosition();
  }

  setRandomPosition() {
    this.x = 200 + Math.random() * 2000;
  }

  animate() {
    this.startCloudMovement();
  }

  startCloudMovement() {
    setInterval(() => {
      this.moveCloud();
    }, 1000 / 60);
  }

  moveCloud() {
    this.moveLeft();
  }
}
