import { config } from "./game-config.js";

export class Joueur {

    listeCartesJoueur;
    joueur_1_score;
    joueur_2_score;
    #mult = 1

    constructor(listeCartesJoueur, joueur_1_score, joueur_2_score) {
        this.listeCartesJoueur = listeCartesJoueur
        this.joueur_1_score = joueur_1_score
        this.joueur_2_score = joueur_2_score
    }

    joueurJoue(){
        let index = 0
        let temp
        let result
    
        this.listeCartesJoueur.forEach(carte => {
        carte.addEventListener('click',()=>{
            console.log(carte.dataset.name) // represente le nom de ma carte
            carte.classList.toggle("flipped") //gere le retournement
            carte.style.pointerEvents = 'none';// desactive les click
            index ++
    
            if (index === 1)
            {
                temp = carte
            }
            else if(index === 2 && carte.dataset.name === temp.dataset.name)
            {
                console.log("identique")
                index = 0
                result = carte.dataset.name
                temp = ""
                this.#checkResult(result)
                result = ""
            }
            else
            {   
                console.log("different")
                index = 0
                result = "different"
                //reactive les click
                temp.style.pointerEvents = '';
                carte.style.pointerEvents = '';
                //gere le retourneùment
                setTimeout(()=>{
                    carte.classList.toggle("flipped")
                    temp.classList.toggle("flipped")
                    temp = ""
                },1000)
                 this.#checkResult(result)
                result = ""
                
            }

        }) 
    });
    }


    #checkResult(result) {
        //conversion pour travailler mes chiffres
        let j2Pv = parseInt(this.joueur_2_score[0].textContent)
        let j2Armor = parseInt(this.joueur_2_score[1].textContent)
        
        let j1Pv = parseInt(this.joueur_1_score[0].textContent)
        let j1Armor = parseInt(this.joueur_1_score[1].textContent)
    
        console.log(j2Pv)
        console.log(j2Armor)
        //traitement de mon resultat selon les types de tuiles retournées
        switch (result) {
            case "Arc":
                console.log("je tire a l'arc")
                this.#damage(config.arc, j2Armor, j2Pv)
                break;
    
            case "Epee":
                console.log("je met un coup d'Epee")
                this.#damage(config.epee, j2Armor, j2Pv)
                break;

            case "Boule de feu":
                console.log("je lance une boule de feu")
                this.#damage(config.parchemin, j2Armor, j2Pv)
                break;

            case "Bouclier":
                console.log("je leve mon bouclier")
                j1Armor += config.bouclier * this.#mult
                this.joueur_1_score[1].textContent = j1Armor
                break;
            case "Parade":
                console.log("je pars cette attaque")
                j1Armor += config.parade * this.#mult
                this.joueur_1_score[1].textContent = j1Armor
                break;
            case "Potion":
                console.log("je bois une potion")
                j1Pv += config.potion * this.#mult
                this.joueur_1_score[0].textContent = j1Pv
                break;
            case "Bandage":
                console.log("je m'applique un bandage")
                j1Pv += config.bandage * this.#mult
                this.joueur_1_score[0].textContent = j1Pv
                break;
            case "Concentration":
                console.log("je canalise ma prochaine action")
                //gerer la concetration
                this.#mult = 2
                break;
            case "different":
                console.log("aie je me suis trompé")
                this.joueur_1_score[0].textContent -= config.erreur
                break;
        }
    
        
            console.log("le result",result)
        
        
        if (result !== "different" && result !== "Concentration"){
            this.#mult = 1
        }
    }


    #damage(value, j2Armor,j2Pv) // gestion des degats
    {
    let res
    if ( j2Armor > 0) {
            res =  value * this.#mult - j2Armor
            if (res > 0) {
                console.log("hello")
                j2Pv -= res
                this.joueur_2_score[0].textContent = j2Pv
                this.joueur_2_score[1].textContent = 0
            }
            else{
                this.joueur_2_score[1].textContent = j2Armor - value * this.#mult
            }
        }
        else{
            this.joueur_2_score[0].textContent = j2Pv - value * this.#mult
        }
    }



}    