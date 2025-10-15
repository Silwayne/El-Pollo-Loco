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
  }
}

function drawStartButton() {
  const btnWidth = 260;
  const btnHeight = 60;
  const btnX = canvas.width / 2 - btnWidth / 2;
  const btnY = 40;

  const isHover =
    mousePos.x >= btnX &&
    mousePos.x <= btnX + btnWidth &&
    mousePos.y >= btnY &&
    mousePos.y <= btnY + btnHeight;

  ctx.save();
  ctx.fillStyle = isHover ? "#754c24" : "#a0220a"; 
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
  const isHover =
    mousePos.x >= x &&
    mousePos.x <= x + btnWidth &&
    mousePos.y >= y &&
    mousePos.y <= y + btnHeight;
  ctx.save();
  ctx.fillStyle = isHover ? "rgba(200,60,10,0.95)" : "rgba(160,34,10,0.9)";
  ctx.fillRect(x, y, btnWidth, btnHeight);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    soundOn ? "Sound Off" : "Sound On",
    x + btnWidth / 2,
    y + btnHeight / 2
  );
  ctx.restore();
  window.soundButtonArea = { x, y, width: btnWidth, height: btnHeight };
}
