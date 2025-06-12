export function updateClock() {
    const clockElement = document.querySelector("#clock");
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;
    clockElement.textContent = currentTime;
}

setInterval(updateClock, 1000);
updateClock();


/**************************** date ****************************/

export function afficherDateAccueil() {
    const joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const moisAnnee = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    const aujourdHui = new Date();
    const jourSemaine = joursSemaine[aujourdHui.getDay()];
    const jour = aujourdHui.getDate();
    const mois = moisAnnee[aujourdHui.getMonth()];
    const jourFormate = jour < 10 ? "0" + jour : jour;
    const dateTexte = `${jourSemaine} ${jourFormate} ${mois}`;
    document.querySelector("#date").innerText = dateTexte;
}