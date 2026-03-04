import React from 'react';
import { Link } from 'react-router-dom';

const BarreNav = () => {
  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tighter">
          SmartTrip<span className="text-slate-900">.</span>
        </Link>

        {/* MENU */}
        <div className="flex items-center gap-8">
          <Link to="/a-propos" className="hidden md:block text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
            Comment ça marche ?
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/connexion" className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors">
              Espace membre
            </Link>
            <Link 
              to="/inscription" 
              className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
            >
              Rejoindre l'aventure
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BarreNav;