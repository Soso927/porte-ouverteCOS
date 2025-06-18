export const GameConfig = {
  imageTaupeId: 1,

  volume: 0.8, 

  dureeDescente: 500,

  reflexe: {
    rookie: 1500,
    easy: 1000,
    killer: 600
  },

  auditif: {
    rookie: 1000,
    easy: 800,
    killer: 500
  },

  endurance: {
    rookie: 1200,
    easy: 900,
    killer: 600
  },

  chrono: {
    rookie: 30,
    easy: 60,
    killer: 90
  },

  reflexeAssaut: {
    serie: 3,
    nbTaupesParSerie: 10,
    maxHoles: 18
  },
  
  memoireAssaut: {
    serie: 3,
    maxHoles: 18
  },

  erreursMaxMemoire: {
    6: 2,
    8: 3,
    10: 4,
    12: 5,
    14: 6,
    18: 8
  },

  getMaxErreurs(holes) {
    return this.erreursMaxMemoire[holes] || 2;
  },

  holeOptions: {
    Reflexe: [4, 6, 8, 9, 10, 12, 14, 15, 18],
    Memoire: [6, 8, 10, 12, 14, 18],
    Auditif: [4, 8],
    Battle: [8, 10, 12, 14, 18],
  },
  
auditifChrono: {
  rookie: 1000,
  easy: 800,
  killer: 500,
  endurance: {
    rookie: { tempsParTour: 10000, taupesParTour: 3 },
    easy:   { tempsParTour: 8000,  taupesParTour: 5 },
    killer: { tempsParTour: 6000,  taupesParTour: 7 }
  }
},
};

