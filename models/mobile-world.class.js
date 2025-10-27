World.prototype.setupMobileButtons = function () {
  const { w, h } = this.getCanvasDimensions();
  const btnSize = this.calculateButtonSize(h);
  const buttonConfigs = this.getButtonConfigs(w, h, btnSize);

  this.createMobileButtons(buttonConfigs);
};

World.prototype.getCanvasDimensions = function () {
  return {
    w: this.canvas.width,
    h: this.canvas.height,
  };
};

World.prototype.calculateButtonSize = function (canvasHeight) {
  return Math.round(Math.min(80, canvasHeight * 0.12));
};

World.prototype.getButtonConfigs = function (
  canvasWidth,
  canvasHeight,
  btnSize
) {
  const margin = 20;
  const gap = 20;
  const totalHeight = btnSize * 2 + gap;
  const startY = (canvasHeight - totalHeight) / 2;

  return [
    { key: "LEFT", x: margin, y: startY, size: btnSize, label: "←" },
    {
      key: "THROW",
      x: margin,
      y: startY + btnSize + gap,
      size: btnSize,
      label: "🧴",
    },
    {
      key: "RIGHT",
      x: canvasWidth - btnSize - margin,
      y: startY,
      size: btnSize,
      label: "→",
    },
    {
      key: "JUMP",
      x: canvasWidth - btnSize - margin,
      y: startY + btnSize + gap,
      size: btnSize,
      label: "⤒",
    },
  ];
};

World.prototype.createMobileButtons = function (buttonConfigs) {
  this.mobileButtons = buttonConfigs.map((config) =>
    this.createMobileButton(
      config.key,
      config.x,
      config.y,
      config.size,
      config.label
    )
  );
};

World.prototype.createMobileButton = function (key, x, y, size, label) {
  return {
    key,
    x,
    y,
    w: size,
    h: size,
    label,
  };
};

World.prototype.drawMobileButton = function (btn) {
  const ctx = this.ctx;
  ctx.save();
  this.drawButtonBackground(ctx, btn);
  this.drawButtonLabel(ctx, btn);
  ctx.restore();
};

World.prototype.drawButtonBackground = function (ctx, btn) {
  const opacity = this.getButtonOpacity(btn);
  const centerX = btn.x + btn.w / 2;
  const centerY = btn.y + btn.h / 2;
  const radius = btn.w / 2;

  ctx.globalAlpha = opacity;
  ctx.fillStyle = "#a0220a";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
};

World.prototype.getButtonOpacity = function (btn) {
  return this.pressedButtons && this.pressedButtons[btn.key] ? 0.7 : 0.45;
};

World.prototype.drawButtonLabel = function (ctx, btn) {
  const centerX = btn.x + btn.w / 2;
  const centerY = btn.y + btn.h / 2;

  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(btn.label, centerX, centerY);
};

World.prototype.drawMobileControls = function () {
  this.ensureButtonsExist();
  this.drawAllButtons();
};

World.prototype.ensureButtonsExist = function () {
  if (!this.mobileButtons || this.mobileButtons.length === 0) {
    this.setupMobileButtons();
  }
};

World.prototype.drawAllButtons = function () {
  this.mobileButtons.forEach((btn) => {
    this.drawMobileButton(btn);
  });
};
