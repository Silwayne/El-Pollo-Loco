let startScreenImg = new Image();
let startScreenImgLoaded = false;

startScreenImg.src = "img/9_intro_outro_screens/start/startscreen_1.png";
startScreenImg.onload = function () {
  startScreenImgLoaded = true;
  if (typeof ctx !== "undefined") drawStartScreen();
};

function drawStartScreen() {
  window.showStartScreen = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (startScreenImgLoaded) {
    this.drawBackgroundImage();
    this.drawAllButtons();
    this.drawHelpOverlay();
  }
}

function drawBackgroundImage() {
  ctx.drawImage(startScreenImg, 0, 0, canvas.width, canvas.height);
}

function drawAllButtons() {
  drawStartButton();
  drawSoundButton();
  drawHelpButton();
  drawLegalButton();
  drawImprintButton();
}

function drawStartButton() {
  const buttonConfig = getButtonConfig(260, 60, 40);
  drawButton(buttonConfig, "Start game");
  setButtonArea("startButtonArea", buttonConfig);
}

function drawSoundButton() {
  const buttonConfig = getBottomButtonConfig(0);
  const label = soundOn ? "Sound OFF" : "Sound ON";
  drawButton(buttonConfig, label);
  setButtonArea("soundButtonArea", buttonConfig);
}

function drawHelpButton() {
  const buttonConfig = getBottomButtonConfig(1);
  drawButton(buttonConfig, "Help");
  setButtonArea("helpButtonArea", buttonConfig);
}

function drawLegalButton() {
  const buttonConfig = getBottomButtonConfig(2);
  drawButton(buttonConfig, "Legal");
  setButtonArea("legalButtonArea", buttonConfig);
}

function drawImprintButton() {
  const buttonConfig = getBottomButtonConfig(3);
  drawButton(buttonConfig, "Imprint");
  setButtonArea("imprintButtonArea", buttonConfig);
}

function getButtonConfig(width, height, yOffset) {
  return {
    x: canvas.width / 2 - width / 2,
    y: yOffset,
    width: width,
    height: height,
  };
}

function getBottomButtonConfig(index) {
  const btnWidth = 150;
  const btnHeight = 40;
  const x = 15 + index * 180;
  const y = canvas.height - 50;

  return { x, y, width: btnWidth, height: btnHeight };
}

function drawButton(config, label) {
  ctx.save();
  drawButtonBackground(config);
  drawButtonBorder(config);
  drawButtonText(config, label);
  ctx.restore();
}

function drawButtonBackground(config) {
  ctx.fillStyle = "#a0220a";
  ctx.fillRect(config.x, config.y, config.width, config.height);
}

function drawButtonBorder(config) {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.strokeRect(config.x, config.y, config.width, config.height);
}

function drawButtonText(config, label) {
  const centerX = config.x + config.width / 2;
  const centerY = config.y + config.height / 2;
  const fontSize = config.width > 200 ? "bold 32px" : "20px";

  ctx.fillStyle = "#fff";
  ctx.font = `${fontSize} Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, centerX, centerY);
}

function setButtonArea(areaName, config) {
  window[areaName] = {
    x: config.x,
    y: config.y,
    width: config.width,
    height: config.height,
  };
}

function showHelp() {
  window.showHelpOverlay = true;
  if (typeof drawStartScreen === "function") drawStartScreen();
}

function drawHelpOverlay() {
  if (!window.showHelpOverlay) return;

  const overlayConfig = getOverlayConfig();
  drawOverlayBackground(overlayConfig);
  drawHelpContent(overlayConfig);
  drawCloseButton(overlayConfig);
}

function getOverlayConfig() {
  const margin = 40;
  return {
    x: margin,
    y: margin,
    width: canvas.width - margin * 2,
    height: canvas.height - margin * 2,
  };
}

function drawOverlayBackground(config) {
  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = "#111";
  ctx.fillRect(config.x, config.y, config.width, config.height);
  ctx.globalAlpha = 1;
}

function drawHelpContent(config) {
  this.drawHelpTitle(config);
  this.drawHelpInstructions(config);
}

function drawHelpTitle(config) {
  ctx.fillStyle = "#fff";
  ctx.font = "bold 36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Spielanleitung / Cómo jugar", canvas.width / 2, config.y + 50);
}

function drawHelpInstructions(config) {
  const instructions = getHelpInstructions();
  const colWidth = config.width / 3;
  const baseY = config.y + 110;

  drawGermanInstructions(instructions.german, config.x, baseY);
  drawSpanishInstructions(instructions.spanish, config.x, colWidth, baseY);
}

function getHelpInstructions() {
  return {
    german: [
      "Steuerung:",
      "• Links bewegen: A",
      "• Rechts bewegen: D",
      "• Springen: W",
      "• Flasche werfen: E",
      "",
      "Tippe 'Schließen' um zurückzukehren.",
    ],
    spanish: [
      "Controles:",
      "• Mover a la izquierda: A",
      "• Mover a la derecha: D",
      "• Saltar: W",
      "• Lanzar botella: E",
      "",
      "Toca 'Cerrar' para volver.",
    ],
  };
}

function drawGermanInstructions(lines, x, baseY) {
  ctx.font = "18px Arial";
  ctx.textAlign = "left";
  ctx.fillStyle = "#fff";

  let currentY = baseY;
  for (let line of lines) {
    ctx.fillText(line, x + 30, currentY);
    currentY += 28;
  }
}

function drawSpanishInstructions(lines, x, colWidth, baseY) {
  ctx.font = "18px Arial";
  ctx.textAlign = "left";
  ctx.fillStyle = "#fff";

  let currentY = baseY;
  for (let line of lines) {
    ctx.fillText(line, x + colWidth * 2, currentY);
    currentY += 28;
  }
}

function drawCloseButton(overlayConfig) {
  const buttonConfig = getCloseButtonConfig(overlayConfig);
  drawButton(buttonConfig, "Schließen / Cerrar");
  setButtonArea("helpCloseButtonArea", buttonConfig);
  ctx.restore(); // Close the save from drawOverlayBackground
}

function getCloseButtonConfig(overlayConfig) {
  const btnWidth = 180;
  const btnHeight = 48;
  const btnX = canvas.width / 2 - btnWidth / 2;
  const btnY = overlayConfig.y + overlayConfig.height - 80;

  return { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
}
