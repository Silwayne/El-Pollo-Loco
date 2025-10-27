let Mobile = {
  canvas: null,
  world: null,
  activeTouches: {},
  threshold: 1023,

  init(canvas, world) {
    this.canvas = canvas;
    this.world = world;
    this.setupEventListeners();
  },

  setupEventListeners() {
    this.setupTouchEvents();
    this.setupMouseEvents();
  },

  setupTouchEvents() {
    const options = { passive: false };

    this.canvas.addEventListener(
      "touchstart",
      (e) => this.onTouchStart(e),
      options
    );
    this.canvas.addEventListener(
      "touchmove",
      (e) => this.onTouchMove(e),
      options
    );
    this.canvas.addEventListener(
      "touchend",
      (e) => this.onTouchEnd(e),
      options
    );
    this.canvas.addEventListener(
      "touchcancel",
      (e) => this.onTouchEnd(e),
      options
    );
  },

  setupMouseEvents() {
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    window.addEventListener("mouseup", (e) => this.onMouseUp(e));
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
    if (this.handleHelpCloseButton(x, y)) return true;
    if (this.handleStartScreenButtons(x, y)) return true;
    if (this.handleGameEndButtons(x, y)) return true;

    return false;
  },

  handleHelpCloseButton(x, y) {
    if (!window.helpCloseButtonArea || !window.showHelpOverlay) return false;

    const c = window.helpCloseButtonArea;
    if (this.isPointInArea(x, y, c)) {
      window.showHelpOverlay = false;
      if (typeof drawStartScreen === "function") drawStartScreen();
      return true;
    }
    return false;
  },

  handleStartScreenButtons(x, y) {
    if (!window.showStartScreen) return false;

    return (
      this.handleSoundButton(x, y) ||
      this.handleStartButton(x, y) ||
      this.handleHelpButton(x, y) ||
      this.handleLegalButton(x, y) ||
      this.handleImprintButton(x, y)
    );
  },

  handleSoundButton(x, y) {
    return this.handleGenericButton(x, y, "soundButtonArea", () => {
      if (typeof toggleSound === "function") toggleSound();
      if (typeof drawStartScreen === "function") drawStartScreen();
    });
  },

  handleStartButton(x, y) {
    return this.handleGenericButton(x, y, "startButtonArea", () => {
      if (typeof init === "function") init();
    });
  },

  handleHelpButton(x, y) {
    return this.handleGenericButton(x, y, "helpButtonArea", () => {
      if (typeof showHelp === "function") {
        showHelp();
      } else {
        window.showHelpOverlay = true;
        if (typeof drawStartScreen === "function") drawStartScreen();
      }
    });
  },

  handleLegalButton(x, y) {
    return this.handleGenericButton(x, y, "legalButtonArea", () => {
      window.location.href = "datenschutz.html";
    });
  },

  handleImprintButton(x, y) {
    return this.handleGenericButton(x, y, "imprintButtonArea", () => {
      window.location.href = "impressum.html";
    });
  },

  handleGenericButton(x, y, areaName, callback) {
    if (!window[areaName]) return false;

    const area = window[areaName];
    if (this.isPointInArea(x, y, area)) {
      callback();
      return true;
    }
    return false;
  },

  handleGameEndButtons(x, y) {
    return this.handleRestartButton(x, y) || this.handleHomeButton(x, y);
  },

  handleRestartButton(x, y) {
    if (!this.world || !this.world.restartButtonArea) return false;

    const r = this.world.restartButtonArea;
    if (this.isPointInArea(x, y, r)) {
      if (typeof restartGame === "function") restartGame();
      return true;
    }
    return false;
  },

  handleHomeButton(x, y) {
    if (!this.world || !this.world.homeButtonArea) return false;

    const ho = this.world.homeButtonArea;
    if (this.isPointInArea(x, y, ho)) {
      location.reload();
      return true;
    }
    return false;
  },

  isPointInArea(x, y, area) {
    return (
      x >= area.x &&
      x <= area.x + area.width &&
      y >= area.y &&
      y <= area.y + area.height
    );
  },

  onTouchStart(e) {
    if (e.cancelable) e.preventDefault();
    if (!this.canvas) return;

    for (let t of e.changedTouches) {
      const pos = this.toCanvasPos(t.clientX, t.clientY);

      if (this.checkUIButtonsAt(pos.x, pos.y)) continue;
      if (!this.world) continue;

      this.handleMobileButtonTouch(t.identifier, pos);
    }
  },

  handleMobileButtonTouch(touchId, pos) {
    const btn = this.findButtonAt(pos.x, pos.y);
    if (btn) {
      this.activeTouches[touchId] = btn.key;
      this.setKey(btn.key, true);
    }
  },

  // onTouchMove(e) {
  //   // Optional: Handle touch move if needed
  // },

  onTouchEnd(e) {
    if (e.cancelable) e.preventDefault();
    if (!this.enabled()) return;

    for (let t of e.changedTouches) {
      this.releaseTouch(t.identifier);
    }
  },

  releaseTouch(touchId) {
    let prev = this.activeTouches[touchId];
    if (prev) {
      this.setKey(prev, false);
      delete this.activeTouches[touchId];
    }
  },

  onMouseDown(e) {
    if (!this.canvas || !this.world) return;

    let pos = this.toCanvasPos(e.clientX, e.clientY);
    if (this.checkUIButtonsAt(pos.x, pos.y)) return;

    this.handleMobileButtonMouse(pos);
  },

  handleMobileButtonMouse(pos) {
    let btn = this.findButtonAt(pos.x, pos.y);
    if (btn) {
      this.activeTouches["mouse"] = btn.key;
      this.setKey(btn.key, true);
    }
  },

  onMouseUp(e) {
    this.releaseMouse();
  },

  releaseMouse() {
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
