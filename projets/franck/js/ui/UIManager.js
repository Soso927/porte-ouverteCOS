import { GameConfig } from "./GameConfig.js";
import { TaupesLoader } from "../loader/TaupesLoader.js";

export class UIManager {
  // --------------------------------------------------------------------------------------------
  // Affichage acceuil
  // --------------------------------------------------------------------------------------------
  static afficherAccueil() {
    // modif
    window.speechSynthesis.cancel();
    document.querySelector(".imgAcceuil").style.display = "block";
    document.querySelector(".imgDecors").style.display = "none";
    document.querySelector(".titre").style.display = "block";
    document.querySelector(".controls").style.display = "block";
    document.querySelector("#chrono").style.display = "none";
    document.querySelector("#viewGameParamPlayer1").style.display = "none";
    document.querySelector("#viewGameParamPlayer2").style.display = "none";
    document.querySelector(".exit").style.display = "none";
    document.querySelector("#message").style.display = "none";
    document.querySelector("#messageTemp").style.display = "none";
    const plateau = document.querySelector("#game");
    if (plateau) {
      plateau.innerHTML = ""; // Vide les trous et taupes affichés
      plateau.className = "game"; // Réinitialise les classes (ex: grid-9)
    }

  }
  // --------------------------------------------------------------------------------------------
  // Affichage jeu
  // --------------------------------------------------------------------------------------------
  static afficherJeu(typeJeu) {
    document.querySelector(".imgAcceuil").style.display = "none";
    document.querySelector(".imgDecors").style.display = "block";
    document.querySelector(".titre").style.display = "none";
    document.querySelector(".controls").style.display = "none";

    document.querySelector("#viewGameParamPlayer1").style.display = "flex";
    document.querySelector("#viewGameParamPlayer2").style.display =
      typeJeu === "Battle" ? "flex" : "none";

    document.querySelector(".exit").style.display = "block";
    document.querySelector("#message").style.display = "none";
    document.querySelector("#messageTemp").style.display = "none";
  }
  // --------------------------------------------------------------------------------------------
  // affichage test auditif
  // --------------------------------------------------------------------------------------------
  static afficherTestAuditif() {
    // Affiche le fond décor, cache l'accueil
    document.querySelector(".imgDecors").style.display = "block";
    document.querySelector(".imgAcceuil").style.display = "none";
    document.querySelector(".titre").style.display = "none";
    document.querySelector(".controls").style.display = "none";
    // Affiche le bouton Exit
    document.querySelector(".exit").style.display = "block";

    // Cacher les autres messages
    document.getElementById("message").style.display = "none";

    // Crée une zone dédiée ou vide l'existante
    let container = document.getElementById("game");
    container.innerHTML = "";
    container.className = "grid-9"; // Grille 3x3 classique

    // Ajoute les trous 0 à 8 avec leur son
    for (let i = 0; i < 9; i++) {
      const hole = document.createElement("div");
      hole.className = "hole active-hole";
      hole.id = `test-hole-${i}`;
      hole.textContent = i;
      container.appendChild(hole);

      hole.addEventListener("click", async () => {
        const sonPath = await TaupesLoader.getSonAuditif(8, i);
        if (sonPath) {
          new Audio(sonPath).play();
          console.log(`Trou ${i} ➜ Son joué : ${sonPath}`);
        } else {
          console.warn(`❌ Aucun son pour l'index ${i}`);
        }
      });
    }

    UIManager.afficherMessageTestSound("🎧 Mode test auditif actif – Cliquez sur un trou pour tester le son.");
  }
  // --------------------------------------------------------------------------------------------
  // Affichage des compteurs selon le type de jeu
  // --------------------------------------------------------------------------------------------
  static afficherCompteurs(typeJeu) {
    // Tout cacher d'abord
    document.getElementById("touchP1").style.display = "none";
    document.getElementById("findP1").style.display = "none";
    document.getElementById("missP1").style.display = "none";
    document.getElementById("findP2").style.display = "none";
    document.getElementById("missP2").style.display = "none";
    document.getElementById("totalP1").style.display = "none";
    document.getElementById("chrono").style.display = "none";

    if (typeJeu === "Reflexe") {
      document.getElementById("touchP1").style.display = "block";
      document.getElementById("missP1").style.display = "block";

    } else if (typeJeu === "Auditif") {
      document.getElementById("totalP1").style.display = "block";
      document.getElementById("missP1").style.display = "block";

    } else if (typeJeu === "Memoire") {
      document.getElementById("findP1").style.display = "block";
      document.getElementById("missP1").style.display = "block";

    } else if (typeJeu === "Battle") {
      document.getElementById("findP1").style.display = "block";
      document.getElementById("missP1").style.display = "block";
      document.getElementById("findP2").style.display = "block";
      document.getElementById("missP2").style.display = "block";
    }
  }
  // --------------------------------------------------------------------------------------------
  // Réinitialisation de tous les compteurs
  // --------------------------------------------------------------------------------------------
  static resetAllCompteurs() {
    this.mettreAJourTouchesP1(0);
    this.mettreAJourTouchesP2(0);
    this.mettreAJourMissP1(0);
    this.mettreAJourMissP2(0);
    this.mettreAJourFindP1(0);
    this.mettreAJourFindP2(0);
    this.afficherChrono(0);
    this.mettreAJourTotalP1(0);
  }
  // --------------------------------------------------------------------------------------------
  // Affichage message central (départ, niveau, etc.)
  // --------------------------------------------------------------------------------------------
static async showMessage(message, duration = 2000) {
  const messageDiv = document.getElementById("messageTemp");
  messageDiv.textContent = message;
  messageDiv.style.display = "block";

  return new Promise((resolve) => {
    setTimeout(() => {
      messageDiv.style.display = "none";
      resolve(); // ⚠️ indispensable pour que le `await` fonctionne
    }, duration);
  });
}
  // --------------------------------------------------------------------------------------------
  // Compte à rebours avant la partie
  // --------------------------------------------------------------------------------------------
  static async launchCountdown() {
    const countdownDiv = document.getElementById("messageTemp");
    countdownDiv.style.display = "block";

    for (let i = 3; i >= 1; i--) {
      countdownDiv.textContent = i;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    countdownDiv.textContent = "Go!";
    await new Promise(resolve => setTimeout(resolve, 500));

    countdownDiv.style.display = "none";
  }
  // --------------------------------------------------------------------------------------------
  // Mise à jour des touches pour le joueur 1
  // --------------------------------------------------------------------------------------------
  static mettreAJourTouchesP1(score) {
    const touchesP1 = document.querySelector(".touchP1");
    if (touchesP1) {
      touchesP1.textContent = `Touches : ${score}`;
    }
  }
  // --------------------------------------------------------------------------------------------
  // mise à jour des loupé pour le joueur 1
  // --------------------------------------------------------------------------------------------
  static mettreAJourMissP1(erreurs) {
    const missP1 = document.querySelector(".missP1");
    if (missP1) {
      missP1.textContent = `Miss : ${erreurs}`;
    }
  }
  // --------------------------------------------------------------------------------------------
  // mise à jour des paires pour le joueur 1
  // --------------------------------------------------------------------------------------------
  static mettreAJourFindP1(paires) {
    const findP1 = document.querySelector(".findP1");
    if (findP1) {
      findP1.textContent = `Paires : ${paires}`;
    }
  }
  // --------------------------------------------------------------------------------------------
  // mise à jour du total pour le joueur 1
  // --------------------------------------------------------------------------------------------
  static mettreAJourTotalP1(total) {
    const totalP1 = document.querySelector(".totalP1");
    if (totalP1) {
      totalP1.textContent = `Total : ${total}`;
    }
  }
  // --------------------------------------------------------------------------------------------
  // mise à jour des touches pour le joueur 2 (Battle)
  // --------------------------------------------------------------------------------------------
  static mettreAJourTouchesP2(score) {
    const touchesP2 = document.querySelector(".touchP2");
    if (touchesP2) {
      touchesP2.textContent = `${score} : Touches`;
    }
  }
  // --------------------------------------------------------------------------------------------
  // mise à jour des loupé pour le joueur 2 (Battle)
  // --------------------------------------------------------------------------------------------
  static mettreAJourMissP2(erreurs) {
    const missP2 = document.querySelector(".missP2");
    if (missP2) {
      missP2.textContent = `${erreurs} : Miss`;
    }
  }
  // --------------------------------------------------------------------------------------------
  // mise à jour des paires pour le joueur 2 (Battle)
  // --------------------------------------------------------------------------------------------
  static mettreAJourFindP2(paires) {
    const findP2 = document.querySelector(".findP2");
    if (findP2) {
      findP2.textContent = `${paires} : Paires`;
    }
  }
  // --------------------------------------------------------------------------------------------
  // Chrono central (affichage commun Reflexe/Chrono)
  // --------------------------------------------------------------------------------------------
  static afficherChrono(secondes) {
    const chrono = document.getElementById("chrono");
    if (chrono) {
      chrono.textContent = `Temps : ${secondes}s`;
    }
  }
  // --------------------------------------------------------------------------------------------
  // Résultat fin de partie type reflexe mode assaut
  // --------------------------------------------------------------------------------------------
  static afficherResultatAssaut(score, erreurs = 0) {
    const messageDiv = document.getElementById("internMessage");
    const totalTaupes = GameConfig.reflexeAssaut.nbTaupesParSerie * GameConfig.reflexeAssaut.serie;
    messageDiv.innerHTML = `Fin de l'Assaut !<br><br>Taupes touchées : ${score}/${totalTaupes}<br>Miss : ${erreurs}`;
    messageDiv.style.display = "block";
    document.getElementById("message").style.display = "block";
  }
  // --------------------------------------------------------------------------------------------
  // Résultat fin de partie type reflexe mode endurance
  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
 static afficherResultatEndurance(score, erreurs = 0, temps = null) {
  const messageDiv = document.getElementById("internMessage");

  let message = `Fin de l'Endurance !<br><br>Taupes touchées : ${score}<br>Miss : ${erreurs}`;
  if (temps !== null) {
    message += `<br>Durée : ${temps}s`;
  }

  messageDiv.innerHTML = message;
  messageDiv.style.display = "block";
  document.getElementById("message").style.display = "block";
}
  // --------------------------------------------------------------------------------------------
  // Résultat fin de partie type reflexe mode chrono
  // --------------------------------------------------------------------------------------------
  static afficherResultatChrono(score, erreurs, tempsTotal, typeJeu = "Reflexe") {
    const messageDiv = document.getElementById("internMessage");
    let message = `Fin de Partie !<br><br>`;
    console.log(typeJeu)
    if (typeJeu === "Memoire") {
      message += `Paires trouvées : ${score}<br>`;
      message += `Erreurs : ${erreurs}<br>`;
    } else {
      message += `Touches : ${score}<br>`;
      message += `Miss : ${erreurs}<br>`;
    }

    message += `Temps : ${tempsTotal}s`;

    messageDiv.innerHTML = message;
    messageDiv.style.display = "block";
    document.getElementById("message").style.display = "block";
  }
  // --------------------------------------------------------------------------------------------
  // Résultat fin de partie type Memoire mode assaut
  // --------------------------------------------------------------------------------------------
static afficherResultatMemoireAssaut(score, erreurs = 0, perdu = false) {
  const messageDiv = document.getElementById("internMessage");

  let message = `Fin de l'Assaut Mémoire !<br><br>`;
  message += `Paires trouvées : ${score}<br>`;
  message += `Erreurs : ${erreurs}<br><br>`;

  if (perdu) {
    message += `❌ Dommage ! Tu as perdu.`;
  } else {
    message += `🎉 Bravo !`;
  }

  messageDiv.innerHTML = message;
  messageDiv.style.display = "block";
  document.getElementById("message").style.display = "block";
}
  // --------------------------------------------------------------------------------------------
  // Résultat fin de partie type Memoire mode chrono
  // --------------------------------------------------------------------------------------------
 static afficherResultatMemoireChrono(score, erreurs, tempsTotal) {
  const messageDiv = document.getElementById("internMessage");

  const message = `
    Temps écoulé !<br><br>
    Paires trouvées : ${score}<br>
    Erreurs : ${erreurs}<br>
    Temps : ${tempsTotal}s
  `;

  messageDiv.innerHTML = message;
  messageDiv.style.display = "block";
  document.getElementById("message").style.display = "block";
}
  // --------------------------------------------------------------------------------------------
  // Résultat fin de partie type Auditif mode endurance
  // --------------------------------------------------------------------------------------------
  static afficherResultatAuditifEndurance(score, erreurs = 0, type = "Auditif", temps = null) {
    const messageDiv = document.getElementById("internMessage");

    if (type === "Memoire") {
      messageDiv.innerHTML = `Fin de l'Endurance !<br><br>Paires trouvées : ${score}<br>Erreurs : ${erreurs}`;
    } else {
      let message = `Fin de l'Endurance !<br><br>Taupes touchées : ${score}<br>Miss : ${erreurs}`;
      if (temps !== null) {
        message += `<br>Durée : ${temps}s`;
      }
      messageDiv.innerHTML = message;
    }

    messageDiv.style.display = "block";
    document.getElementById("message").style.display = "block";
  }
  // --------------------------------------------------------------------------------------------
  // Résultat fin de partie type Auditif mode chrono
  // --------------------------------------------------------------------------------------------
  static afficherResultatAuditifChrono(score, erreurs, tempsTotal, typeJeu = "Auditif") {
    const messageDiv = document.getElementById("internMessage");
    let message = `Fin de Partie !<br><br>`;
    console.log(typeJeu)
    if (typeJeu === "Memoire") {
      message += `Paires trouvées : ${score}<br>`;
      message += `Erreurs : ${erreurs}<br>`;
    } else {
      message += `Touches : ${score}<br>`;
      message += `Miss : ${erreurs}<br>`;
    }

    message += `Temps : ${tempsTotal}s`;

    messageDiv.innerHTML = message;
    messageDiv.style.display = "block";
    document.getElementById("message").style.display = "block";
  }
  // --------------------------------------------------------------------------------------------
  // Résultat fin de partie battle
  // --------------------------------------------------------------------------------------------
  static afficherResultatBattle(scoreP1, erreursP1, scoreP2, erreursP2) {
    const messageDiv = document.getElementById("internMessage");

    const message = `
    Fin de Battle !<br><br>
    Joueur 1 : ${scoreP1} paires / ${erreursP1} erreurs<br>
    Joueur 2 : ${scoreP2} paires / ${erreursP2} erreurs
  `;

    messageDiv.innerHTML = message;
    messageDiv.style.display = "block";
    document.getElementById("message").style.display = "block";
  }
  // --------------------------------------------------------------------------------------------
  // affichage selection du joueur actif
  // --------------------------------------------------------------------------------------------
  static setActivePlayer(player) {
    const p1 = document.getElementById("viewGameParamPlayer1");
    const p2 = document.getElementById("viewGameParamPlayer2");

    if (player === 1) {
      p1.style.backgroundColor = "#ffcc00"; // Couleur active pour P1
      p1.style.border = "3px solid #ffcc00"; // Bordure active pour P1
      p2.style.border = "1px solid #ffcc00"; // Bordure active pour P2
      p2.style.background = "linear-gradient(0.15turn, #84521fb3,#15802edf)"; // Reset P2
    } else if (player === 2) {
      p2.style.backgroundColor = "#ffcc00"; // Couleur active pour P2
      p2.style.border = "3px solid #ffcc00"; // Bordure active pour P2
      p1.style.border = "1px solid #ffcc00"; // Bordure active pour P1
      p1.style.background = "linear-gradient(0.15turn, #84521fb3,#15802edf)"; // Reset P1
    }
  }
  // --------------------------------------------------------------------------------------------
  // Réinitialisation des joueurs actifs
  // --------------------------------------------------------------------------------------------
  static resetActivePlayers() {
    const p1 = document.getElementById("viewGameParamPlayer1");
    const p2 = document.getElementById("viewGameParamPlayer2");
    p1.style.background = "linear-gradient(0.15turn, #84521fb3,#15802edf)";
    p2.style.background = "linear-gradient(0.15turn, #84521fb3,#15802edf)";
    p1.style.border = "1px solid #ffcc00"; // Bordure active pour P1
    p2.style.border = "1px solid #ffcc00"; // Bordure active pour P2
    p1.style.backgroundColor = "none"; // Reset P2
    p2.style.backgroundColor = "none"; // Reset P2
  }
  // --------------------------------------------------------------------------------------------
  // Ouvre le menu secret pour modifier les paramètres du jeu
  // --------------------------------------------------------------------------------------------
  static openSecretMenu() {
    const menu = document.getElementById("secretMenu");
    menu.style.display = (menu.style.display === "none") ? "flex" : "none";

    const savedConfig = JSON.parse(localStorage.getItem("gameConfig"));
    if (savedConfig) {
      Object.assign(GameConfig, savedConfig);
    }

    const volumeInput = document.getElementById("volumeControl");
    if (volumeInput) volumeInput.value = GameConfig.volume;
    const dureeDescente = document.getElementById("dureeDescente")
    if (dureeDescente) dureeDescente.value = GameConfig.dureeDescente
    const rookie = document.getElementById("reflexeRookie");
    const easy = document.getElementById("reflexeEasy");
    const killer = document.getElementById("reflexeKiller");

    if (rookie) rookie.value = GameConfig.reflexe.rookie;
    if (easy) easy.value = GameConfig.reflexe.easy;
    if (killer) killer.value = GameConfig.reflexe.killer;
  }
  // --------------------------------------------------------------------------------------------
  // message temporaire en bas de l'écran
  // --------------------------------------------------------------------------------------------
    static afficherMessageTemporaire(message, duree = 3000) {
    const messageDiv = document.getElementById("internMessage");
    if (!messageDiv) return;

    messageDiv.innerHTML = message;
    messageDiv.style.display = "block";

    setTimeout(() => {
      messageDiv.style.display = "none";
    }, duree);
  }
  // --------------------------------------------------------------------------------------------
  // Affichage du message de fin de partie
  // --------------------------------------------------------------------------------------------
     static afficherMessageTestSound(message, duree = 3000) {
    const messageDiv = document.getElementById("testSound");
    if (!messageDiv) return;

    messageDiv.innerHTML = message;
    messageDiv.style.display = "block";

    setTimeout(() => {
      messageDiv.style.display = "none";
    }, duree);
  }
}
