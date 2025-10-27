class AudioManager {
  constructor() {
    this.sounds = {};
    this.activeClones = {};
    this.loopingPlaying = {};
    this.initializeSounds();
  }

  initializeSounds() {
    this.createSoundObjects();
    this.setupLoopingSounds();
  }

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

  setupLoopingSounds() {
    this.sounds.background.loop = true;
    this.sounds.boss.loop = true;
    this.sounds.boss.volume = 1.0;
  }

  play(name) {
    const sound = this.sounds[name];
    if (!sound) return;

    if (sound.loop) {
      this.playLoopingSound(name, sound);
    } else {
      this.playOneShotSound(name, sound);
    }
  }

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

  playOneShotSound(name, sound) {
    try {
      const clone = this.createSoundClone(sound, name);
      this.setupCloneCleanup(clone, name);
      this.playSoundClone(clone);
    } catch (e) {
      console.warn("AudioManager.play(clone) failed:", e);
    }
  }

  createSoundClone(sound, name) {
    const clone = sound.cloneNode();
    clone.volume = sound.volume;
    this.trackActiveClone(name, clone);
    return clone;
  }

  trackActiveClone(name, clone) {
    if (!this.activeClones[name]) {
      this.activeClones[name] = [];
    }
    this.activeClones[name].push(clone);
  }

  setupCloneCleanup(clone, name) {
    clone.addEventListener("ended", () => {
      this.removeActiveClone(name, clone);
    });
  }

  removeActiveClone(name, clone) {
    const idx = this.activeClones[name].indexOf(clone);
    if (idx !== -1) {
      this.activeClones[name].splice(idx, 1);
    }
  }

  playSoundClone(clone) {
    if (window.soundOn) {
      clone.play().catch(() => {});
    }
  }

  pause(name) {
    this.pauseLoopingSound(name);
    this.pauseOneShotSounds(name);
  }

  pauseLoopingSound(name) {
    const orig = this.sounds[name];
    if (orig && orig.loop) {
      this.stopLoopingSound(orig, name);
    }
  }

  stopLoopingSound(sound, name) {
    try {
      sound.pause();
      sound.currentTime = 0;
    } catch (e) {
      console.warn("AudioManager.pause(loop) failed:", e);
    }
    this.loopingPlaying[name] = false;
  }

  pauseOneShotSounds(name) {
    if (this.activeClones[name] && this.activeClones[name].length > 0) {
      this.stopAllClones(name);
    }
  }

  stopAllClones(name) {
    this.activeClones[name].forEach((clone) => {
      this.stopClone(clone);
    });
    this.activeClones[name] = [];
  }

  stopClone(clone) {
    try {
      clone.pause();
      clone.currentTime = 0;
    } catch (e) {}
  }

  stopAll() {
    try {
      this.stopAllLoopingSounds();
      this.stopAllOneShotSounds();
    } catch (e) {
      console.warn("AudioManager.stopAll failed:", e);
    }
  }

  stopAllLoopingSounds() {
    Object.keys(this.sounds).forEach((name) => {
      const sound = this.sounds[name];
      if (!sound) return;

      if (sound.loop) {
        this.stopLoopingSound(sound, name);
      }
    });
  }

  stopAllOneShotSounds() {
    Object.keys(this.activeClones).forEach((name) => {
      this.pause(name);
    });
  }
}
