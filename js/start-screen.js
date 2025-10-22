let startScreenImg = new Image();
let startScreenImgLoaded = false;

startScreenImg.src = "img/9_intro_outro_screens/start/startscreen_1.png";
startScreenImg.onload = function () {
  startScreenImgLoaded = true;
  if (typeof ctx !== "undefined") drawStartScreen();
};

function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (startScreenImgLoaded) {
    ctx.drawImage(startScreenImg, 0, 0, canvas.width, canvas.height);
    drawStartButton();
    drawSoundButton();
    drawHelpButton();
  }
}

function drawStartButton() {
  const btnWidth = 260;
  const btnHeight = 60;
  const btnX = canvas.width / 2 - btnWidth / 2;
  const btnY = 40;

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
  const btnWidth = 150;
  const btnHeight = 40;
  const x = 40;
  const y = canvas.height - 50;

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
  const btnWidth = 150;
  const btnHeight = 40;
  const helpX = 220;
  const helpY = canvas.height - 50;

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

  window.helpButtonArea = { x: helpX, y: helpY, width: btnWidth, height: btnHeight };
}
