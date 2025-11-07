/**
 * Centralized collision detection and response system
 * Handles all game object interactions including enemy collisions, item collection, and game end conditions
 * Separates collision logic from world management for better maintainability
 * @class
 */
class CollisionManager {
  constructor(world) {
    this.world = world;
  }

  /**
   * Performs all collision checks in the game world
   * Orchestrates enemy collisions, cleanup, and game end conditions
   * @returns {void}
   */
  checkAllCollisions() {
    this.checkEnemyCollisions();
    this.cleanupEnemiesList();
    this.checkGameEnd();
  }

  /**
   * Checks collisions between character and all enemies
   * Processes each enemy for collision detection and response
   * @returns {void}
   */
  checkEnemyCollisions() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.shouldCheckCollision(enemy)) {
        this.handleEnemyCollision(enemy);
      }
    });
  }

  /**
   * Determines if collision should be checked for a specific enemy
   * @param {Object} enemy - The enemy to check
   * @returns {boolean} True if collision detection should be performed
   */
  shouldCheckCollision(enemy) {
    return !enemy.isDead && this.world.character.isColliding(enemy);
  }

  /**
   * Handles collision with an enemy based on enemy type
   * @param {Object} enemy - The enemy involved in collision
   * @returns {void}
   */
  handleEnemyCollision(enemy) {
    if (enemy instanceof Endboss) {
      this.handleEndbossCollision(enemy);
    } else {
      this.handleRegularEnemyCollision(enemy);
    }
  }

  /**
   * Handles collision with the end boss
   * @param {Endboss} endboss - The end boss enemy
   * @returns {void}
   */
  handleEndbossCollision(endboss) {
    if (!this.world.character.isHurt()) {
      this.hurtCharacter();
    }
  }

  /**
   * Handles collision with regular enemies (chickens)
   * @param {Object} enemy - The regular enemy
   * @returns {void}
   */
  handleRegularEnemyCollision(enemy) {
    if (this.world.character.isFallingOn(enemy)) {
      this.killEnemy(enemy);
    } else if (!this.world.character.isHurt()) {
      this.hurtCharacter();
    }
  }

  /**
   * Applies damage to character and updates UI
   * @returns {void}
   */
  hurtCharacter() {
    this.world.character.hit();
    this.world.statusBar.setPercentage(this.world.character.energy);
    this.world.audioManager.play("hurt");
  }

  /**
   * Kills an enemy and plays death effects
   * @param {Object} enemy - The enemy to kill
   * @returns {void}
   */
  killEnemy(enemy) {
    enemy.die();
    this.world.audioManager.play("enemyDead");
  }

  /**
   * Cleans up the enemies list by removing dead enemies
   * @returns {void}
   */
  cleanupEnemiesList() {
    this.world.level.enemies = this.world.level.enemies.filter(
      (e) => !e.remove
    );
  }

  /**
   * Checks game end conditions (character death or boss defeat)
   * @returns {void}
   */
  checkGameEnd() {
    const boss = this.getBoss();
    const endbossDead = boss ? boss.isDead : false;
    const characterDead =
      this.world.character.isDead && this.world.character.isDead();

    if ((characterDead || endbossDead) && !this.world.gameEnded) {
      this.endGame(characterDead, endbossDead);
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
   * Ends the game and triggers appropriate state changes
   * @param {boolean} characterDead - Whether the character is dead
   * @param {boolean} endbossDead - Whether the end boss is dead
   * @returns {void}
   */
  endGame(characterDead, endbossDead) {
    this.world.gameEnded = true;
    this.world.paused = true;
    this.handleEndSounds(characterDead, endbossDead);
  }

  /**
   * Manages audio for game end scenarios
   * @param {boolean} characterDead - Whether the character is dead
   * @param {boolean} endbossDead - Whether the end boss is dead
   * @returns {void}
   */
  handleEndSounds(characterDead, endbossDead) {
    try {
      this.world.audioManager.stopAll();
      this.playEndSound(characterDead, endbossDead);
    } catch (e) {
      console.warn("Failed to stop/play end sounds:", e);
    }
  }

  /**
   * Plays appropriate end game sound based on outcome
   * @param {boolean} characterDead - Whether the character is dead
   * @param {boolean} endbossDead - Whether the end boss is dead
   * @returns {void}
   */
  playEndSound(characterDead, endbossDead) {
    if (characterDead) {
      this.world.audioManager.play("gameOver");
    } else if (endbossDead) {
      this.world.audioManager.play("win");
    }
  }

  /**
   * Checks for bottle collection collisions
   * @returns {void}
   */
  checkBottleCollisions() {
    this.world.level.bottles.forEach((bottle, index) => {
      if (this.world.character.isColliding(bottle)) {
        this.collectBottle(index);
      }
    });
  }

  /**
   * Handles bottle collection logic
   * @param {number} index - Index of the collected bottle in the array
   * @returns {void}
   */
  collectBottle(index) {
    this.world.bottleCount++;
    this.world.audioManager.play("bottle");
    this.world.level.bottles.splice(index, 1);
    this.world.bottleBar.setPercentage(this.world.bottleCount);
  }

  /**
   * Checks for coin collection collisions
   * @returns {void}
   */
  checkCoinCollisions() {
    this.world.level.coins.forEach((coin, index) => {
      if (this.world.character.isColliding(coin)) {
        this.collectCoin(index);
      }
    });
  }

  /**
   * Handles coin collection logic
   * @param {number} index - Index of the collected coin in the array
   * @returns {void}
   */
  collectCoin(index) {
    this.world.coinCount++;
    this.world.audioManager.play("coin");
    this.world.level.coins.splice(index, 1);
    this.world.coinBar.setPercentage(this.world.coinCount);
  }
}
