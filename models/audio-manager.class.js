class AudioManager {
  constructor() {
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
      win: new Audio(
        "audio/music/brass-fanfare-with-timpani-and-winchimes-reverberated.mp3"
      ),
      gameOver: new Audio("audio/music/game-over.mp3"),
    };

    this.sounds.background.loop = true;
    this.sounds.boss.loop = true;
    this.sounds.boss.volume = 1.0;
    this.activeClones = {};
    this.loopingPlaying = {};
  }

  play(name) {
    const sound = this.sounds[name];
    if (!sound) return;
    if (sound.loop) {
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
      return;
    }

    try {
      const clone = sound.cloneNode();
      clone.volume = sound.volume;
      if (!this.activeClones[name]) this.activeClones[name] = [];
      this.activeClones[name].push(clone);

      clone.addEventListener("ended", () => {
        const idx = this.activeClones[name].indexOf(clone);
        if (idx !== -1) this.activeClones[name].splice(idx, 1);
      });

      if (window.soundOn) {
        clone.play().catch(() => {});
      }
    } catch (e) {
      console.warn("AudioManager.play(clone) failed:", e);
    }
  }

  pause(name) {
    const orig = this.sounds[name];
    if (orig && orig.loop) {
      try {
        orig.pause();
        orig.currentTime = 0;
      } catch (e) {
        console.warn("AudioManager.pause(loop) failed:", e);
      }
      this.loopingPlaying[name] = false;
    }

    if (this.activeClones[name] && this.activeClones[name].length > 0) {
      this.activeClones[name].forEach((c) => {
        try {
          c.pause();
          c.currentTime = 0;
        } catch (e) {}
      });
      this.activeClones[name] = [];
    }
  }

  stopAll() {
    try {
      Object.keys(this.sounds).forEach((name) => {
        const s = this.sounds[name];
        if (!s) return;
        if (s.loop) {
          try {
            s.pause();
            s.currentTime = 0;
            this.loopingPlaying[name] = false;
          } catch (e) {}
        }
      });

      Object.keys(this.activeClones).forEach((name) => {
        this.pause(name);
      });
    } catch (e) {
      console.warn("AudioManager.stopAll failed:", e);
    }
  }
}
