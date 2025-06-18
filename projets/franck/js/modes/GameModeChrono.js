import { UIManager } from "../ui/UIManager.js";
import { GameConfig } from "../ui/GameConfig.js";

// --------------------------------------------------------------------------------------------
// Déclaration et création de la classe GameModeChrono
// --------------------------------------------------------------------------------------------
export class GameModeChrono {
  constructor(gameInstance, holes, difficulty, typeJeu) {
    this.gameInstance = gameInstance;
    this.holes = holes;
    this.difficulty = difficulty;
    this.typeJeu = typeJeu;
    this.locked = true;
    this.score = 0;
    this.erreurs = 0;
    this.interrompu = false;
    this.timer = null;
    this.tempsTotal = GameConfig.chrono[this.difficulty];
  }
  // --------------------------------------------------------------------------------------------
  // Méthode de démarrage du jeu selon type de jeu
  // --------------------------------------------------------------------------------------------
  async start() {
    this.interrompu = false;
    this.score = 0;
    this.erreurs = 0;
    this.gameInstance.locked = true;

    // Initialisation de la grille uniquement pour le mode Chrono
    this.gameInstance.initialiserGrille(this.holes);

    // Réinitialise les compteurs et affiche les composants
    UIManager.resetAllCompteurs();
    UIManager.afficherCompteurs(this.typeJeu);
    UIManager.afficherChrono(this.tempsTotal);

    await UIManager.launchCountdown();

    this.gameInstance.locked = false;

    await this.lancerChrono(this.typeJeu === "Auditif");
  }
  // --------------------------------------------------------------------------------------------
  // Méthode du mode de jeu Chrono
  // --------------------------------------------------------------------------------------------
  async lancerChrono(jouerSon) {
    const dureeVisibleBase = GameConfig.reflexe[this.difficulty];
    let tempsRestant = this.tempsTotal;

    UIManager.afficherCompteurs(this.typeJeu);
    UIManager.mettreAJourTouchesP1(this.score);
    UIManager.mettreAJourMissP1(this.erreurs);
    UIManager.afficherChrono(tempsRestant);

    this.gameInstance.isGameRunning = true;

    this.timer = setInterval(() => {
      if (this.interrompu) {
        clearInterval(this.timer);
        return;
      }

      tempsRestant--;
      UIManager.afficherChrono(tempsRestant);

      if (tempsRestant <= 0 || !this.gameInstance.isGameRunning) {
        clearInterval(this.timer);
        if (!this.interrompu) {
          this.gameInstance.stopGameEngine();
          UIManager.afficherResultatChrono(
            this.score,
            this.erreurs,
            this.tempsTotal,
            this.typeJeu
          );
        }
      }
    }, 1000);

    while (this.gameInstance.isGameRunning && tempsRestant > 0) {
      if (this.interrompu) break;

      const index = this.gameInstance.getRandomHole();
      const variation = 0.85 + Math.random() * 0.3;
      const dureeVisible = dureeVisibleBase * variation;

      const hit = await this.gameInstance.afficherTaupeAvecDetection(
        index,
        dureeVisible,
        jouerSon
      );

      if (
        !this.gameInstance.isGameRunning ||
        this.interrompu ||
        tempsRestant <= 0
      )
        break;

      if (hit) {
        this.score++;
        UIManager.mettreAJourTouchesP1(this.score);
      } else {
        this.erreurs++;
        UIManager.mettreAJourMissP1(this.erreurs);
      }

      const delay = Math.random() * 200;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (!this.interrompu && this.gameInstance.isGameRunning) {
      this.gameInstance.stopGameEngine();
      document.getElementById("chrono").style.display = "none";
      UIManager.afficherResultatChrono(
        this.score,
        this.erreurs,
        this.tempsTotal,
        this.typeJeu
      );
    }
  }
  stopGameMode() {
    this.interrompu = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.gameInstance?.stopGameEngine();
  }
}
