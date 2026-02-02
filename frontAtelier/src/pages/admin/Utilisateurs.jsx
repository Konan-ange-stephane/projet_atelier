import React, { useState } from 'react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  return (
    <div className="page-container">
      <h1>Gestion des Utilisateurs</h1>
      <p>Gérer les utilisateurs du système</p>
    </div>
  );
};

export default AdminUsers;
