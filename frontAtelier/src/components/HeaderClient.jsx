// src/components/LayoutClient.jsx
import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SidebarClient from './SidebarClient';
import { AuthContext } from '../context/AuthContext';

const LayoutClient = ({ children, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleDeconnexion = (e) => {
    e.preventDefault();
    logout();
    navigate('/', { replace: true });
  };

  const navItems = [
    { name: 'Accueil',     path: '/client',                  icon: '🏠' },
    { name: 'Trajets',     path: '/client/trajets',          icon: '📍' },
    { name: 'Billets',     path: '/client/mes-reservations', icon: '🎫' },
    { name: 'Profil',      path: '/client/profil',           icon: '👤' },
    { name: 'Déconnexion', path: null, icon: '🚪', onClick: handleDeconnexion },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <div className="hidden lg:block w-72 flex-shrink-0">
        <SidebarClient />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white p-4 md:p-6 lg:px-10 border-b border-gray-100 flex justify-between items-center sticky top-0 z-40">
          <h1 className="text-lg md:text-xl font-black text-slate-900">{title || "SmartTrip"}</h1>
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-xl shadow-sm">👤</div>
        </header>

        <main className="p-4 md:p-6 lg:p-10 pb-28 lg:pb-10">
          {children}
        </main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center z-50 h-20 px-4 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => {
            const isActive = item.path && location.pathname === item.path;

            if (item.onClick) {
              return (
                <button
                  key="deconnexion"
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center w-full h-full relative group"
                >
                  <span className="text-2xl opacity-40 group-active:scale-90 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-black mt-1 text-gray-400">
                    {item.name}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center w-full h-full relative"
              >
                <span className={`text-2xl transition-all duration-300 ${isActive ? 'scale-125 -translate-y-1' : 'opacity-40 grayscale'}`}>
                  {item.icon}
                </span>
                {isActive && (
                  <span className="absolute bottom-3 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                )}
                <span className={`text-[10px] font-black mt-1 ${isActive ? 'text-blue-600' : 'text-gray-400 opacity-0'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default LayoutClient;