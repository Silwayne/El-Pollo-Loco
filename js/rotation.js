/**
 * Checks device orientation and displays rotation overlay on mobile devices
 * in portrait mode to prompt users to rotate to landscape for better experience
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("rotate-overlay");

  if (!overlay) return;

  const landscapeQuery = window.matchMedia("(orientation: landscape)");

  const updateOverlay = () => {
    if (landscapeQuery.matches) {
      overlay.style.display = "none";
    } else {
      overlay.style.display = "flex";
    }
  };

  landscapeQuery.addEventListener("change", updateOverlay);

  updateOverlay();
});
