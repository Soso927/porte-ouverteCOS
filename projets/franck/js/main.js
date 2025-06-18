import { GameEngine } from "./core/GameEngine.js";
import { UIManager } from "./ui/UIManager.js";
import { GameConfig } from "./ui/GameConfig.js";
import { AudioManager } from "./core/AudioManager.js";


// Sélection des éléments DOM
const gameTypeSelect = document.getElementById("gameType");
const modeSelect = document.getElementById("gameMode");
const difficultySelect = document.getElementById("gameDifficulty");
const holesNumberSelect = document.getElementById("holesNumber");
const menuMode = document.getElementById("menuMode");
const menuDifficulty = document.getElementById("menuDifficulty");
const startBtn = document.getElementById("startBtn");
const exitBtn = document.querySelector(".exit");

let lastParams = null;
let gameInstance = null;
let gameModeInstance = null;

const saved = JSON.parse(localStorage.getItem("gameConfig"));
if (saved) Object.assign(GameConfig, saved);

// -----------------------------------------------------------
// Fonction de nettoyage avant le redémarrage du jeu
// -----------------------------------------------------------
function cleanUpBeforeRestart() {
  if (gameModeInstance?.stopGameMode)
    gameModeInstance.stopGameMode({ silent: true });
  if (gameInstance?.stopGameEngine) gameInstance.stopGameEngine();
  gameModeInstance = null;
  // ⛔ Arrêt de la synthèse vocale
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
// -----------------------------------------------------------
// Fonction d'initialisation dynamique des trous
// -----------------------------------------------------------
function initialiserHoles(liste) {
  const currentValue = parseInt(holesNumberSelect.value);
  holesNumberSelect.innerHTML = "";

  liste.forEach((val) => {
    const option = document.createElement("option");
    option.value = val;
    option.textContent = val;
    holesNumberSelect.appendChild(option);
  });

  // On restaure la valeur précédente si elle est encore présente
  if (liste.includes(currentValue)) {
    holesNumberSelect.value = currentValue;
  }
}
// -----------------------------------------------------------
// Chargement initial des trous par défaut (Reflexe complet)
// -----------------------------------------------------------
initialiserHoles(GameConfig.holeOptions["Reflexe"]);

// -----------------------------------------------------------
// Gestion volume et son (au chargement de la page)
// -----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  AudioManager.init()
  AudioManager.playAccueil()

  const audio = document.getElementById("musiqueIntro");
  const muteBtn = document.getElementById("muteBtn");
  const volumeSlider = document.getElementById("volumeControl");
  const btnEnregistrer = document.getElementById("btnEnregistrer");

  audio.volume = GameConfig.volume;
  volumeSlider.value = GameConfig.volume;
  audio.muted = GameConfig.volume === 0;
  muteBtn.textContent = audio.muted ? "🔇" : "🔊";

  volumeSlider.addEventListener("input", () => {
    const newVolume = parseFloat(volumeSlider.value);
    audio.volume = newVolume;
    audio.muted = newVolume === 0;
    GameConfig.volume = newVolume;
    muteBtn.textContent = audio.muted ? "🔇" : "🔊";
    localStorage.setItem("gameConfig", JSON.stringify(GameConfig));
  });

  muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? "🔇" : "🔊";
    volumeSlider.value = audio.muted ? 0 : audio.volume || 1;
    GameConfig.volume = parseFloat(volumeSlider.value);
    localStorage.setItem("gameConfig", JSON.stringify(GameConfig));
  });

  if (btnEnregistrer) {
    btnEnregistrer.addEventListener("click", () => {
      console.log("Bouton Enregistrer cliqué !");
      GameEngine.saveConfig();
    });
  }
});
// -----------------------------------------------------------
// Adaptation des paramètres de trous selon le mode de jeu
// -----------------------------------------------------------
gameTypeSelect.addEventListener("change", () => {
  const type = gameTypeSelect.value;
  if (type === "Reflexe") {
    document.getElementById("AssautSelect").style.display = "block";
    document.getElementById("ChronoSelect").style.display = "block";
    document.getElementById("EnduranceSelect").style.display = "block";
  } else if (type === "Auditif") {
    document.getElementById("AssautSelect").style.display = "none";
    document.getElementById("ChronoSelect").style.display = "block";
    document.getElementById("EnduranceSelect").style.display = "block";
  } else if (type === "Memoire") {
    document.getElementById("AssautSelect").style.display = "block";
    document.getElementById("ChronoSelect").style.display = "block";
    document.getElementById("EnduranceSelect").style.display = "none";
  } else if (type === "Battle") {
    document.getElementById("AssautSelect").style.display = "none";
    document.getElementById("ChronoSelect").style.display = "none";
    document.getElementById("EnduranceSelect").style.display = "none";
  }

  initialiserHoles(GameConfig.holeOptions[type]);

  const isBattle = type === "Battle";
  menuMode.style.display = isBattle ? "none" : "block";
  menuDifficulty.style.display = isBattle ? "none" : "block";
});
// -----------------------------------------------------------
// Lancement de la partie
// -----------------------------------------------------------
startBtn.addEventListener("click", async () => {
  window.speechSynthesis.cancel();
  cleanUpBeforeRestart();
  const typeJeu = gameTypeSelect.value;
  let modeJeu = modeSelect.value;
  let difficulty = difficultySelect.value;
  const holes = parseInt(holesNumberSelect.value);

  if (typeJeu === "Battle") {
    modeJeu = "Battle";
    difficulty = "rookie";
  }
  lastParams = { type: typeJeu, mode: modeJeu, difficulty, holes };

  console.log(
    `Type: ${typeJeu}, Mode: ${modeJeu}, Diff: ${difficulty}, Trous: ${holes}`
  );
  switch (typeJeu) {
  case "Battle":
    AudioManager.stop();
    AudioManager.playBattle();
    break;
  case "Auditif":
    AudioManager.stop();
    AudioManager.playAuditif();
    break;
  case "Reflexe":
  case "Memoire":
    AudioManager.stop();
    AudioManager.playAllModes();
    break;
  default:
    AudioManager.stop();
    AudioManager.playAccueil();
    break;
}

  UIManager.afficherJeu(typeJeu);
  gameInstance = new GameEngine(typeJeu, modeJeu, difficulty, holes);
  window.gameInstance = gameInstance;
  await gameInstance.init();
  await gameInstance.start();
  gameModeInstance = gameInstance.getGameMode();
});
// -----------------------------------------------------------
//  Rejouer la partie
// -----------------------------------------------------------
document.getElementById("again").addEventListener("click", async () => {
  window.speechSynthesis.cancel();
  cleanUpBeforeRestart();
  UIManager.afficherJeu(lastParams.type);
  gameInstance = new GameEngine(
    lastParams.type,
    lastParams.mode,
    lastParams.difficulty,
    lastParams.holes
  );
  window.gameInstance = gameInstance;
  await gameInstance.init();
  await gameInstance.start();
  gameModeInstance = gameInstance.getGameMode();
});
// -----------------------------------------------------------
//  Retour à l'accueil depuis le jeu
// -----------------------------------------------------------
document.getElementById("acceuil").addEventListener("click", () => {
  AudioManager.stop();
  AudioManager.playAccueil(); // 🎵 relance la musique d'accueil
  cleanUpBeforeRestart(); // ⛔ stoppe les modes et le moteur
  UIManager.afficherAccueil(); // 🏠 revient à l'accueil
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel(); // ⛔ stoppe la synthèse vocale
  }
});
// -----------------------------------------------------------
// Retour accueil
// -----------------------------------------------------------
exitBtn.addEventListener("click", () => {
  AudioManager.stop();
  AudioManager.playAccueil();
  if (window.speechSynthesis) speechSynthesis.cancel();

  const container = document.getElementById("game");
  if (container) container.innerHTML = ""; // ← important !

  cleanUpBeforeRestart();
  UIManager.afficherAccueil();
});

// -----------------------------------------------------------
//  Ouvrir le menu secret avec F10 + Shift
// -----------------------------------------------------------
document.addEventListener("keydown", (e) => {
  if (e.key === "F10" && e.shiftKey) {
    UIManager.openSecretMenu();
  }
});
// -----------------------------------------------------------
//  Ouvrir le menu des options
// ----------------------------------------------------------
document.getElementById("btnTestAuditif").addEventListener("click", () => {
  AudioManager.stop();
  if (gameModeInstance !== null) {
    UIManager.afficherMessageTemporaire(
      "Termine la partie avant de tester les sons."
    );
    return;
  }
  document.getElementById("secretMenu").style.display = "none";
  UIManager.afficherTestAuditif(); // ➜ Appelle directement le mode test
});
