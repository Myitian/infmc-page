/** @ts-ignore @type {HTMLAnchorElement[]} */
const TABS = document.querySelectorAll("#tabs a[data-id]");
/** @ts-ignore @type {HTMLElement[]} */
const PAGES = document.querySelectorAll("section[data-id]");
if (!window.location.hash.substring(1)) {
    window.location.hash = TABS[0].dataset.id
}
detectHashChange();
window.addEventListener("hashchange", detectHashChange);
for (const tab of TABS) {
    tab.addEventListener("click", clickEvent);
}

/**
 * @param {Event} event 
 */
function clickEvent(event) {
    /** @ts-ignore @type {HTMLButtonElement} */
    const self = event.target;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function detectHashChange() {
    const hash = window.location.hash.substring(1);
    let anySelected = false;
    if (!hash) {
        TABS[0].classList.add("active");
        PAGES[0].classList.add("active");
        anySelected = true;
    } else if (document.querySelector(`[data-id="${hash}"]`)) {
        for (const tab of TABS) {
            if (tab.dataset.id === hash) {
                tab.classList.add("active");
                anySelected = true;
            } else {
                tab.classList.remove("active");
            }
        }
        for (const page of PAGES) {
            if (page.dataset.id === hash) {
                page.classList.add("active");
                if (page.dataset.name) {
                    document.title = page.dataset.name;
                }
                anySelected = true;
            } else {
                page.classList.remove("active");
            }
        }
    } else {
        const element = document.getElementById(hash);
        if (!element) {
            return;
        }
        /** @type {HTMLElement} */
        const ancestor = element.closest("section[data-id]");
        if (!ancestor) {
            return;
        }
        for (const tab of TABS) {
            if (tab.dataset.id === ancestor.dataset.id) {
                tab.classList.add("active");
                anySelected = true;
            } else {
                tab.classList.remove("active");
            }
        }
        for (const page of PAGES) {
            if (page.dataset.id === ancestor.dataset.id) {
                page.classList.add("active");
                if (page.dataset.name) {
                    document.title = page.dataset.name;
                }
                anySelected = true;
            } else {
                page.classList.remove("active");
            }
        }
    }
}

function redirectToDonate() {
    window.location.replace("https://afdian.tv/a/infmc");
}