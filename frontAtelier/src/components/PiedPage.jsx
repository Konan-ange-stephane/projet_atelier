import React from 'react';
import { Link } from 'react-router-dom';

const PiedPage = () => (
  <footer className="py-12 px-8 bg-white border-t border-slate-100 mt-20 font-sans">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">S</div>
        <span className="font-black text-slate-900 tracking-tighter">SMARTTRIP</span>
      </div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© {new Date().getFullYear()} Tous droits réservés.</p>
      <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <a href="#" className="hover:text-indigo-600 transition-colors">Confidentialité</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
      </div>
    </div>
  </footer>
);

export default PiedPage;