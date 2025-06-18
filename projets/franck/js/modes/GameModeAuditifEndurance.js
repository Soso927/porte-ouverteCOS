import { UIManager } from "../ui/UIManager.js";
import { TaupesLoader } from "../loader/TaupesLoader.js";
import { GameConfig } from "../ui/GameConfig.js";
import { AudioManager } from "../core/AudioManager.js";

export class GameModeAuditifEndurance {
  constructor(gameInstance, holes, difficulty) {
    this.gameInstance = gameInstance;
    this.holes = holes;
    this.difficulty = difficulty;
    this.find = 0;
    this.miss = 0;
    this.currentIndex = null;
    this.locked = false;
    this.gameOver = false;
    this.startTime = null;
    this.endTime = null;
    this.targetFind = GameConfig.auditifChrono[difficulty];
  }

  async start() {
    window.speechSynthesis.cancel(); 
    document.getElementById("musiqueIntro")?.pause();

    await this.gameInstance.genererPlateauAuditif(
      this.holes,
      async (gridIndex) => {
        await this.handlePlayerChoice(gridIndex);
      }
    );

    await UIManager.launchCountdown();

    UIManager.afficherCompteurs("Auditif");
    UIManager.resetAllCompteurs();
    UIManager.mettreAJourTotalP1(this.find);
    UIManager.mettreAJourMissP1(this.miss);

    this.startTime = Date.now();

    this.nextRound();
  }

  stop({ silent = false } = {}) {
    this.gameOver = true;
    this.endTime = Date.now();
    this.gameInstance.disableHoleClick?.();

if (!silent) {
  window.speechSynthesis.cancel(); // ← arrête toute voix encore en cours
  const totalTime = Math.floor((this.endTime - this.startTime) / 1000);
  UIManager.afficherResultatAuditifChrono(this.find, this.miss, totalTime);

  const utterance = new SpeechSynthesisUtterance(
    `Bravo ! ${this.find} bonnes réponses, ${this.miss} erreurs. Temps total : ${totalTime} secondes.`
  );
  speechSynthesis.speak(utterance);
}
  }

 async nextRound() {
  if (this.gameOver) return;

  const possibleIndexes = this.holes === 4
    ? [0, 1, 2, 3] // Avant, Gauche, Droite, Arrière
    : [0, 1, 2, 3, 4, 5, 6, 7]; // 8 positions logiques

  const randomLogicIndex = possibleIndexes[Math.floor(Math.random() * possibleIndexes.length)];
  this.currentIndex = randomLogicIndex;
  this.locked = false;

  // Joue le son associé à la position logique
  const sonPath = await TaupesLoader.getSonAuditif(this.holes, this.currentIndex);
  if (sonPath) {
    const audio = new Audio(sonPath);
    audio.play();
  }

  // ➤ PAS DE sortieTaupe ici — attend la réponse du joueur
}

 async handlePlayerChoice(playerIndex) {
  if (this.locked || this.gameOver || playerIndex === null) return;
  this.locked = true;

  const isCorrect = playerIndex === this.currentIndex;

  // Mapping logique → index visuel (pour animation taupe)
  const gridMapping = this.holes === 4
    ? [1, 3, 5, 7]
    : [0, 1, 2, 3, 5, 6, 7, 8];

  const gridIndex = gridMapping[this.currentIndex];

  // La taupe sort maintenant, après réponse
  await this.gameInstance.sortieTaupe(gridIndex);

if (isCorrect) {
  this.find++;
  UIManager.mettreAJourTotalP1(this.find);
  AudioManager.playEffectDing();
} else {
  this.miss++;
  UIManager.mettreAJourMissP1(this.miss);
  AudioManager.playEffectWrongHole();
}

  // Pause avant rentrée
  await new Promise((r) => setTimeout(r, 500));
  await this.gameInstance.rentreTaupe(gridIndex);

  if (this.find >= this.targetFind) {
    this.stop();
  } else {
    setTimeout(() => this.nextRound(), 400);
  }
}


  stopGameMode(options) {
    this.stop(options);
  }
}
