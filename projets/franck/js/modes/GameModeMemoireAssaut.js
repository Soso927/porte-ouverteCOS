import { UIManager } from "../ui/UIManager.js";
import { GameConfig } from "../ui/GameConfig.js";

// --------------------------------------------------------------------------------------------
//
// --------------------------------------------------------------------------------------------
export class GameModeMemoireAssaut {
   constructor(gameInstance, holes, difficulty, typeJeu) {
    this.gameInstance = gameInstance;
    this.holes = holes;
    this.difficulty = difficulty;
    this.typeJeu = typeJeu;

    this.pairesTrouvees = 0;
    this.erreurs = 0;
    this.interrompu = false;
    this.nbPlateaux = GameConfig.memoireAssaut.nbPlateaux;
  }
  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
   async start() {
    this.niveau = 1;
    this.currentHoles = this.holes;
    this.pairesTrouvees = 0;
    this.erreurs = 0;

    this.gameInstance.locked = true;
    this.gameInstance.initialiserGrille(this.currentHoles, (index) => this.onClickMemory(index));

    await UIManager.launchCountdown();
    UIManager.resetAllCompteurs();
    UIManager.afficherCompteurs(this.typeJeu);

    this.gameInstance.locked = false;
    await this.lancerMemoire();
  }
  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
     async lancerMemoire() {
    this.locked = true;
    this.gameInstance.peutJouer = false;

    await this.gameInstance.genererPlateauMemoire(this.currentHoles, (index) => this.onClickMemory(index));

    this.totalPaires = Math.floor(this.currentHoles / 2);
    this.maxErreurs = GameConfig.getMaxErreurs(this.currentHoles);

    this.pairesTrouvees = 0;
    this.erreurs = 0;

    UIManager.mettreAJourFindP1(this.pairesTrouvees);
    UIManager.mettreAJourMissP1(this.erreurs);
    UIManager.showMessage(`Niveau ${this.niveau} - ${this.currentHoles} trous`, 1500);

    this.locked = false;
    this.gameInstance.peutJouer = true;
  }
  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
  onClickMemory(index) {
    if (this.locked || !this.gameInstance.peutJouer) return;

    const hole = document.querySelector(`#hole-${index}`);
    if (!hole || hole.classList.contains("disabled")) return;

    const result = this.gameInstance.checkMemoryPair(
      index,
      this.pairesTrouvees,
      this.totalPaires,
      this.erreurs,
      async () => {
        // Plateau terminé avec succès
        if (this.niveau >= this.nbPlateaux) {
          this.gameInstance.stopGameEngine();
          UIManager.afficherResultatMemoireAssaut(
            this.pairesTrouvees,
            this.erreurs,
            false // gagné
          );
        } else {
          this.niveau++;
          this.currentHoles += 2;
          this.pairesTrouvees = 0;
          this.erreurs = 0;

          this.gameInstance.resetSelections();
          this.gameInstance.sequence = [];

          document.querySelectorAll(".hole").forEach(h => h.classList.remove("matched", "locked"));
          document.querySelectorAll(".taupe").forEach(t => {
            t.style.transform = "translateY(100%)";
            t.dataset.found = "false";
            t.dataset.revealed = "false";
          });

          await this.lancerMemoire();
        }
      }
    );

    this.pairesTrouvees = result.pairesTrouvees;
    this.erreurs = result.erreurs;

    UIManager.mettreAJourFindP1(this.pairesTrouvees);
    UIManager.mettreAJourMissP1(this.erreurs);

    if (this.erreurs >= this.maxErreurs) {
      this.gameInstance.stopGameEngine();
      UIManager.afficherResultatMemoireAssaut(
        this.pairesTrouvees,
        this.erreurs,
        true // perdu
      );
    }
  }
  stopGameMode() {
    this.interrompu = true;
    this.gameInstance?.stopGameEngine();
  }
}
