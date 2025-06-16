
document.addEventListener("DOMContentLoaded", () => {
    const isHomePage = document.querySelector(".car-options-carousel");
    const isGamePage = document.getElementById("car-container");

    if (isHomePage) {
        initCarSelectionPage();
    }

    if (isGamePage) {
        loadCarInGame();
    }
});

/*********************/
/* select modele voiture */
/*********************/

function initCarSelectionPage() {
    const imageBack = document.getElementById("imageBack");
    const carouselButtons = document.getElementById("carouselButtons");
    const lockOverlay = document.getElementById("lockOverlay");
    const unlockModal = document.getElementById("unlockModal");
    const unlockInput = document.getElementById("unlockCodeInput");
    const unlockConfirmBtn = document.getElementById("confirmUnlockBtn");
    const closeUnlockBtn = document.getElementById("closeUnlockModal");
    const modalContent = document.getElementById("modalContent");


    closeUnlockBtn.addEventListener("click", () => {
        closeUnlockPopup();
    });

    const carOptions = [
        { name: "aston", image: "medias/car_color/car-aston-martin.png", displayName: "Aston Martin - One 77", unlocked: true },
        { name: "bmwM", image: "medias/car_color/car-bmw-m.png", displayName: "BMW - M2", unlocked: true },
        { name: "bmw", image: "medias/car_color/car-bmw.png", displayName: "BMW - E9 3.0 CSL", unlocked: false, code: "BMW123" },
        { name: "chevrolet", image: "medias/car_color/car-chevrolet.png", displayName: "Chevrolet - Camaro SS", unlocked: true },
        { name: "dodge", image: "medias/car_color/car-dodge.png", displayName: "Dodge - Viper ACR", unlocked: false, code: "DODGE123" },
        { name: "ferrari", image: "medias/car_color/car-ferrari.png", displayName: "Ferrari - 458 Special", unlocked: true },
        { name: "abarth", image: "medias/car_color/car-abarth.png", displayName: "Fiat - 500 Abarth", unlocked: true },
        { name: "lamborghini", image: "medias/car_color/car-lamborghini.png", displayName: "Lamborghini - Reventon", unlocked: true },
        { name: "mercedesAMG", image: "medias/car_color/car-mercedes-amg.png", displayName: "Mercedes - C63 AMG", unlocked: true },
        { name: "mercedes", image: "medias/car_color/car-mercedes.png", displayName: "Mercedes - 300 SL", unlocked: false, code: "MERCO123" },
        { name: "nissan", image: "medias/car_color/car-nissan.png", displayName: "Nissan - GTR", unlocked: true },
        { name: "porsche", image: "medias/car_color/car-porsche.png", displayName: "Porsche - 918 Spyder (Gulf Edition)", unlocked: false, code: "PORSCHE123" },
        { name: "audi", image: "medias/car_color/car-audi.png", displayName: "Audi - TT RS", unlocked: true }
    ];

    let currentIndex = 0;
    let selectedCar = carOptions[0].name;

    function updateCarDisplay() {
        const currentCar = carOptions[currentIndex];

        const unlockedCars = JSON.parse(localStorage.getItem("unlockedCars") || "[]");
        if (unlockedCars.includes(currentCar.name)) {
            currentCar.unlocked = true;
        }

        imageBack.src = currentCar.image;
        carName.textContent = currentCar.displayName;

        if (!currentCar.unlocked) {
            imageBack.style.filter = "grayscale(10%) brightness(0.3)";
            lockOverlay.style.display = "block";
            unlockBtn.style.display = "inline-block";
        } else {
            imageBack.style.filter = "none";
            lockOverlay.style.display = "none";
            unlockBtn.style.display = "none";
        }

        selectedCar = currentCar.unlocked ? currentCar.name : null;
    }


    const carLogos = {
        aston: "medias/car_color/logo-aston.png",
        bmwM: "medias/car_color/logo-bmw-m.png",
        bmw: "medias/car_color/logo-bmw.png",
        chevrolet: "medias/car_color/logo-chevrolet.png",
        dodge: "medias/car_color/logo-dodge.png",
        ferrari: "medias/car_color/logo-ferrari.png",
        abarth: "medias/car_color/logo-abarth.png",
        lamborghini: "medias/car_color/logo-lamborghini.png",
        mercedesAMG: "medias/car_color/logo-mercedes-amg.png",
        mercedes: "medias/car_color/logo-mercedes.png",
        nissan: "medias/car_color/logo-nissan.png",
        porsche: "medias/car_color/logo-porsche.png",
        audi: "medias/car_color/logo-audi.png"
    };

    function afficherMessage(message, type = "success", logo = null) {
        const confirmationMessage = document.getElementById("confirmationMessage");

        confirmationMessage.classList.remove("success", "error", "show");
        confirmationMessage.classList.add(type, "show");
        confirmationMessage.innerHTML = "";

        if (logo) {
            const img = document.createElement("img");
            img.src = logo;
            img.alt = "Logo voiture";
            img.style.height = "150px";
            confirmationMessage.appendChild(img);
        }

        const span = document.createElement("span");
        span.textContent = message;
        confirmationMessage.appendChild(span);

        setTimeout(() => confirmationMessage.classList.remove("show"), 2500);
    }

    function openUnlockPopup() {
        unlockInput.value = "";
        unlockModal.style.display = "block";
    }

    function closeUnlockPopup() {
        unlockModal.style.display = "none";
    }

    unlockConfirmBtn.addEventListener("click", () => {
        const currentCar = carOptions[currentIndex];
        const enteredCode = unlockInput.value.trim();

        const modalError = document.getElementById("modalError");
        modalError.textContent = "";

        if (enteredCode === currentCar.code) {
            currentCar.unlocked = true;

            const unlockedCars = JSON.parse(localStorage.getItem("unlockedCars") || "[]");
            if (!unlockedCars.includes(currentCar.name)) {
                unlockedCars.push(currentCar.name);
                localStorage.setItem("unlockedCars", JSON.stringify(unlockedCars));
            }

            modalContent.classList.remove("error-modal"); //fd rouge retire
            updateCarDisplay();
            closeUnlockPopup();
            afficherMessage(`Véhicule déverrouillé : ${currentCar.displayName}`, "success", carLogos[currentCar.name]);
        } else {
            modalError.textContent = "Code incorrect !";

            modalContent.classList.add("error-modal", "shake"); // tremblement message erreur code
            setTimeout(() => {
                modalContent.classList.remove("shake");
            }, 500);
        }
    });

    lockOverlay.addEventListener("click", () => {
        openUnlockPopup();
    });

    window.validerChoix = function () {
        if (selectedCar) {
            const selectedOption = carOptions.find(car => car.name === selectedCar);
            const logo = carLogos[selectedCar];

            localStorage.setItem("voitureChoisie", selectedCar);
            localStorage.setItem("voitureNom", selectedOption.displayName);

            afficherMessage(`${selectedOption.displayName}, excellent choix !`, "success", logo);
        } else {
            afficherMessage("Véhicule verrouillé !", "error");
        }
    };

    carOptions.forEach((car, index) => {
        const btn = document.createElement("button");
        btn.className = "btn-select-color";
        btn.style.backgroundImage = `url(${car.image})`;
        btn.addEventListener("click", () => {
            currentIndex = index;
            updateCarDisplay();
        });
        carouselButtons.appendChild(btn);
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + carOptions.length) % carOptions.length;
        updateCarDisplay();
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % carOptions.length;
        updateCarDisplay();
    });

    updateCarDisplay();
}

