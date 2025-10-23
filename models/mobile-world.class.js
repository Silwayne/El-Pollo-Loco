World.prototype.setupMobileButtons = function () {
  const w = this.canvas.width;
  const h = this.canvas.height;
  const btnSize = Math.round(Math.min(80, h * 0.12));
  const margin = 20;
  const gap = 20;
  const totalHeight = btnSize * 2 + gap;
  const startY = (h - totalHeight) / 2;

  this.mobileButtons = [
    this.createMobileButton("LEFT", margin, startY, btnSize, "←"),
    this.createMobileButton("THROW", margin, startY + btnSize + gap, btnSize, "🧴"),
    this.createMobileButton("RIGHT", w - btnSize - margin, startY, btnSize, "→"),
    this.createMobileButton("JUMP", w - btnSize - margin, startY + btnSize + gap, btnSize, "⤒"),
  ];
};

World.prototype.createMobileButton = function (key, x, y, size, label) {
  return { key, x, y, w: size, h: size, label };
};

World.prototype.drawMobileButton = function (btn) {
  const ctx = this.ctx;
  ctx.save();
  ctx.globalAlpha = this.pressedButtons && this.pressedButtons[btn.key] ? 0.7 : 0.45;
  ctx.fillStyle = "#a0220a";
  ctx.beginPath();
  ctx.arc(btn.x + btn.w / 2, btn.y + btn.h / 2, btn.w / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  ctx.restore();
};

World.prototype.drawMobileControls = function () {
  if (!this.mobileButtons || this.mobileButtons.length === 0) this.setupMobileButtons();
  this.mobileButtons.forEach((btn) => this.drawMobileButton(btn));
};
