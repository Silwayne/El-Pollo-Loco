/**
 * Comprehensive audio management system for handling game sounds and music
 * Supports both one-shot sound effects and looping background music
 * Implements sound cloning for concurrent playback of the same sound
 * @class
 */
class AudioManager {
  /**
   * Creates an AudioManager instance and initializes all sound objects
   */
  constructor() {
    /**
     * Dictionary of original sound objects
     * @type {Object<string, HTMLAudioElement>}
     */
    this.sounds = {};
    
    /**
     * Active sound clones for concurrent playback tracking
     * @type {Object<string, HTMLAudioElement[]>}
     */
    this.activeClones = {};
    
    /**
     * Tracking for currently playing looping sounds
     * @type {Object<string, boolean>}
     */
    this.loopingPlaying = {};
    
    this.initializeSounds();
  }

  /**
   * Initializes all sound objects and configures looping behavior
   * @returns {void}
   */
  initializeSounds() {
    this.createSoundObjects();
    this.setupLoopingSounds();
  }

  /**
   * Creates and configures all audio objects for the game
   * @returns {void}
   */
  createSoundObjects() {
    this.sounds = {
      jump: new Audio("audio/sounds/sfx_jump.mp3"),
      throw: new Audio("audio/sounds/bottle-throw.mp3"),
      hurt: new Audio("audio/sounds/ough.mp3"),
      coin: new Audio("audio/sounds/coin.mp3"),
      bottle: new Audio("audio/sounds/bottle-up.mp3"),
      bottleSmash: new Audio("audio/sounds/glass-bottle-smash.mp3"),
      enemyDead: new Audio("audio/sounds/chick-sound.mp3"),
      boss: new Audio("audio/sounds/cocorico.mp3"),
      snoring: new Audio("audio/sounds/male-snoring.mp3"),
      background: new Audio("audio/music/acoustic-mexican-guitar.mp3"),
      win: new Audio("audio/music/brass-fanfare-with-timpani-and-winchimes-reverberated.mp3"),
      gameOver: new Audio("audio/music/game-over.mp3"),
    };
  }

  /**
   * Configures looping behavior for background music and boss sounds
   * @returns {void}
   */
  setupLoopingSounds() {
    this.sounds.background.loop = true;
    this.sounds.boss.loop = true;
    this.sounds.boss.volume = 1.0;
  }

  /**
   * Plays a sound by name, handling both looping and one-shot sounds appropriately
   * @param {string} name - Name of the sound to play
   * @returns {void}
   */
  play(name) {
    const sound = this.sounds[name];
    if (!sound) return;

    if (sound.loop) {
      this.playLoopingSound(name, sound);
    } else {
      this.playOneShotSound(name, sound);
    }
  }

  /**
   * Plays a looping sound if not already playing
   * @param {string} name - Name of the looping sound
   * @param {HTMLAudioElement} sound - The sound object to play
   * @returns {void}
   */
  playLoopingSound(name, sound) {
    if (this.loopingPlaying[name]) return;

    try {
      sound.currentTime = 0;
      if (window.soundOn) {
        sound.play().catch(() => {});
      }
      this.loopingPlaying[name] = true;
    } catch (e) {
      console.warn("AudioManager.play(loop) failed:", e);
    }
  }

  /**
   * Plays a one-shot sound using cloning for concurrent playback
   * @param {string} name - Name of the sound to play
   * @param {HTMLAudioElement} sound - The sound object to clone and play
   * @returns {void}
   */
  playOneShotSound(name, sound) {
    try {
      const clone = this.createSoundClone(sound, name);
      this.setupCloneCleanup(clone, name);
      this.playSoundClone(clone);
    } catch (e) {
      console.warn("AudioManager.play(clone) failed:", e);
    }
  }

  /**
   * Creates a clone of a sound for independent playback
   * @param {HTMLAudioElement} sound - The original sound to clone
   * @param {string} name - Name of the sound for tracking
   * @returns {HTMLAudioElement} Cloned sound object
   */
  createSoundClone(sound, name) {
    const clone = sound.cloneNode();
    clone.volume = sound.volume;
    this.trackActiveClone(name, clone);
    return clone;
  }

