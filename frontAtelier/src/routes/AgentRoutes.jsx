import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ReservationsAgent from '../pages/agents/ReservationsAgent';
import ReservationAgentDetail from '../pages/agents/ReservationAgentDetail';
import AgentPassengers from '../pages/agents/Passagers';
import VehiculesAgent from '../pages/agents/VehiculesAgent';
import GestionTrajetsAgent from '../pages/agents/GestionTrajetsAgent';

const AgentRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/agent/reservations" replace />} />
    <Route path="reservations" element={<ReservationsAgent />} />
    <Route path="reservations/:id" element={<ReservationAgentDetail />} />
    <Route path="trajets" element={<GestionTrajetsAgent />} />
    <Route path="passagers" element={<AgentPassengers />} />
    <Route path="vehicules" element={<VehiculesAgent />} />
  </Routes>
);

export default AgentRoutes;
