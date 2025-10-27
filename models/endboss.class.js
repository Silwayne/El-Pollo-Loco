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
   * Walking animation frames for the boss
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  /**
   * Spawning/alert animation frames
   * @type {string[]}
   */
  IMAGES_SPAWNING = [
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  /**
   * Attack animation frames
   * @type {string[]}
   */
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

  /**
   * Hurt animation frames
   * @type {string[]}
   */
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /**
   * Death animation frames
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

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
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_SPAWNING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
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
   * Plays walking animation and moves boss left
   * @returns {void}
   */
  playWalkingAnimation() {
    this.playAnimation(this.IMAGES_WALKING);
    this.moveLeft();
  }

  /**
   * Plays attack animation
   * @returns {void}
   */
  playAttackAnimation() {
    this.playAnimation(this.IMAGES_ATTACK);
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
    this.playAnimation(this.IMAGES_WALKING);

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

    this.playAnimation(this.IMAGES_SPAWNING);
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
   * Plays hurt animation when boss takes damage
   * @returns {void}
   */
  playHurtAnimation() {
    if (this.isDead) return;

    this.isHurt = true;
    this.startHurtAnimation();
  }

  /**
   * Starts the hurt animation sequence
   * @returns {void}
   */
  startHurtAnimation() {
    let i = 0;
    const interval = setInterval(() => {
      this.updateHurtAnimation(i, interval);
      i++;
    }, 400);
  }

  /**
   * Updates hurt animation frame and manages completion
   * @param {number} index - Current animation frame index
   * @param {number} interval - The interval ID to clear when complete
   * @returns {void}
   */
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
   * Plays boss death animation sequence
   * @returns {void}
   */
  playDeathAnimation() {
    let i = 0;
    const nextFrame = () => {
      this.updateDeathFrame(i, nextFrame);
      i++;
    };
    nextFrame();
  }

  /**
   * Updates death animation frame using recursive timeout
   * @param {number} index - Current death animation frame index
   * @param {Function} callback - Callback function for next frame
   * @returns {void}
   */
  updateDeathFrame(index, callback) {
    if (index < this.IMAGES_DEAD.length) {
      this.img = this.imageCache[this.IMAGES_DEAD[index]];
      setTimeout(callback, 250, index, callback);
    } else {
      this.setFinalDeathFrame();
    }
  }

  /**
   * Sets the final death animation frame
   * @returns {void}
   */
  setFinalDeathFrame() {
    this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
  }

  /**
   * Defines the collision box for boss interactions
   * @returns {{x: number, y: number, width: number, height: number}} Collision box
   */
  getTopHitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}