  /**
   * Tracks an active sound clone for cleanup purposes
   * @param {string} name - Name of the sound
   * @param {HTMLAudioElement} clone - The clone to track
   * @returns {void}
   */
  trackActiveClone(name, clone) {
    if (!this.activeClones[name]) {
      this.activeClones[name] = [];
    }
    this.activeClones[name].push(clone);
  }

  /**
   * Sets up automatic cleanup when a sound clone finishes playing
   * @param {HTMLAudioElement} clone - The sound clone to monitor
   * @param {string} name - Name of the sound for cleanup
   * @returns {void}
   */
  setupCloneCleanup(clone, name) {
    clone.addEventListener("ended", () => {
      this.removeActiveClone(name, clone);
    });
  }

  /**
   * Removes a sound clone from active tracking
   * @param {string} name - Name of the sound
   * @param {HTMLAudioElement} clone - The clone to remove
   * @returns {void}
   */
  removeActiveClone(name, clone) {
    const idx = this.activeClones[name].indexOf(clone);
    if (idx !== -1) {
      this.activeClones[name].splice(idx, 1);
    }
  }

  /**
   * Plays a sound clone with global sound preference check
   * @param {HTMLAudioElement} clone - The sound clone to play
   * @returns {void}
   */
  playSoundClone(clone) {
    if (window.soundOn) {
      clone.play().catch(() => {});
    }
  }

  /**
   * Pauses a specific sound (both looping and one-shot instances)
   * @param {string} name - Name of the sound to pause
   * @returns {void}
   */
  pause(name) {
    this.pauseLoopingSound(name);
    this.pauseOneShotSounds(name);
  }

  /**
   * Pauses a looping sound
   * @param {string} name - Name of the looping sound to pause
   * @returns {void}
   */
  pauseLoopingSound(name) {
    const orig = this.sounds[name];
    if (orig && orig.loop) {
      this.stopLoopingSound(orig, name);
    }
  }

  /**
   * Stops a looping sound and resets its playback position
   * @param {HTMLAudioElement} sound - The looping sound to stop
   * @param {string} name - Name of the sound for state tracking
   * @returns {void}
   */
  stopLoopingSound(sound, name) {
    try {
      sound.pause();
      sound.currentTime = 0;
    } catch (e) {
      console.warn("AudioManager.pause(loop) failed:", e);
    }
    this.loopingPlaying[name] = false;
  }

  /**
   * Pauses all active one-shot sound clones for a specific sound
   * @param {string} name - Name of the sound to pause
   * @returns {void}
   */
  pauseOneShotSounds(name) {
    if (this.activeClones[name] && this.activeClones[name].length > 0) {
      this.stopAllClones(name);
    }
  }

  /**
   * Stops and cleans up all clones for a specific sound
   * @param {string} name - Name of the sound
   * @returns {void}
   */
  stopAllClones(name) {
    this.activeClones[name].forEach((clone) => {
      this.stopClone(clone);
    });
    this.activeClones[name] = [];
  }

  /**
   * Stops an individual sound clone
   * @param {HTMLAudioElement} clone - The sound clone to stop
   * @returns {void}
   */
  stopClone(clone) {
    try {
      clone.pause();
      clone.currentTime = 0;
    } catch (e) {}
  }

  /**
   * Stops all sounds (both looping and one-shot)
   * @returns {void}
   */
  stopAll() {
    try {
      this.stopAllLoopingSounds();
      this.stopAllOneShotSounds();
    } catch (e) {
      console.warn("AudioManager.stopAll failed:", e);
    }
  }

  /**
   * Stops all looping sounds
   * @returns {void}
   */
  stopAllLoopingSounds() {
    Object.keys(this.sounds).forEach((name) => {
      const sound = this.sounds[name];
      if (!sound) return;

      if (sound.loop) {
        this.stopLoopingSound(sound, name);
      }
    });
  }

  /**
   * Stops all one-shot sound clones
   * @returns {void}
   */
  stopAllOneShotSounds() {
    Object.keys(this.activeClones).forEach((name) => {
      this.pause(name);
    });
  }
}