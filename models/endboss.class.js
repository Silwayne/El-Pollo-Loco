/**
 * Final boss enemy with complex behavior patterns and multiple attack phases
 * Features spawning sequence, walking, attacking, hurt states, and death animation
 * Manages multiple animation intervals for sophisticated boss behavior
 * @class
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  /** @type {number} */ y = 55;
  /** @type {number} */ height = 400;
  /** @type {number} */ width = 250;
  /** @type {number} */ energy = 100;
  /** @type {boolean} */ triggered = false;
  /** @type {boolean} */ attacking = false;
  /** @type {boolean} */ attackPhase = false;
  /** @type {boolean} */ isDead = false;
  /** @type {boolean} */ isHurt = false;

  /** @type {number} */ animateInterval = null;
  /** @type {number} */ walkInterval = null;
  /** @type {number} */ attackInterval = null;

  /**
   * Creates an Endboss instance
   * Initializes properties, loads images, and starts animation
   */
  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/1_walk/G1.png");
    this.loadAllImages();
    this.setInitialProperties();
    this.animate();
  }

  /**
   * Preloads all boss animation images
   * @returns {void}
   */
  loadAllImages() {
    this.loadImages(Endboss.IMAGES_WALKING);
    this.loadImages(Endboss.IMAGES_SPAWNING);
    this.loadImages(Endboss.IMAGES_ATTACK);
    this.loadImages(Endboss.IMAGES_DEAD);
    this.loadImages(Endboss.IMAGES_HURT);
  }

  /**
   * Sets initial boss properties including position and speed
   * @returns {void}
   */
  setInitialProperties() {
    this.speed = 2;
    this.x = 2500;
  }

  /**
   * Starts the main boss animation loop
   * @returns {void}
   */
  animate() {
    this.animateInterval = setInterval(() => {
      this.handleAnimationFrame();
    }, 200);
  }

  /**
   * Handles each animation frame based on boss state
   * @returns {void}
   */
  handleAnimationFrame() {
    if (this.isDead || this.isHurt) return;

    this.checkTriggerCondition();
    this.handleAttackBehavior();
  }

  /**
   * Checks if player has reached boss trigger area
   * @returns {void}
   */
  checkTriggerCondition() {
    if (!this.triggered && this.world.character.x > 2150) {
      this.startBossSequence();
    }
  }

  /**
   * Handles attack behavior when boss is in attacking state
   * @returns {void}
   */
  handleAttackBehavior() {
    if (this.attacking) {
      if (this.attackPhase) {
        this.playWalkingAnimation();
      } else {
        this.playAttackAnimation();
      }
    }
  }

  /**
   * Starts the complete boss encounter sequence
   * @returns {void}
   */
  startBossSequence() {
    this.triggered = true;
    this.startWalkSequence();
  }

  /**
   * Starts the boss walk sequence towards player
   * @returns {void}
   */
  startWalkSequence() {
    this.walkInterval = setInterval(() => {
      this.updateWalkSequence();
    }, 120);
  }

  /**
   * Updates walk sequence by moving boss and playing animation
   * @returns {void}
   */
  updateWalkSequence() {
    this.x -= 5;
    this.playAnimation(Endboss.IMAGES_WALKING);

    if (this.x <= 2350) {
      this.completeWalkSequence();
    }
  }

  /**
   * Completes walk sequence and transitions to spawn animation
   * @returns {void}
   */
  completeWalkSequence() {
    clearInterval(this.walkInterval);
    this.walkInterval = null;

    this.playAnimation(Endboss.IMAGES_SPAWNING);
    this.playBossSound();
    this.scheduleAttackStart();
  }

  /**
   * Plays boss sound effect
   * @returns {void}
   */
  playBossSound() {
    if (this.world && this.world.audioManager) {
      this.world.audioManager.play("boss");
    }
  }

  /**
   * Schedules the start of attack pattern after spawn animation
   * @returns {void}
   */
  scheduleAttackStart() {
    setTimeout(() => {
      this.startAttackPattern();
    }, 1500);
  }

  /**
   * Starts the boss attack pattern
   * @returns {void}
   */
  startAttackPattern() {
    this.attacking = true;
    this.startAttackIntervals();
  }

  /**
   * Starts attack interval for regular attack cycles
   * @returns {void}
   */
  startAttackIntervals() {
    this.attackInterval = setInterval(() => {
      this.executeAttackCycle();
    }, 3000);
  }

  /**
   * Executes a single attack cycle
   * @returns {void}
   */
  executeAttackCycle() {
    if (this.isDead) return;

    this.attackPhase = true;
    this.scheduleAttackEnd();
  }

  /**
   * Schedules the end of current attack phase
   * @returns {void}
   */
  scheduleAttackEnd() {
    setTimeout(() => {
      this.attackPhase = false;
    }, 1500);
  }

  /**
   * Handles boss taking damage from player attacks
   * @returns {void}
   */
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

  /**
   * Checks if boss is on hit cooldown to prevent rapid damage
   * @returns {boolean} True if boss cannot take damage yet
   */
  isOnCooldown() {
    let now = new Date().getTime();
    return this.lastHit && now - this.lastHit < 1000;
  }

  /**
   * Registers the time of last hit for cooldown tracking
   * @returns {void}
   */
  registerHit() {
    this.lastHit = new Date().getTime();
  }

  /**
   * Reduces boss energy by fixed amount
   * @returns {void}
   */
  reduceEnergy() {
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;
  }

  /**
   * Updates boss health bar display
   * @returns {void}
   */
  updateBossBar() {
    world.bossBar.setPercentage(this.energy);
  }

  /**
   * Handles boss death sequence
   * @returns {void}
   */
  die() {
    this.setDeathState();
    this.clearAllIntervals();
    this.stopBossSound();
    this.playDeathAnimation();
  }

  /**
   * Sets boss death state flags
   * @returns {void}
   */
  setDeathState() {
    this.isDead = true;
    this.isHurt = false;
  }

  /**
   * Clears all active intervals to stop boss behavior
   * @returns {void}
   */
  clearAllIntervals() {
    this.clearInterval(this.animateInterval);
    this.clearInterval(this.walkInterval);
    this.clearInterval(this.attackInterval);
  }

  /**
   * Safely clears an interval if it exists
   * @param {number} interval - The interval ID to clear
   * @returns {void}
   */
  clearInterval(interval) {
    if (interval) {
      clearInterval(interval);
    }
  }

  /**
   * Stops boss sound effect
   * @returns {void}
   */
  stopBossSound() {
    if (this.world && this.world.audioManager) {
      this.world.audioManager.pause("boss");
    }
  }

  /**
   * Defines the collision box for boss interactions
   * @returns {{x: number, y: number, width: number, height: number}} Collision box
   */
  getCollisionBox() {
    return {
      x: this.x + 20,
      y: this.y + 80,
      width: this.width - 30,
      height: this.height - 150,
    };
  }
}
