class Character extends MovableObject {
  y = 200;
  speed = 10;
  height = 250;
  width = 150;
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  world; 

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);

    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT) {
        this.x += this.speed;
        this.otherDirection = false; // Setzt die andere Richtung, wenn nach rechts bewegt wird
      }

      if (this.world.keyboard.LEFT) {
        this.x -= this.speed;
        this.otherDirection = true; // Setzt die andere Richtung, wenn nach links bewegt wird
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        // Walk Animation
        let i = this.currentImage % this.IMAGES_WALKING.length; // Modulus-Operator, um den Index zu begrenzen
        let path = this.IMAGES_WALKING[i]; // Mit dem i startet das Array wieder von vorne
        this.img = this.imageCache[path]; // Greift auf das Bild im Cache zu
        this.currentImage++; // Erhöht den Index für das nächste Bild
      }
    }, 50);
  }

  jump() {}
}
