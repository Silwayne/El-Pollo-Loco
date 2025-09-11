// class Endboss extends MovableObject {

//   y = 55;
//   height = 400;
//   width = 250;

//   IMAGES_WALKING = [
//     "img/4_enemie_boss_chicken/2_alert/G11.png",
//     "img/4_enemie_boss_chicken/2_alert/G8.png",
//     "img/4_enemie_boss_chicken/2_alert/G9.png",
//     "img/4_enemie_boss_chicken/2_alert/G10.png",
//     "img/4_enemie_boss_chicken/1_walk/G1.png",
//     "img/4_enemie_boss_chicken/1_walk/G2.png",
//     "img/4_enemie_boss_chicken/1_walk/G3.png",
//     "img/4_enemie_boss_chicken/1_walk/G4.png",
//   ];

//   IMAGES_SPAWNING = [
//     "img/4_enemie_boss_chicken/2_alert/G8.png",
//     "img/4_enemie_boss_chicken/2_alert/G9.png",
//     "img/4_enemie_boss_chicken/2_alert/G11.png",
//     "img/4_enemie_boss_chicken/2_alert/G10.png",
//     "img/4_enemie_boss_chicken/2_alert/G12.png"
//   ];

//   constructor() {
//     super().loadImage(this.IMAGES_WALKING[0]);
//     this.loadImages(this.IMAGES_WALKING);
//     this.loadImages(this.IMAGES_SPAWNING);
//     this.x = 2500;
//     this.animate();
//   }

//   animate() {
//     let i = 0;
//     setInterval(() => {
//       if (i < 10) {
//         this.playAnimation(this.IMAGES_SPAWNING);
//       } else {
//         this.playAnimation(this.IMAGES_WALKING);
//       }
//       i++;
//       if (world.character.x > 2150) {
//         i = 0;
//       }
//     }, 200);
//   }
// }

class Endboss extends MovableObject {
  y = 55;
  height = 400;
  width = 250;
  triggered = false; // wurde der Boss schon aktiviert?
  attacking = false; // ist er im Angriffsmodus?
  attackPhase = false; // rennt er gerade oder steht er still?

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_SPAWNING = [
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/1_walk/G1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_SPAWNING);
    this.loadImages(this.IMAGES_ATTACK);
    this.speed = 2;
    this.x = 2500; // Start weit außerhalb des Bildschirms
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (!this.triggered && world.character.x > 2150) {
        this.startBossSequence();
      }

      if (this.attacking) {
        if (this.attackPhase) {
          // Lauf-Phase → Bewegung + Walking-Animation
          this.playAnimation(this.IMAGES_WALKING);
          this.moveLeft();
        } else {
          // Angriffs-Phase → stehende Attack-Animation
          this.playAnimation(this.IMAGES_ATTACK);
        }
      }
    }, 200); // alle 200ms Bild wechseln
  }

  startBossSequence() {
    this.triggered = true;

    let walkInterval = setInterval(() => {
      this.x -= 5;
      this.playAnimation(this.IMAGES_WALKING); // 👉 jetzt animiert er beim Laufen

      if (this.x <= 2350) {
        clearInterval(walkInterval);

        // Spawn/Alert-Animation + Sound
        this.playAnimation(this.IMAGES_SPAWNING);
        world.audioManager.play("boss");

        setTimeout(() => {
          this.startAttackPattern();
        }, 1500);
      }
    }, 120); // 120ms für Animation wirkt besser als 60ms
  }

  startAttackPattern() {
    this.attacking = true;

    // Boss hat jetzt einen Rhythmus: laufen – stehen – laufen
    setInterval(() => {
      this.attackPhase = true; // Start: laufen
      setTimeout(() => {
        this.attackPhase = false; // Pause
      }, 1500); // läuft 1,5 Sekunden, steht dann still
    }, 3000); // alle 3 Sekunden Rhythmus wechseln
  }
}
