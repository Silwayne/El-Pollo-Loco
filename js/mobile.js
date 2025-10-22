// mobile.js - komplette Version (ersetze deine aktuelle mobile.js damit)

const Mobile = {
  canvas: null,
  world: null,
  activeTouches: {}, // touchId -> actionKey
  threshold: 768,

  init(canvas, world) {
    this.canvas = canvas;
    this.world = world;

    // register listeners (passive:false so preventDefault works)
    canvas.addEventListener("touchstart", (e) => this._onTouchStart(e), {
      passive: false,
    });
    canvas.addEventListener("touchmove", (e) => this._onTouchMove(e), {
      passive: false,
    });
    canvas.addEventListener("touchend", (e) => this._onTouchEnd(e), {
      passive: false,
    });
    canvas.addEventListener("touchcancel", (e) => this._onTouchEnd(e), {
      passive: false,
    });

    // mouse fallback for desktop testing
    canvas.addEventListener("mousedown", (e) => this._onMouseDown(e));
    window.addEventListener("mouseup", (e) => this._onMouseUp(e));

    console.log("Mobile.init registered");
  },

  // helper: enabled only if canvas & world exist and screen is small enough
  _enabled() {
    return this.canvas && this.world && window.innerWidth <= this.threshold;
  },

  _toCanvasPos(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * this.canvas.width,
      y: ((clientY - rect.top) / rect.height) * this.canvas.height,
    };
  },

  _findButtonAt(x, y) {
    if (!this.world || !this.world.mobileButtons) return null;
    return this.world.mobileButtons.find((btn) => {
      return (
        x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h
      );
    });
  },

  _onTouchStart(e) {
    if (e.cancelable) e.preventDefault();
    if (!this._enabled()) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const pos = this._toCanvasPos(t.clientX, t.clientY);
      const btn = this._findButtonAt(pos.x, pos.y);
      if (btn) {
        this.activeTouches[t.identifier] = btn.key;
        this._setKey(btn.key, true);
        console.log("touchstart ->", btn.key);
      }
    }
  },

  _onTouchMove(e) {
    if (e.cancelable) e.preventDefault();
    if (!this._enabled()) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const pos = this._toCanvasPos(t.clientX, t.clientY);
      const btn = this._findButtonAt(pos.x, pos.y);
      const prev = this.activeTouches[t.identifier];
      if (btn && prev !== btn.key) {
        if (prev) this._setKey(prev, false);
        this.activeTouches[t.identifier] = btn.key;
        this._setKey(btn.key, true);
        console.log("touchmove enter ->", btn.key);
      } else if (!btn && prev) {
        this._setKey(prev, false);
        delete this.activeTouches[t.identifier];
        console.log("touchmove leave ->", prev);
      }
    }
  },

  _onTouchEnd(e) {
    if (e.cancelable) e.preventDefault();
    if (!this._enabled()) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const prev = this.activeTouches[t.identifier];
      if (prev) {
        this._setKey(prev, false);
        delete this.activeTouches[t.identifier];
        console.log("touchend ->", prev);
      }
    }
  },

  _onMouseDown(e) {
    if (!this._enabled()) return;
    const pos = this._toCanvasPos(e.clientX, e.clientY);
    const btn = this._findButtonAt(pos.x, pos.y);
    if (btn) {
      this.activeTouches["mouse"] = btn.key;
      this._setKey(btn.key, true);
      console.log("mousedown ->", btn.key);
    }
  },

  _onMouseUp(e) {
    if (!this._enabled()) return;
    if (this.activeTouches["mouse"]) {
      this._setKey(this.activeTouches["mouse"], false);
      delete this.activeTouches["mouse"];
      console.log("mouseup -> released");
    }
  },

  /**
   * _setKey: setzt alle relevanten keyboard-Properties sowohl auf dem
   * globalen keyboard-Objekt als auch auf world.keyboard (falls vorhanden).
   * Dadurch decken wir verschiedene Namenskonventionen ab (W/A/D/SPACE vs LEFT/RIGHT/UP).
   */
  _setKey(btnKey, pressed) {
    function trySet(obj, prop, val) {
      if (!obj) return;
      if (prop in obj) obj[prop] = val;
    }

    const kbGlobal = window.keyboard || null;
    const kbWorld =
      this.world && this.world.keyboard ? this.world.keyboard : null;

    const mapping = {
      LEFT: ["A", "LEFT"],
      RIGHT: ["D", "RIGHT"],
      JUMP: ["W", "UP"],
      THROW: ["SPACE"], // passe ggf. an (E oder SPACE)
    };

    let candidates = mapping[btnKey] || [btnKey];

    candidates.forEach((p) => {
      trySet(kbGlobal, p, pressed);
      trySet(kbWorld, p, pressed);
    });

    // UI pressed state (für Button-Opazität)
    if (this.world) {
      this.world.pressedButtons = this.world.pressedButtons || {};
      this.world.pressedButtons[btnKey] = pressed;
    }
  },
};
