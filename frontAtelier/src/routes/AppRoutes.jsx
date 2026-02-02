// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Chargeur from '../components/Chargeur';

// Pages publiques
import Accueil from '../pages/Accueil';
import Connexion from '../pages/Connexion';
import Inscription from '../pages/Inscription';

// Pages client
import ClientReservations from '../pages/clients/Reservations';
import ClientTrajets from '../pages/clients/Trajets';

// Pages agent
import AgentGererTrajets from '../pages/agents/GererTrajets';
import AgentPassagers from '../pages/agents/Passagers';

// Pages admin
import AdminUtilisateurs from '../pages/admin/Utilisateurs';
import AdminStatistiques from '../pages/admin/Statistiques';

// Composant de route protégée
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Chargeur fullScreen />;
  }

  if (!user) {
    return <Navigate to="/connexion" />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<Accueil />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/inscription" element={<Inscription />} />

      {/* Routes client */}
      <Route 
        path="/client/reservations" 
        element={
          <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
            <ClientReservations />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/client/trajets" 
        element={
          <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
            <ClientTrajets />
          </ProtectedRoute>
        } 
      />

      {/* Routes agent */}
      <Route 
        path="/agent/trajets" 
        element={
          <ProtectedRoute roles={['AGENT', 'ADMIN']}>
            <AgentGererTrajets />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/agent/passagers" 
        element={
          <ProtectedRoute roles={['AGENT', 'ADMIN']}>
            <AgentPassagers />
          </ProtectedRoute>
        } 
      />

      {/* Routes admin */}
      <Route 
        path="/admin/utilisateurs" 
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminUtilisateurs />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/statistiques" 
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminStatistiques />
          </ProtectedRoute>
        } 
      />

      {/* Route 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;