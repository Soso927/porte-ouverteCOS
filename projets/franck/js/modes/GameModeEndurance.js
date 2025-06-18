import { UIManager } from "../ui/UIManager.js";
// import { GameConfig } from "../ui/GameConfig.js";

// --------------------------------------------------------------------------------------------
// declartion et creation de la classe GameModeEndurance
// --------------------------------------------------------------------------------------------
export class GameModeEndurance {
  constructor(gameInstance, holes, difficulty, typeJeu) {
    this.gameInstance = gameInstance;
    this.holes = holes;
    this.difficulty = difficulty;
    this.typeJeu = typeJeu;

    this.score = 0;
    this.erreurs = 0;
    this.interrompu = false;
    this.chrono = 0;
    this.chronoInterval = null;
  }
  // --------------------------------------------------------------------------------------------
  // methode de demarrage du jeu selon type de jeu
  // --------------------------------------------------------------------------------------------
  async start() {
    this.interrompu = false;
    this.score = 0;
    this.erreurs = 0;
    this.chrono = 0;

    this.gameInstance.locked = true;
    this.gameInstance.initialiserGrille(this.holes);

    await UIManager.launchCountdown();
    UIManager.resetAllCompteurs();
    UIManager.afficherCompteurs(this.typeJeu);

    this.gameInstance.isGameRunning = true;
    this.gameInstance.locked = false;

    this.lancerChrono();
    await this.lancerEndurance();
  }
  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
  lancerChrono() {
    this.chronoInterval = setInterval(() => {
      this.chrono++;
    }, 1000);
  }

  // --------------------------------------------------------------------------------------------
  // methode du mode de jeu endurance
  // --------------------------------------------------------------------------------------------
  async lancerEndurance() {
    const baseDuration = 1000;
    let taupesApparues = 0;
    let vitesse = baseDuration;

    while (this.gameInstance.isGameRunning && !this.interrompu) {
      const index = this.gameInstance.getRandomHole();
      const hit = await this.gameInstance.afficherTaupeAvecDetection(
        index,
        vitesse
      );

      if (!this.gameInstance.isGameRunning || this.interrompu) break;

      taupesApparues++;

      if (hit) {
        this.score++;
        UIManager.mettreAJourTouchesP1(this.score);
      } else {
        this.erreurs++;
        UIManager.mettreAJourMissP1(this.erreurs);
        break; // 🟥 Fin immédiate après une erreur
      }

      UIManager.mettreAJourTotalP1(taupesApparues);

      if (taupesApparues % 5 === 0) {
        vitesse = Math.max(300, vitesse - 100);
      }

      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    this.stopGameMode();
    UIManager.afficherResultatEndurance(
      this.score,
      this.erreurs,
      this.chrono,
      this.typeJeu
    );
  }

  stopGameMode() {
    this.interrompu = true;
    if (this.chronoInterval) clearInterval(this.chronoInterval);
    this.gameInstance?.stopGameEngine();
  }
}
