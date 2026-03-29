class Carousel {
  constructor(carouselElement, isReverse = false) {
    this.carousel = carouselElement;
    this.track = carouselElement.querySelector(".track");
    this.isReverse = isReverse;
    this.isHovering = false;
    this.animationId = null;
    this.position = 0;
    this.speed = 0.5;
    this.hoverSpeed = 0.35;
    this.currentSpeed = this.speed;
    this.trackWidth = 0;
    this.contentWidth = 0;
    this.isReady = false;
    this.dimensionRetries = 0;
    this.maxRetries = 50;

    this.init();
  }

  init() {
    this.carousel.addEventListener("mouseenter", () => this.onHover(true));
    this.carousel.addEventListener("mouseleave", () => this.onHover(false));
    this.tryStart();
  }

  tryStart() {
    setTimeout(() => {
      this.updateDimensions();
      if (this.contentWidth <= 0 && this.dimensionRetries < this.maxRetries) {
        this.dimensionRetries++;
        console.log(
          "Retrying dimension calculation... attempt",
          this.dimensionRetries,
        );
        this.tryStart();
      } else {
        this.isReady = true;
        console.log(
          "Carousel ready! Starting animation with contentWidth:",
          this.contentWidth,
        );
        this.animate();
        window.addEventListener("resize", () => this.updateDimensions());
      }
    }, 100);
  }

  updateDimensions() {
    this.track.style.transform = "translateX(0px)";

    this.track.offsetHeight;
    let width = this.track.scrollWidth;

    if (width <= 0) {
      width = this.track.offsetWidth;
    }

    if (width <= 0) {
      const rect = this.track.getBoundingClientRect();
      width = rect.width;
    }

    this.trackWidth = width;
    this.contentWidth = this.trackWidth > 0 ? this.trackWidth / 2 : 0;

    console.log(
      "Dimensions - Track:",
      this.trackWidth,
      "Content:",
      this.contentWidth,
    );
  }

  onHover(isHovering) {
    this.isHovering = isHovering;
    this.currentSpeed = isHovering ? this.hoverSpeed : this.speed;
  }

  animate() {
    if (this.isReverse) {
      this.position -= this.currentSpeed;
      if (this.contentWidth > 0 && this.position <= -this.contentWidth) {
        this.position = 0;
      }
    } else {
      this.position += this.currentSpeed;
      if (this.contentWidth > 0 && this.position >= this.contentWidth) {
        this.position = 0;
      }
    }

    this.track.style.transform = `translateX(${this.position}px)`;

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel");
  console.log("Found", carousels.length, "carousels");

  carousels.forEach((carousel, index) => {
    const isReverse = carousel.closest(".skills") !== null;
    console.log("Setting up carousel", index, "reverse:", isReverse);
    new Carousel(carousel, isReverse);
  });
});
