// src/routes/ClientRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importation des pages (On utilise "import" et non "importer")
import Dashboard from '../pages/clients/Dashboard';
import Trajets from '../pages/clients/Trajets';
import TrajetDetails from '../pages/clients/TrajetDetails';
import Reservation from '../pages/clients/Reservation';        
import MesReservations from '../pages/clients/MesReservations';
import ProfilClient from '../pages/clients/ProfilClient';
import Paiement from '../pages/clients/Paiement';

const ClientRoutes = () => {
  return (
    <Routes>
      {/* Route par défaut pour le client */}
      <Route path="/" element={<Dashboard />} /> 
      
      {/* Gestion des itinéraires */}
      <Route path="trajets" element={<Trajets />} /> 
      <Route path="trajet/:id" element={<TrajetDetails />} /> 
      
      {/* Réservation */}
      <Route path="reservation" element={<Reservation />} /> 
      <Route path="mes-reservations" element={<MesReservations />} /> 
      
      {/* Profil et paiement */}
      <Route path="profil" element={<ProfilClient />} /> 
      <Route path="paiement" element={<Paiement />} /> 
    </Routes>
  );
};

// On utilise "export default" pour exporter le composant
export default ClientRoutes;