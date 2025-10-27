/**
 * Main player character class representing the playable hero
 * Handles movement, animations, physics, and character states
 * Includes advanced features like idle animations and collision detection
 * @class
 * @extends MovableObject
 */
class Character extends MovableObject {
  /** @type {number} */ y = 180;
  /** @type {number} */ speed = 10;
  /** @type {number} */ height = 250;
  /** @type {number} */ width = 150;
  /** @type {boolean} */ hurtSoundPlayed = false;
  /** @type {boolean} */ deathHandled = false;
  /** @type {World} */ world;
  /** @type {number} */ lastActionTime = Date.now();
  /** @type {boolean} */ isDozing = false;
  /** @type {boolean} */ isSleeping = false;
  /** @type {number} */ DOZE_TIMEOUT = 3000;
  /** @type {number} */ SLEEP_TIMEOUT = 5000;

  /**
   * Walking animation frames
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  /**
   * Jumping animation frames
   * @type {string[]}
   */
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

  /**
   * Death animation frames
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  /**
   * Hurt animation frames
   * @type {string[]}
   */
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  /**
   * Dozing/idle animation frames
   * @type {string[]}
   */
  IMAGES_DOZE = [
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  /**
   * Sleeping animation frames
   * @type {string[]}
   */
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

  /**
   * Creates a Character instance
   * Loads all animations and applies gravity physics
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadAllCharacterImages();
    this.applyGravity();
  }

  /**
   * Preloads all character animation images for smooth playback
   * @returns {void}
   */
  loadAllCharacterImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DOZE);
    this.loadImages(this.IMAGES_SLEEP);
  }

  /**
   * Defines the collision box for character interactions
   * Smaller than visual bounds for better gameplay feel
   * @returns {{x: number, y: number, width: number, height: number}} Collision box
   */
  getCollisionBox() {
    return {
      x: this.x + 40,
      y: this.y + 130,
      width: this.width - 80,
      height: 120,
    };
  }

  /**
   * Checks if character is falling onto an enemy (for stomp attacks)
   * @param {MovableObject} enemy - The enemy to check against
   * @returns {boolean} True if character is falling onto enemy
   */
  isFallingOn(enemy) {
    return (
      this.speedY < 0 && this.y < enemy.y && this.y + this.height - enemy.y < 30
    );
  }

  /**
   * Updates the last action timestamp and wakes up from idle states
   * @returns {void}
   */
  updateLastAction() {
    this.lastActionTime = Date.now();
    if (this.isDozing || this.isSleeping) {
      this.wakeUp();
    }
  }

  /**
   * Starts the dozing animation state
   * @returns {void}
   */
  startDoze() {
    if (this.isDozing || this.isSleeping) return;
    this.isDozing = true;
    this.currentImage = 0;
  }

  /**
   * Starts the sleeping animation state
   * @returns {void}
   */
  startSleep() {
    if (this.isSleeping) return;
    this.isDozing = false;
    this.isSleeping = true;
    this.currentImage = 0;
  }

  /**
   * Wakes up from dozing or sleeping states
   * @returns {void}
   */
  wakeUp() {
    this.isDozing = false;
    if (this.isSleeping) this.isSleeping = false;
    this.currentImage = 0;
  }

  /**
   * Starts all animation and movement loops
   * @returns {void}
   */
  animate() {
    this.startMovementLoop();
    this.startAnimationLoop();
  }

  /**
   * Starts the movement processing loop (60 FPS)
   * @returns {void}
   */
  startMovementLoop() {
    setInterval(() => {
      this.handleMovement();
    }, 1000 / 60);
  }

  /**
   * Handles all character movement based on keyboard input
   * @returns {void}
   */
  handleMovement() {
    if (this.shouldSkipMovement()) return;

    this.handleRightMovement();
    this.handleLeftMovement();
    this.handleJumpMovement();
    this.updateCameraPosition();
  }

  /**
   * Checks if movement should be skipped due to game state
   * @returns {boolean} True if movement should be skipped
   */
  shouldSkipMovement() {
    return (
      this.world &&
      (this.world.paused ||
        this.world.gameEnded ||
        (this.isDead && this.isDead()))
    );
  }

  /**
   * Handles right movement with boundary checking
   * @returns {void}
   */
  handleRightMovement() {
    if (this.world.keyboard.D && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.updateLastAction();
    }
  }

  /**
   * Handles left movement with boundary checking
   * @returns {void}
   */
  handleLeftMovement() {
    if (this.world.keyboard.A && this.x > -600) {
      this.moveLeft();
      this.otherDirection = true;
      this.updateLastAction();
    }
  }

  /**
   * Handles jump movement with ground check
   * @returns {void}
   */
  handleJumpMovement() {
    if (this.world.keyboard.W && !this.isAboveGround()) {
      this.jump();
      this.playJumpSound();
      this.updateLastAction();
    }
  }

  /**
   * Plays jump sound effect
   * @returns {void}
   */
  playJumpSound() {
    if (this.world.audioManager && this.world.audioManager.play) {
      this.world.audioManager.play("jump");
    }
  }

  /**
   * Updates camera position to follow character
   * @returns {void}
   */
  updateCameraPosition() {
    if (this.world) this.world.camera_x = -this.x + 100;
  }

  /**
   * Starts the animation rendering loop (150ms interval)
   * @returns {void}
   */
  startAnimationLoop() {
    setInterval(() => {
      this.handleAnimation();
    }, 150);
  }

  /**
   * Handles all character animations based on state
   * @returns {void}
   */
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

  /**
   * Plays death animation
   * @returns {void}
   */
  playDeadAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
  }

  /**
   * Plays hurt animation
   * @returns {void}
   */
  playHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
  }

  /**
   * Handles idle state animations (dozing and sleeping)
   * @returns {void}
   */
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

  /**
   * Calculates time since last character action
   * @returns {number} Idle time in milliseconds
   */
  getIdleTime() {
    return Date.now() - (this.lastActionTime || Date.now());
  }

  /**
   * Plays sleeping animation
   * @returns {void}
   */
  playSleepAnimation() {
    if (this.IMAGES_SLEEP && this.IMAGES_SLEEP.length) {
      this.playAnimation(this.IMAGES_SLEEP);
    }
  }

  /**
   * Plays dozing animation
   * @returns {void}
   */
  playDozeAnimation() {
    if (this.IMAGES_DOZE && this.IMAGES_DOZE.length) {
      this.playAnimation(this.IMAGES_DOZE);
    }
  }

  /**
   * Handles movement-based animations (walking and jumping)
   * @returns {void}
   */
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

  /**
   * Plays jumping animation
   * @returns {void}
   */
  playJumpAnimation() {
    this.playAnimation(this.IMAGES_JUMPING);
  }

  /**
   * Plays walking animation
   * @returns {void}
   */
  playWalkAnimation() {
    this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Checks collision with a rectangular box
   * @param {{x: number, y: number, width: number, height: number}} box - The box to check collision with
   * @returns {boolean} True if colliding with the box
   */
  isCollidingBox(box) {
    return (
      this.x + this.width > box.x &&
      this.x < box.x + box.width &&
      this.y + this.height > box.y &&
      this.y < box.y + box.height
    );
  }

  /**
   * Makes the character jump with specified vertical speed
   * @returns {void}
   */
  jump() {
    this.speedY = 30;
    this.updateLastAction();
  }
}