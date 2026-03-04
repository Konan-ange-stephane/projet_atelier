// src/services/authService.js
import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY, USER_KEY } from '../config';

// Mode développement : mettre à true pour simuler l'authentification
const MODE_DEV = true;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gestion des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

// Fonction pour simuler un délai (comme une vraie requête API)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // Connexion
  login: async (credentials) => {
    if (MODE_DEV) {
      // MODE DÉVELOPPEMENT - Simulation
      await delay(500); // Simuler le délai réseau
      
      // Simuler une vérification simple
      if (credentials.email && credentials.password) {
        const fakeUser = {
          id: 1,
          nom: 'Test User',
          email: credentials.email,
          role: 'CLIENT'
        };
        const fakeToken = 'fake-jwt-token-' + Date.now();
        
        localStorage.setItem(TOKEN_KEY, fakeToken);
        localStorage.setItem(USER_KEY, JSON.stringify(fakeUser));
        
        return { token: fakeToken, user: fakeUser };
      } else {
        throw new Error('Email ou mot de passe invalide');
      }
    } else {
      // MODE PRODUCTION - Vraie API
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      }
      return response.data;
    }
  },

  // Inscription
  register: async (userData) => {
    if (MODE_DEV) {
      // MODE DÉVELOPPEMENT - Simulation
      await delay(500);
      
      if (userData.email && userData.password && userData.nom) {
        return { 
          message: 'Inscription réussie',
          user: {
            nom: userData.nom,
            email: userData.email
          }
        };
      } else {
        throw new Error('Données invalides');
      }
    } else {
      // MODE PRODUCTION - Vraie API
      const response = await api.post('/auth/register', userData);
      return response.data;
    }
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Obtenir l'utilisateur courant
  getCurrentUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Récupérer le token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Rafraîchir le token
  refreshToken: async () => {
    if (MODE_DEV) {
      await delay(300);
      const fakeToken = 'fake-jwt-token-refreshed-' + Date.now();
      localStorage.setItem(TOKEN_KEY, fakeToken);
      return { token: fakeToken };
    } else {
      const response = await api.post('/auth/refresh-token');
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
      }
      return response.data;
    }
  }
};

export default api;