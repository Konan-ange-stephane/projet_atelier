import { API_BASE_URL } from '../config';

// --- SERVICE AUTHENTIFICATION ---
export const authService = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  getUserById: async (userId, token) => {
    const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};

// --- SERVICE DES TRAJETS (TRIPS) ---
export const tripService = {
  getAllTrips: async () => {
    const response = await fetch(`${API_BASE_URL}/trips`);
    return response.json();
  },

  getTripById: async (tripId) => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}`);
    return response.json();
  },

  searchTrips: async (departureCity, arrivalCity) => {
    const response = await fetch(
      `${API_BASE_URL}/trips/search?departureCity=${departureCity}&arrivalCity=${arrivalCity}`
    );
    return response.json();
  },

  createTrip: async (tripData, agentId, token) => {
    const response = await fetch(`${API_BASE_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': agentId,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(tripData),
    });
    return response.json();
  },

  updateTrip: async (tripId, tripData, token) => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(tripData),
    });
    return response.json();
  },

  deleteTrip: async (tripId, token) => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};

// --- SERVICE DES RÉSERVATIONS ---
export const reservationService = {
  createReservation: async (reservationData, clientId, token) => {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': clientId,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reservationData),
    });
    return response.json();
  },

  getClientReservations: async (clientId, token) => {
    const response = await fetch(`${API_BASE_URL}/reservations/client/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  cancelReservation: async (reservationId, token) => {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};

// --- SERVICE DES STATISTIQUES ---
export const statisticsService = {
  getStatistics: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/statistics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};