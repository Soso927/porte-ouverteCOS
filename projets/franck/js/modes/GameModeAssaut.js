import { UIManager } from "../ui/UIManager.js";
import { GameConfig } from "../ui/GameConfig.js";

// --------------------------------------------------------------------------------------------
// declartion et creation de la classe GameModeAssaut
// --------------------------------------------------------------------------------------------
export class GameModeAssaut {
  constructor(gameInstance, holes, difficulty, typeJeu) {
    this.gameInstance = gameInstance;
    this.holes = holes;
    this.difficulty = difficulty;
    this.typeJeu = typeJeu;

    this.score = 0;
    this.erreurs = 0;
    this.locked = true;
  }
  // --------------------------------------------------------------------------------------------
  // methode de demarrage du jeu selon type de jeu
  // --------------------------------------------------------------------------------------------
  async start() {
    this.interrompu = false;
    this.score = 0;
    this.erreurs = 0;

    this.gameInstance.locked = true;

    this.gameInstance.initialiserGrille(this.holes); // Grille de départ
    UIManager.resetAllCompteurs();
    UIManager.afficherCompteurs(this.typeJeu);

    await UIManager.launchCountdown();

    this.gameInstance.locked = false;

    await this.lancerAssaut(this.typeJeu === "Auditif");
  }
  // --------------------------------------------------------------------------------------------
  // methode du mode de jeu Assaut
  // --------------------------------------------------------------------------------------------
  async lancerAssaut(jouerSon) {
    const dureeBase = GameConfig.reflexe[this.difficulty];
    const config = GameConfig.reflexeAssaut;
    const nbVagues = config.serie;
    const taupesParVague = config.nbTaupesParSerie;
    const maxHoles = config.maxHoles;

    const holesDepart = this.holes;

    this.gameInstance.isGameRunning = true;

    for (
      let vague = 0;
      vague < nbVagues && this.gameInstance.isGameRunning && !this.interrompu;
      vague++
    ) {
      const nouveauxTrous = Math.min(holesDepart + vague * 2, maxHoles);
      this.holes = nouveauxTrous;
      this.gameInstance.initialiserGrille(this.holes);

      for (
        let i = 0;
        i < taupesParVague &&
        this.gameInstance.isGameRunning &&
        !this.interrompu;
        i++
      ) {
        const index = this.gameInstance.getRandomHole();
        const variation = 0.85 + Math.random() * 0.3;
        const dureeVisible = dureeBase * variation;

        const hit = await this.gameInstance.afficherTaupeAvecDetection(
          index,
          dureeVisible,
          jouerSon
        );

        if (!this.gameInstance.isGameRunning || this.interrompu) return;

        if (hit) {
          this.score++;
          UIManager.mettreAJourTouchesP1(this.score);
        } else {
          this.erreurs++;
          UIManager.mettreAJourMissP1(this.erreurs);

          if (this.erreurs >= 3) {
            await UIManager.showMessage("Perdu !");
            this.gameInstance.stopGameEngine();
            UIManager.afficherResultatAssaut(
              this.score,
              this.erreurs,
              this.typeJeu
            );
            return;
          }
        }

        UIManager.mettreAJourTotalP1(`${this.gameInstance.taupesApparues}`);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      if (vague < nbVagues - 1 && !this.interrompu) {
        UIManager.showMessage(`Vague ${vague + 1} terminée`, 1000);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!this.interrompu && this.gameInstance.isGameRunning) {
      this.gameInstance.stopGameEngine();
      UIManager.afficherResultatAssaut(this.score, this.erreurs, this.typeJeu);
    }
  }
  stopGameMode() {
    this.interrompu = true;
    this.gameInstance?.stopGameEngine();
  }
}
