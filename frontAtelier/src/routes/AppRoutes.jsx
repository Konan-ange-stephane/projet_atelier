// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Chargeur from '../components/Chargeur';

// Pages publiques
import Accueil from '../pages/Accueil';
import Connexion from '../pages/Connexion';
import Inscription from '../pages/Inscription';

// Pages client
import ClientRoutes from "./ClientRoutes";

// Route protégée
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return <Chargeur fullScreen />;

  if (!user) return <Navigate to="/connexion" />;

  if (roles.length > 0 && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Accueil />} />
    <Route path="/connexion" element={<Connexion />} />
    <Route path="/inscription" element={<Inscription />} />

    {/* Toutes les routes client sous /client/* */}
    <Route
      path="/client/*"
      element={
        <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
          <ClientRoutes />
        </ProtectedRoute>
      }
    />

    {/* 404 */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRoutes;
