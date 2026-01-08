/**
 * Manages all throwing mechanics and projectile behavior in the game
 * Handles bottle throwing input, projectile physics, collisions, and cleanup
 * Separates throwing logic from world management for better maintainability
 * @class
 */
class ThrowManager {
  constructor(world) {
    this.world = world;
    this.lastThrowTime = 0;
  }

  /**
   * Performs all throw-related checks and updates
   * Orchestrates input handling and projectile management
   * @returns {void}
   */
  checkThrowObjects() {
    this.handleThrowInput();
    this.updateThrowableObjects();
  }

  /**
   * Handles throw input from keyboard or mobile controls
   * Processes throw commands with cooldown and resource checks
   * @returns {void}
   */
  handleThrowInput() {
    const THROW_COOLDOWN = 1200;
    const now = Date.now();

    if (this.canThrow(now, THROW_COOLDOWN)) {
      this.throwBottle(now);
    }
  }

  /**
   * Determines if a throw can be performed
   * Checks input state, resource availability, and cooldown
   * @param {number} now - Current timestamp in milliseconds
   * @param {number} cooldown - Cooldown duration in milliseconds
   * @returns {boolean} True if throw can be executed
   */
  canThrow(now, cooldown) {
    const isThrowKeyPressed = this.world.keyboard && this.world.keyboard.E;
    if (!isThrowKeyPressed) return false;

    if (this.world.bottleCount <= 0) return false;

    const isCooldownOver =
      !this.lastThrowTime || now - this.lastThrowTime > cooldown;
    return isCooldownOver;
  }

  /**
   * Executes bottle throwing sequence
   * Creates throwable object, updates game state, and plays effects
   * @param {number} now - Current timestamp for cooldown tracking
   * @returns {void}
   */
  throwBottle(now) {
    const throwX = this.world.character.otherDirection ? this.world.character.x - 50 : this.world.character.x + 100;
    const throwY = this.world.character.y + 100;
    const bottle = new ThrowableObject(throwX, throwY);
    bottle.speed = this.world.character.otherDirection ? -10 : 10;
    this.world.throwableObjects.push(bottle);
    this.world.bottleCount--;
    this.world.bottleBar.setPercentage(this.world.bottleCount);
    this.world.audioManager.play("throw");
    this.lastThrowTime = now;
    if (this.world.character && this.world.character.updateLastAction) {
      this.world.character.updateLastAction();
    }
  }

  /**
   * Updates all active throwable objects in the game world
   * Processes collisions and removal of throwable objects
   * @returns {void}
   */
  updateThrowableObjects() {
    for (let i = this.world.throwableObjects.length - 1; i >= 0; i--) {
      const bottle = this.world.throwableObjects[i];
      if (!bottle) continue;

      this.handleBottleCollisions(bottle, i);
      this.handleBottleRemoval(bottle, i);
    }
  }

  /**
   * Handles collisions for a specific bottle
   * Checks for boss collisions and ground impacts
   * @param {ThrowableObject} bottle - The bottle to check collisions for
   * @param {number} index - Index of the bottle in the throwableObjects array
   * @returns {void}
   */
  handleBottleCollisions(bottle, index) {
    if (bottle.isShattered) return;

    const boss = this.getBoss();
    if (boss && bottle.isColliding(boss)) {
      this.hitBossWithBottle(boss, bottle);
    } else if (bottle.y > 350) {
      this.shatterBottle(bottle);
    }
  }

  /**
   * Retrieves the end boss instance from the level
   * @returns {Endboss|null} The end boss or null if not found
   */
  getBoss() {
    return (
      this.world.level.endboss ||
      this.world.level.enemies.find((e) => e instanceof Endboss)
    );
  }

  /**
   * Handles bottle collision with the end boss
   * Applies damage to boss and triggers bottle shatter effects
   * @param {Endboss} boss - The end boss enemy
   * @param {ThrowableObject} bottle - The thrown bottle
   * @returns {void}
   */
  hitBossWithBottle(boss, bottle) {
    boss.hit();
    this.world.audioManager.play("bottleSmash");
    if (this.world.bossBar) this.world.bossBar.setPercentage(boss.energy);
    bottle.shatter();
  }

  /**
   * Handles bottle shattering on ground impact
   * Plays sound effects and marks bottle for removal
   * @param {ThrowableObject} bottle - The bottle to shatter
   * @returns {void}
   */
  shatterBottle(bottle) {
    this.world.audioManager.play("bottleSmash");
    bottle.shatter();
  }

  /**
   * Handles removal of bottles marked for cleanup
   * @param {ThrowableObject} bottle - The bottle to check for removal
   * @param {number} index - Index of the bottle in the throwableObjects array
   * @returns {void}
   */
  handleBottleRemoval(bottle, index) {
    if (bottle.remove) {
      this.world.throwableObjects.splice(index, 1);
    }
  }
}
