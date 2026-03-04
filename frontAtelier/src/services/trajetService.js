// src/services/trajetService.js
import api from './serviceAuth';

// Mode développement
const MODE_DEV = true;

// Données simulées pour le développement
const TRAJETS_SIMULES = [
  {
    id: 1,
    depart: 'Abidjan',
    arrivee: 'Yamoussoukro',
    date: '2026-02-10',
    heure: '08:00',
    prix: 5000,
    duree: '3h30',
    siegesDisponibles: 25,
    compagnie: {
      id: 1,
      nom: 'Express Transport',
      logo: '🚌',
      note: 4.5,
      nombreAvis: 230
    }
  },
  {
    id: 2,
    depart: 'Abidjan',
    arrivee: 'Bouaké',
    date: '2026-02-12',
    heure: '10:30',
    prix: 7000,
    duree: '4h00',
    siegesDisponibles: 18,
    compagnie: {
      id: 2,
      nom: 'Confort Bus',
      logo: '🚍',
      note: 4.8,
      nombreAvis: 450
    }
  },
  {
    id: 3,
    depart: 'Abidjan',
    arrivee: 'San-Pédro',
    date: '2026-02-15',
    heure: '14:00',
    prix: 8000,
    duree: '5h00',
    siegesDisponibles: 30,
    compagnie: {
      id: 3,
      nom: 'Voyage Plus',
      logo: '🚐',
      note: 4.2,
      nombreAvis: 180
    }
  },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const trajetService = {
  // Récupérer tous les trajets
  getTrajets: async (filters = {}) => {
    if (MODE_DEV) {
      await delay(500);
      
      let trajets = [...TRAJETS_SIMULES];
      
      // Filtrer par départ
      if (filters.depart) {
        trajets = trajets.filter(t => 
          t.depart.toLowerCase().includes(filters.depart.toLowerCase())
        );
      }
      
      // Filtrer par arrivée
      if (filters.arrivee) {
        trajets = trajets.filter(t => 
          t.arrivee.toLowerCase().includes(filters.arrivee.toLowerCase())
        );
      }
      
      // Filtrer par compagnie
      if (filters.compagnieId) {
        trajets = trajets.filter(t => t.compagnie.id === filters.compagnieId);
      }
      
      return trajets;
    } else {
      // MODE PRODUCTION - Vraie API
      const response = await api.get('/trajets', { params: filters });
      return response.data;
    }
  },

  // Récupérer un trajet par ID
  getTrajetById: async (id) => {
    if (MODE_DEV) {
      await delay(300);
      return TRAJETS_SIMULES.find(t => t.id === parseInt(id)) || null;
    } else {
      const response = await api.get(`/trajets/${id}`);
      return response.data;
    }
  },

  // Récupérer les compagnies disponibles
  getCompagnies: async () => {
    if (MODE_DEV) {
      await delay(300);
      
      // Extraire les compagnies uniques des trajets
      const compagniesMap = new Map();
      TRAJETS_SIMULES.forEach(trajet => {
        if (!compagniesMap.has(trajet.compagnie.id)) {
          compagniesMap.set(trajet.compagnie.id, trajet.compagnie);
        }
      });
      
      return Array.from(compagniesMap.values());
    } else {
      const response = await api.get('/compagnies');
      return response.data;
    }
  },
};