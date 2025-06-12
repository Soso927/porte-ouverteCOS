export class Dice {

    constructor() {
        this.cube = document.querySelector('.cube');
        this.positions = [
            [ // Un
                { x: 180, y: 1620 },
                { x: 540, y: 1260 },
                { x: 900, y: 900 },
                { x: 1260, y: 540 },
                { x: 1620, y: 180 },
                { x: 1980, y: 1980 }
            ],
            [ // Deux
                { x: 0, y: 1980 },
                { x: 360, y: 1620 },
                { x: 720, y: 1260 },
                { x: 1080, y: 900 },
                { x: 1440, y: 540 },
                { x: 1800, y: 180 }
            ],
            [ // Trois
                { x: 180, y: 450 },
                { x: 540, y: 810 },
                { x: 900, y: 1170 },
                { x: 1260, y: 1530 },
                { x: 1620, y: 1890 },
                { x: 1980, y: 90 }
            ],
            [ // Quatre
                { x: 0, y: 90 },
                { x: 360, y: 450 },
                { x: 720, y: 810 },
                { x: 1080, y: 1170 },
                { x: 1440, y: 1530 },
                { x: 1800, y: 1890 }
            ],
            [ // Cinq
                { x: 270, y: 1710 },
                { x: 630, y: 1350 },
                { x: 990, y: 990 },
                { x: 1350, y: 630 },
                { x: 270, y: 1710 },
                { x: 2070, y: 0 }
            ],
            [ // Six
                { x: 90, y: 270 },
                { x: 450, y: 630 },
                { x: 810, y: 990 },
                { x: 1170, y: 1350 },
                { x: 1530, y: 1710 },
                { x: 1890, y: 2070 }
            ]
        ];
    }

    // Fonction de lancer du dé
    roll() {
        let rand = this.#getRandomDice();
        let valueForReturn = rand;
        let spins = this.#getRandomDice();
        rand--;
        spins--;
        const xPos = this.positions[rand][spins].x + 1800;
        const yPos = this.positions[rand][spins].y + 1800;
        this.cube.style.transform = `rotateX(${xPos}deg) rotateY(${yPos}deg)`;
        this.cube.style.webkitTransform = `rotateX(${xPos}deg) rotateY(${yPos}deg)`;
        return valueForReturn;
    }

    /**
     * Méthode privée de génération d'un nombre aléatoire
     * @returns : un nombre aléatoire entre 1 et 6
     */
    #getRandomDice() {
        return Math.floor(Math.random() * (6 - 1)) + 1;
    }
}

