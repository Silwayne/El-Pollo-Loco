class Character extends MovableObject {
  y = 200;
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

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);

    this.animate();
  }

  animate() {
    setInterval(() => {
      let i = this.currentImage % this.IMAGES_WALKING.length; // Modulus-Operator, um den Index zu begrenzen
      let path = this.IMAGES_WALKING[i]; // Mit dem i startet das Array wieder von vorne
      this.img = this.imageCache[path]; // Greift auf das Bild im Cache zu
      this.currentImage++; // Erhöht den Index für das nächste Bild
    }, 200); 
  }

  jump() {}
}
