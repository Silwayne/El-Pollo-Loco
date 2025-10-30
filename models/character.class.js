/**
 * Main player character class representing the playable hero
 * Handles movement, physics, collision detection and core functionality
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
  /** @type {boolean} */ isThrowing = false;

  /** @type {number} */ lastActionTime = Date.now();
  /** @type {boolean} */ isDozing = false;
  /** @type {boolean} */ isSleeping = false;
  /** @type {number} */ DOZE_TIMEOUT = 3000;
  /** @type {number} */ SLEEP_TIMEOUT = 5000;

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
    this.loadImages(Character.IMAGES_WALKING);
    this.loadImages(Character.IMAGES_JUMPING);
    this.loadImages(Character.IMAGES_DEAD);
    this.loadImages(Character.IMAGES_HURT);
    this.loadImages(Character.IMAGES_DOZE);
    this.loadImages(Character.IMAGES_SLEEP);
    this.loadImages(Character.IMAGES_IDLE);
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
      height: this.height - 120,
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
    if (!this.world || !this.world.keyboard) return;
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
      this.world.keyboard &&
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
   * Makes the character jump with specified vertical speed
   * @returns {void}
   */
  jump() {
    this.speedY = 30;
    this.updateLastAction();
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
   * Starts throw animation
   * @returns {void}
   */
  startThrowAnimation() {
    this.isThrowing = true;
    this.currentImage = 0;

    setTimeout(() => {
      this.isThrowing = false;
      this.resetAnimationState();
    }, 400);
  }

  /**
   * Wakes up from dozing or sleeping states
   * @returns {void}
   */
  wakeUp() {
    this.isDozing = false;
    this.isSleeping = false;
    this.currentImage = 0;
  }

  /**
   * Reset animation state after special animations
   * @returns {void}
   */
  resetAnimationState() {
    this.isThrowing = false;
    this.currentImage = 0;
  }

  /**
   * Updates the last action timestamp and wakes up from idle states
   * @returns {void}
   */
  updateLastAction() {
    this.lastActionTime = Date.now();
    this.wakeUp();
    this.resetAnimationState();
  }

  /**
   * Calculates time since last character action
   * @returns {number} Idle time in milliseconds
   */
  getIdleTime() {
    return Date.now() - (this.lastActionTime || Date.now());
  }
}