window.addEventListener("load", () => {
    localStorage.removeItem("unlockedCars");
});




/*********************/
/* choix radio */
/*********************/

const radios = {
    rock: {
        name: "RockWave",
        image: "medias/radio/radio-rock.png",
        playlist: [
            {
                artist: "AC/DC",
                title: "Highway To Hell",
                file: "medias/radio/music-radio/ROCK_ACDC_Highway-To-Hell.mp3"
            },
            {
                artist: "Mark Knopfler",
                title: "What It Is",
                file: "medias/radio/music-radio/ROCK_Mark-Knopfler_What-It-Is.mp3"
            }
        ]
    },

    electro: {
        name: "ElectroPulse",
        image: "medias/radio/radio-electro.png",
        playlist: [
            {
                artist: "Kavinsky",
                title: "Roadgame",
                file: "medias/radio/music-radio/ELECTRO_Kavinsky_Roadgame.mp3"
            },
            {
                artist: "The Chainsmokers",
                title: "Takeway",
                file: "medias/radio/music-radio/ELECTRO_The-Chainsmokers_Takeaway.mp3"
            }
        ]
    },

    rnb: {
        name: "UrbanFlow",
        image: "medias/radio/radio-urban.png",
        playlist: [
            {
                artist: "Akhenaton",
                title: "La Cosca (Scratch by Dj Pone)",
                file: "medias/radio/music-radio/RNB_Akhenaton_La-Cosca_Scratch-by DJ-Pone.mp3"
            },
            {
                artist: "Dr Dre ft Snoop Dogg & Akon",
                title: "Kush",
                file: "medias/radio/music-radio/RNB_Dr-Dre_Kush.mp3"
            }
        ]
    },
    pop: {
        name: "PopFM",
        image: "medias/radio/radio-pop.png",
        playlist: [
            {
                artist: "Michael Jackson",
                title: "Beat It",
                file: "medias/radio/music-radio/POP_Michael-Jackson_Beat-It.mp3"
            },
            {
                artist: "Stardust",
                title: "Music Sounds Better With You",
                file: "medias/radio/music-radio/POP_Stardust_Music-Sounds-Better-With-You.mp3"
            }
        ]
    },
    classique: {
        name: "HarmonieRadio",
        image: "medias/radio/radio-harmonie.png",
        playlist: [
            {
                artist: "Johann Strauss",
                title: "Radetzky March",
                file: "medias/radio/music-radio/CLASSIC_Johann-Strauss_Radetzky-March.mp3"
            },
            {
                artist: "Dimitri Shostakovich",
                title: "Waltz n°2",
                file: "medias/radio/music-radio/CLASSIC_Dimitri-Shostakovich_Waltz-N2.mp3"
            }
        ]
    },
    jazz: {
        name: "JazzFM",
        image: "medias/radio/radio-jazz.png",
        playlist: [
            {
                artist: "Benny Goodman",
                title: "Sing Sing Sing",
                file: "medias/radio/music-radio/JAZZ_Benny-Goodman_Sing-Sing-Sing.mp3"
            }
        ]
    },

};


