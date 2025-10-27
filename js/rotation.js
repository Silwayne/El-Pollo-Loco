/**
 * Checks device orientation and displays rotation overlay on mobile devices
 * in portrait mode to prompt users to rotate to landscape for better experience
 * @returns {void}
 */
function checkOrientation() {
  const overlay = document.getElementById("rotate-overlay");
  const isMobile =
    /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Macintosh") && "ontouchend" in document);

  if (isMobile && window.innerHeight > window.innerWidth) {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}

// Set up orientation change listeners
window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);