class Endboss extends MovableObject {
  y = 55;
  height = 400;
  width = 250;
  energy = 100;
  triggered = false; // wurde der Boss schon aktiviert?
  attacking = false; // ist er im Angriffsmodus?
  attackPhase = false; // rennt er gerade oder steht er still?
  isDead = false;

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

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/1_walk/G1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_SPAWNING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
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

  // hit() {
  //   if (this.isDead) return;
  //   let now = new Date().getTime();

  //   if (this.lastHit && now - this.lastHit < 1000) {
  //     return;
  //   }

  //   this.lastHit = now;
  //   this.energy -= 20;
  //   if (this.energy < 0) this.energy = 0;

  //   this.playAnimation(this.IMAGES_HURT);
  //   world.bossBar.setPercentage(this.energy);

  //   if (this.energy === 0) {
  //     this.die();
  //   } else {
  //     setTimeout(() => {
  //       this.attacking = true;
  //     }, 1000);
  //   }
  // }

    playHurtAnimation() {
    let i = 0;
    const interval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_HURT[i]];
      i++;

      if (i >= this.IMAGES_HURT.length) {
        clearInterval(interval);
      }
    }, 300); // langsamer: alle 300ms Bild wechseln
  }

  hit() {
    if (this.isDead) return;
    let now = new Date().getTime();

    if (this.lastHit && now - this.lastHit < 1000) {
      return;
    }

    this.lastHit = now;
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;

    // langsame Hurt-Animation
    this.playHurtAnimation();

    world.bossBar.setPercentage(this.energy);

    if (this.energy === 0) {
      this.die();
    } else {
      setTimeout(() => {
        this.attacking = true;
      }, 1000);
    }
  }

  die() {
    this.isDead = true;
    let i = 0;

    const nextFrame = () => {
      if (i < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[i]];
        i++;
        setTimeout(nextFrame, 250); // Dauer pro Frame (hier 250ms)
      } else {
        // Animation fertig -> letztes Bild bleibt eingefroren
        this.img =
          this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
        world.audioManager.play("win"); // Sieges-Sound
        // kein this.remove = true -> Boss bleibt liegen
      }
    };

    nextFrame();
  }

  getTopHitbox() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
