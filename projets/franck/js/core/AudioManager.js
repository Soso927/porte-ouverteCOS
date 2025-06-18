import { AudioConfig } from "../ui/AudioConfig.js";
export const AudioManager = {
  audioElement: null,

  init() {
    this.audioElement = document.getElementById("musiqueIntro");
  },

  play(src = null) {
    if (src && this.audioElement.src !== src) {
      this.audioElement.src = src;
    }

    this.audioElement.play().catch((err) => {
      console.warn("Erreur de lecture audio :", err);
    });
  },

  switchTrack(src) {
    if (this.audioElement) {
      this.audioElement.pause(); // Stoppe avant
      this.audioElement.src = src;

      this.audioElement.play().catch((err) => {
        console.warn("Erreur de lecture audio :", err);
      });
    }
  },

  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
  },

  mute() {
    if (this.audioElement) this.audioElement.muted = true;
  },

  unmute() {
    if (this.audioElement) this.audioElement.muted = false;
  },

  setVolume(value) {
    if (this.audioElement) this.audioElement.volume = value;
  },

  fadeOut(duration = 1000) {
    if (!this.audioElement) return;
    const step = 0.05;
    const interval = duration * step;
    const fade = setInterval(() => {
      if (this.audioElement.volume > step) {
        this.audioElement.volume -= step;
      } else {
        this.audioElement.volume = 0;
        this.audioElement.pause();
        clearInterval(fade);
      }
    }, interval);
  },
  playAccueil() {
    this.play(AudioConfig.musique.accueil);
  },

  playBattle() {
    this.play(AudioConfig.musique.battle);
  },

  playAuditif() {
    const list = AudioConfig.musique.auditif;
    const index = Math.floor(Math.random() * list.length);
    this.switchTrack(list[index]);
  },

  playAllModes() {
    const list = AudioConfig.musique.allModes;
    const index = Math.floor(Math.random() * list.length);
    this.switchTrack(list[index]);
  },

  playEffectVictory() {
    this.playEffect(AudioConfig.soundsTaupes.victory);
  },

  playEffectLose() {
    this.playEffect(AudioConfig.soundsTaupes.lose);
  },

  playEffectDing() {
    this.playEffect(AudioConfig.soundsTaupes.win);
  },

  playEffectWrongHole() {
    this.playEffect(AudioConfig.soundsTaupes.wrongHole);
  },

  playEffectFouet() {
    this.playEffect(AudioConfig.soundsTaupes.fouetTaupes);
  },

  playEffectPunch() {
    this.playEffect(AudioConfig.soundsTaupes.punchTaupe);
  },

  playEffectBof() {
    this.playEffect(AudioConfig.soundsTaupes.bofTaupe);
  },

  playEffectShoot() {
    this.playEffect(AudioConfig.soundsTaupes.shootTaupe);
  },

  playEffectTrompette() {
    this.playEffect(AudioConfig.engine.trompette);
  },
  playEffectBingo() {
    this.playEffect(AudioConfig.soundsTaupes.bingo);
  },
playEffect(src) {
  const effect = new Audio(src);
  effect.volume = this.audioElement?.volume || 1;

  // Ne pas utiliser de pause() ici → laisse le son se jouer jusqu’au bout
  effect.play().catch((e) => {
    if (e.name !== "AbortError") {
      console.warn("Effet audio non joué :", e);
    }
  });
}
}
