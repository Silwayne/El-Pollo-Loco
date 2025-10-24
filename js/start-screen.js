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
    ctx.drawImage(startScreenImg, 0, 0, canvas.width, canvas.height);
    drawStartButton();
    drawSoundButton();
    drawHelpButton();
    drawLegalButton();
    drawImprintButton();
    drawHelpOverlay();
  }
}

function drawStartButton() {
  let btnWidth = 260;
  let btnHeight = 60;
  let btnX = canvas.width / 2 - btnWidth / 2;
  let btnY = 40;

  ctx.save();
  ctx.fillStyle = "#a0220a";
  ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Start game", btnX + btnWidth / 2, btnY + btnHeight / 2);
  ctx.restore();

  window.startButtonArea = {
    x: btnX,
    y: btnY,
    width: btnWidth,
    height: btnHeight,
  };
}

function drawSoundButton() {
  let btnWidth = 150;
  let btnHeight = 40;
  let x = 15;
  let y = canvas.height - 50;

  ctx.save();
  ctx.fillStyle = "#a0220a";
  ctx.fillRect(x, y, btnWidth, btnHeight);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, btnWidth, btnHeight);
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    soundOn ? "Sound OFF" : "Sound ON",
    x + btnWidth / 2,
    y + btnHeight / 2
  );
  ctx.restore();

  window.soundButtonArea = { x, y, width: btnWidth, height: btnHeight };
}

function drawHelpButton() {
  let btnWidth = 150;
  let btnHeight = 40;
  let helpX = 195;
  let helpY = canvas.height - 50;

  ctx.save();
  ctx.fillStyle = "#a0220a";
  ctx.fillRect(helpX, helpY, btnWidth, btnHeight);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.strokeRect(helpX, helpY, btnWidth, btnHeight);
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Help", helpX + btnWidth / 2, helpY + btnHeight / 2);
  ctx.restore();

  window.helpButtonArea = {
    x: helpX,
    y: helpY,
    width: btnWidth,
    height: btnHeight,
  };
}

function drawLegalButton() {
  const btnWidth = 150;
  const btnHeight = 40;
  const legalX = 375;
  const legalY = canvas.height - 50;

  ctx.save();
  ctx.fillStyle = "#a0220a";
  ctx.fillRect(legalX, legalY, btnWidth, btnHeight);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.strokeRect(legalX, legalY, btnWidth, btnHeight);
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Legal", legalX + btnWidth / 2, legalY + btnHeight / 2);
  ctx.restore();

  window.legalButtonArea = {
    x: legalX,
    y: legalY,
    width: btnWidth,
    height: btnHeight,
  };
}

function drawImprintButton() {
  const btnWidth = 150;
  const btnHeight = 40;
  const imprintX = 555;
  const imprintY = canvas.height - 50;

  ctx.save();
  ctx.fillStyle = "#a0220a";
  ctx.fillRect(imprintX, imprintY, btnWidth, btnHeight);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.strokeRect(imprintX, imprintY, btnWidth, btnHeight);
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Imprint", imprintX + btnWidth / 2, imprintY + btnHeight / 2);
  ctx.restore();

  window.imprintButtonArea = {
    x: imprintX,
    y: imprintY,
    width: btnWidth,
    height: btnHeight,
  };
}

function showHelp() {
  window.showHelpOverlay = true;
  if (typeof drawStartScreen === "function") drawStartScreen();
}

function drawHelpOverlay() {
  if (!window.showHelpOverlay) return;
  let margin = 40;
  let x = margin;
  let y = margin;
  let w = canvas.width - margin * 2;
  let h = canvas.height - margin * 2;

  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = "#111";
  ctx.fillRect(x, y, w, h);
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#fff";
  ctx.font = "bold 36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Spielanleitung / Cómo jugar", canvas.width / 2, y + 50);

  ctx.font = "18px Arial";
  ctx.textAlign = "left";

  let de = [
    "Steuerung:",
    "• Links bewegen: A",
    "• Rechts bewegen: D",
    "• Springen: W",
    "• Flasche werfen: SPACE",
    "",
    "Tippe 'Schließen' um zurückzukehren.",
  ];

  let es = [
    "Controles:",
    "• Mover a la izquierda: A",
    "• Mover a la derecha: D",
    "• Saltar: W",
    "• Lanzar botella: SPACE",
    "",
    "Toca 'Cerrar' para volver.",
  ];

  let colWidth = w / 3;
  let baseY = y + 110;

  let ty = baseY;
  for (let line of de) {
    ctx.fillText(line, x + 30, ty);
    ty += 28;
  }

  ty = baseY;
  for (let line of es) {
    ctx.fillText(line, x + colWidth * 2 + 0, ty);
    ty += 28;
  }

  let btnW = 180;
  let btnH = 48;
  let btnX = canvas.width / 2 - btnW / 2;
  let btnY = y + h - 80;

  ctx.fillStyle = "#a0220a";
  ctx.fillRect(btnX, btnY, btnW, btnH);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.strokeRect(btnX, btnY, btnW, btnH);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 20px Arial";
  ctx.fillText("Schließen / Cerrar", btnX + btnW / 2, btnY + btnH / 2);

  window.helpCloseButtonArea = { x: btnX, y: btnY, width: btnW, height: btnH };

  ctx.restore();
}
