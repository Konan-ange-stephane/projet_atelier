// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';

// Pages publiques
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Pages client
import ClientReservations from '../pages/Client/Reservations';
import ClientTrips from '../pages/Client/Trips';

// Pages agent
import AgentManageTrips from '../pages/Agent/ManageTrips';
import AgentPassengers from '../pages/Agent/Passengers';

// Pages admin
import AdminUsers from '../pages/Admin/Users';
import AdminStatistics from '../pages/Admin/Statistics';

// Composant de route protégée
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
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
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
        path="/client/trips" 
        element={
          <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
            <ClientTrips />
          </ProtectedRoute>
        } 
      />

      {/* Routes agent */}
      <Route 
        path="/agent/trips" 
        element={
          <ProtectedRoute roles={['AGENT', 'ADMIN']}>
            <AgentManageTrips />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/agent/passengers" 
        element={
          <ProtectedRoute roles={['AGENT', 'ADMIN']}>
            <AgentPassengers />
          </ProtectedRoute>
        } 
      />

      {/* Routes admin */}
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminUsers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/statistics" 
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminStatistics />
          </ProtectedRoute>
        } 
      />

      {/* Route 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;