/**
 * Endboss animation methods
 * All animation-related functionality for the Endboss class
 */

// Static image arrays
Endboss.IMAGES_WALKING = [
  "img/4_enemie_boss_chicken/1_walk/G1.png",
  "img/4_enemie_boss_chicken/1_walk/G2.png",
  "img/4_enemie_boss_chicken/1_walk/G3.png",
  "img/4_enemie_boss_chicken/1_walk/G4.png",
];

Endboss.IMAGES_SPAWNING = [
  "img/4_enemie_boss_chicken/2_alert/G8.png",
  "img/4_enemie_boss_chicken/2_alert/G9.png",
  "img/4_enemie_boss_chicken/2_alert/G11.png",
  "img/4_enemie_boss_chicken/2_alert/G10.png",
  "img/4_enemie_boss_chicken/2_alert/G12.png",
];

Endboss.IMAGES_ATTACK = [
  "img/4_enemie_boss_chicken/3_attack/G13.png",
  "img/4_enemie_boss_chicken/3_attack/G14.png",
  "img/4_enemie_boss_chicken/3_attack/G15.png",
  "img/4_enemie_boss_chicken/3_attack/G16.png",
  "img/4_enemie_boss_chicken/3_attack/G17.png",
  "img/4_enemie_boss_chicken/3_attack/G18.png",
  "img/4_enemie_boss_chicken/3_attack/G19.png",
  "img/4_enemie_boss_chicken/3_attack/G20.png",
];

Endboss.IMAGES_HURT = [
  "img/4_enemie_boss_chicken/4_hurt/G21.png",
  "img/4_enemie_boss_chicken/4_hurt/G22.png",
  "img/4_enemie_boss_chicken/4_hurt/G23.png",
];

Endboss.IMAGES_DEAD = [
  "img/4_enemie_boss_chicken/5_dead/G24.png",
  "img/4_enemie_boss_chicken/5_dead/G25.png",
  "img/4_enemie_boss_chicken/5_dead/G26.png",
];

/**
 * Plays walking animation and moves boss left
 * @returns {void}
 */
Endboss.prototype.playWalkingAnimation = function () {
  this.playAnimation(Endboss.IMAGES_WALKING);
  this.moveLeft();
};

/**
 * Plays attack animation
 * @returns {void}
 */
Endboss.prototype.playAttackAnimation = function () {
  this.playAnimation(Endboss.IMAGES_ATTACK);
};

/**
 * Plays hurt animation when boss takes damage
 * @returns {void}
 */
Endboss.prototype.playHurtAnimation = function () {
  if (this.isDead) return;

  this.isHurt = true;
  this.startHurtAnimation();
};

/**
 * Starts the hurt animation sequence
 * @returns {void}
 */
Endboss.prototype.startHurtAnimation = function () {
  let i = 0;
  const interval = setInterval(() => {
    this.updateHurtAnimation(i, interval);
    i++;
  }, 400);
};

/**
 * Updates hurt animation frame and manages completion
 * @param {number} index - Current animation frame index
 * @param {number} interval - The interval ID to clear when complete
 * @returns {void}
 */
Endboss.prototype.updateHurtAnimation = function (index, interval) {
  if (this.isDead) {
    clearInterval(interval);
    return;
  }

  this.img = this.imageCache[Endboss.IMAGES_HURT[index]];

  if (index >= Endboss.IMAGES_HURT.length - 1) {
    clearInterval(interval);
    this.isHurt = false;
  }
};

/**
 * Plays boss death animation sequence
 * @returns {void}
 */
Endboss.prototype.playDeathAnimation = function () {
  let i = 0;
  const nextFrame = () => {
    this.updateDeathFrame(i, nextFrame);
    i++;
  };
  nextFrame();
};

/**
 * Updates death animation frame using recursive timeout
 * @param {number} index - Current death animation frame index
 * @param {Function} callback - Callback function for next frame
 * @returns {void}
 */
Endboss.prototype.updateDeathFrame = function (index, callback) {
  if (index < Endboss.IMAGES_DEAD.length) {
    this.img = this.imageCache[Endboss.IMAGES_DEAD[index]];
    setTimeout(callback, 250, index, callback);
  } else {
    this.setFinalDeathFrame();
  }
};

/**
 * Sets the final death animation frame
 * @returns {void}
 */
Endboss.prototype.setFinalDeathFrame = function () {
  this.img =
    this.imageCache[Endboss.IMAGES_DEAD[Endboss.IMAGES_DEAD.length - 1]];
};
