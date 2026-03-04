// src/mocks/reservationsMock.js

export const reservationsMock = [
  {
    id: 1,
    trajet: {
      depart: "Abidjan",
      arrivee: "Bouaké",
      date: "2026-02-15",
      heure: "08:30",
    },
    numeroPlace: 12,
    prix: 5000,
    statut: "Confirmée",
    paiement: "Payé"
  },
  {
    id: 2,
    trajet: {
      depart: "Abidjan",
      arrivee: "Yamoussoukro",
      date: "2026-02-20",
      heure: "14:00",
    },
    numeroPlace: 5,
    prix: 4000,
    statut: "En attente",
    paiement: "Non payé"
  }
];

// Cette ligne est cruciale pour que l'importation fonctionne dans vos autres fichiers
export default reservationsMock;