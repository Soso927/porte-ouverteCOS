export class Quizz {
    // Catégories des questions
    #categories = [
        ["tv_cinema", "TV & Cinéma"],
        ["art_litterature", "Art & Littérature"],
        ["musique", "Musique"],
        ["actu_politique", "Actualité politique"],
        ["culture_generale", "Culture générale"],
        ["sport", "Sport"],
        ["jeux_videos", "Jeux videos"]
    ];

    // Niveaux des questions posées
    #niveaux = ["facile", "normal", "difficile"];
  
    #answerUser;
    #nbBonnesReponses;
    #nbQuestionsPosees;
    #bonneReponse; // Boolean

    constructor() {
        const choixUser = document.querySelector(".titreNiveau");
        this.#makeHTMLRadio(choixUser);
        this.#answerUser;
        this.#nbBonnesReponses = 0;
        this.#nbQuestionsPosees = 0;
    }

    /**
     * Méthode privée qui crée dans le DOM les boutons radios avec les différents niveaux
     * @param {*} choixUser 
     */
    #makeHTMLRadio(choixUser) {
        const divNiveaux = document.createElement("div");
        divNiveaux.classList.add("niveaux");
        const niveaux = this.niveaux;
        niveaux.forEach((niveau, index) => {
            let label = document.createElement("label");
            let input = document.createElement("input");
            label.htmlFor = index;
            label.textContent = niveau;
            input.type = "radio";
            input.name = "niveaux";
            input.id = index;
            input.value = niveau;
            divNiveaux.append(label);
            divNiveaux.append(input);
            // Positionne le checked sur "facile" à la création des boutons radios
            input.checked = (index === 0);
        })
        choixUser.after(divNiveaux);
    }

    /**
     * Méthode qui affiche la question et les réponses possibles
     * (utilisé dans play.js)
     * @param {String} questionApi : question 
     * @param {String} niv : niveau  
     * @param {Object} answers : réponses possibles 
     * @param {String} cat 
     * @param {String} goodAnswer 
     * @param {Function} callback 
     */
    makeHTMLQuestionAndAnswers(questionApi, niv, [answers], cat, goodAnswer, callback) {
        const question = document.querySelector(".texteQuestion");
        question.textContent = questionApi;
        const categorie = document.querySelector(".categorie");
        const myCategory = this.categories.find(element => element[0] === cat)
        categorie.textContent = myCategory[1];
        const niveau = document.querySelector(".niveau");
        niveau.textContent = niv;
        const proposition = document.querySelector("#proposition");

        // Création des éléments avec les réponses dans le DOM
        for (let index = 0; index < answers.length; index++) {
            const button = document.createElement("button");
            button.classList.add("answers");
            button.type = "button";
            button.id = index;
            button.textContent = answers[index];
            proposition.prepend(button);

            // Ajout ecouteur sur les réponses
            button.addEventListener("click", (event) => {
                // Récupération du texte de la réponse sélectionnée
                this.#answerUser = event.target.textContent;
                this.nbQuestionsPosees += 1;
                // Test si ce texte est identique à celui de la bonne réponse
                if (this.#answerUser === goodAnswer) {
                    this.#disabledAnswers(event.target.id, "choixVrai", goodAnswer);
                    this.nbBonnesReponses += 1;
                    // valeur utilisée dans quizz Play pour faire 
                    // avancer le pion
                    this.bonneReponse = true;
                } else {
                    this.#disabledAnswers(event.target.id, "choixFaux", goodAnswer);
                    // valeur utilisée dans quizz Play
                    this.bonneReponse = false;
                }
                // Appel de la callback avec l'information de la réponse
                // info récupéré par Play
                if (callback && typeof callback === 'function') {
                    callback(this.bonneReponse);
                }
            })
        }
    }

    /**
     * Méthode privée qui désactive le click sur les réponses et coloration du fond 
     * en fonction de la réponse
     * @param {Numbre} id
     * @param {String} newClass 
     */
    #disabledAnswers(id, newClass, goodAnswer) {
        //  event.target.style.border = "7px solid yellow"
        const paragraphes = document.querySelectorAll('.answers');
        paragraphes.forEach((paragraphe) => {
            // Ajout border sur la bonne réponse
            if(paragraphe.textContent === goodAnswer) {
                paragraphe.style.border = "2px solid #1cf251";                       
            } else {
                paragraphe.style.border = "2px solid rgb(229, 117, 25)"; 
            }
            // Modification du backgroundColor des boutons avec les réponses
            // Vert si vrai, rouge si faux
            if (id === paragraphe.id) {
                paragraphe.classList.add(newClass);
            } else {
                paragraphe.classList.add("choixFaux");
            }
            paragraphe.disabled = true;
        });
    }

    /**
     * Méthode qui modifie le visuel de la partie gauche de l'écran 
     * quand l'utilsateur click sur le bouton jouer
     * (utilisé dans play.js)
     */
    changeDisplayZoneDiceOrInterfaceUser(go, zoneChoixUser, zoneDice, zoneQuestion) {
        //console.log(this.#go.disabled)
        if (go.disabled) {
            go.style.display = "none";
            zoneChoixUser.style.display = "none";
            zoneDice.classList.remove("hidden");
            zoneQuestion.classList.remove("hidden");
        } else {
            go.style.display = "";
            zoneChoixUser.style.display = "block";
            zoneDice.classList.add("hidden");
            zoneQuestion.classList.add("hidden");
        }
    }

    // ********************** //
    //   Getters et Setters   //
    // ********************** //
    get categories() {
        return this.#categories;
    }

    get niveaux() {
        return this.#niveaux;
    }

    get nbBonnesReponses() {
        return this.#nbBonnesReponses;
    }

    set nbBonnesReponses(value) {
        this.#nbBonnesReponses = value;
    }

    get bonneReponse() {
        return this.#bonneReponse;
    }

    set bonneReponse(value) {
        this.#bonneReponse = value;
    }

    get nbQuestionsPosees() {
        return this.#nbQuestionsPosees;
    }

    set nbQuestionsPosees(value) {
        this.#nbQuestionsPosees = value;
    }
}





