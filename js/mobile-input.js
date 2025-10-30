/**
 * Mobile touch and mouse input handler for game controls
 * Provides unified input handling for both touch devices and desktop
 * @namespace Mobile
 */
let Mobile = {
  /** @type {HTMLCanvasElement} */
  canvas: null,

  /** @type {World} */
  world: null,

  /**
   * Active touch points and their associated button keys
   * @type {Object<number|string, string>}
   */
  activeTouches: {},

  /**
   * Maximum screen width threshold for mobile controls (1023px)
   * @type {number}
   */
  threshold: 1023,

  /**
   * Initializes the mobile controller with canvas and world reference
   * @param {HTMLCanvasElement} canvas - The game canvas element
   * @param {World} world - The game world instance
   * @returns {void}
   */
  init(canvas, world) {
    this.canvas = canvas;
    this.world = world;
    this.setupEventListeners();
  },

  /**
   * Sets up all input event listeners (touch and mouse)
   * @returns {void}
   */
  setupEventListeners() {
    this.setupTouchEvents();
    this.setupMouseEvents();
  },

  /**
   * Sets up touch event listeners for mobile devices
   * Uses passive: false to allow preventDefault() for better scrolling control
   * @returns {void}
   */
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

  /**
   * Sets up mouse event listeners for desktop devices
   * Uses window for mouseup to capture release outside canvas
   * @returns {void}
   */
  setupMouseEvents() {
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    window.addEventListener("mouseup", (e) => this.onMouseUp(e));
  },

  /**
   * Checks if mobile controls should be active
   * Requires canvas, world, and screen width below threshold
   * @returns {boolean} True if mobile controls should be enabled
   */
  enabled() {
    return this.canvas && this.world && window.innerWidth <= this.threshold;
  },

  /**
   * Converts client coordinates to canvas-relative coordinates
   * Accounts for canvas scaling and positioning
   * @param {number} clientX - Client X coordinate
   * @param {number} clientY - Client Y coordinate
   * @returns {{x: number, y: number}} Canvas-relative coordinates
   */
  toCanvasPos(clientX, clientY) {
    let rect = this.canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * this.canvas.width,
      y: ((clientY - rect.top) / rect.height) * this.canvas.height,
    };
  },

  /**
   * Finds a mobile button at the given canvas coordinates
   * @param {number} x - Canvas X coordinate
   * @param {number} y - Canvas Y coordinate
   * @returns {Object|null} Button object or null if no button found
   */
  findButtonAt(x, y) {
    if (!this.world || !this.world.mobileButtons) return null;

    return this.world.mobileButtons.find(
      (btn) =>
        x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h
    );
  },

  /**
   * Checks if a point is within a rectangular area
   * @param {number} x - X coordinate of the point
   * @param {number} y - Y coordinate of the point
   * @param {{x: number, y: number, width: number, height: number}} area - The area to check against
   * @returns {boolean} True if point is within the area
   */
  isPointInArea(x, y, area) {
    return (
      x >= area.x &&
      x <= area.x + area.width &&
      y >= area.y &&
      y <= area.y + area.height
    );
  },

  /**
   * Handles touch start events
   * Processes multiple touches and checks for UI interactions
   * @param {TouchEvent} e - Touch event object
   * @returns {void}
   */
  onTouchStart(e) {
    if (e.cancelable) e.preventDefault();
    if (!this.canvas) return;

    for (let t of e.changedTouches) {
      const pos = this.toCanvasPos(t.clientX, t.clientY);

      if (MobileUI.checkUIButtonsAt(pos.x, pos.y)) continue;
      if (!this.world) continue;

      this.handleMobileButtonTouch(t.identifier, pos);
    }
  },

  /**
   * Handles mobile game button touches
   * @param {number} touchId - Unique identifier for the touch
   * @param {{x: number, y: number}} pos - Canvas coordinates of the touch
   * @returns {void}
   */
  handleMobileButtonTouch(touchId, pos) {
    const btn = this.findButtonAt(pos.x, pos.y);
    if (btn) {
      this.activeTouches[touchId] = btn.key;
      this.setKey(btn.key, true);
    }
  },

  /**
   * Handles touch end and cancel events
   * Releases associated button keys
   * @param {TouchEvent} e - Touch event object
   * @returns {void}
   */
  onTouchEnd(e) {
    if (e.cancelable) e.preventDefault();
    if (!this.enabled()) return;

    for (let t of e.changedTouches) {
      this.releaseTouch(t.identifier);
    }
  },

  /**
   * Releases a specific touch and its associated button key
   * @param {number} touchId - Unique identifier for the touch to release
   * @returns {void}
   */
  releaseTouch(touchId) {
    let prev = this.activeTouches[touchId];
    if (prev) {
      this.setKey(prev, false);
      delete this.activeTouches[touchId];
    }
  },

  /**
   * Handles mouse down events for desktop controls
   * @param {MouseEvent} e - Mouse event object
   * @returns {void}
   */
  onMouseDown(e) {
    if (!this.canvas || !this.world) return;

    let pos = this.toCanvasPos(e.clientX, e.clientY);
    if (MobileUI.checkUIButtonsAt(pos.x, pos.y)) return;

    this.handleMobileButtonMouse(pos);
  },

  /**
   * Handles mobile game button mouse clicks
   * @param {{x: number, y: number}} pos - Canvas coordinates of the mouse click
   * @returns {void}
   */
  handleMobileButtonMouse(pos) {
    let btn = this.findButtonAt(pos.x, pos.y);
    if (btn) {
      this.activeTouches["mouse"] = btn.key;
      this.setKey(btn.key, true);
    }
  },

  /**
   * Handles mouse up events for desktop controls
   * @param {MouseEvent} e - Mouse event object
   * @returns {void}
   */
  onMouseUp(e) {
    this.releaseMouse();
  },

  /**
   * Releases the mouse button and its associated key
   * @returns {void}
   */
  releaseMouse() {
    if (this.activeTouches["mouse"]) {
      this.setKey(this.activeTouches["mouse"], false);
      delete this.activeTouches["mouse"];
    }
  },

  /**
   * Sets keyboard state based on mobile button interactions
   * Maps mobile button keys to keyboard keys for unified input handling
   * @param {string} btnKey - Mobile button key (LEFT, RIGHT, JUMP, THROW)
   * @param {boolean} pressed - Whether the key is pressed or released
   * @returns {void}
   */
  setKey(btnKey, pressed) {
    let mapping = {
      LEFT: ["A"],
      RIGHT: ["D"],
      JUMP: ["W"],
      THROW: ["E"],
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
