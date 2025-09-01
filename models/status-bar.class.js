class StatusBar extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png", // 0
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png", // 1
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png", // 2
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png", // 3
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png", // 4
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png", // 5
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 40;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  // setPercentage(50);
  setPercentage(percentage) {
    this.percentage = percentage; // Eine Zahl zwischen 0 und 5 Ermitteln
    let path = this.IMAGES[this.resolveImageIndex()]; // Pfad des Bildes anhand des Indexes
    this.img = this.imageCache[path]; // Aktuelles Bild austauschen
  }

  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
