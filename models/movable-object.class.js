/**
 * Base class for all movable game objects with physics and collision capabilities
 * Extends DrawableObject to add movement, gravity, health, and animation systems
 * Serves as the foundation for characters, enemies, and interactive objects
 * @class
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /** @type {number} */ speed = 0.15;
  /** @type {boolean} */ otherDirection = false;
  /** @type {number} */ speedY = 0;
  /** @type {number} */ acceleration = 2.5;
  /** @type {number} */ energy = 100;
  /** @type {number} */ lastHit = 0;

  /**
   * Applies gravity physics to the object
   * Sets up interval-based gravity updates for smooth falling motion
   * @returns {void}
   */
  applyGravity() {
    setInterval(() => {
      this.updateGravity();
    }, 1000 / 25);
  }

  /**
   * Updates gravity effect based on object state
   * Determines if gravity should be applied or object should be grounded
   * @returns {void}
   */
  updateGravity() {
    if (this.shouldApplyGravity()) {
      this.applyVerticalMovement();
    } else {
      this.resetToGround();
    }
  }

  /**
   * Determines if gravity should be applied to the object
   * @returns {boolean} True if object is above ground or moving upward
   */
  shouldApplyGravity() {
    return this.isAboveGround() || this.speedY > 0;
  }

  /**
   * Applies vertical movement based on current speed and acceleration
   * @returns {void}
   */
  applyVerticalMovement() {
    this.y -= this.speedY;
    this.speedY -= this.acceleration;
  }

  /**
   * Resets object to ground position with zero vertical speed
   * @returns {void}
   */
  resetToGround() {
    this.y = 180;
    this.speedY = 0;
  }

  /**
   * Checks if object is above ground level
   * Throwable objects are always considered above ground
   * @returns {boolean} True if object is above ground
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  /**
   * Checks collision with another game object
   * @param {Object} obj - The other object to check collision with
   * @returns {boolean} True if objects are colliding
   */
  isColliding(obj) {
    const a = this.getCollisionEntity();
    const b = this.getOtherCollisionEntity(obj);
    return this.checkCollision(a, b);
  }

  /**
   * Gets the collision entity for this object
   * Uses collision box if available, otherwise uses object itself
   * @returns {Object} Collision entity for this object
   */
  getCollisionEntity() {
    return this.getCollisionBox ? this.getCollisionBox() : this;
  }

  /**
   * Gets the collision entity for another object
   * Uses collision box if available, otherwise uses object itself
   * @param {Object} obj - The other object
   * @returns {Object} Collision entity for the other object
   */
  getOtherCollisionEntity(obj) {
    return obj.getCollisionBox ? obj.getCollisionBox() : obj;
  }

  /**
   * Performs actual collision detection between two entities
   * Uses Axis-Aligned Bounding Box (AABB) collision detection
   * @param {Object} a - First collision entity
   * @param {Object} b - Second collision entity
   * @returns {boolean} True if entities are colliding
   */
  checkCollision(a, b) {
    return (
      a.x + a.width > b.x &&
      a.y + a.height > b.y &&
      a.x < b.x + b.width &&
      a.y < b.y + b.height
    );
  }

  /**
   * Handles object being hit by reducing energy and updating hit time
   * @returns {void}
   */
  hit() {
    this.reduceEnergy();
    this.updateLastHitTime();
  }

  /**
   * Reduces object energy by fixed amount
   * Ensures energy doesn't go below zero
   * @returns {void}
   */
  reduceEnergy() {
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;
  }

  /**
   * Updates the timestamp of last hit for cooldown tracking
   * @returns {void}
   */
  updateLastHitTime() {
    this.lastHit = new Date().getTime();
  }

  /**
   * Checks if object is currently in hurt state (recently hit)
   * @returns {boolean} True if object was hit within the last second
   */
  isHurt() {
    let timepassed = this.getTimeSinceLastHit();
    return timepassed < 1.0;
  }

  /**
   * Calculates time passed since last hit in seconds
   * @returns {number} Time since last hit in seconds
   */
  getTimeSinceLastHit() {
    let timepassed = new Date().getTime() - this.lastHit;
    return timepassed / 1000;
  }

  /**
   * Checks if object is dead (energy depleted)
   * @returns {boolean} True if object has zero energy
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Plays animation sequence from image array
   * Cycles through images based on currentImage counter
   * @param {string[]} images - Array of image paths for animation
   * @returns {void}
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves object to the right based on current speed
   * @returns {void}
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves object to the left based on current speed
   * @returns {void}
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes object jump by setting upward vertical speed
   * @returns {void}
   */
  jump() {
    this.speedY = 30;
  }
}