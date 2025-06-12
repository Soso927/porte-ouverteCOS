export class Popup {
    #opentBtn;
    #overlay;
    #closeBtn;

    constructor() {
        this.#opentBtn = document.querySelector(".open-btn");
        this.#overlay = document.querySelector(".popup-overlay");
        this.#closeBtn = document.querySelector(".fillIn");
    }

    initPopup() {
        this.#ecouteurOpen();
        this.#ecouteurOverlay();
        this.#ecouteurClose();
    }

    #ecouteurOpen() {
        this.#opentBtn.addEventListener("click", () => {
            this.#overlay.style.display = "flex";
            document.body.classList.add("no-scroll");
        });
    }

    #ecouteurOverlay() {
        this.#overlay.addEventListener("click", (event) => {
            if (event.target === this.#overlay) {
                this.#overlay.style.display = "none";
                document.body.classList.remove("no-scroll");
            }
        });
    }

    #ecouteurClose() {
        this.#closeBtn.addEventListener("click", () => {
            this.#overlay.style.display = "none";
            document.body.classList.remove("no-scroll");
        });
    }
}







        