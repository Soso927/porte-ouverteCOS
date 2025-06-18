import { UIManager } from "../ui/UIManager.js";
import { TaupesLoader } from "../loader/TaupesLoader.js";
import { AudioManager } from "../core/AudioManager.js";
import { AudioConfig } from "../ui/AudioConfig.js";

// --------------------------------------------------------------------------------------------
// declartion et creation de la classe GameModeBattle
// --------------------------------------------------------------------------------------------
export class GameModeBattle {
  constructor(gameInstance, holes, difficulty, typeJeu) {
    this.gameInstance = gameInstance;
    this.holes = holes;
    this.difficulty = difficulty;
    this.typeJeu = typeJeu;
    this.peutJouer = false;
    this.scoreP1 = 0;
    this.erreursP1 = 0;
    this.scoreP2 = 0;
    this.erreursP2 = 0;
    this.currentPlayer = 1;
    this.locked = true;
  }
  // --------------------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------------------
  async start() {
  this.locked = true;

  // Grille de sélection pour déterminer le joueur qui commence
  this.gameInstance.initialiserGrille(2);
  await UIManager.launchCountdown();
  await this.phaseDeSelection();

  // 🔁 Nettoyage DOM : supprime tout contenu de la grille
  const container = document.getElementById("game");
  if (container) {
    container.innerHTML = ""; // Vide le contenu
  }

  // 🧱 Réinitialise la vraie grille de jeu avec les bons trous
  this.gameInstance.initialiserGrille(this.holes, (index) =>
    this.onClickBattle(index)
  );

  this.peutJouer = false;

  // 🚀 Lance la logique Battle mémoire
  await this.lancerBattleMemoire();
}
  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
  async phaseDeSelection() {
    const taupes = await TaupesLoader.load();
    const taupeVictoire = taupes.find((t) => t.name === "victoire");
    const taupeDefaite = taupes.find((t) => t.name === "defaite");

    const taupesSelection = [taupeVictoire, taupeDefaite];
    taupesSelection.sort(() => Math.random() - 0.5);

    for (let i = 0; i < 2; i++) {
      const taupeWrapper = document.querySelector(`#hole-${i} .taupe`);
      taupeWrapper.dataset.taupeType = taupesSelection[i].name;
      taupeWrapper.style.backgroundImage = `url(${taupesSelection[i].image})`;
    }

    const indexClique = await new Promise((resolve) => {
      document.querySelectorAll(".hole").forEach((hole, index) => {
        hole.addEventListener("click", () => resolve(index), { once: true });
      });
    });

    this.gameInstance.sortieTaupe(indexClique);

    const taupeWrapperClique = document.querySelector(
      `#hole-${indexClique} .taupe`
    );
    const typeTaupe = taupeWrapperClique.dataset.taupeType;
    this.currentPlayer = typeTaupe === "victoire" ? 1 : 2;
    
    if (typeTaupe === "victoire") {
      AudioManager.playEffect(AudioConfig.soundsTaupes.victory);
    } else {
      AudioManager.playEffect(AudioConfig.soundsTaupes.lose);
    }

    await new Promise((resolve) => setTimeout(resolve, 700));

    const message =
      this.currentPlayer === 1
        ? "Bravo ! Tu commences la partie."
        : "Dommage ! Ton adversaire commence.";
    UIManager.showMessage(message, 2000);
    UIManager.setActivePlayer(this.currentPlayer);
  }

  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
  async lancerBattleMemoire() {
    UIManager.afficherCompteurs(this.typeJeu);
    UIManager.resetAllCompteurs();

    this.locked = true;
    await this.gameInstance.genererPlateauMemoire(this.holes);

for (let i = 0; i < this.holes; i++) {
  const taupeWrapper = document.querySelector(`#hole-${i} .taupe-wrapper`);
  if (taupeWrapper) {
    const newWrapper = taupeWrapper.cloneNode(true);
    taupeWrapper.parentNode.replaceChild(newWrapper, taupeWrapper);
  } else {
    console.warn(`[WARN] taupeWrapper manquant pour hole-${i}`);
  }
}

    for (let i = 0; i < this.holes; i++) {
      const taupeWrapper = document.querySelector(`#hole-${i} .taupe-wrapper`);
      taupeWrapper.addEventListener("click", () => {
        if (!this.locked) this.onClickBattle(i);
      });
    }

    this.pairesTrouvees = 0;
    this.totalPaires = Math.floor(this.holes / 2);
    this.updateUI();

    UIManager.showMessage("C'est parti !", 3000);
    this.peutJouer = true;
    this.locked = false;
  }

  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
  onClickBattle(index) {
    if (!this.gameInstance.peutJouer || this.locked) return;
    this.locked = true;

    const erreursAvant = this.getCurrentErreurs();

    const result = this.gameInstance.checkMemoryPair(
  index,
  this.pairesTrouvees,
  this.totalPaires,
  erreursAvant
);


   if (result.foundPair) {
  AudioManager.playEffectDing(); // ✅ paire trouvée
  if (this.currentPlayer === 1) {
    this.scoreP1++;
  } else {
    this.scoreP2++;
  }
}

if (result.erreurs > erreursAvant) {
  AudioManager.playEffectLose(); // ❌ erreur
  if (this.currentPlayer === 1) {
    this.erreursP1++;
  } else {
    this.erreursP2++;
  }
}

    this.updateUI();

    if (this.scoreP1 + this.scoreP2 >= Math.floor(this.holes / 2)) {
      AudioManager.playEffectTrompette(); // 🎺 fin de partie
      this.finDePartie();
    } else if (result.erreurs > erreursAvant) {
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
      UIManager.setActivePlayer(this.currentPlayer);
      const message =
        this.currentPlayer === 1
          ? "C'est au Joueur 1 de jouer."
          : "C'est au Joueur 2 de jouer.";
      UIManager.showMessage(message, 1500);
    }

    this.locked = false;
  }

  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
  getCurrentErreurs() {
    return this.currentPlayer === 1 ? this.erreursP1 : this.erreursP2;
  }
  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
  updateUI() {
    UIManager.mettreAJourFindP1(this.scoreP1);
    UIManager.mettreAJourMissP1(this.erreursP1);
    UIManager.mettreAJourFindP2(this.scoreP2);
    UIManager.mettreAJourMissP2(this.erreursP2);
  }
  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
  finDePartie() {
    this.stopGameMode();
    UIManager.afficherResultatBattle(
      this.scoreP1,
      this.erreursP1,
      this.scoreP2,
      this.erreursP2
    );
  }
  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
  stopGameMode() {
    this.locked = true;
    this.peutJouer = false;
    this.gameInstance?.stopGameEngine();
    UIManager.resetActivePlayers?.();
  }
}
