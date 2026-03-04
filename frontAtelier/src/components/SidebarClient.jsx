import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarClient = ({ user, logout }) => {
  const location = useLocation();
  const activePath = location.pathname;

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Tableau de bord', 
      path: '/client', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1"/>
          <rect width="7" height="5" x="14" y="3" rx="1"/>
          <rect width="7" height="9" x="14" y="12" rx="1"/>
          <rect width="7" height="5" x="3" y="16" rx="1"/>
        </svg>
      )
    },
    { 
      id: 'trajets', 
      label: 'Trajets disponibles', 
      path: '/client/trajets', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      )
    },
    { 
      id: 'reservations', 
      label: 'Mes réservations', 
      path: '/client/mes-reservations', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 9V5.25A2.25 2.25 0 0 1 4.25 3h15.5A2.25 2.25 0 0 1 22 5.25V9"/>
          <path d="M2 15v3.75A2.25 2.25 0 0 0 4.25 21h15.5A2.25 2.25 0 0 0 22 18.75V15"/>
          <rect width="20" height="6" x="2" y="9" rx="2"/>
        </svg>
      )
    },
    { 
      id: 'profil', 
      label: 'Mon profil', 
      path: '/client/profil', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 flex flex-col shadow-sm z-50">
      {/* Logo */}
      <div className="p-8 mb-6 flex items-center gap-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9V5.25A2.25 2.25 0 0 1 4.25 3h15.5A2.25 2.25 0 0 1 22 5.25V9"/>
            <path d="M2 15v3.75A2.25 2.25 0 0 0 4.25 21h15.5A2.25 2.25 0 0 0 22 18.75V15"/>
            <rect width="20" height="6" x="2" y="9" rx="2"/>
          </svg>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">SmartTrip</h1>
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 group ${
              activePath === item.path
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className={`${activePath === item.path ? 'text-white' : 'group-hover:text-indigo-600'} transition-colors`}>
              {item.icon}
            </div>
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Section utilisateur */}
      <div className="p-4 border-t border-slate-50">
        <div className="mb-4 p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600 font-black border border-slate-100">
            {user?.nom ? user.nom[0].toUpperCase() : 'C'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-black text-slate-900 truncate leading-none mb-1">
              {user?.nom || 'Client'}
            </p>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">
              Passager
            </p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center gap-4 w-full px-4 py-3.5 text-rose-500 font-bold hover:bg-rose-50 rounded-2xl transition-all group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" x2="9" y1="12" y2="12"/>
          </svg>
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarClient;