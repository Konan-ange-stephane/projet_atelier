// src/services/reservationService.js
import api from './serviceAuth';

const MODE_DEV = true;

const RESERVATIONS_SIMULES = [
  {
    id: 101,
    userId: 1,
    trajetId: 1,
    nom: 'Test User',
    trajet: 'Abidjan → Yamoussoukro',
    depart: 'Abidjan',
    arrivee: 'Yamoussoukro',
    date: '2026-02-10',
    heure: '08:00',
    siege: 12,
    prix: 5000,
    statut: 'Confirmée',
    compagnie: 'Express Transport',
    codeReservation: 'ST-2026-101'
  },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reservationService = {
  // Récupérer toutes les réservations de l'utilisateur
  getMesReservations: async () => {
    if (MODE_DEV) {
      await delay(500);
      return RESERVATIONS_SIMULES;
    } else {
      const response = await api.get('/reservations/mes-reservations');
      return response.data;
    }
  },

  // Créer une nouvelle réservation
  creerReservation: async (reservationData) => {
    if (MODE_DEV) {
      await delay(800);
      
      const nouvelleReservation = {
        id: Date.now(),
        ...reservationData,
        statut: 'Confirmée',
        codeReservation: `ST-2026-${Date.now()}`,
      };
      
      RESERVATIONS_SIMULES.push(nouvelleReservation);
      return nouvelleReservation;
    } else {
      const response = await api.post('/reservations', reservationData);
      return response.data;
    }
  },

  // Annuler une réservation
  annulerReservation: async (reservationId) => {
    if (MODE_DEV) {
      await delay(500);
      const reservation = RESERVATIONS_SIMULES.find(r => r.id === reservationId);
      if (reservation) {
        reservation.statut = 'Annulée';
      }
      return reservation;
    } else {
      const response = await api.put(`/reservations/${reservationId}/annuler`);
      return response.data;
    }
  },
};