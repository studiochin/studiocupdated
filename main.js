const math = {
  lerp: (v0, v1, t) => {
    return v0 * (1 - t) + v1 * t;
  },
  norm: (value, min, max) => {
    return (value - min) / (max - min);
  },
};

const config = {
  height: window.innerHeight,
  width: window.innerWidth,
};

let isDone = false;

class SmoothScroll {
  constructor() {
    this.bindMethods();

    this.data = {
      ease: 0.1,
      current: 0,
      last: 0,
      rounded: 0,
    };

    this.dom = {
      el: document.querySelector("[data-scroll]"),
      content: document.querySelector("[data-scroll-content]"),
    };

    this.rAF = null;

    this.init();
  }

  bindMethods() {
    ["scroll", "run", "resize"].forEach(
      (fn) => (this[fn] = this[fn].bind(this))
    );
  }

  setStyles() {
    Object.assign(this.dom.el.style, {
      position: "fixed",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      overflow: "hidden",
    });
  }

  setHeight() {
    document.body.style.height = `${
      this.dom.content.getBoundingClientRect().height
    }px`;
  }

  resize() {
    this.setHeight();
    this.scroll();
  }

  preload() {
    this.setHeight();
    // imagesLoaded(this.dom.content, (instance) => {
    //     this.setHeight();
    // });
  }

  scroll() {
    this.data.current = window.scrollY;
  }

  run() {
    this.data.last += (this.data.current - this.data.last) * this.data.ease;
    this.data.rounded = Math.round(this.data.last * 100) / 100;

    const diff = this.data.current - this.data.rounded;
    const acc = diff / config.width;
    const velo = +acc;
    const skew = velo * 0.5;

    this.dom.content.style.transform = `translate3d(0, -${this.data.rounded}px, 0) skewY(${skew}deg)`;

    this.requestAnimationFrame();
  }

  on() {
    this.setStyles();
    this.setHeight();
    this.addEvents();
    this.requestAnimationFrame();
  }

  off() {
    this.cancelAnimationFrame();

    this.removeEvents();
  }

  requestAnimationFrame() {
    this.rAF = requestAnimationFrame(this.run);
  }

  cancelAnimationFrame() {
    cancelAnimationFrame(this.rAF);
  }

  destroy() {
    document.body.style.height = "";

    this.data = null;

    this.removeEvents();
    this.cancelAnimationFrame();
  }

  resize() {
    this.setHeight();
    this.data.rounded = this.data.last = this.data.current;
  }

  addEvents() {
    window.addEventListener("resize", this.resize, { passive: true });
    window.addEventListener("scroll", this.scroll, { passive: true });
  }

  removeEvents() {
    window.removeEventListener("resize", this.resize, { passive: true });
    window.removeEventListener("scroll", this.scroll, { passive: true });
  }

  init() {
    this.preload();
    this.on();
  }
}
class Parallax {
  constructor() {
    this.bindMethods();
    this.initParallaxControls();
    this.initEvents();
    this.requestAnimationFrame();
    this.initialLerpVal = math.lerp(window.scrollY, window.scrollY * 0.2, 2);

    isDone = true;
  }

  initParallaxControls() {
    this.parallaxControls = document.querySelectorAll(".parallax");
  }

  bindMethods() {
    ["scroll", "run"].forEach((fn) => (this[fn] = this[fn].bind(this)));
  }

  initEvents() {
    window.addEventListener("scroll", this.scroll, { passive: true });
  }

  requestAnimationFrame() {
    this.rAF = requestAnimationFrame(this.run);
  }

  run() {
    let scrollPosition = this.scrollPosition;
    let initialLerpVal = this.initialLerpVal;
    this.parallaxControls.forEach((el, ind) => {
      if (ind % 2 != 0) {
        let lerpVal = math.lerp(scrollPosition, scrollPosition * 0.2, 2) - initialLerpVal;
        el.style.backgroundPositionY = `${lerpVal}px`;
      } else {
        el.style.backgroundPositionY = `${math.lerp(
          scrollPosition,
          scrollPosition * 0.8,
          2
        )}px`;
      }
    });
    this.requestAnimationFrame();
  }

  scroll() {
    this.scrollPosition = window.scrollY;
  }
}
new Parallax();
new SmoothScroll();

if (isDone) {
  setInterval(async () => {
    document.querySelector(".loader-overlay").classList.add("opacity-0");
  }, 200);
  setInterval(async () => {
    document.querySelector(".loader-overlay").classList.add("d-none");
  }, 800);
  // remove the loader
}