function selectRadio(station) {
    localStorage.setItem('selectedStation', station);
    window.location.href = 'game.html';
}

/******************************* radio page jeux ***************************/

const stationKeys = Object.keys(radios);
let currentStationIndex = 0;
let currentPlaylist = [];
let currentTrack = 0;

const player = document.getElementById('radioPlayer');
const stationNameDisplay = document.getElementById('stationName');
const stationImage = document.getElementById('stationImage');

const savedStation = localStorage.getItem('selectedStation') || 'rock';
currentStationIndex = stationKeys.indexOf(savedStation);
if (currentStationIndex === -1) currentStationIndex = 0;

function loadStation() {
    const stationKey = stationKeys[currentStationIndex];
    const station = radios[stationKey];
    currentPlaylist = station.playlist;
    currentTrack = 0;

    // MAJ visuel nom
    stationNameDisplay.textContent = station.name;
    stationImage.src = station.image;

    playCurrentTrack();
}

function playCurrentTrack() {
    if (currentPlaylist.length === 0) return;
    currentTrack = Math.floor(Math.random() * currentPlaylist.length);
    const trackPath = currentPlaylist[currentTrack];

    player.src = trackPath;
    trackNameDisplay.textContent = getTrackName(trackPath);
    player.play().catch(err => {
        console.warn("Lecture bloquée par le navigateur : interaction requise.");
    });
}

function nextStation() {
    currentStationIndex = (currentStationIndex + 1) % stationKeys.length;
    loadStation();
}

function prevStation() {
    currentStationIndex = (currentStationIndex - 1 + stationKeys.length) % stationKeys.length;
    loadStation();
}

player.addEventListener('ended', () => {
    playCurrentTrack();
});

const trackArtistDisplay = document.getElementById('trackArtist');
const trackTitleDisplay = document.getElementById('trackTitle');

function playCurrentTrack() {
    if (currentPlaylist.length === 0) return;
    currentTrack = Math.floor(Math.random() * currentPlaylist.length);
    const track = currentPlaylist[currentTrack];

    player.src = track.file;
    trackArtistDisplay.textContent = track.artist;
    trackTitleDisplay.textContent = track.title;

    player.play().catch(err => {
        console.warn("Lecture bloquée par le navigateur : interaction requise.");
    });
}



