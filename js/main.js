let mousePos = { x: 0, y: 0 };
let canvas;
let world;
let keyboard = new Keyboard();
window.soundOn = localStorage.getItem("soundOn") !== "false";

window.addEventListener("load", function () {
  initializeCanvas();
  setupMobileControls();
  setupMouseTracking();
  setupEventListeners();
  drawStartScreen();
});

function initializeCanvas() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
}

function setupMobileControls() {
  if (typeof Mobile !== "undefined") {
    Mobile.init(canvas, null);
  }
}

function setupMouseTracking() {
  canvas.addEventListener("mousemove", (e) => {
    updateMousePosition(e);
    updateCursorStyle();
  });
}

function updateMousePosition(e) {
  const rect = canvas.getBoundingClientRect();
  mousePos.x = e.clientX - rect.left;
  mousePos.y = e.clientY - rect.top;
}

function updateCursorStyle() {
  const hovering = isAnyButtonHovered();
  canvas.style.cursor = hovering ? "pointer" : "default";
}

function isAnyButtonHovered() {
  return (
    isHelpCloseButtonHovered() ||
    isStartScreenButtonHovered() ||
    isGameEndButtonHovered()
  );
}

function isHelpCloseButtonHovered() {
  if (!window.showHelpOverlay || !window.helpCloseButtonArea) return false;
  return isPointInArea(mousePos.x, mousePos.y, window.helpCloseButtonArea);
}

function isStartScreenButtonHovered() {
  if (!window.showStartScreen) return false;
  return (
    isButtonHovered("startButtonArea") ||
    isButtonHovered("soundButtonArea") ||
    isButtonHovered("helpButtonArea") ||
    isButtonHovered("legalButtonArea") ||
    isButtonHovered("imprintButtonArea")
  );
}

function isGameEndButtonHovered() {
  if (window.showStartScreen) return false;
  return (
    isWorldButtonHovered("restartButtonArea") ||
    isWorldButtonHovered("homeButtonArea")
  );
}

function isButtonHovered(areaName) {
  return (
    window[areaName] && isPointInArea(mousePos.x, mousePos.y, window[areaName])
  );
}

function isWorldButtonHovered(areaName) {
  return (
    world &&
    world[areaName] &&
    isPointInArea(mousePos.x, mousePos.y, world[areaName])
  );
}

function setupEventListeners() {
  canvas.addEventListener("click", handleCanvasClick);
}
