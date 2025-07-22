class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");

    this.x = Math.random() * 500; // Zufällige Position auf der X-Achse
    this.animate();
  }

  animate() {
    this.moveLeft(); // Startet die Bewegung nach links
  }
}