window.addEventListener('DOMContentLoaded', loadStation);



// etat dif actions
let isEngineOn = false;
let isDrivingOn = false;
let isLightsOn = false;
let isLeftIndicatorsOn = false;
let isRightIndicatorsOn = false;
let isHazardLightsOn = false;
let isNitroOn = false;

/*********************/
/* Nitro */
/*********************/


let nitroCompt = 3;
let nitroDuree = 5000; // temps nitro
let nitroRefresh = 100000;


const car = document.querySelector(".car__image");
const nitroEffect = document.createElement("div");
nitroEffect.classList.add("nitro-screen-effect");
document.body.appendChild(nitroEffect);

// compteur nitro
const nitroDisplay = document.createElement("div");
nitroDisplay.classList.add("nitro-compteur");
nitroDisplay.textContent = `Nitro : ${nitroCompt}`;
document.body.appendChild(nitroDisplay);

// affichage temps
const nitroTemps = document.createElement("div");
nitroTemps.classList.add("nitro-temps");
document.body.appendChild(nitroTemps);

// son
const nitroSound = document.getElementById("nitro-sound");

document.querySelector(".controls__nitro").addEventListener("click", activateNitro);
document.addEventListener("keydown", function (event) {
    if (event.key === "Shift") {
        activateNitro();
    }
});


