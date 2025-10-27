/**
 * Main game world controller orchestrating all game systems and managers
 * Serves as the central hub connecting game objects, UI, audio, and gameplay logic
 * Implements manager-based architecture for clean separation of concerns
 * @class
 */
class World {
  /** @type {Character} */ character = new Character();
  /** @type {Level} */ level = createNewLevel();
  /** @type {HTMLCanvasElement} */ canvas;
  /** @type {CanvasRenderingContext2D} */ ctx;
  /** @type {Keyboard} */ keyboard;
  /** @type {number} */ camera_x = 0;
  /** @type {StatusBar} */ statusBar = new StatusBar();
  /** @type {BottleBar} */ bottleBar = new BottleBar();
  /** @type {CoinBar} */ coinBar = new CoinBar();
  /** @type {BossBar} */ bossBar = new BossBar();
  /** @type {Array} */ throwableObjects = [];
  /** @type {number} */ bottleCount = 0;
  /** @type {number} */ coinCount = 0;
  /** @type {boolean} */ paused = false;

  /**
   * Creates a World instance and initializes all game systems
   * @param {HTMLCanvasElement} canvas - The game canvas element
   * @param {Keyboard} keyboard - Keyboard input handler
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.initializeWorld();
    this.setupManagers();
    this.run();
    this.draw();
  }

  /**
   * Initializes all game world components and objects
   * @returns {void}
   */
  initializeWorld() {
    this.cleanupEnemies();
    this.setupEndboss();
    this.setupUI();
    this.setupCharacter();
    this.setupBars();
    this.resetCounters();
  }

  /**
   * Cleans up enemies list before endboss setup
   * Removes any existing endboss instances to prevent duplicates
   * @returns {void}
   */
  cleanupEnemies() {
    if (this.level && Array.isArray(this.level.enemies)) {
      this.level.enemies = this.level.enemies.filter(
        (e) => !(e instanceof Endboss)
      );
    }
  }

  /**
   * Sets up the end boss enemy and adds it to the level
   * @returns {void}
   */
  setupEndboss() {
    this.endboss = new Endboss();
    this.endboss.world = this;
    this.level = createNewLevel();
    this.level.enemies.push(this.endboss);
  }

  /**
   * Sets up the user interface system
   * @returns {void}
   */
  setupUI() {
    this.ui = new WorldUI(this);
  }

  /**
   * Sets up the player character with world reference
   * @returns {void}
   */
  setupCharacter() {
    this.character = new Character();
    this.setWorld();
  }

  /**
   * Sets up all status bars for game UI
   * @returns {void}
   */
  setupBars() {
    this.statusBar = new StatusBar();
    this.bottleBar = new BottleBar();
    this.coinBar = new CoinBar();
    this.bossBar = new BossBar();
  }

  /**
   * Resets game counters and object collections
   * @returns {void}
   */
  resetCounters() {
    this.throwableObjects = [];
    this.bottleCount = 0;
    this.coinCount = 0;
  }

  /**
   * Sets up specialized manager systems for game functionality
   * Implements separation of concerns through dedicated managers
   * @returns {void}
   */
  setupManagers() {
    this.audioManager = new AudioManager();
    this.handleBackgroundMusic();
    this.collisionManager = new CollisionManager(this);
    this.throwManager = new ThrowManager(this);
  }

  /**
   * Handles background music based on user sound preferences
   * @returns {void}
   */
  handleBackgroundMusic() {
    try {
      if (window.soundOn && this.audioManager?.sounds?.background) {
        this.playBackgroundMusic();
      } else {
        this.pauseBackgroundMusic();
      }
    } catch (e) {
      console.warn("Audio start failed:", e);
    }
  }

  /**
   * Plays background music with configured settings
   * @returns {void}
   */
  playBackgroundMusic() {
    const bgSound = this.audioManager.sounds.background;
    bgSound.volume = 0.3;
    bgSound.currentTime = 0;
    bgSound.play().catch(() => {});
  }

  /**
   * Pauses background music and resets playback position
   * @returns {void}
   */
  pauseBackgroundMusic() {
    if (this.audioManager?.sounds?.background) {
      const bgSound = this.audioManager.sounds.background;
      bgSound.pause();
      bgSound.currentTime = 0;
    }
  }

  /**
   * Sets world reference for character and starts character animation
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  /**
   * Starts the main game logic loop
   * Delegates specific tasks to specialized managers
   * @returns {void}
   */
  run() {
    this.logicInterval = setInterval(() => {
      if (!this.paused) {
        this.collisionManager.checkBottleCollisions();
        this.collisionManager.checkCoinCollisions();
        this.throwManager.checkThrowObjects();
      }
    }, 60);
  }

  /**
   * Main rendering loop - draws game frame and manages animations
   * @returns {void}
   */
  draw() {
    if (!this.paused) {
      this.collisionManager.checkAllCollisions();
    }

    this.ui.draw();
    this.drawMobileControlsIfNeeded();

    let self = this;
    requestAnimationFrame(() => self.draw());
  }

  /**
   * Conditionally draws mobile controls on touch devices
   * @returns {void}
   */
  drawMobileControlsIfNeeded() {
    if (
      window.innerWidth <= 1023 &&
      typeof this.drawMobileControls === "function"
    ) {
      this.drawMobileControls();
    }
  }

  /**
   * Adds multiple objects to the game map
   * @param {Array} objects - Array of objects to add to the map
   * @returns {void}
   */
  addObjectToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Adds a single object to the map with directional handling
   * @param {MovableObject} mo - The movable object to add
   * @returns {void}
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips image horizontally for left-facing objects
   * @param {MovableObject} mo - The movable object to flip
   * @returns {void}
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores image orientation after flipping
   * @param {MovableObject} mo - The movable object to restore
   * @returns {void}
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}