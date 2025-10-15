class Endboss extends MovableObject {
  y = 55;
  height = 400;
  width = 250;
  energy = 100;
  triggered = false; // wurde der Boss schon aktiviert?
  attacking = false; // ist er im Angriffsmodus?
  attackPhase = false; // rennt er gerade oder steht er still?
  isDead = false;
  isHurt = false;

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
      if (this.isDead || this.isHurt) return;

      if (!this.triggered && this.world.character.x > 2150) {
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
      this.playAnimation(this.IMAGES_WALKING);

      if (this.x <= 2350) {
        clearInterval(walkInterval);

        // Spawn/Alert-Animation + Sound
        this.playAnimation(this.IMAGES_SPAWNING);
        world.audioManager.play("boss");

        setTimeout(() => {
          this.startAttackPattern();
        }, 1500);
      }
    }, 120);
  }

  startAttackPattern() {
    this.attacking = true;

    // Boss hat jetzt einen Rhythmus: laufen – stehen – laufen
    setInterval(() => {
      if (this.isDead) return; // kein Angriffsverhalten nach Tod
      this.attackPhase = true; // Start: laufen
      setTimeout(() => {
        this.attackPhase = false; // Pause
      }, 1500);
    }, 3000);
  }

  playHurtAnimation() {
    if (this.isDead) return; // keine Hurt-Animation mehr wenn tot
    this.isHurt = true;

    let i = 0;
    const interval = setInterval(() => {
      if (this.isDead) {
        clearInterval(interval);
        return;
      }

      this.img = this.imageCache[this.IMAGES_HURT[i]];
      i++;

      if (i >= this.IMAGES_HURT.length) {
        clearInterval(interval);
        this.isHurt = false;
      }
    }, 400); // etwas langsamer → 400ms pro Frame
  }

  hit() {
    if (this.isDead) return;
    let now = new Date().getTime();

    if (this.lastHit && now - this.lastHit < 1000) {
      return; // kurze Schutzzeit
    }

    this.lastHit = now;
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;

    // langsame Hurt-Animation
    this.playHurtAnimation();

    world.bossBar.setPercentage(this.energy);

    if (this.energy === 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.isHurt = false; // falls Hurt noch lief → abbrechen

    let i = 0;
    const nextFrame = () => {
      if (i < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[i]];
        i++;
        setTimeout(nextFrame, 250); // etwas langsamer → 250ms pro Frame
      } else {
        // Animation fertig -> letztes Bild bleibt eingefroren
        this.img =
          this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
        world.audioManager.play("win");
      }
    };

    nextFrame();
  }

  getTopHitbox() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}

