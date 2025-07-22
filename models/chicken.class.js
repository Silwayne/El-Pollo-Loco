class Chicken extends MovableObject {
  y = 355;
  height = 80;
  width = 60;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");

    this.x = 200 + Math.random() * 500; // Zufällige Position auf der X-Achse
    this.speed = 0.15 + Math.random() * 0.5;

    this.loadImages(this.IMAGES_WALKING);

    this.animate();
  }

  animate() {
    this.moveLeft(); // Startet die Bewegung nach links

    setInterval(() => {
      let i = this.currentImage % this.IMAGES_WALKING.length; // Modulus-Operator, um den Index zu begrenzen
      let path = this.IMAGES_WALKING[i]; // Mit dem i startet das Array wieder von vorne
      this.img = this.imageCache[path]; // Greift auf das Bild im Cache zu
      this.currentImage++; // Erhöht den Index für das nächste Bild
    }, 200);
  }
}
