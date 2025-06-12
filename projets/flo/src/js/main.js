import { tabDataCard } from "./dataCard.js" //import des données des cartes
import { Carte } from "./carte.js"
import { Joueur } from "./joueur.js"
import { config } from "./game-config.js"


//recup des valeurs du DOM
const joueur_1 = document.querySelector("#joueur_1")
const joueur_2 = document.querySelector("#joueur_2")
let joueur_1_score = document.querySelectorAll(".score-joueur_1 p span")
let joueur_2_score = document.querySelectorAll(".score-joueur_2 p span")
joueur_1_score[0].textContent = config.pv
joueur_2_score[0].textContent = config.pv

//Fonction de melange des cartes
function melangerCartes() {
    for (let i = tabDataCard.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = tabDataCard[i];
        tabDataCard[i] = tabDataCard[j];
        tabDataCard[j] = temp;
    }
}


//créé les 16 cartes joueur 1
melangerCartes(tabDataCard)
for (let index = 0; index < tabDataCard.length; index++) {
    const carteCrea = new Carte(tabDataCard[index].nom, tabDataCard[index].image, tabDataCard[index].description, "rouge");
    const carteHTML = carteCrea.createCard()
    joueur_1.appendChild(carteHTML)
}

//créé les 16 cartes joueur 2
melangerCartes(tabDataCard)
for (let index = 0; index < tabDataCard.length; index++) {
    const carteCrea = new Carte(tabDataCard[index].nom, tabDataCard[index].image, tabDataCard[index].description, "bleu");
    const carteHTML = carteCrea.createCard()
    joueur_2.appendChild(carteHTML)
}


//--------------gestion du jeu --------------------//

const cartesJ1 = document.querySelectorAll('#joueur_1 .carte')
const cartesJ2 = document.querySelectorAll('#joueur_2 .carte')

//--------------Joueur 1 --------------------//
let joueur1 = new Joueur(cartesJ1, joueur_1_score, joueur_2_score)
joueur1.joueurJoue()

//--------------Joueur 2 --------------------//
let joueur2 = new Joueur(cartesJ2, joueur_2_score, joueur_1_score)
joueur2.joueurJoue()


//gestion du changement de tour
const zoneJ1 = document.querySelector('#joueur_1')
const zoneJ2 = document.querySelector('#joueur_2')
zoneJ2.style.pointerEvents = 'none'
let index = 0
let tour = 1
let gagnant

//tout les 2 click ma variable tour change et mon code peut passer d'une condition a l'autre tout les 2 click au lieu d'un seul
const fullCarte = document.querySelectorAll(".carte")
const afficheJoueur = document.querySelector(".tour-joueur p")

fullCarte.forEach(carte => {
    carte.addEventListener("click", ()=> {
        index ++

        if (index % 2 === 0){
                tour++

            if(tour % 2 ===0 ){
                afficheJoueur.textContent = "joueur 2"
                zoneJ1.style.pointerEvents = 'none'
                zoneJ2.style.pointerEvents = ''
            }
            else{
            afficheJoueur.textContent = "joueur 1"
            zoneJ1.style.pointerEvents = ''
            zoneJ2.style.pointerEvents = 'none'
            }
        }

        console.log(joueur_1_score)
        //detection de la victorie d'un joueur  
        gagnant = (joueur_1_score[0].textContent <= "0") ? "Joueur 2" : "Joueur 1";

        

        if (joueur_1_score[0].textContent <= "0" || joueur_2_score[0].textContent <= "0"){
            const event = new CustomEvent('finPartie',{
                detail : {condition : gagnant}
                })
            joueur_1.dispatchEvent(event)
        }
    })
}) 

 
//bouton qui retourne toute les cartes
document.querySelector("#flip-all").addEventListener("click", ()=>{
    fullCarte.forEach(carte =>{ 
        carte.classList.toggle('flipped')
        // setTimeout(()=>{
            // carte.classList.toggle('flipped')
        // },10000)
    })
    
})

//bouton de rechargement de la partie
document.querySelector("#reset").addEventListener("click", ()=>{
    window.location.reload()
})

document.querySelector("#reset-modal").addEventListener("click", ()=> {
    window.location.reload()
})


///Creation event personnaliser (Merci Thomas) qui ouvre la page de fin///
joueur_1.addEventListener("finPartie", (event)=> {
    console.log(event.detail.condition)
    setTimeout(()=>{
        document.querySelector(".modal-fin").style.display = "block"
        document.querySelector("#gagnant").textContent = event.detail.condition
    },500)
})

//bouton fenetre 



//fenetre modal a l'ouverture de la page
const modalRegle = document.querySelector(".modal_regles")
document.querySelector(".modal-content_regles span").addEventListener("click", () => {
    console.log("hello")
    modalRegle.style.display = "none"
    
})

modalRegle.addEventListener("click", (e)=> {
    if( e.target == modalRegle){
    modalRegle.style.display = "none"
    }
})


