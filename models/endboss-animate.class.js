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
 * Handles all animation logic for the Endboss class.
 * Controls walking, attacking, hurt, spawning, and death animations.
 * @class
 */
class EndbossAnimation {
  constructor(endboss) {
    this.endboss = endboss;
  }

  /**
   * Plays walking animation and moves boss slightly to the left.
   * Called during walking or chase phases.
   * @returns {void}
   */
  playWalkingAnimation() {
    const e = this.endboss;
    e.playAnimation(Endboss.IMAGES_WALKING);
    e.x -= 40;
  }

  /**
   * Plays the attack animation.
   * Called when the boss enters its attack phase.
   * @returns {void}
   */
  playAttackAnimation() {
    this.endboss.playAnimation(Endboss.IMAGES_ATTACK);
  }

  /**
   * Plays the hurt animation when the boss takes damage.
   * Temporarily sets the boss into a hurt state.
   * @returns {void}
   */
  playHurtAnimation() {
    const e = this.endboss;
    if (e.isDead) return;

    e.isHurt = true;
    let i = 0;

    const interval = setInterval(() => {
      if (e.isDead) {
        clearInterval(interval);
        return;
      }

      e.img = e.imageCache[Endboss.IMAGES_HURT[i]];

      if (i >= Endboss.IMAGES_HURT.length - 1) {
        clearInterval(interval);
        e.isHurt = false;
      }
      i++;
    }, 400);
  }

  /**
   * Plays the full death animation sequence.
   * Progresses through all death frames and stops on the final image.
   * @returns {void}
   */
  playDeathAnimation() {
    const e = this.endboss;
    let i = 0;

    const nextFrame = () => {
      if (i < Endboss.IMAGES_DEAD.length) {
        e.img = e.imageCache[Endboss.IMAGES_DEAD[i]];
        i++;
        setTimeout(nextFrame, 250);
      } else {
        e.img =
          e.imageCache[Endboss.IMAGES_DEAD[Endboss.IMAGES_DEAD.length - 1]];
      }
    };

    nextFrame();
  }

  /**
   * Plays the spawning (alert) animation sequence.
   * Called when the boss first appears or becomes active.
   * @returns {void}
   */
  playSpawningAnimation() {
    this.endboss.playAnimation(Endboss.IMAGES_SPAWNING);
  }
}
