import { Quizz } from "./Quizz.js";
import { Api } from "./Api.js";
import { SvgManager } from "./SvgManager.js";
import { openGameOver } from "../popup.js";
import { Dice } from "./Dice.js";

export class Play {
    #go;                    // Bouton lancement jeu
    #zoneChoixUser;
    #zoneDice;              // Div contenant le dé au démarrage display none
    #roll;                  // Valeur du dé
    #lastRoll;              // Valeur du dé au tour précédent, à 0 lors du chargement
    #radioNiveaux;          // Niveau du quizz
    #zoneQuestion;
    #serieOfQuestions = []; // Variable qui contient les questions et réponses
    #goodAnswer;
    #currentPosition;       // Position actuelle du pion sur le plateau
    #userInterface;

    constructor() {
        this.quizz = new Quizz();
        this.api = new Api();
        // Partie droite de l'ecran => chargement SVG
        this.svg = new SvgManager();
        this.dice = new Dice();
        // Valeur du dé
        this.#roll;
        this.#lastRoll;
        this.currentPosition = 0;
        // Partie gauche de l'écran
        this.#go = document.querySelector("#go");
        this.suivant = document.querySelector(".suivant");
        this.init = document.querySelector(".init");
        this.#radioNiveaux = document.querySelectorAll(".niveaux input");
        this.#zoneDice = document.querySelector(".containerDice");
        this.#zoneChoixUser = document.querySelector("#choixUser");
        this.#zoneQuestion = document.querySelector("#zoneQuestion");
        this.#userInterface = document.querySelector("#userInterface");
    }

    /**
     * Méthode qui initialise le jeu
     */
    async initPlay() {
        try {
            await this.svg.initSVG();
            this.#initLocalStorage();
            this.#ecouteurRadio();
            this.#ecouteurGo();
            this.#ecouteurSuivant();
            this.#ecouteurInit();
        } catch (erreur) {
            console.error('Erreur pendant l\'initialisation:', erreur);
            throw erreur;
        }
    }

