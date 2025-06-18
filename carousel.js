const config = { attributes: true };
const observer = new MutationObserver(mutationCallback);

/**
 * @param {MutationRecord[]} mutationsList
 */
function mutationCallback(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type !== "attributes") {
            continue;
        }
        // @ts-ignore
        changeSlide(mutation.target);
    }
};

/** @param {HTMLElement} carousel */
function changeSlide(carousel) {
    let slide = parseInt(carousel.dataset.slide);
    if (!isFinite(slide)) {
        slide = 0;
    }
    if (carousel.childElementCount == 0) {
        return;
    }
    if (slide < 0) {
        slide = 0;
    } else if (slide >= carousel.childElementCount) {
        slide = carousel.childElementCount - 1;
    }
    let i = 0;
    for (const element of carousel.children) {
        /** @ts-ignore @type {HTMLElement} */
        const e = element;
        if (!e.classList.contains("slide")) {
            continue;
        }
        if (i == slide) {
            e.classList.add("active");
        } else {
            e.classList.remove("active");
        }
        e.style.transform = `translateX(${(i - slide) * 100}%)`;
        i++;
    }
}

/**
 * @param {string} str 
 */
function parseBoolean(str) {
    str = String(str).toLowerCase().trim();
    return str === "true" || str === "" || (!isNaN(Number(str)) && Number(str) !== 0);
}

class Carousel {
    /**
     * @readonly
     * @type {HTMLElement}
     */
    carousel;
    /**
     * @type {number}
     */
    interval = 5000;
    /**
     * @type {number}
     */
    intervalAfterManual = 10000;
    /**
     * @type {number}
     */
    clock;
    /**
     * @param {HTMLElement} carousel
     */
    constructor(carousel) {
        this.carousel = carousel;
        changeSlide(this.carousel);
        /** @ts-ignore @type {HTMLButtonElement} */
        const prev = this.carousel.querySelector(".controller-prev")
        if (prev) {
            prev.addEventListener("click", this.prevSlide.bind(this));
        }
        /** @ts-ignore @type {HTMLButtonElement} */
        const next = this.carousel.querySelector(".controller-next")
        if (next) {
            next.addEventListener("click", this.nextSlide.bind(this))
        }
        observer.observe(this.carousel, config);
        this.updateInterval();
        this.clock = this.interval;
        window.setInterval(this.tick.bind(this), 200);
    };
    tick() {
        this.clock -= 200;
        if (this.clock <= 0) {
            this.autoSlide();
            this.updateInterval();
            this.clock = this.interval;
        }
    };
    prevSlide() {
        this.clock = this.intervalAfterManual;
        let slide = parseInt(this.carousel.dataset.slide);
        if (slide > 0) {
            slide--;
        }
        this.carousel.dataset.slide = slide.toString();
    };
    nextSlide() {
        this.clock = this.intervalAfterManual;
        let slide = parseInt(this.carousel.dataset.slide);
        const count_1 = this.carousel.querySelectorAll(".slide").length - 1;
        if (slide < count_1) {
            slide++;
        }
        this.carousel.dataset.slide = slide.toString();
    };
    autoSlide() {
        let slide = parseInt(this.carousel.dataset.slide);
        let direction = parseInt(this.carousel.dataset.direction);
        if (!isFinite(slide)) {
            slide = 0;
        }
        const oneWay = parseBoolean(this.carousel.dataset.oneway);
        const count_1 = this.carousel.querySelectorAll(".slide").length - 1;
        if (count_1 < 0) {
            return;
        }
        if (direction > 0) {
            if (slide < 0) {
                slide = 0;
            } else if (slide >= count_1) {
                if (oneWay) {
                    slide = 0;
                } else {
                    direction = -1;
                    slide--;
                }
            } else {
                slide++;
            }
        } else {
            if (slide > count_1) {
                slide = count_1;
            } else if (slide <= 0) {
                if (oneWay) {
                    slide = count_1;
                } else {
                    direction = 1;
                    slide++;
                }
            } else {
                slide--;
            }
        }
        slide = Math.min(Math.max(0, slide), count_1);
        this.carousel.dataset.slide = slide.toString();
        this.carousel.dataset.direction = direction.toString();
    };
    updateInterval() {
        const interval = parseInt(this.carousel.dataset.interval);
        if (interval > 0) {
            this.interval = interval;
        } else if (interval < 0) {
            this.interval = Infinity;
        }
        const intervalAfterManual = parseInt(this.carousel.dataset.intervalAfterManual);
        if (intervalAfterManual > 0) {
            this.intervalAfterManual = intervalAfterManual;
        } else if (interval < 0) {
            this.intervalAfterManual = Infinity;
        }
    }
}

/** @ts-ignore @type {HTMLElement[]} */
const carousels = document.querySelectorAll(".carousel");
for (const carousel of carousels) {
    new Carousel(carousel);
}