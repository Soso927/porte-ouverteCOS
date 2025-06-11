// Elements popup regles du jeu
const rules = document.querySelector("#rules");
const openRules = document.querySelector(".open-rules");
const closeBtnRules = document.querySelector(".button-close-rules");
// Elements popup game over
const gameOver = document.querySelector("#gameOver");
const closeBtnGameOVer = document.querySelector(".button-close-gameOver");
// Fond de la popup
const overlay = document.querySelector(".popup-overlay");

// Au départ
gameOver.style.display = "none"; // pour afficher => flex
rules.style.display = "none"; // pour afficher => flex

// Ecuteur sur bouton pour afficher les règles du jeu
openRules.addEventListener("click", function () {
    gameOver.style.display = "none";
    rules.style.display = "flex";
    overlay.style.display = "flex";
    document.body.classList.add("no-scroll");
});

// Bouton ppur fermer popup avec les règles du jeu
closeBtnRules.addEventListener("click", () => {
    overlay.style.display = "none";
    document.body.classList.remove("no-scroll");
});

// Fond quand popup ouverte => si on click sur le fond ferme la popup
overlay.addEventListener("click", (event) => {
    console.log(event.target);
    if (event.target === overlay) {
        overlay.style.display = "none";
        document.body.classList.remove("no-scroll");
    }
});

// Ouverture popup gameOver => utilisé dans play #traitementSerieQuestion(niveau)
export function openGameOver() {
    rules.style.display = "none";
    gameOver.style.display = "flex";
    overlay.style.display = "flex";
    document.body.classList.add("no-scroll");
}
