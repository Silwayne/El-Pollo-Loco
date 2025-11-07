/**
 * Represents a small chicken enemy variant in the game world
 * Faster and more agile than regular chickens, with similar behavior patterns
 * Extends MovableObject for movement and animation capabilities
 * @class
 * @extends MovableObject
 */
class LittleChicken extends MovableObject {
  y = 355;
  height = 70;
  width = 70;
  isDead = false;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.initializeChicken();
    this.animate();
  }

  /**
   * Initializes chicken properties including position, speed, and images
   * @returns {void}
   */
  initializeChicken() {
    this.setPosition();
    this.setSpeed();
    this.loadAllImages();
  }

  /**
   * Sets the initial x-position with random offset
   * Uses provided x value or random position between 400-2400
   * @returns {void}
   */
  setPosition() {
    this.x = typeof x === "number" ? x : 400 + Math.random() * 2000;
  }

  /**
   * Sets random movement speed for variety
   * Speed ranges from 0.25 to 0.75 pixels per frame (faster than regular chickens)
   * @returns {void}
   */
  setSpeed() {
    this.speed = 0.25 + Math.random() * 0.5;
  }

  /**
   * Preloads all animation images for smooth playback
   * @returns {void}
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Handles chicken death sequence with safety check
   * Sets dead state, plays death animation, and schedules removal
   * @returns {void}
   */
  die() {
    if (this.isDead) return;

    this.setDeadState();
    this.playDeathAnimation();
    this.scheduleRemoval();
  }

  /**
   * Marks the chicken as dead and stops movement
   * @returns {void}
   */
  setDeadState() {
    this.isDead = true;
  }

  /**
   * Plays the death animation
   * @returns {void}
   */
  playDeathAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
  }

  /**
   * Schedules removal of the chicken from the game world after death
   * Removes after 500ms to allow death animation to play
   * @returns {void}
   */
  scheduleRemoval() {
    setTimeout(() => {
      this.remove = true;
    }, 500);
  }

  /**
   * Defines the collision box for enemy interactions
   * Smaller than visual bounds for balanced gameplay
   * @returns {{x: number, y: number, width: number, height: number}} Collision box
   */
  getCollisionBox() {
    return {
      x: this.x + 10,
      y: this.y + 10,
      width: this.width - 20,
      height: this.height - 10,
    };
  }

  /**
   * Starts all movement and animation loops
   * @returns {void}
   */
  animate() {
    this.startMovement();
    this.startAnimation();
  }

  /**
   * Starts the movement processing loop (60 FPS)
   * @returns {void}
   */
  startMovement() {
    this.walkInterval = setInterval(() => {
      this.handleMovement();
    }, 1000 / 60);
  }

  /**
   * Handles chicken movement - moves left when alive
   * @returns {void}
   */
  handleMovement() {
    if (!this.isDead) {
      this.moveLeft();
    }
  }

  /**
   * Starts the animation rendering loop (200ms interval)
   * @returns {void}
   */
  startAnimation() {
    this.animInterval = setInterval(() => {
      this.handleAnimation();
    }, 200);
  }

  /**
   * Handles chicken animations based on state
   * Plays walking animation when alive
   * @returns {void}
   */
  handleAnimation() {
    if (!this.isDead) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }
}
