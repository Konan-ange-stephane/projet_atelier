import React, { useState } from 'react';

export const AdminStatistics = () => {
  const [statistics, setStatistics] = useState(null);

  return (
    <div className="page-container">
      <h1>Statistiques</h1>
      <p>Aperçu des statistiques du système</p>
    </div>
  );
};

export default AdminStatistics;
