let Mobile = {
  canvas: null,
  world: null,
  activeTouches: {},
  threshold: 1023,

  init(canvas, world) {
    this.canvas = canvas;
    this.world = world;

    canvas.addEventListener("touchstart", (e) => this.onTouchStart(e), {
      passive: false,
    });
    canvas.addEventListener("touchmove", (e) => this.onTouchMove(e), {
      passive: false,
    });
    canvas.addEventListener("touchend", (e) => this.onTouchEnd(e), {
      passive: false,
    });
    canvas.addEventListener("touchcancel", (e) => this.onTouchEnd(e), {
      passive: false,
    });

    canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    window.addEventListener("mouseup", (e) => this.onMouseUp(e));

    console.log("✅ Mobile.init registered");
  },

  enabled() {
    return this.canvas && this.world && window.innerWidth <= this.threshold;
  },

  toCanvasPos(clientX, clientY) {
    let rect = this.canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * this.canvas.width,
      y: ((clientY - rect.top) / rect.height) * this.canvas.height,
    };
  },

  findButtonAt(x, y) {
    if (!this.world || !this.world.mobileButtons) return null;
    return this.world.mobileButtons.find(
      (btn) =>
        x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h
    );
  },

  checkUIButtonsAt(x, y) {
    if (window.soundButtonArea) {
      let s = window.soundButtonArea;
      if (x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height) {
        if (typeof toggleSound === "function") toggleSound();
        if (typeof drawStartScreen === "function") drawStartScreen();
        return true;
      }
    }

    if (window.startButtonArea) {
      let st = window.startButtonArea;
      if (
        x >= st.x &&
        x <= st.x + st.width &&
        y >= st.y &&
        y <= st.y + st.height
      ) {
        if (typeof init === "function") init();
        return true;
      }
    }

    if (window.helpButtonArea) {
      let h = window.helpButtonArea;
      if (x >= h.x && x <= h.x + h.width && y >= h.y && y <= h.y + h.height) {
        if (typeof showHelp === "function") showHelp();
        else {
          window.showHelpOverlay = true;
          if (typeof drawStartScreen === "function") drawStartScreen();
        }
        return true;
      }
    }

    if (window.world && window.world.restartButtonArea) {
      let r = window.world.restartButtonArea;
      if (x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height) {
        if (typeof restartGame === "function") restartGame();
        return true;
      }
    }

    if (window.world && window.world.homeButtonArea) {
      let ho = window.world.homeButtonArea;
      if (
        x >= ho.x &&
        x <= ho.x + ho.width &&
        y >= ho.y &&
        y <= ho.y + ho.height
      ) {
        location.reload();
        return true;
      }
    }

    if (window.helpCloseButtonArea) {
      let c = window.helpCloseButtonArea;
      if (x >= c.x && x <= c.x + c.width && y >= c.y && y <= c.y + c.height) {
        window.showHelpOverlay = false;
        if (typeof drawStartScreen === "function") drawStartScreen();
        return true;
      }
    }

    return false;
  },

  onTouchStart(e) {
    if (e.cancelable) e.preventDefault();
    if (!this.canvas) return;

    for (let t of e.changedTouches) {
      let pos = this.toCanvasPos(t.clientX, t.clientY);

      if (this.checkUIButtonsAt(pos.x, pos.y)) continue;

      if (this.world && this.enabled()) {
        let btn = this.findButtonAt(pos.x, pos.y);
        if (btn) {
          this.activeTouches[t.identifier] = btn.key;
          this.setKey(btn.key, true);
        }
      }
    }
    console.log("📱 Touch detected:", e.changedTouches.length);
  },

  onMouseDown(e) {
    if (!this.canvas) return;
    let pos = this.toCanvasPos(e.clientX, e.clientY);

    if (this.checkUIButtonsAt(pos.x, pos.y)) return;

    if (this.world && this.enabled()) {
      let btn = this.findButtonAt(pos.x, pos.y);
      if (btn) {
        this.activeTouches["mouse"] = btn.key;
        this.setKey(btn.key, true);
      }
    }
  },

  onTouchEnd(e) {
    if (e.cancelable) e.preventDefault();
    if (!this.enabled()) return;

    for (let t of e.changedTouches) {
      let prev = this.activeTouches[t.identifier];
      if (prev) {
        this.setKey(prev, false);
        delete this.activeTouches[t.identifier];
      }
    }
  },

  onMouseDown(e) {
    if (!this.canvas || !this.world) return;
    let pos = this.toCanvasPos(e.clientX, e.clientY);
    if (this.checkUIButtonsAt(pos.x, pos.y)) return;

    let btn = this.findButtonAt(pos.x, pos.y);
    if (btn) {
      this.activeTouches["mouse"] = btn.key;
      this.setKey(btn.key, true);
    }
  },

  onMouseUp(e) {
    if (this.activeTouches["mouse"]) {
      this.setKey(this.activeTouches["mouse"], false);
      delete this.activeTouches["mouse"];
    }
  },

  setKey(btnKey, pressed) {
    let mapping = {
      LEFT: ["A"],
      RIGHT: ["D"],
      JUMP: ["W"],
      THROW: ["SPACE"],
    };

    let kbGlobal = window.keyboard || null;
    let kbWorld = this.world?.keyboard || null;
    let keys = mapping[btnKey] || [btnKey];

    for (let key of keys) {
      if (kbGlobal && key in kbGlobal) kbGlobal[key] = pressed;
      if (kbWorld && key in kbWorld) kbWorld[key] = pressed;
    }
  },
};
