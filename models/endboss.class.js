class Endboss extends MovableObject {
  y = 55;
  height = 400;
  width = 250;
  energy = 100;
  triggered = false;
  attacking = false;
  attackPhase = false;
  isDead = false;
  isHurt = false;

  animateInterval = null;
  walkInterval = null;
  attackInterval = null;

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
    this.loadAllImages();
    this.setInitialProperties();
    this.animate();
  }

  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_SPAWNING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
  }

  setInitialProperties() {
    this.speed = 2;
    this.x = 2500;
  }

  animate() {
    this.animateInterval = setInterval(() => {
      this.handleAnimationFrame();
    }, 200);
  }

  handleAnimationFrame() {
    if (this.isDead || this.isHurt) return;

    this.checkTriggerCondition();
    this.handleAttackBehavior();
  }

  checkTriggerCondition() {
    if (!this.triggered && this.world.character.x > 2150) {
      this.startBossSequence();
    }
  }

  handleAttackBehavior() {
    if (this.attacking) {
      if (this.attackPhase) {
        this.playWalkingAnimation();
      } else {
        this.playAttackAnimation();
      }
    }
  }

  playWalkingAnimation() {
    this.playAnimation(this.IMAGES_WALKING);
    this.moveLeft();
  }

  playAttackAnimation() {
    this.playAnimation(this.IMAGES_ATTACK);
  }

  startBossSequence() {
    this.triggered = true;
    this.startWalkSequence();
  }

  startWalkSequence() {
    this.walkInterval = setInterval(() => {
      this.updateWalkSequence();
    }, 120);
  }

  updateWalkSequence() {
    this.x -= 5;
    this.playAnimation(this.IMAGES_WALKING);

    if (this.x <= 2350) {
      this.completeWalkSequence();
    }
  }

  completeWalkSequence() {
    clearInterval(this.walkInterval);
    this.walkInterval = null;

    this.playAnimation(this.IMAGES_SPAWNING);
    this.playBossSound();
    this.scheduleAttackStart();
  }

  playBossSound() {
    if (this.world && this.world.audioManager) {
      this.world.audioManager.play("boss");
    }
  }

  scheduleAttackStart() {
    setTimeout(() => {
      this.startAttackPattern();
    }, 1500);
  }

  startAttackPattern() {
    this.attacking = true;
    this.startAttackIntervals();
  }

  startAttackIntervals() {
    this.attackInterval = setInterval(() => {
      this.executeAttackCycle();
    }, 3000);
  }

  executeAttackCycle() {
    if (this.isDead) return;

    this.attackPhase = true;
    this.scheduleAttackEnd();
  }

  scheduleAttackEnd() {
    setTimeout(() => {
      this.attackPhase = false;
    }, 1500);
  }

  playHurtAnimation() {
    if (this.isDead) return;

    this.isHurt = true;
    this.startHurtAnimation();
  }

  startHurtAnimation() {
    let i = 0;
    const interval = setInterval(() => {
      this.updateHurtAnimation(i, interval);
      i++;
    }, 400);
  }

  updateHurtAnimation(index, interval) {
    if (this.isDead) {
      clearInterval(interval);
      return;
    }

    this.img = this.imageCache[this.IMAGES_HURT[index]];

    if (index >= this.IMAGES_HURT.length - 1) {
      clearInterval(interval);
      this.isHurt = false;
    }
  }

  hit() {
    if (this.isDead || this.isOnCooldown()) return;

    this.registerHit();
    this.reduceEnergy();
    this.playHurtAnimation();
    this.updateBossBar();

    if (this.energy === 0) {
      this.die();
    }
  }

  isOnCooldown() {
    let now = new Date().getTime();
    return this.lastHit && now - this.lastHit < 1000;
  }

  registerHit() {
    this.lastHit = new Date().getTime();
  }

  reduceEnergy() {
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;
  }

  updateBossBar() {
    world.bossBar.setPercentage(this.energy);
  }

  die() {
    this.setDeathState();
    this.clearAllIntervals();
    this.stopBossSound();
    this.playDeathAnimation();
  }

  setDeathState() {
    this.isDead = true;
    this.isHurt = false;
  }

  clearAllIntervals() {
    this.clearInterval(this.animateInterval);
    this.clearInterval(this.walkInterval);
    this.clearInterval(this.attackInterval);
  }

  clearInterval(interval) {
    if (interval) {
      clearInterval(interval);
    }
  }

  stopBossSound() {
    if (this.world && this.world.audioManager) {
      this.world.audioManager.pause("boss");
    }
  }

  playDeathAnimation() {
    let i = 0;
    const nextFrame = () => {
      this.updateDeathFrame(i, nextFrame);
      i++;
    };
    nextFrame();
  }

  updateDeathFrame(index, callback) {
    if (index < this.IMAGES_DEAD.length) {
      this.img = this.imageCache[this.IMAGES_DEAD[index]];
      setTimeout(callback, 250, index, callback);
    } else {
      this.setFinalDeathFrame();
    }
  }

  setFinalDeathFrame() {
    this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
  }

  getTopHitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
