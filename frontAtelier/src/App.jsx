// src/App.jsx
import React from 'react';
import { BrowserRouter as Routeur } from 'react-router-dom';
import { AuthProvider } from './contexte/ContexteAuth';
import AppRoutes from './routes/AppRoutes';
import './App.css';


function App() {
  return (
    <Routeur>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Routeur>
  );
}

export default App;