    /**
     * Méthode privée qui enregistre le niveau facile à l'affichage
     */
    #initLocalStorage() {
        // Par défaut au démarrage 
        localStorage.setItem("niveau", "facile");
    }

    /**
     * Méthode privée qui écoute les boutons radios determinant le niveau
     * choisi par le user
     */
    #ecouteurRadio() {
        for (let index = 0; index < this.#radioNiveaux.length; index++) {
            // Ajoute un écouteur sur chaque bouton radio
            this.#radioNiveaux[index].addEventListener("change", (event) => {
                localStorage.setItem("niveau", `${event.target.value}`);
            });
        }
    }

    /**
     * Méthode privée qui écoute le bouton jouer
     */
    #ecouteurGo() {
        this.#go.addEventListener("click", async (event) => {
            this.#go.disabled = true;
            this.quizz.changeDisplayZoneDiceOrInterfaceUser(this.#go, this.#zoneChoixUser, this.#zoneDice, this.#zoneQuestion);
            this.#recuperationJSON();
        })
    }

    /**
     * Méthode qui écoute le click sur bouton reset
     */
    #ecouteurInit() {
        this.init.addEventListener("click", () => {
            window.location.reload();
        })
    }

    /**
     * Méthode privée qui écoute le bouton question suivante
     */
    #ecouteurSuivant() {
        this.suivant.addEventListener("click", () => {
            // Récupère le niveau choisi par le user
            const niveau = localStorage.getItem('niveau');
            this.suivant.classList.add("hidden");
            // effacement ancienne question et réponses du DOM
            const oldAnswers = document.querySelectorAll(".answers");
            oldAnswers.forEach(answer => {
                answer.remove();
            })
            this.#traitementSerieQuestion(niveau);
            let score = document.querySelector(".score");
            score.classList.remove("hidden");
            let nbBonneReposne = document.querySelector("#nbBonneReposne");
            let NbTotalQuestion = document.querySelector("#NbTotalQuestion");
            nbBonneReposne.textContent = this.quizz.nbBonnesReponses;
            NbTotalQuestion.textContent = this.quizz.nbQuestionsPosees
        })
    }

    /**
     * Méthode privée qui récupère un lot de question
     * via l'API
     */
    async #recuperationJSON() {
        // Récupère le niveau choisi par le user
        const niveau = localStorage.getItem('niveau');
        // Listes des questions via API
        this.serieOfQuestions = await this.api.obtenirQuestions(niveau);
        this.serieOfQuestions = _.shuffle(this.serieOfQuestions)
        this.#traitementSerieQuestion(niveau);
    }

    /**
     * Définition de le callback pour recevoir l'information de la réponse
     * de la class Quizz où sont les écouteurs sur les réponses (ligne 54)
     * @param {boolean} isCorrect 
     */
    #handleAnswer = (isCorrect) => {
        //console.log(`La réponse est ${isCorrect ? 'correcte' : 'incorrecte'}`);
        if (isCorrect) {
            // Détermine la case d'arrivée du point après une bonne réponse
            const arrivee = this.currentPosition + this.roll;
            this.#testCaseArrivee(arrivee);
            this.#userInterface.style.display = "none";
        } else {
            this.suivant.classList.remove("hidden");
        }
    };

    #changeDisplay() {
        setTimeout(() => {
            this.suivant.classList.remove("hidden");
            this.#userInterface.style.display = "flex";
        }, 1500);
    }

    /**
     * Méthode privée qui test la postion du pion en fonction de sa case d'arrivée
     * @param {Number} arrivee 
     */
    #testCaseArrivee(arrivee) {
        switch (arrivee) {
            // Fleche 1
            case 5:
                this.svg.animationFleche(1);
                this.svg.showPawnsPlus(this.currentPosition, 14)
                    .then(() => this.svg.animationFleche(1))
                    .then(() => this.#changeDisplay());
                this.currentPosition = 14;
                break;
            // Fleche 2
            case 24:
                this.svg.animationFleche(2);
                this.svg.showPawnsPlus(this.currentPosition, 29)
                    .then(() => this.svg.animationFleche(2))
                    .then(() => this.#changeDisplay());
                this.currentPosition = 29;
                break;
            // Fleche 3
            case 37:
                this.svg.animationFleche(3);
                this.svg.showPawnsPlus(this.currentPosition, 37)
                    .then(() => this.svg.showPawnsMoins(37, 18))
                    .then(() => this.svg.animationFleche(3))
                    .then(() => this.#changeDisplay());
                this.currentPosition = 18;
                break;
            // Fleche 4
            case 42:
                this.svg.animationFleche(4);
                this.svg.showPawnsPlus(this.currentPosition, 42)
                    .then(() => this.svg.showPawnsMoins(42, 39))
                    .then(() => this.svg.animationFleche(4))
                    .then(() => this.#changeDisplay());
                this.currentPosition = 39;
                break;
            // Case Finish
            case 46:
                console.log(this.currentPosition);
                this.svg.showPawnsPlus(this.currentPosition, 46);
                this.svg.animationFinish();
                this.init.classList.remove("hidden");
                // this.suivant.classList.add("hidden");
                setTimeout(() => {
                    this.#userInterface.style.display = "flex";
                }, 1500);
                break;
            // Cases autres et case finish    
            default:
                let gap = arrivee - 46;
                if (arrivee > 46 && gap != 4) {
                    // Le pion va en case 46 et revient sur 46 - différence en arrivée
                    console.log(arrivee);
                    console.log(gap);
                    this.svg.showPawnsPlus(this.currentPosition, 46)
                        .then(() => this.svg.showPawnsMoins(46, 46 - gap))
                        .then(() => this.#changeDisplay());
                    this.currentPosition = 46 - gap;
                } else if (arrivee > 46 && gap == 4) {
                    // Le pion revient sur la case 42 -> 39
                    this.svg.animationFleche(4);
                    this.svg.showPawnsPlus(this.currentPosition, 46)
                        .then(() => this.svg.showPawnsMoins(46, 39))
                        .then(() => this.#changeDisplay());
                    this.svg.animationFleche(4);
                    this.currentPosition = 39;
                } else {
                    this.svg.showPawnsPlus(this.currentPosition, arrivee)
                        .then(() => this.#changeDisplay());
                    this.currentPosition = arrivee;
                }
                break;
        }
    }

    /**
     * Méthode privée qui récupère la question et ses réponses
     * dans this.serieOfQuestions
     * @param {String} niveau 
     */
    #traitementSerieQuestion(niveau) {
        if (this.serieOfQuestions.length === 0) {
            this.#zoneDice.classList.add("hidden");
            this.#zoneQuestion.classList.add("hidden");
            this.init.classList.remove("hidden");
            openGameOver();
        } else {
            this.roll = this.dice.roll();
            // Dans le lot de question, on choisi une question (quest) au hasard
            // this.serieOfQuestions => utilise le getteurs
            const rang = this.#aleatoireQuestion(this.serieOfQuestions.length);
            const quest = this.serieOfQuestions[rang].question;
            // Bonne réponse + mauvaises réponses
            const allAnswers = [
                this.serieOfQuestions[rang].answer,
                ...this.serieOfQuestions[rang].badAnswers
            ];

            // Mélange les réponses (shuffle vient de lodash)
            const shuffledAnswers = _.shuffle(allAnswers);
            // Mémorisation de la bonne réponse
            this.#goodAnswer = this.serieOfQuestions[rang].answer;
            // Catégorie
            const cat = this.serieOfQuestions[rang].category;

            // Callback cf Quizz
            this.quizz.makeHTMLQuestionAndAnswers(quest, niveau, [shuffledAnswers], cat, this.#goodAnswer, this.#handleAnswer);
            // Suppression de la question qui vient d'être posée dans le tableau
            x
        }
    }

    /**
     * Méthode privée qui sort un nombre en fonction du nombre de questions
     * reçus à partir du Fetch (cf. Api.js)
     * @param {Numbre} nbElement 
     * @returns : un nombre
     */
    #aleatoireQuestion(nbElement) {
        return Math.floor(Math.random() * nbElement);
    }

    // ********************** //
    //   Getters et Setters   //
    // ********************** //
    get serieOfQuestions() {
        return this.#serieOfQuestions;
    }

    set serieOfQuestions(values) {
        this.#serieOfQuestions = values;
    }

    get roll() {
        return this.#roll;
    }

    set roll(value) {
        this.#roll = value;
    }

    get lastRoll() {
        return this.#lastRoll;
    }

    set lastRoll(value) {
        this.#lastRoll = value;
    }

    get currentPosition() {
        return this.#currentPosition;
    }

    set currentPosition(value) {
        this.#currentPosition = value;
    }

}