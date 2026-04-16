import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SidebarClient = ({ collapsed, setCollapsed, user, logout }) => {
  const location = useLocation();
  const activePath = location.pathname;

  const menuItems = [
    {
      id: 'tableau de bord',
      label: 'Accueil',
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
      id: 'réservations',
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
    <aside
      className="fixed left-0 top-0 h-screen bg-white border-r border-slate-100 flex flex-col shadow-sm z-50 transition-all duration-300"
      style={{ width: collapsed ? '72px' : '272px' }}
    >
      <div className={`flex items-center h-20 px-4 border-b border-slate-50 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">SmartTrip</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-8 h-8 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-slate-400 transition-all ${collapsed ? 'hidden' : 'flex'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
        {menuItems.map((item) => {
          const isActive = activePath === item.path || (item.path !== '/client' && activePath.startsWith(item.path));
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-2xl font-bold transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:text-blue-600'} transition-colors`}>
                {item.icon}
              </div>
              {!collapsed && <span className="text-sm whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-50">
        <button
          onClick={logout}
          className={`flex items-center gap-3 w-full px-3 py-3 text-rose-500 font-bold hover:bg-rose-50 rounded-2xl transition-all group ${collapsed ? 'justify-center' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
          </svg>
          {!collapsed && <span className="text-sm">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

const LayoutClient = ({ children, title, subtitle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Utilisation de useAuth
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mobileNav = [
    { name: 'Accueil', path: '/client', icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { name: 'Trajets', path: '/client/trajets', icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> },
    { name: 'Billets', path: '/client/mes-reservations', icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9V5.25A2.25 2.25 0 0 1 4.25 3h15.5A2.25 2.25 0 0 1 22 5.25V9"/><path d="M2 15v3.75A2.25 2.25 0 0 0 4.25 21h15.5A2.25 2.25 0 0 0 22 18.75V15"/><rect width="20" height="6" x="2" y="9" rx="2"/></svg> },
    { name: 'Profil', path: '/client/profil', icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:block flex-shrink-0 transition-all duration-300" style={{ width: `${sidebarCollapsed ? 72 : 272}px` }}>
        <SidebarClient
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          user={user}
          logout={handleLogout}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="bg-white px-5 md:px-8 min-h-16 py-3 border-b border-slate-100/80 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex flex-col gap-0.5 min-w-0 pr-2">
            <h1 className="text-base md:text-lg font-semibold tracking-tight text-slate-900 truncate">
              {title || 'SmartTrip'}
            </h1>
            {subtitle ? (
              <p className="text-xs md:text-sm text-slate-500 font-medium truncate">{subtitle}</p>
            ) : null}
          </div>
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md">
            {user?.nom ? user.nom[0].toUpperCase() : 'U'}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-28 lg:pb-8">
          {children}
        </main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
          <div className="flex items-stretch h-[68px]">
            {mobileNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className="flex-1 flex flex-col items-center justify-center gap-1">
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
                  <span className={`text-[10px] font-bold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default LayoutClient;