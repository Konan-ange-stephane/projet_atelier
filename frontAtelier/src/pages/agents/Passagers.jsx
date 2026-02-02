import React, { useState } from 'react';

export const AgentPassengers = () => {
  const [passengers, setPassengers] = useState([]);

  return (
    <div className="page-container">
      <h1>Liste des Passagers</h1>
      <p>Consultation des passagers pour vos trajets</p>
    </div>
  );
};

export default AgentPassengers;