function activateNitro() {
    if (isNitroOn || nitroCompt <= 0) return;

    isNitroOn = true;
    nitroCompt--;
    nitroDisplay.textContent = `Nitro: ${nitroCompt}`;

    car.classList.add("nitro");
    nitroEffect.classList.add("active");
    nitroSound.currentTime = 0;
    nitroSound.play();

    let timeLeft = nitroDuree / 1000;
    nitroTemps.textContent = `Nitro: ${timeLeft}s`;
    nitroTemps.style.display = "block";

    let timerInterval = setInterval(() => {
        timeLeft--;
        nitroTemps.textContent = `Nitro: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            nitroTemps.style.display = "none";
        }
    }, 1000);

    setTimeout(() => {
        isNitroOn = false;
        car.classList.remove("nitro");
        nitroEffect.classList.remove("active");

        nitroSound.pause();
        nitroSound.currentTime = 0;

    }, nitroDuree);

    setTimeout(() => {
        if (nitroCompt < 3) {
            nitroCompt++;
            nitroDisplay.textContent = `Nitro: ${nitroCompt}`;
        }
    }, nitroRefresh);
}


/*********************/
/* Klaxon */
/*********************/

const hornSound = document.getElementById("horn-sound");
document.querySelector(".controls__klaxon").addEventListener("click", function () {
    hornSound.currentTime = 0;
    hornSound.play();
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Space") {
        klaxonBtn.classList.add("on");
        hornSound.currentTime = 0;
        hornSound.play();
    }
});


/**************************/
/* Gestion de la conduite */
/**************************/

document.querySelector(".controls__driving").addEventListener("click", function () {
    let car = document.querySelector(".car__image");
    car.classList.toggle("on");
});

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") {
        car.classList.add("on");
    }
});


/**************************/
/* move left */
/**************************/

document.querySelector(".controls__move_left").addEventListener("click", function () {

    let car = document.querySelector(".car__image svg");
    car.classList.add("left");
    car.classList.remove("right");
});

document.addEventListener("keydown", function (event) {
    let car = document.querySelector(".car__image svg");

    if (event.key === "ArrowLeft") {
        car.classList.remove("right");
        car.classList.add("left");
    }
});



/**************************/
/* move right */
/**************************/

document.querySelector(".controls__move_right").addEventListener("click", function () {
    let car = document.querySelector(".car__image svg");
    car.classList.remove("left");
    car.classList.add("right");
});

document.addEventListener("keydown", function (event) {
    let car = document.querySelector(".car__image svg");

    if (event.key === "ArrowRight") {
        car.classList.remove("left");
        car.classList.add("right");
    }
});

/********************/
/* Gestion des feux */
/********************/

document.querySelector(".controls__lights").addEventListener("click", function () {
    document.querySelectorAll("#led_right, #led_left, #headlight_faiseau, #headlight_faiseau-2")
        .forEach(headlight => headlight.classList.toggle("on"));
});

document.addEventListener("keydown", function (event) {
    if (event.key.toLowerCase() === "z") {
        document.querySelectorAll("#led_right, #led_left, #headlight_faiseau, #headlight_faiseau-2")
            .forEach(headlight => headlight.classList.toggle("on"));
    }
});



// cligno son

const clignoSound = document.getElementById("cligno-left");

function toggleClignoSound() {
    if (isLeftIndicatorsOn || isRightIndicatorsOn) {
        clignoSound.loop = true;
        clignoSound.play();
    } else {
        clignoSound.pause();
        clignoSound.currentTime = 0;
    }
}


/***********************************/
/* Gestion des clignotants gauches */
/***********************************/

document.querySelector(".controls__left-indicators").addEventListener("click", function () {
    isLeftIndicatorsOn = !isLeftIndicatorsOn;
    document.querySelectorAll("#left_front_indicator, #left_rear_indicator_back, #left_side_indicator_side")
        .forEach(indicator => indicator.classList.toggle("on"));
    toggleClignoSound();
});

document.addEventListener("keydown", function (event) {
    if (event.key.toLowerCase() === "q") {
        isLeftIndicatorsOn = !isLeftIndicatorsOn;
        document.querySelectorAll("#left_front_indicator, #left_rear_indicator_back, #left_side_indicator_side")
            .forEach(indicator => indicator.classList.toggle("on"));
        toggleClignoSound();
    }
});

/**********************************/
/* Gestion des clignotants droits */
/**********************************/

document.querySelector(".controls__right-indicators").addEventListener("click", function () {
    isRightIndicatorsOn = !isRightIndicatorsOn;
    document.querySelectorAll("#right_front_indicator, #right_rear_indicator_back, #right_side_indicator_side")
        .forEach(indicator => indicator.classList.toggle("on"));
    toggleClignoSound();
});

document.addEventListener("keydown", function (event) {
    if (event.code === "KeyD") {
        isRightIndicatorsOn = !isRightIndicatorsOn;
        document.querySelectorAll("#right_front_indicator, #right_rear_indicator_back, #right_side_indicator_side")
            .forEach(indicator => indicator.classList.toggle("on"));
        toggleClignoSound();
    }
});


/************************/
/* Gestion des warnings */
/************************/

document.querySelector(".controls__hazard-lights").addEventListener("click", function () {
    isRightIndicatorsOn = !isRightIndicatorsOn;
    document.querySelectorAll("#right_rear_indicator_back, #left_rear_indicator_back, #left_front_indicator, #right_front_indicator, #left_side_indicator_side, #right_side_indicator_side")
        .forEach(indicator => indicator.classList.toggle("on"));
    toggleClignoSound();
});

document.addEventListener("keydown", function (event) {
    if (event.key === "s") {
        isLeftIndicatorsOn = !isLeftIndicatorsOn;
       
        document.querySelectorAll("#right_rear_indicator_back, #left_rear_indicator_back, #left_front_indicator, #right_front_indicator, #left_side_indicator_side, #right_side_indicator_side")
            .forEach(indicator => indicator.classList.toggle("on"));
        toggleClignoSound();
    }
});



/************************/
/* Obstacles */
/************************/
const obstacleAnimations = [];
let jeuActif = true;
let intervalObstacle;

function loadCarInGame() {
    const couleur = localStorage.getItem("voitureChoisie");
    const carSVGs = {
        aston: "cars/car-aston-martin.svg",
        bmwM: "cars/car-bmw-m.svg",
        bmw: "cars/car-bmw.svg",
        chevrolet: "cars/car-chevrolet.svg",
        dodge: "cars/car-dodge.svg",
        ferrari: "cars/car-ferrari.svg",
        abarth: "cars/car-abarth.svg",
        lamborghini: "cars/car-lamborghini.svg",
        mercedesAMG: "cars/car-mercedes-amg.svg",
        mercedes: "cars/car-mercedes.svg",
        nissan: "cars/car-nissan.svg",
        porsche: "cars/car-porsche.svg",
        audi: "cars/car-audi.svg"
    };

    const carContainer = document.getElementById("car-container");

    if (couleur && carSVGs[couleur]) {
        fetch(carSVGs[couleur])
            .then(res => res.text())
            .then(svgCode => {
                carContainer.innerHTML = svgCode;

                // lance jeu quand SVG dans DOM
                requestAnimationFrame(() => {
                    startCountdown();
                });
            })
            .catch(err => {
                console.error("Erreur lors du chargement du SVG :", err);
            });
    } else {
        console.warn("Voiture inconnue :", couleur);
    }
}


const viesDisplay = document.createElement("div");
viesDisplay.classList.add("vies-compteur");
document.body.appendChild(viesDisplay);

const viesMessage = document.createElement("div");
viesMessage.classList.add("vies-message");
document.body.appendChild(viesMessage);

viesDisplay.innerHTML = `Vies : ` + Array.from({ length: 4 }, (_, i) =>
    `<i class="fa-solid fa-heart" data-index="${i}" style="color: red;"></i>`
).join(" ");


function victoire() {
    if (!jeuActif) return;
    jeuActif = false;
    clearInterval(intervalTemps);
    obstacleAnimations.forEach(id => cancelAnimationFrame(id));

    const popup = document.getElementById("game-over-popup");
    popup.classList.remove('defaite');
    popup.classList.add('victoire');
    document.getElementById("game-over-message").textContent = "Gagnez !";
    popup.style.display = "flex";
}

function defaite() {
    if (!jeuActif) return;
    jeuActif = false;
    clearInterval(intervalTemps);
    obstacleAnimations.forEach(id => cancelAnimationFrame(id));

    const popup = document.getElementById("game-over-popup");
    popup.classList.remove('victoire');
    popup.classList.add('defaite');
    document.getElementById("game-over-message").textContent = "Perdu !";
    popup.style.display = "flex";
}

let tempsRestant = 60;

function startTimer() {
    const timerEl = document.getElementById('timer');
    timerEl.textContent = `Temps : ${tempsRestant}s`;

    intervalTemps = setInterval(() => {
        tempsRestant--;
        timerEl.textContent = `Temps : ${tempsRestant}s`;

        if (tempsRestant <= 0) {
            clearInterval(intervalTemps);
            victoire();
        }
    }, 1000);
}


function startCountdown() {

const feuDepart = document.getElementById('feu-depart');
const lumieres = {
    rouge: feuDepart.querySelector('.rouge'),
    orange: feuDepart.querySelector('.orange'),
    verte: feuDepart.querySelector('.verte')
};

function allumerFeu(couleur) {
    lumieres.rouge.classList.remove('allume');
    lumieres.orange.classList.remove('allume');
    lumieres.verte.classList.remove('allume');

    if (lumieres[couleur]) {
        lumieres[couleur].classList.add('allume');
    }
}


    const countdownEl = document.getElementById('countdown');
    let count = 3;

    function afficherNombre(nombre) {
    countdownEl.textContent = nombre;

    switch (nombre) {
        case 3:
            allumerFeu('rouge');
            break;
        case 2:
            allumerFeu('orange');
            break;
        case 1:
            allumerFeu('verte');
            break;
        case "GO!":
            feuDepart.style.display = 'none'; // cache feu
            break;
    }

    // anim nombre
    countdownEl.classList.remove('countdown-anim');
    void countdownEl.offsetWidth;
    countdownEl.classList.add('countdown-anim');
}

    afficherNombre(count);

   const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            afficherNombre(count);
        } else if (count === 0) {
            afficherNombre("GO!");
        } else {
            clearInterval(countdownInterval);
            countdownEl.style.display = 'none';
            startGame();
            startTimer();
        }
    }, 1000);
}


function startGame() {
    // let dernierObstacleGenere = 0;
    const carContainer = document.getElementById('car-container');
    const voiture = carContainer.querySelector('svg');

    const listeImages = [
        'obstacles/cycliste.png',
        'obstacles/cyclo-moteur.png',
        'obstacles/motard.png'
    ];

    let vies = 4;
    const messageEl = document.querySelector('.vies-message');
    const coeurs = document.querySelectorAll('.vies-compteur i');

    const centreRoute = [330, 570];
    const obstaclesActifs = [];
    // const obstacleAnimations = [];

    const TEMPS_MIN_ENTRE_OBSTACLES = 1500; // ms
    const DISTANCE_MIN = 1200;            // px
    const ALIGNEMENT_TOLERANCE = 1200;

    function updateVies() {
        coeurs.forEach((coeur, index) => {
            coeur.style.color = index < vies ? 'red' : 'gray';
        });
    }

    function afficherMessage(texte) {
        messageEl.textContent = texte;
        messageEl.style.opacity = 1;
        setTimeout(() => {
            messageEl.style.opacity = 0;
        }, 1500);
    }

    function creerObstacle() {
        const voieDisponible = centreRoute.filter(centre => {
            const obstaclesDansVoie = obstaclesActifs.filter(o => o.centre === centre);
            if (obstaclesDansVoie.length === 0) return true;

            const dernierObstacle = obstaclesDansVoie[obstaclesDansVoie.length - 1];
            const pos = parseInt(dernierObstacle.element.style.top || '0', 10);

            return pos > DISTANCE_MIN;
        });

        if (voieDisponible.length === 0) return;

        const centre = voieDisponible[Math.floor(Math.random() * voieDisponible.length)];

        const autreVoie = centreRoute.find(c => c !== centre);
        const obstaclesAutreVoie = obstaclesActifs.filter(o => o.centre === autreVoie);

        const alignementOK = obstaclesAutreVoie.every(o => {
            const pos = parseInt(o.element.style.top || '0', 10);
            return Math.abs(pos - 0) > ALIGNEMENT_TOLERANCE;
        });

        if (!alignementOK) return;

        const obstacle = document.createElement('img');
        obstacle.src = listeImages[Math.floor(Math.random() * listeImages.length)];
        obstacle.classList.add('obstacle');
        obstacle.style.top = '0px';
        obstacle.style.left = `${centre}px`;

        carContainer.appendChild(obstacle);
        obstaclesActifs.push({ element: obstacle, centre });

        deplacerObstacle(obstacle);
    }

    function deplacerObstacle(obstacle) {
        let position = 0;

        function descendre() {
            if (!jeuActif) return;

            position += 4;
            obstacle.style.top = `${position}px`;

            if (verifierCollision(obstacle)) {
                obstacle.remove();
                retirerObstacle(obstacle);
                vies--;
                updateVies();
                afficherMessage("⚠️ Collision");

                if (vies <= 0) {
                    defaite();
                    return;
                }
            }

            if (position < carContainer.offsetHeight) {
                const animationId = requestAnimationFrame(descendre);
                obstacleAnimations.push(animationId);
            } else {
                obstacle.remove();
                retirerObstacle(obstacle);
            }
        }

        requestAnimationFrame(descendre);

    }


    function getRelativeRect(element, container) {
        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        return {
            top: rect.top - containerRect.top,
            left: rect.left - containerRect.left,
            right: rect.right - containerRect.left,
            bottom: rect.bottom - containerRect.top,
            width: rect.width,
            height: rect.height
        };
    }

    function verifierCollision(obstacle) {
        if (!voiture) return false;

        const rectObstacle = getRelativeRect(obstacle, carContainer);
        const rectVoiture = getRelativeRect(voiture, carContainer);

        return !(
            rectObstacle.bottom < rectVoiture.top ||
            rectObstacle.top > rectVoiture.bottom ||
            rectObstacle.right < rectVoiture.left ||
            rectObstacle.left > rectVoiture.right
        );
    }


    function retirerObstacle(obstacle) {
        const index = obstaclesActifs.findIndex(o => o.element === obstacle);
        if (index !== -1) obstaclesActifs.splice(index, 1);
    }

    function boucleJeu(timestamp) {
        if (!jeuActif) return;

        if (timestamp - dernierObstacleGenere > TEMPS_MIN_ENTRE_OBSTACLES) {
            creerObstacle();
            dernierObstacleGenere = timestamp;
        }

        requestAnimationFrame(boucleJeu);
    }

    updateVies();
    dernierObstacleGenere = 0;
    requestAnimationFrame(boucleJeu);
}


document.getElementById("rejouer-btn").addEventListener("click", () => {
    location.reload(); // raffraichi page
});

document.getElementById("quitter-btn").addEventListener("click", () => {
    window.location.href = "index.html";
});

window.addEventListener('DOMContentLoaded', () => {
    loadCarInGame();
});
