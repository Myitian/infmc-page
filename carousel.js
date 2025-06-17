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

class Carousel {
    /**
     * @readonly
     * @type {HTMLElement}
     */
    carousel;
    /**
     * @type {number}
     */
    clock = 5000;
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
        window.setInterval(this.tick.bind(this), 200);
    };
    tick() {
        this.clock -= 200;
        if (this.clock <= 0) {
            this.autoSlide();
            this.clock = 5000;
        }
    };
    prevSlide() {
        this.clock = 10000;
        let slide = parseInt(this.carousel.dataset.slide);
        if (slide > 0) {
            slide--;
        }
        this.carousel.dataset.slide = slide.toString();
    };
    nextSlide() {
        this.clock = 10000;
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
        const count_1 = this.carousel.querySelectorAll(".slide").length - 1;
        if (count_1 < 0) {
            return;
        }
        if (direction > 0) {
            if (slide < 0) {
                slide = 0;
            } else if (slide >= count_1) {
                direction = -1;
                slide--;
            } else {
                slide++;
            }
        } else {
            if (slide > count_1) {
                slide = count_1;
            } else if (slide <= 0) {
                direction = 1;
                slide++;
            } else {
                slide--;
            }
        }
        slide = Math.min(Math.max(0, slide), count_1);
        this.carousel.dataset.slide = slide.toString();
        this.carousel.dataset.direction = direction.toString();
    };
}

/** @ts-ignore @type {HTMLElement[]} */
const carousels = document.querySelectorAll(".carousel");
for (const carousel of carousels) {
    new Carousel(carousel);
}