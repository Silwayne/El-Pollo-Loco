class Character extends MovableObject {
  y = 180;
  speed = 10;
  height = 250;
  width = 150;
  hurtSoundPlayed = false;
  deathHandled = false;
  world;
  lastActionTime = Date.now();
  isDozing = false;
  isSleeping = false;
  DOZE_TIMEOUT = 3000;
  SLEEP_TIMEOUT = 5000;

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_DOZE = [
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_SLEEP = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadAllCharacterImages();
    this.applyGravity();
  }

  loadAllCharacterImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DOZE);
    this.loadImages(this.IMAGES_SLEEP);
  }

  getCollisionBox() {
    return {
      x: this.x + 40,
      y: this.y + 130,
      width: this.width - 80,
      height: 120,
    };
  }

  isFallingOn(enemy) {
    return (
      this.speedY < 0 && this.y < enemy.y && this.y + this.height - enemy.y < 30
    );
  }

  updateLastAction() {
    this.lastActionTime = Date.now();
    if (this.isDozing || this.isSleeping) {
      this.wakeUp();
    }
  }

  startDoze() {
    if (this.isDozing || this.isSleeping) return;
    this.isDozing = true;
    this.currentImage = 0;
  }

  startSleep() {
    if (this.isSleeping) return;
    this.isDozing = false;
    this.isSleeping = true;
    this.currentImage = 0;
  }

  wakeUp() {
    this.isDozing = false;
    if (this.isSleeping) this.isSleeping = false;
    this.currentImage = 0;
  }

  animate() {
    this.startMovementLoop();
    this.startAnimationLoop();
  }

  startMovementLoop() {
    setInterval(() => {
      this.handleMovement();
    }, 1000 / 60);
  }

  handleMovement() {
    if (this.shouldSkipMovement()) return;

    this.handleRightMovement();
    this.handleLeftMovement();
    this.handleJumpMovement();
    this.updateCameraPosition();
  }

  shouldSkipMovement() {
    return (
      this.world &&
      (this.world.paused ||
        this.world.gameEnded ||
        (this.isDead && this.isDead()))
    );
  }

  handleRightMovement() {
    if (this.world.keyboard.D && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.updateLastAction();
    }
  }

  handleLeftMovement() {
    if (this.world.keyboard.A && this.x > -600) {
      this.moveLeft();
      this.otherDirection = true;
      this.updateLastAction();
    }
  }

  handleJumpMovement() {
    if (this.world.keyboard.W && !this.isAboveGround()) {
      this.jump();
      this.playJumpSound();
      this.updateLastAction();
    }
  }

  playJumpSound() {
    if (this.world.audioManager && this.world.audioManager.play) {
      this.world.audioManager.play("jump");
    }
  }

  updateCameraPosition() {
    if (this.world) this.world.camera_x = -this.x + 100;
  }

  startAnimationLoop() {
    setInterval(() => {
      this.handleAnimation();
    }, 150);
  }

  handleAnimation() {
    if (this.isDead && this.isDead()) {
      this.playDeadAnimation();
      return;
    }

    if (this.isHurt && this.isHurt()) {
      this.playHurtAnimation();
      return;
    }

    this.handleIdleAnimations();
    this.handleMovementAnimations();
  }

  playDeadAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
  }

  playHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
  }

  handleIdleAnimations() {
    const idleTime = this.getIdleTime();

    if (!this.isDozing && !this.isSleeping && idleTime >= this.DOZE_TIMEOUT) {
      this.startDoze();
    }
    if (!this.isSleeping && idleTime >= this.SLEEP_TIMEOUT) {
      this.startSleep();
    }

    if (this.isSleeping) {
      this.playSleepAnimation();
      return;
    }

    if (this.isDozing) {
      this.playDozeAnimation();
      return;
    }
  }

  getIdleTime() {
    return Date.now() - (this.lastActionTime || Date.now());
  }

  playSleepAnimation() {
    if (this.IMAGES_SLEEP && this.IMAGES_SLEEP.length) {
      this.playAnimation(this.IMAGES_SLEEP);
    }
  }

  playDozeAnimation() {
    if (this.IMAGES_DOZE && this.IMAGES_DOZE.length) {
      this.playAnimation(this.IMAGES_DOZE);
    }
  }

  handleMovementAnimations() {
    if (this.isAboveGround && this.isAboveGround()) {
      this.playJumpAnimation();
      return;
    }

    if (this.world && (this.world.keyboard.D || this.world.keyboard.A)) {
      this.playWalkAnimation();
      return;
    }
  }

  playJumpAnimation() {
    this.playAnimation(this.IMAGES_JUMPING);
  }

  playWalkAnimation() {
    this.playAnimation(this.IMAGES_WALKING);
  }

  isCollidingBox(box) {
    return (
      this.x + this.width > box.x &&
      this.x < box.x + box.width &&
      this.y + this.height > box.y &&
      this.y < box.y + box.height
    );
  }

  jump() {
    this.speedY = 30;
    this.updateLastAction();
  }
}
