import { UIManager } from '../ui/UIManager.js';
import { GameConfig } from "../ui/GameConfig.js";

// --------------------------------------------------------------------------------------------
// 
// --------------------------------------------------------------------------------------------
export class GameModeMemoireChrono {
  constructor(gameInstance, holes, difficulty, typeJeu) {
    this.gameInstance = gameInstance;
    this.holes = holes;
    this.difficulty = difficulty;
    this.typeJeu = typeJeu;

    this.pairesTrouvees = 0;
    this.erreurs = 0;
    this.totalPaires = Math.floor(this.holes / 2);
    this.timer = null;

    this.tempsTotal = GameConfig.chrono[this.difficulty];
    this.tempsRestant = this.tempsTotal;
    this.interrompu = false;
  }
// --------------------------------------------------------------------------------------------
// 
// --------------------------------------------------------------------------------------------
  async start() {
    this.interrompu = false;
    this.pairesTrouvees = 0;
    this.erreurs = 0;

    this.gameInstance.locked = true;
    this.gameInstance.initialiserGrille(this.holes);

    await UIManager.launchCountdown();
    UIManager.resetAllCompteurs();
    UIManager.afficherCompteurs(this.typeJeu);
    UIManager.afficherChrono(this.tempsRestant);

    await this.lancerMemoire();
    this.debutChrono();

    this.gameInstance.locked = false;
  }
// --------------------------------------------------------------------------------------------
// 
// --------------------------------------------------------------------------------------------

  async lancerMemoire() {
    this.gameInstance.peutJouer = false;
    await this.gameInstance.genererPlateauMemoire(this.holes, (index) => this.onClickMemory(index));
    UIManager.showMessage("C'est parti !", 1500);
    this.gameInstance.peutJouer = true;
  }

// --------------------------------------------------------------------------------------------
// 
// --------------------------------------------------------------------------------------------
   debutChrono() {
    this.timer = setInterval(() => {
      this.tempsRestant--;
      UIManager.afficherChrono(this.tempsRestant);

      if (this.tempsRestant <= 0) {
        clearInterval(this.timer);
        this.gameInstance.peutJouer = false;
        this.stopGameMode();
        UIManager.afficherResultatMemoireChrono(
          this.pairesTrouvees,
          this.erreurs,
          this.tempsTotal,
          this.typeJeu
        );
      }
    }, 1000);
  } 
// --------------------------------------------------------------------------------------------
// 
// --------------------------------------------------------------------------------------------
  onClickMemory(index) {
    if (!this.gameInstance.peutJouer || this.interrompu) return;

    const result = this.gameInstance.checkMemoryPair(
      index,
      this.pairesTrouvees,
      this.totalPaires,
      this.erreurs,
      () => {
        this.stopGameMode();
        UIManager.afficherResultatMemoireChrono(
          this.pairesTrouvees,
          this.erreurs,
          this.tempsTotal - this.tempsRestant,
          this.typeJeu
        );
      }
    );

    this.pairesTrouvees = result.pairesTrouvees;
    this.erreurs = result.erreurs;

    UIManager.mettreAJourFindP1(this.pairesTrouvees);
    UIManager.mettreAJourMissP1(this.erreurs);
  }
    stopGameMode() {
    this.interrompu = true;
    clearInterval(this.timer);
    this.gameInstance?.stopGameEngine();
  }
}

