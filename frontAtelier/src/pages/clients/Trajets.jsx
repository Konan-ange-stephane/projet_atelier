import React, { useState } from 'react';

export const ClientTrips = () => {
  const [trips, setTrips] = useState([]);

  return (
    <div className="page-container">
      <h1>Mes Trajets</h1>
      <p>Liste des trajets disponibles pour les clients</p>
    </div>
  );
};

export default ClientTrips;
