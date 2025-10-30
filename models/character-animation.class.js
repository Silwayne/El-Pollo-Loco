/**
 * Character animation methods
 * All animation-related functionality for the Character class
 */

Character.IMAGES_IDLE = [
  "img/2_character_pepe/1_idle/idle/I-1.png",
  "img/2_character_pepe/1_idle/idle/I-2.png",
  "img/2_character_pepe/1_idle/idle/I-3.png",
  "img/2_character_pepe/1_idle/idle/I-4.png",
  "img/2_character_pepe/1_idle/idle/I-5.png",
  "img/2_character_pepe/1_idle/idle/I-6.png",
  "img/2_character_pepe/1_idle/idle/I-7.png",
  "img/2_character_pepe/1_idle/idle/I-8.png",
  "img/2_character_pepe/1_idle/idle/I-9.png",
  "img/2_character_pepe/1_idle/idle/I-10.png",
];

Character.IMAGES_WALKING = [
  "img/2_character_pepe/2_walk/W-21.png",
  "img/2_character_pepe/2_walk/W-22.png",
  "img/2_character_pepe/2_walk/W-23.png",
  "img/2_character_pepe/2_walk/W-24.png",
  "img/2_character_pepe/2_walk/W-25.png",
  "img/2_character_pepe/2_walk/W-26.png",
];

Character.IMAGES_JUMPING = [
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

Character.IMAGES_DEAD = [
  "img/2_character_pepe/5_dead/D-51.png",
  "img/2_character_pepe/5_dead/D-52.png",
  "img/2_character_pepe/5_dead/D-53.png",
  "img/2_character_pepe/5_dead/D-54.png",
  "img/2_character_pepe/5_dead/D-55.png",
  "img/2_character_pepe/5_dead/D-56.png",
  "img/2_character_pepe/5_dead/D-57.png",
];

Character.IMAGES_HURT = [
  "img/2_character_pepe/4_hurt/H-41.png",
  "img/2_character_pepe/4_hurt/H-42.png",
  "img/2_character_pepe/4_hurt/H-43.png",
];

Character.IMAGES_DOZE = [
  "img/2_character_pepe/1_idle/idle/I-3.png",
  "img/2_character_pepe/1_idle/idle/I-5.png",
  "img/2_character_pepe/1_idle/idle/I-6.png",
  "img/2_character_pepe/1_idle/idle/I-7.png",
  "img/2_character_pepe/1_idle/idle/I-8.png",
  "img/2_character_pepe/1_idle/idle/I-9.png",
  "img/2_character_pepe/1_idle/idle/I-10.png",
];

Character.IMAGES_SLEEP = [
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

/**
 * Main animation handler - determines which animation to play
 * @returns {void}
 */
Character.prototype.handleAnimation = function () {
  if (this.isDead && this.isDead()) {
    this.playDeadAnimation();
    return;
  }

  if (this.isHurt && this.isHurt()) {
    this.playHurtAnimation();
    return;
  }

  if (this.isThrowing) {
    this.playThrowAnimation();
    return;
  }

  this.handleStandardAnimations();
};

/**
 * Handles standard animations (idle, movement, jumping)
 * @returns {void}
 */
Character.prototype.handleStandardAnimations = function () {
  if (this.isAboveGround()) {
    this.playJumpAnimation();
  } else if (this.world && (this.world.keyboard.D || this.world.keyboard.A)) {
    this.playWalkAnimation();
  } else {
    this.handleIdleAnimations();
  }
};

/**
 * Plays death animation
 * @returns {void}
 */
Character.prototype.playDeadAnimation = function () {
  this.playAnimation(Character.IMAGES_DEAD);
};

/**
 * Plays hurt animation
 * @returns {void}
 */
Character.prototype.playHurtAnimation = function () {
  this.playAnimation(Character.IMAGES_HURT);

  setTimeout(() => {
    if (!this.isHurt()) {
      this.resetAnimationState();
    }
  }, 1000);
};

/**
 * Plays jumping animation with time-based frame management
 * @returns {void}
 */
Character.prototype.playJumpAnimation = function () {
  if (Character.IMAGES_JUMPING && Character.IMAGES_JUMPING.length > 0) {
    let frameIndex =
      Math.floor(Date.now() / 100) % Character.IMAGES_JUMPING.length;
    let imagePath = Character.IMAGES_JUMPING[frameIndex];

    if (this.imageCache[imagePath]) {
      this.img = this.imageCache[imagePath];
    }
  }
};

/**
 * Plays walking animation with time-based frame management
 * @returns {void}
 */
Character.prototype.playWalkAnimation = function () {
  if (Character.IMAGES_WALKING && Character.IMAGES_WALKING.length > 0) {
    let frameIndex =
      Math.floor(Date.now() / 150) % Character.IMAGES_WALKING.length;
    let imagePath = Character.IMAGES_WALKING[frameIndex];

    if (this.imageCache[imagePath]) {
      this.img = this.imageCache[imagePath];
    }
  }
};

/**
 * Plays throw animation
 * @returns {void}
 */
Character.prototype.playThrowAnimation = function () {
  this.playAnimation(Character.IMAGES_JUMPING);
};

/**
 * Handles idle state animations (idle wiggling, dozing and sleeping)
 * @returns {void}
 */
Character.prototype.handleIdleAnimations = function () {
  const idleTime = this.getIdleTime();

  if (!this.isDozing && !this.isSleeping) {
    this.playIdleAnimation();
  }

  if (!this.isDozing && !this.isSleeping && idleTime >= this.DOZE_TIMEOUT) {
    this.startDoze();
  }

  if (!this.isSleeping && idleTime >= this.SLEEP_TIMEOUT) {
    this.startSleep();
  }

  if (this.isSleeping) {
    this.playSleepAnimation();
  } else if (this.isDozing) {
    this.playDozeAnimation();
  }
};

/**
 * Plays the standard idle animation (Wippen/Wackeln)
 * @returns {void}
 */
Character.prototype.playIdleAnimation = function () {
  if (Character.IMAGES_IDLE && Character.IMAGES_IDLE.length > 0) {
    let frameIndex =
      Math.floor(Date.now() / 200) % Character.IMAGES_IDLE.length;
    let imagePath = Character.IMAGES_IDLE[frameIndex];

    if (this.imageCache[imagePath]) {
      this.img = this.imageCache[imagePath];
    }
  }
};

/**
 * Plays sleeping animation
 * @returns {void}
 */
Character.prototype.playSleepAnimation = function () {
  this.playAnimation(Character.IMAGES_SLEEP);
};

/**
 * Plays dozing animation
 * @returns {void}
 */
Character.prototype.playDozeAnimation = function () {
  this.playAnimation(Character.IMAGES_DOZE);
};

/**
 * Starts the dozing animation state
 * @returns {void}
 */
Character.prototype.startDoze = function () {
  if (this.isDozing || this.isSleeping) return;
  this.isDozing = true;
  this.currentImage = 0;
};

/**
 * Starts the sleeping animation state
 * @returns {void}
 */
Character.prototype.startSleep = function () {
  if (this.isSleeping) return;
  this.isDozing = false;
  this.isSleeping = true;
  this.currentImage = 0;
};
