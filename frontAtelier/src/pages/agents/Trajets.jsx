import React, { useState } from 'react';

export const AgentTrips = () => {
  const [trips, setTrips] = useState([]);

  return (
    <div className="page-container">
      <h1>Gestion des Trajets</h1>
      <p>Créer et gérer vos trajets</p>
    </div>
  );
};

export default AgentTrips;
