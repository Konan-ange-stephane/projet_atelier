import React from 'react';
import { useAuth } from '../hooks/useAuth';
import SidebarClient from './SidebarClient';
import HeaderClient from './HeaderClient';

const LayoutClient = ({ title, subtitle, children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <SidebarClient user={user} logout={logout} />

      {/* Contenu principal */}
      <main className="flex-1 ml-72 p-10">
        <div className="max-w-6xl mx-auto">
          <HeaderClient title={title} subtitle={subtitle} />
          {children}
        </div>
      </main>
    </div>
  );
};

export default LayoutClient;