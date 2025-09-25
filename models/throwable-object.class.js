class ThrowableObject extends MovableObject {
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y) {
    super();
    this.loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 100;
    this.width = 100;
    this.isShattered = false;
    this.remove = false;
    this.throw();
  }

  // throw() {
  //   this.speedY = 30;
  //   this.applyGravity();
  //   setInterval(() => {
  //     this.x += 10;
  //   }, 25);
  // }

  throw() {
    // Standardwurf-Geschwindigkeit; passe nach Bedarf an
    this.speedY = 25;
    this.speed = 10; // horizontale Geschwindigkeit wird über setInterval weiter unten verändert

    this.applyGravity();

    // Rotation / Vorwärtsbewegung
    this.throwInterval = setInterval(() => {
      // Nur bewegen, wenn nicht zersprungen
      if (!this.isShattered) {
        this.x += this.speed;   // bewegt die Flasche nach rechts (wenn du links werfen willst, negative speed)
        // optional: play rotation animation while flying (falls du Rotation-Sprites hast)
        if (this.IMAGES_ROTATION.length) {
          this.playAnimation(this.IMAGES_ROTATION);
        }
      }
    }, 25);
  }

  // zerschmettern (Animation + Sound) — danach remove = true
  shatter() {
    if (this.isShattered) return;
    this.isShattered = true;

    // Stoppe die Bewegung
    this.speed = 0;
    this.speedY = 0;
    if (this.throwInterval) clearInterval(this.throwInterval);

    // Stelle sicher, dass die Splash-Frames geladen sind und setze das erste Bild
    const firstPath = this.IMAGES_SPLASH[0];
    if (this.imageCache && this.imageCache[firstPath]) {
      this.img = this.imageCache[firstPath];
    }

    // Spiel Animation der Splash-Frames (falls playAnimation in MovableObject richtig damit arbeitet)
    this.playAnimation(this.IMAGES_SPLASH);

    // Nach der Animation entfernen (hier 300ms, anpassen falls Frames langsamer sind)
    setTimeout(() => {
      this.remove = true;
    }, 350);
  }
}
