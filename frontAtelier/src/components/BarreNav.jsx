import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const BarreNav = () => {
  const { user, loading } = useAuth();
  const role = user?.role != null ? String(user.role).toUpperCase() : '';

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tighter">
          SmartTrip<span className="text-slate-900">.</span>
        </Link>

        {/* MENU */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/a-propos" className="hidden md:block text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
            Comment ça marche ?
          </Link>

          {!loading && user && (
            <div className="hidden sm:flex items-center gap-3 text-sm font-bold">
              {(role === 'CLIENT' ||
                role === 'USER' ||
                role === 'ROLE_USER' ||
                role === 'ROLE_CLIENT') && (
                <Link to="/client/trajets" className="text-indigo-600 hover:text-indigo-800">
                  Espace voyageur
                </Link>
              )}
              {(role === 'AGENT' || role === 'ROLE_AGENT') && (
                <Link to="/agent/reservations" className="text-indigo-600 hover:text-indigo-800">
                  Espace agent
                </Link>
              )}
              {(role === 'ADMIN' || role === 'ROLE_ADMIN') && (
                <>
                  <Link to="/admin" className="text-violet-700 hover:text-violet-900">
                    Administration
                  </Link>
                  <Link to="/agent/reservations" className="text-slate-600 hover:text-slate-900">
                    Agent
                  </Link>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link to="/connexion" className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors">
                  Espace membre
                </Link>
                <Link
                  to="/inscription"
                  className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                >
                  Créer un compte
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/connexion" className="flex items-center gap-2 group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                    {(user.nom || user.email || '?')[0].toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-black text-slate-900 leading-none mb-0.5">
                      {user.nom || user.email?.split('@')[0]}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                      {role === 'CLIENT' ? 'Voyageur' : role}
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BarreNav;