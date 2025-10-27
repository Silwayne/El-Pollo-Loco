function handleCanvasClick(e) {
  if (!canvas) return;

  const clickPos = getClickPosition(e);

  if (handleHelpOverlayClick(clickPos)) return;
  if (handleStartScreenClick(clickPos)) return;
  if (handleGameEndClick(clickPos)) return;
}

function getClickPosition(e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function handleHelpOverlayClick(clickPos) {
  if (!window.showHelpOverlay) return false;

  if (isHelpCloseButtonClicked(clickPos)) {
    closeHelpOverlay();
    return true;
  }

  return window.showHelpOverlay;
}

function isHelpCloseButtonClicked(clickPos) {
  return (
    window.helpCloseButtonArea &&
    isPointInArea(clickPos.x, clickPos.y, window.helpCloseButtonArea)
  );
}

function closeHelpOverlay() {
  window.showHelpOverlay = false;
  if (typeof drawStartScreen === "function") drawStartScreen();
}

function handleStartScreenClick(clickPos) {
  if (!window.showStartScreen) return false;

  return (
    handleSoundButtonClick(clickPos) ||
    handleStartButtonClick(clickPos) ||
    handleHelpButtonClick(clickPos) ||
    handleLegalButtonClick(clickPos) ||
    handleImprintButtonClick(clickPos)
  );
}

function handleSoundButtonClick(clickPos) {
  return handleGenericButtonClick(clickPos, "soundButtonArea", () => {
    toggleSound();
    if (typeof drawStartScreen === "function") drawStartScreen();
  });
}

function handleStartButtonClick(clickPos) {
  return handleGenericButtonClick(clickPos, "startButtonArea", () => {
    init();
  });
}

function handleHelpButtonClick(clickPos) {
  return handleGenericButtonClick(clickPos, "helpButtonArea", () => {
    showHelp();
  });
}

function handleLegalButtonClick(clickPos) {
  return handleGenericButtonClick(clickPos, "legalButtonArea", () => {
    window.location.href = "./datenschutz.html";
  });
}

function handleImprintButtonClick(clickPos) {
  return handleGenericButtonClick(clickPos, "imprintButtonArea", () => {
    window.location.href = "./impressum.html";
  });
}

function handleGenericButtonClick(clickPos, areaName, callback) {
  if (!window[areaName]) return false;

  if (isPointInArea(clickPos.x, clickPos.y, window[areaName])) {
    callback();
    return true;
  }
  return false;
}

function handleGameEndClick(clickPos) {
  return handleRestartButtonClick(clickPos) || handleHomeButtonClick(clickPos);
}

function handleRestartButtonClick(clickPos) {
  return handleWorldButtonClick(clickPos, "restartButtonArea", () => {
    restartGame();
  });
}

function handleHomeButtonClick(clickPos) {
  return handleWorldButtonClick(clickPos, "homeButtonArea", () => {
    location.reload();
  });
}

function handleWorldButtonClick(clickPos, areaName, callback) {
  if (!world || !world[areaName]) return false;

  if (isPointInArea(clickPos.x, clickPos.y, world[areaName])) {
    callback();
    return true;
  }
  return false;
}

function isPointInArea(x, y, area) {
  return (
    x >= area.x &&
    x <= area.x + area.width &&
    y >= area.y &&
    y <= area.y + area.height
  );
}
