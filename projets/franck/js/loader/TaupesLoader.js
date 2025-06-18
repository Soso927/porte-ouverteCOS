// class exportable qui sert a charger les taupes depuis le fichier data.json
export class TaupesLoader {
  //methode "load" en asynchrone qui retourne une promesse
  static async load() {
    // utilise l'API Fetch pour charger le fichier data.json
    const response = await fetch("./data/data.json");
    // declare "data" qui sera la convertion de la reponse en objet js
    const data = await response.json();
    // console.log(data.taupes);
    console.log("Taupes chargées avec succès !");
    return data.taupes;
  }
  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
  static async getTaupeById(id) {
    const taupes = await this.load();
    return taupes.find((t) => t.id === Number(id));
  }
  // --------------------------------------------------------------------------------------------
  //
  // --------------------------------------------------------------------------------------------
  static async getSonAuditif(holes, index) {
    try {
      const response = await fetch("../data/sons_auditifs.json");
      const data = await response.json();

      const holesKey = holes.toString();
      const sonsParPosition = data["auditif"]?.[holesKey];

      if (!sonsParPosition) {
        console.warn(`Pas de sons pour ${holes} trous`);
        return null;
      }

      return sonsParPosition[index.toString()] || null;
    } catch (err) {
      console.error("Erreur lors du chargement des sons auditifs :", err);
      return null;
    }
  }
}
