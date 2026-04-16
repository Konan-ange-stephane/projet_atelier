import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardAdmin from '../pages/admin/DashboardAdmin';
import AdminStatistics from '../pages/admin/Statistiques';
import AdminUsers from '../pages/admin/Utilisateurs';

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<DashboardAdmin />} />
    <Route path="statistiques" element={<AdminStatistics />} />
    <Route path="utilisateurs" element={<AdminUsers />} />
  </Routes>
);

export default AdminRoutes;
