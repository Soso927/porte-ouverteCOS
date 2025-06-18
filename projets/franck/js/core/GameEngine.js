import { GameModeAssaut } from "../modes/GameModeAssaut.js";
import { GameModeEndurance } from "../modes/GameModeEndurance.js";
import { GameModeChrono } from "../modes/GameModeChrono.js";
import { GameModeMemoireAssaut } from "../modes/GameModeMemoireAssaut.js";
import { GameModeMemoireChrono } from "../modes/GameModeMemoireChrono.js";
import { GameModeAuditifEndurance } from "../modes/GameModeAuditifEndurance.js";
import { GameModeAuditifChrono } from "../modes/GameModeAuditifChrono.js";
import { GameModeBattle } from "../modes/GameModeBattle.js";
import { TaupesLoader } from "../loader/TaupesLoader.js";
import { UIManager } from "../ui/UIManager.js";
import { GameConfig } from "../ui/GameConfig.js";

// --------------------------------------------------------------------------------------------
// declaratioon de la classe GameEngine
// --------------------------------------------------------------------------------------------
export class GameEngine {
  constructor(type, mode, difficulty, holes) {
    this.type = type;
    this.mode = mode;
    this.difficulty = difficulty;
    this.holes = holes;
    this.gameInstance = null;
    this.isGameRunning = false;
    this.sequence = [];
    this.taupesTrouvees = [];
    this.firstSelection = null;
    this.secondSelection = null;
    this.trousVerrouilles = [];
    this.locked = false;
  }
  // --------------------------------------------------------------------------------------------
  // Permet d’accéder au mode de jeu actif depuis l’extérieur
  // --------------------------------------------------------------------------------------------
  getGameMode() {
    return this.gameInstance;
  }
  // --------------------------------------------------------------------------------------------
  // initialisation du jeu(creation de la classe correspondante)
  // --------------------------------------------------------------------------------------------
  async init() {
    switch (this.type) {
      case "Reflexe":
        await this.initReflexe();
        break;
      case "Auditif":
        await this.initAuditif();
        break;
      case "Memoire":
        await this.initMemoire();
        break;
      case "Battle":
        this.gameInstance = new GameModeBattle(
          this,
          this.holes,
          this.difficulty,
          this.type
        );
        break;
      default:
        console.error("Type de jeu inconnu :", this.type);
    }
  }
  // --------------------------------------------------------------------------------------------
  // initialisation du jeu(creation de la classe correspondante)
  // --------------------------------------------------------------------------------------------
  async initReflexe() {
    switch (this.mode) {
      case "Assaut":
        this.gameInstance = new GameModeAssaut(
          this,
          this.holes,
          this.difficulty,
          this.type
        );
        break;
      case "Endurance":
        this.gameInstance = new GameModeEndurance(
          this,
          this.holes,
          this.difficulty,
          this.type
        );
        break;
      case "Chrono":
        this.gameInstance = new GameModeChrono(
          this,
          this.holes,
          this.difficulty,
          this.type
        );
        break;
      default:
        console.error("Mode ReflexeAuditif inconnu :", this.mode);
    }
  }
  // --------------------------------------------------------------------------------------------
  // initialisation du jeu(creation de la classe correspondante)
  // --------------------------------------------------------------------------------------------
  async initAuditif() {
    switch (this.mode) {
      case "Endurance":
        this.gameInstance = new GameModeAuditifEndurance(
          this,
          this.holes,
          this.difficulty,
          this.type
        );
        break;
      case "Chrono":
        this.gameInstance = new GameModeAuditifChrono(
          this,
          this.holes,
          this.difficulty,
          this.type
        );
        break;
      default:
        console.error("Mode Auditif inconnu :", this.mode);
    }
  }
  // --------------------------------------------------------------------------------------------
  // initialisation du jeu(creation de la classe correspondante)
  // --------------------------------------------------------------------------------------------
  async initMemoire() {
    switch (this.mode) {
      case "Assaut":
        this.gameInstance = new GameModeMemoireAssaut(
          this,
          this.holes,
          this.difficulty,
          this.type
        );
        break;
      case "Chrono":
        this.gameInstance = new GameModeMemoireChrono(
          this,
          this.holes,
          this.difficulty,
          this.type
        );
        break;
      default:
        console.error("Mode Mémoire inconnu :", this.mode);
    }
  }
  // --------------------------------------------------------------------------------------------
  // demarrage du jeu
  // --------------------------------------------------------------------------------------------
  async start() {
    if (!this.gameInstance) return;
    this.isGameRunning = true;
    await this.gameInstance.start();
  }
  // --------------------------------------------------------------------------------------------
  // arret du jeu
  // --------------------------------------------------------------------------------------------
  stopGameEngine() {
    window.speechSynthesis.cancel();
    this.isGameRunning = false;
    this.locked = true;
    this.peutJouer = false;

    clearTimeout(this.taupeTimeout);
    clearInterval(this.chronoInterval);

    //Interrompt proprement le mode en cours
    if (this.gameInstance?.interrompu !== undefined) {
      this.gameInstance.interrompu = true;
    }

    if (typeof this.gameInstance?.stop === "function") {
      //nettoie les intervalles / événements
      this.gameInstance.stop();
    }
  }
  // --------------------------------------------------------------------------------------------
  // remise a zero
  // --------------------------------------------------------------------------------------------
  resetGame() {
    this.isGameRunning = false;

    const grid = document.getElementById("game");
    if (grid) {
      grid.innerHTML = "";
      grid.className = "";
    }

    this.locked = false;
    this.sequence = [];
    this.taupesTrouvees = [];
    this.firstSelection = null;
    this.secondSelection = null;
    this.gameInstance = null;
    this.trousVerrouilles = [];
  }
  // --------------------------------------------------------------------------------------------
  // remise a zero et creation de la grille de jeu
  // --------------------------------------------------------------------------------------------
  initialiserGrille(holes, onTaupeClicked = null) {
    const container = document.getElementById("game");
    container.innerHTML = "";
    container.className = "grid-" + holes;

    for (let i = 0; i < holes; i++) {
      const hole = document.createElement("div");
      hole.id = `hole-${i}`;
      hole.className = "hole";

      const taupeWrapper = document.createElement("div");
      taupeWrapper.className = "taupe-wrapper";

      const taupe = document.createElement("div");
      taupe.className = "taupe";

      taupe.style.backgroundImage = `url(../franck/images/taupes/taupe.png)`;
      taupe.style.transform = "translateY(100%)";
      
      taupeWrapper.appendChild(taupe);
      hole.appendChild(taupeWrapper);
      container.appendChild(hole);

      if (onTaupeClicked) {
        taupeWrapper.addEventListener("click", () => {
          if (!this.locked && !taupeWrapper.classList.contains("disabled"))
            onTaupeClicked(i);
        });
      }
    }
  }
  // --------------------------------------------------------------------------------------------
  // methode generer le plateau de jeu type mémoire
  // --------------------------------------------------------------------------------------------
  async genererPlateauMemoire(tempHoles, onTaupeClicked) {
    // Crée la grille de jeu
    this.initialiserGrille(tempHoles, onTaupeClicked);
    document
      .querySelectorAll(".taupe-wrapper")
      .forEach((el) => el.classList.remove("disabled"));
    this.peutJouer = true;

    // Charge les données des taupes
    const taupesData = await TaupesLoader.load();
    const nombrePaires = Math.floor(tempHoles / 2);
    let taupesUniques = [];

    // Sélectionne des taupes uniques pour les paires
    while (taupesUniques.length < nombrePaires) {
      const taupe = taupesData[Math.floor(Math.random() * taupesData.length)];
      if (!taupesUniques.includes(taupe)) {
        taupesUniques.push(taupe);
      }
    }

    // Crée la séquence de taupes (chaque image en double)
    let sequence = [];
    taupesUniques.forEach((taupe) => {
      sequence.push({ image: taupe.image });
      sequence.push({ image: taupe.image });
    });

    // Mélange la séquence
    sequence = sequence.sort(() => Math.random() - 0.5);
    this.sequence = sequence;
    this.firstSelection = null;
    this.secondSelection = null;

    // Applique les images sur la grille
    sequence.forEach((taupe, index) => {
      const hole = document.querySelector(`#hole-${index}`);
      if (hole) {
        const taupeDiv = hole.querySelector(".taupe");
        if (taupeDiv) taupeDiv.style.backgroundImage = `url(${taupe.image})`;
      }
    });

    // Désactive les clics pendant la mémorisation
    document
      .querySelectorAll(".taupe-wrapper")
      .forEach((el) => el.classList.add("disabled"));

    // Récupère tous les index de trous visibles (pour croix ou grilles custom)
    const holes = Array.from(document.querySelectorAll(".hole"))
      .filter((hole) => hole.style.display !== "none")
      .map((hole) => Number(hole.id.replace("hole-", "")));

    // Toutes les taupes sortent pour la mémorisation
    for (const i of holes) {
      this.sortieTaupe(i, true, true);
    }

    // Attend que le joueur mémorise
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Toutes les taupes rentrent
    for (const i of holes) {
      await this.rentreTaupe(i, 400, true);
    }

    // Réactive les clics
    document
      .querySelectorAll(".taupe-wrapper")
      .forEach((el) => el.classList.remove("disabled"));

    this.locked = false;
  }
  // --------------------------------------------------------------------------------------------
  //  méthode pour générer le plateau de jeu auditif
  // --------------------------------------------------------------------------------------------
  genererPlateauAuditif(holes, onTaupeClicked = null) {
    const container = document.getElementById("game");
    container.innerHTML = "";
    container.className = "grid-9"; // toujours une grille 3x3

    // 1. Création des 9 cases fixes
    for (let i = 0; i < 9; i++) {
      const hole = document.createElement("div");
      hole.id = `hole-${i}`;
      hole.className = "hole";
      hole.style.visibility = "hidden"; // invisible par défaut

      // Création du wrapper + taupe
      const taupeWrapper = document.createElement("div");
      taupeWrapper.className = "taupe-wrapper disabled";

      const taupe = document.createElement("div");
      taupe.className = "taupe";
      taupe.style.backgroundImage = `url(../franck/images/taupes/taupe.png)`;
      taupe.style.transform = "translateY(100%)";

      taupeWrapper.appendChild(taupe);
      hole.appendChild(taupeWrapper);
      container.appendChild(hole);
    }

    // 2. Mapping pour 4 ou 8 trous (index visuel de la grille 3x3)
    let mapping = [];

    if (holes === 4) {
      mapping = [
        { logicIndex: 0, gridIndex: 1 }, // Avant (2)
        { logicIndex: 1, gridIndex: 3 }, // Gauche (4)
        { logicIndex: 2, gridIndex: 5 }, // Droite (6)
        { logicIndex: 3, gridIndex: 7 }, // Arrière (8)
      ];
    } else if (holes === 8) {
      mapping = [
        { logicIndex: 0, gridIndex: 0 }, // Avant-gauche (1)
        { logicIndex: 1, gridIndex: 1 }, // Avant (2)
        { logicIndex: 2, gridIndex: 2 }, // Avant-droit (3)
        { logicIndex: 3, gridIndex: 3 }, // Gauche (4)
        { logicIndex: 4, gridIndex: 5 }, // Droite (6)
        { logicIndex: 5, gridIndex: 6 }, // Arrière-gauche (7)
        { logicIndex: 6, gridIndex: 7 }, // Arrière (8)
        { logicIndex: 7, gridIndex: 8 }, // Arrière-droit (9)
      ];
    }

    // 3. Active uniquement les trous utilisés
    mapping.forEach(({ logicIndex, gridIndex }) => {
      const hole = document.getElementById(`hole-${gridIndex}`);
      if (!hole) return;

      hole.style.visibility = "visible";

      const wrapper = hole.querySelector(".taupe-wrapper");
      if (wrapper) {
        wrapper.classList.remove("disabled");

        if (onTaupeClicked) {
          wrapper.addEventListener("click", () => {
            if (!this.locked && !wrapper.classList.contains("disabled")) {
              onTaupeClicked(logicIndex);
            }
          });
        }
      }
    });
  }
  // --------------------------------------------------------------------------------------------
  //  Retourne un trou aléatoire qui n'est pas le dernier utilisé
  // --------------------------------------------------------------------------------------------
  getRandomHole() {
    let index;
    do {
      index = Math.floor(Math.random() * this.holes);
    } while (index === this.lastIndexUsed && this.holes > 1); // éviter boucle infinie si un seul trou

    this.lastIndexUsed = index;
    return index;
  }
  // --------------------------------------------------------------------------------------------
  // La taupe sort de son trou
  // --------------------------------------------------------------------------------------------
  async sortieTaupe(index, force = false, ignoreLock = false) {
    if (typeof index !== "number" || isNaN(index)) return;
    if ((!this.isGameRunning && !force) || (this.locked && !ignoreLock)) return;

    if (!ignoreLock) this.locked = true;

    const hole = document.querySelector(`#hole-${index}`);
    if (!hole) {
      console.warn(`[WARN] sortieTaupe : hole-${index} introuvable`);
      if (!ignoreLock) this.locked = false;
      return;
    }

    const taupeDiv = hole.querySelector(".taupe");
    if (!taupeDiv) {
      console.warn(`[WARN] sortieTaupe : .taupe introuvable`);
      if (!ignoreLock) this.locked = false;
      return;
    }

    taupeDiv.style.transform = "translateY(0%)";
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!ignoreLock) this.locked = false;
  }
  // --------------------------------------------------------------------------------------------
  // La taupe rentre dans son trou
  // --------------------------------------------------------------------------------------------
  async rentreTaupe(index, dureeDescente = 400, force = false) {
    if (typeof index !== "number" || isNaN(index)) return;
    if (!this.isGameRunning && !force) return;

      const hole = document.getElementById(`hole-${index}`);
    if (!hole) {
      console.warn(`[WARN] rentreTaupe : hole-${index} introuvable`);
      return;
    }

    const taupeDiv = hole.querySelector(".taupe");
    if (!taupeDiv) {
      console.warn(
        `[WARN] rentreTaupe : .taupe introuvable dans hole-${index}`
      );
      return;
    }

    taupeDiv.style.transform = "translateY(100%)";
    await new Promise((resolve) => setTimeout(resolve, dureeDescente));
  }
  // --------------------------------------------------------------------------------------------
  // La taupe sort et rentre de son trou
  // --------------------------------------------------------------------------------------------
  async afficherTaupeAvecDetection(
    index,
    dureeVisible,
    jouerSon = false,
    dureeDescente = 300
  ) {
    return new Promise(async (resolve) => {
      if (!this.isGameRunning) {
        console.warn(`[STOP] afficherTaupeAvecDetection annulée (jeu arrêté)`);
        resolve(false);
        return;
      }

      const hole = document.querySelector(`#hole-${index}`);
      if (!hole) {
        console.warn(`[WARN] Hole introuvable pour index ${index}`);
        resolve(false);
        return;
      }

      const taupeDiv = hole.querySelector(".taupe");
      if (!taupeDiv) {
        console.warn(`[WARN] .taupe introuvable dans hole-${index}`);
        resolve(false);
        return;
      }

      let alreadyClicked = false;

      const cleanup = () => {
        hole.removeEventListener("click", onClick);
        window.removeEventListener("keydown", onKeyDown);
      };

      const onClick = () => {
        if (alreadyClicked || !this.isGameRunning) return;
        alreadyClicked = true;
        const pow = document.createElement("div");
        pow.className = "powEffect";
        hole.appendChild(pow);

        // Supprimer après l'animation ou un délai
        setTimeout(() => {
          pow.remove();
        }, 300); // ou la durée de ton animation CSS
        cleanup();
        this.rentreTaupe(index, dureeDescente);
        resolve(true);
        return;
      };

      const onKeyDown = (e) => {
        if (alreadyClicked || !this.isGameRunning) return;
        if (this.isCorrectKey(e.key, index)) {
          alreadyClicked = true;
          const pow = document.createElement("div");
          pow.className = "powEffect";
          hole.appendChild(pow);

          // Supprimer après l'animation ou un délai
          setTimeout(() => {
            pow.remove();
          }, 300); // ou la durée de ton animation CSS
          cleanup();
          this.rentreTaupe(index, dureeDescente);
          resolve(true);
          return;
        }
      };

      hole.addEventListener("click", onClick);
      window.addEventListener("keydown", onKeyDown);

      this.sortieTaupe(index, jouerSon);
      this.taupesApparues = (this.taupesApparues || 0) + 1;
      await new Promise((res) => setTimeout(res, dureeVisible));

      if (!this.isGameRunning) {
        cleanup();
        resolve(false);
        return;
      }

      await this.rentreTaupe(index, dureeDescente);

      if (!alreadyClicked) {
        cleanup();
        resolve(false);
      }
    });
  }
  // --------------------------------------------------------------------------------------------
  // methode de comparaison de deux taupes et traitement selon type de jeu
  // --------------------------------------------------------------------------------------------
  checkMemoryPair(index, pairesTrouvees, totalPaires, erreurs, onGameEnd) {
    if (this.firstSelection !== null && this.secondSelection !== null) {
      return { foundPair: false, pairesTrouvees, erreurs };
    }

    const hole = document.querySelector(`#hole-${index}`);
    if (
      !hole ||
      hole.classList.contains("matched") ||
      hole.classList.contains("locked")
    ) {
      return { foundPair: false, pairesTrouvees, erreurs };
    }

    const taupeDiv = hole.querySelector(".taupe");
    if (!taupeDiv) return { foundPair: false, pairesTrouvees, erreurs };

    hole.classList.add("locked");

    if (this.firstSelection === null) {
      this.firstSelection = { index, image: this.sequence[index].image };
      taupeDiv.style.transform = "translateY(0%)";
      return { foundPair: false, pairesTrouvees, erreurs };
    } else if (this.secondSelection === null) {
      this.secondSelection = { index, image: this.sequence[index].image };
      taupeDiv.style.transform = "translateY(0%)";

      const first = this.firstSelection;
      const second = this.secondSelection;

      if (first.image === second.image) {
        // ✅ Bonne paire
        document.querySelector(`#hole-${first.index}`).classList.add("matched");
        document
          .querySelector(`#hole-${second.index}`)
          .classList.add("matched");

        pairesTrouvees++;
        this.resetSelections();

        if (pairesTrouvees === totalPaires && typeof onGameEnd === "function") {
          setTimeout(() => onGameEnd(), 500);
        }

        return { foundPair: true, pairesTrouvees, erreurs };
      } else {
        // ❌ Mauvaise paire
        erreurs++;
        setTimeout(async () => {
          await this.rentreTaupe(first.index);
          await this.rentreTaupe(second.index);

          document
            .querySelector(`#hole-${first.index}`)
            .classList.remove("locked");
          document
            .querySelector(`#hole-${second.index}`)
            .classList.remove("locked");

          this.resetSelections();
        }, 800);

        return { foundPair: false, pairesTrouvees, erreurs };
      }
    }

    return { foundPair: false, pairesTrouvees, erreurs };
  }
  // --------------------------------------------------------------------------------------------
  //  verifie si la touche appuyée correspond a la taupe selectionnée
  // --------------------------------------------------------------------------------------------
  isCorrectKey(key, index) {
    // certain navigateur son sensible donc les touche sont en chaines de caracter
    const map8 = { 1: 0, 2: 1, 3: 2, 6: 3, 9: 4, 8: 5, 7: 6, 4: 7 };
    const map4 = { 2: 1, 4: 7, 8: 5, 6: 3 };

    const map = this.holes === 8 ? map8 : map4;

    return map[key] === index;
  }
  // --------------------------------------------------------------------------------------------
  //  remet les selections a null
  // --------------------------------------------------------------------------------------------
  resetSelections() {
    this.firstSelection = null;
    this.secondSelection = null;
  }
  // --------------------------------------------------------------------------------------------
  //  active les clics sur les trous pour le jeu
  // --------------------------------------------------------------------------------------------
  enableHoleClick(callback) {
    const holes = document.querySelectorAll(".hole");
    holes.forEach((hole, i) => {
      hole.onclick = () => {
        callback(i);
      };
    });
  }
  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
  disableHoleClick() {
    const holes = document.querySelectorAll(".hole");
    holes.forEach((hole) => {
      const clone = hole.cloneNode(true);
      hole.parentNode.replaceChild(clone, hole); // supprime tous les events click
    });
  }
  // --------------------------------------------------------------------------------------------
  // Affiche un testSon dans l'interface
  // --------------------------------------------------------------------------------------------
  async activerModeTestSonsAuditifs(holes) {
    const container = document.getElementById("game");
    container.innerHTML = "";
    container.className = "grid-9";

    for (let i = 0; i < 9; i++) {
      const hole = document.createElement("div");
      hole.className = "hole active-hole";
      hole.id = `test-hole-${i}`;
      hole.textContent = i;

      hole.addEventListener("click", async () => {
        const sonPath = await TaupesLoader.getSonAuditif(8, i);
        console.log(`Trou ${i} ➜ Son :`, sonPath);
        if (sonPath) {
          new Audio(sonPath).play();
        } else {
          console.warn(`Aucun son pour index ${i}`);
        }
      });

      container.appendChild(hole);
    }

    UIManager.afficherMessageTestSound(
      "🎧 Mode test auditif actif – Cliquez sur un trou pour tester le son."
    );
  }
  // --------------------------------------------------------------------------------------------
  //  Enregistre les paramètres du jeu dans le local storage
  // --------------------------------------------------------------------------------------------
  static saveConfig() {
    const volumeInput = document.getElementById("volumeControl");
    const descenteInput = document.getElementById("dureeDescente");
    const apparitionRookieInput = document.getElementById("apparitionRookie");
    const apparitionEasyInput = document.getElementById("apparitionEasy");
    const apparitionKillerInput = document.getElementById("apparitionKiller");
    const chronoRookieInput = document.getElementById("chronoRookie");
    const chronoEasyInput = document.getElementById("chronoEasy");
    const chronoKillerInput = document.getElementById("chronoKiller");

    if (
      !volumeInput ||
      !descenteInput ||
      !apparitionRookieInput ||
      !apparitionEasyInput ||
      !apparitionKillerInput ||
      !chronoRookieInput ||
      !chronoEasyInput ||
      !chronoKillerInput
    ) {
      console.warn("Certains éléments du menu config sont absents du DOM.");
      return;
    }

    GameConfig.volume = parseFloat(volumeInput.value);
    GameConfig.dureeDescente = parseFloat(descenteInput.value);
    GameConfig.reflexe.rookie = parseInt(apparitionRookieInput.value);
    GameConfig.reflexe.easy = parseInt(apparitionEasyInput.value);
    GameConfig.reflexe.killer = parseInt(apparitionKillerInput.value);
    GameConfig.chrono.rookie = parseInt(chronoRookieInput.value);
    GameConfig.chrono.easy = parseInt(chronoEasyInput.value);
    GameConfig.chrono.killer = parseInt(chronoKillerInput.value);

    // Sauvegarde dans le localStorage
    localStorage.setItem("gameConfig", JSON.stringify(GameConfig));
  }
}
