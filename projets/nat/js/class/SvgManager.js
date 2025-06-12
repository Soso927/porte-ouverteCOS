export class SvgManager {
    #SVGFile;
    #currentPosition;

    constructor() {
        this.#SVGFile = "default.svg";
        this.#currentPosition = "pawn-0";
    }

    /**
     * Méthode asynchrone qui instancie le SVG contenant le plateau de jeu
     */
    async initSVG() {
        const pathToSvg = "./assets/images/plateauWithPawns.svg";
        // Création de l'élément object
        const divPlateau = document.querySelector("#divPlateau");
        const balisePlateau = document.createElement("object");
        balisePlateau.id = "plateau";
        balisePlateau.type = "image/svg+xml";
        balisePlateau.data = pathToSvg;

        // Nettoyage préventif
        divPlateau.innerHTML = '';
        divPlateau.appendChild(balisePlateau);

        // Attente du chargement complet du SVG
        // Technique pour transformer un événement (comme onload) en une promesse utilisable avec 
        // async/await.
        // L'exécution se déroule en plusieurs étapes :
        // 1 - La promesse est créée immédiatement
        // 2 - L'événement onload est configuré
        // 3 - Le code s'arrête à await jusqu'à ce que l'événement se produise
        // 4 - Quand l'élément est chargé, resolve() est appelé
        // 5 - La promesse est résolue, permettant à l'exécution de continuer
        await new Promise(resolve => {
            balisePlateau.onload = () => {
                resolve();
            };
        });

        // Accès au contenu du SVG
        this.SVGFile = balisePlateau.contentDocument;
    }

    /**
     * Méthode qui Modifie la couleur de la case en cours (toggle = "lime") 
     * @param {Number} numero 
     */
    findOneCase(numero) {
        let maCase = this.SVGFile.querySelector(`#case_${numero}`);
        maCase.classList.toggle("lime");
    }

    /**
     * Méthode qui cache ou affiche le pion ("" ou "none")
     * @param {Number} numero 
     * @param {String} display 
     */
    findOnePawnDisplay(numero, display) {
        return new Promise((resolve) => {

            let monPion = this.SVGFile.querySelector(`#pawn-${numero}`);
            if (monPion) {
                monPion.style.display = display;
            } else {
                console.log(`⚠️ Pion ${numero} non trouvé dans le SVG`);
            }
            resolve();
        });
    }

    /**
     * Méthode qui modifie les pions et les cases
     * quand la progression est croissante
     * @param {Number} nb1 : case de départ
     * @param {Number} nb2 : case d'arrivée = currenPosition
     * @returns 
     */
    showPawnsPlus(nb1, nb2) {
        return new Promise((resolve) => {
            const delay = 500;
            let compteurForDelay = 1;
            this.currentPosition = `case_${nb2}`;
            // Affiche le premier pion immédiatement
            this.findOnePawnDisplay(nb1, "");

            // Boucle pour les pions suivants
            for (let i = nb1 + 1; i <= nb2; i++) {
                compteurForDelay++;
                // Afficher le pion suivant
                setTimeout(() => {
                    this.findOnePawnDisplay(i, "");
                    this.findOneCase(i);
                }, compteurForDelay * delay);
                // Cache le pion précédent après un petit délai supplémentaire
                setTimeout(() => {
                    this.findOnePawnDisplay(i - 1, "none");
                }, compteurForDelay * delay + 100); // Délai légèrement plus court
            }

            // Résoudre la Promesse une fois que toutes les opérations sont terminées
            setTimeout(() => {
                resolve();
            }, compteurForDelay * delay + 100);
        });
    }

    /**
     * Méthode qui modifie les pions et les cases
     * quand la progression est décroissante
     * @param {Number} nb1 : case de départ
     * @param {Number} nb2 : case d'arrivée = currenPosition
     * @returns 
     */
    showPawnsMoins(nb1, nb2) {
        return new Promise(async (resolve) => {
            const delay = 500;
            let compteurForDelay = 1;

            // Boucle principale avec gestion des promesses
            for (let i = nb1; i >= nb2; i--) {
                // Création d'une promesse pour chaque paire d'opérations
                await new Promise(resolve => {
                    setTimeout(() => {
                        this.findOnePawnDisplay(i, "");
                        this.findOneCase(i);
                        setTimeout(() => {
                            this.findOnePawnDisplay(i + 1, "none");
                            resolve(); // Résolution après la deuxième opération
                        }, 100);
                    });
                });
                compteurForDelay++;
            }

            // Exécution finale après la boucle complète
            await new Promise(resolve => {
                setTimeout(() => {
                    this.findOneCase(nb2);
                    this.currentPosition = `case_${nb2}`;
                    resolve();
                }, 200);
            });

            resolve(); // Résolution finale de la promesse principale
        });
    }

    /**
     * Méthode qui fait clignoter les lettres finish
     */
    animationFinish() {
        const letters = this.SVGFile.querySelectorAll('[id^="f-lettre-"]')
        letters.forEach(letter => {
            letter.classList.add("clignote");
        })
    }

    /**
     * Méthode qui lance l'animation sur la flèche en fonction de son numéro
     * @param {Number} nombre : numéro de la flèche à animer
     */
    animationFleche(nombre) {
        // Selection des path avec la class arrow-X
        const arrows = this.SVGFile.querySelectorAll(`.arrow-${String(nombre)}`);
        arrows.forEach(arrow => {
            // arrow.classList.add("clignote");
            arrow.classList.toggle("clignote")
        })
    }

    // ********************** //
    //   Getters et Setters   //
    // ********************** //
    get SVGFile() {
        return this.#SVGFile;
    }

    set SVGFile(value) {
        this.#SVGFile = value;
    }

    get currentPosition() {
        return this.#currentPosition;
    }

    set currentPosition(value) {
        this.#currentPosition = value;
    }
}


