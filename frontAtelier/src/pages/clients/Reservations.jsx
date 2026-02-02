import React, { useState } from 'react';

export const ClientReservations = () => {
  const [reservations, setReservations] = useState([]);

  return (
    <div className="page-container">
      <h1>Mes Réservations</h1>
      <p>Liste de vos réservations</p>
    </div>
  );
};

export default ClientReservations;
