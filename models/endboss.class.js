/**
 * Final boss enemy with complex behavior patterns and multiple attack phases
 * Features spawning sequence, walking, attacking, hurt states, and death animation
 * Manages multiple animation intervals for sophisticated boss behavior
 * @class
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  y = 55;
  height = 400;
  width = 250;
  energy = 100;
  triggered = false;
  isDead = false;
  isHurt = false;
  isAttacking = false;
  lastAttackTime = 0;
  attackCooldown = 2000;

  animateInterval = null;
  walkInterval = null;
  chaseInterval = null;

  static ATTACK_RANGE = 150;

  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/1_walk/G1.png");
    this.loadAllImages();
    this.setInitialProperties();

    this.animation = new EndbossAnimation(this);

    this.animate();
  }

  /**
   * Loads all image sets used by the boss.
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
   * Sets starting position and movement speed.
   * @returns {void}
   */
  setInitialProperties() {
    this.speed = 40;
    this.x = 2500;
  }

  /**
   * Starts the main animation interval.
   * Updates boss logic periodically.
   * @returns {void}
   */
  animate() {
    this.animateInterval = setInterval(() => {
      this.handleAnimationFrame();
    }, 150);
  }

  /**
   * Determines which boss state to process on each frame.
   * @returns {void}
   */
  handleAnimationFrame() {
    if (this.isDead || this.isHurt) return;

    this.checkTriggerCondition();
    this.handleBossBehavior();
  }

  /**
   * Checks if player has entered the boss trigger zone.
   * Starts the boss encounter if condition met.
   * @returns {void}
   */
  checkTriggerCondition() {
    if (!this.triggered && this.world.character.x > 2150) {
      this.startBossSequence();
    }
  }

  /**
   * Handles boss behavior based on distance to player
   * @returns {void}
   */
  handleBossBehavior() {
    if (this.triggered && !this.isDead) {
      const distanceTopPlayer = this.getDistanceToPlayer();

      if (
        Endboss.isPlayerInAttackRange(distanceTopPlayer) &&
        this.canAttack()
      ) {
        this.startAttack();
      } else {
        this.chasePlayer();
      }
    }
  }

  /**
   * Calculates distance to player
   * @returns {number} Distance to player
   */
  getDistanceToPlayer() {
    return Math.abs(this.x - this.world.character.x);
  }

  /**
   * Checks if player is within attack range
   * @param {number} distance - Distance to player
   * @returns {boolean} True if player is in attack range
   */
   static isPlayerInAttackRange(distance) {
    return distance <= Endboss.ATTACK_RANGE;
  }

  /**
   * Checks if boss can attack (cooldown finished)
   * @returns {boolean} True if attack is available
   */
  canAttack() {
    const now = new Date().getTime();
    return now - this.lastAttackTime > this.attackCooldown;
  }

  /**
   * Starts attack sequence
   * @returns {void}
   */
  startAttack() {
    this.isAttacking = true;
    this.lastAttackTime = new Date().getTime();

    this.animation.playAttackAnimation();

    setTimeout(() => {
      this.isAttacking = false;
    }, 1000);
  }

  /**
   * Deals damage to player if in range
   * @returns {void}
   */
  dealDamageToPlayer() {
    const distance = this.getDistanceToPlayer();
    if (distance <= Endboss.ATTACK_RANGE) {
      this.world.character.hit(10);
    }
  }

  /**
   * Chases player by moving towards them
   * @returns {void}
   */
  chasePlayer() {
    this.animation.playWalkingAnimation();

    if (this.x > this.world.character.x + 50) {
      this.x -= 20;
    }
  }

  /**
   * Continuous movement towards the player
   * @returns {void}
   */
  handleContinuousMovement() {
    if (this.triggered && !this.isDead) {
      this.moveTowardsPlayer();
      this.animation.playWalkingAnimation();
    }
  }

  /**
   * Moves boss towards player position
   * @returns {void}
   */
  moveTowardsPlayer() {
    this.x -= 25;

    const characterX = this.world.character.x;
    if (this.x > characterX + 100) {
      this.x -= 30;
    } else {
      this.x -= 20;
    }
  }

  /**
   * Starts the complete boss sequence when triggered.
   * @returns {void}
   */
  startBossSequence() {
    this.triggered = true;
    this.startWalkSequence();
  }

  /**
   * Begins walking sequence toward player.
   * @returns {void}
   */
  startWalkSequence() {
    this.walkInterval = setInterval(() => {
      this.updateWalkSequence();
    }, 60);
  }

  /**
   * Updates walking movement and checks for spawn transition.
   * @returns {void}
   */
  updateWalkSequence() {
    this.x -= 24;
    this.playAnimation(Endboss.IMAGES_WALKING);

    if (this.x <= 2350) {
      this.completeWalkSequence();
    }
  }

  /**
   * Completes walking sequence, plays spawning animation, and triggers attack setup.
   * @returns {void}
   */
  completeWalkSequence() {
    clearInterval(this.walkInterval);
    this.walkInterval = null;

    this.animation.playSpawningAnimation();
    this.playBossSound();
    setTimeout(() => {}, 1500);
  }

  /**
   * Completes walking sequence and starts intelligent chasing
   * @returns {void}
   */
  completeWalkSequence() {
    clearInterval(this.walkInterval);
    this.walkInterval = null;

    this.animation.playSpawningAnimation();
    this.playBossSound();

    setTimeout(() => {}, 1500);
  }

  /**
   * Plays the boss background sound.
   * @returns {void}
   */
  playBossSound() {
    if (this.world && this.world.audioManager) {
      this.world.audioManager.play("boss");
    }
  }

  /**
   * Handles boss getting hit by player's attacks.
   * Applies cooldown and plays hurt animation.
   * @returns {void}
   */
  hit() {
    if (this.isDead || this.isOnCooldown()) return;

    this.registerHit();
    this.reduceEnergy();
    this.animation.playHurtAnimation();
    this.updateBossBar();

    if (this.energy === 0) {
      this.die();
    }
  }

  /**
   * Returns true if boss is on hit cooldown.
   * @returns {boolean}
   */
  isOnCooldown() {
    const now = new Date().getTime();
    return this.lastHit && now - this.lastHit < 1000;
  }

  /**
   * Stores timestamp of last hit to track cooldown.
   * @returns {void}
   */
  registerHit() {
    this.lastHit = new Date().getTime();
  }

  /**
   * Reduces energy by 20 per hit and prevents negative values.
   * @returns {void}
   */
  reduceEnergy() {
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;
  }

  /**
   * Updates the boss health bar to reflect current energy.
   * @returns {void}
   */
  updateBossBar() {
    world.bossBar.setPercentage(this.energy);
  }

  /**
   * Handles full death sequence, animations, and cleanup.
   * @returns {void}
   */
  die() {
    this.setDeathState();
    this.clearAllIntervals();
    this.stopBossSound();
    this.animation.playDeathAnimation();
  }

  /**
   * Sets flags for dead state.
   * @returns {void}
   */
  setDeathState() {
    this.isDead = true;
    this.isHurt = false;
  }

  /**
   * Clears all intervals safely to stop ongoing behaviors.
   * @returns {void}
   */
  clearAllIntervals() {
    this.clearInterval(this.animateInterval);
    this.clearInterval(this.walkInterval);
    this.clearInterval(this.chaseInterval);
  }

  /**
   * Helper function for clearing a given interval.
   * @param {number} interval - ID of the interval to clear.
   * @returns {void}
   */
  clearInterval(interval) {
    if (interval) {
      clearInterval(interval);
    }
  }

  /**
   * Pauses the boss sound when defeated.
   * @returns {void}
   */
  stopBossSound() {
    if (this.world && this.world.audioManager) {
      this.world.audioManager.pause("boss");
    }
  }

  /**
   * Returns the collision box for boss hit detection.
   * @returns {{x: number, y: number, width: number, height: number}}
   */
  getCollisionBox() {
    return {
      x: this.x + 50,
      y: this.y + 120,
      width: this.width - 120,
      height: this.height - 180,
    };
  }
}
