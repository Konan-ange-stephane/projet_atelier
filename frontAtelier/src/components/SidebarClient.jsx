// src/pages/client/Dashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutClient from '../../components/LayoutClient';

const VILLES = [
  'Abidjan (Gare Nord)',
  'Bouaké (Centre)',
  'Yamoussoukro',
  'San-Pédro',
  'Korhogo',
  'Daloa',
  'Man',
];

const TRAJETS_POPULAIRES = [
  { id: 1, depart: 'Abidjan', arrivee: 'Bouaké',       heure: '08:30', places: 45, prix: 5000 },
  { id: 2, depart: 'Abidjan', arrivee: 'Yamoussoukro', heure: '14:00', places: 38, prix: 4000 },
  { id: 3, depart: 'Bouaké',  arrivee: 'San-Pédro',    heure: '07:00', places: 50, prix: 7500 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [villeDepart,  setVilleDepart]  = useState(VILLES[0]);
  const [villeArrivee, setVilleArrivee] = useState(VILLES[1]);

  const handleRechercher = () => {
    navigate('/client/trajets', { state: { depart: villeDepart, arrivee: villeArrivee } });
  };

  return (
    <LayoutClient title="Accueil">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* ── HERO ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Illustration bus */}
          <div className="relative aspect-[16/10] lg:aspect-auto min-h-[220px] bg-gradient-to-br from-blue-500 to-blue-700 rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden shadow-2xl shadow-blue-200">
            {/* Cercles décoratifs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8  w-36 h-36 bg-white/10 rounded-full" />

            {/* Icône bus stylisée */}
            <div className="relative z-10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="M16 8h4l3 3v5h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>

            <div className="relative z-10 text-center px-6">
              <p className="text-white font-black text-2xl md:text-3xl leading-tight drop-shadow">
                Voyagez malin<br/>avec SmartTrip
              </p>
              <p className="text-white/70 text-sm font-bold mt-2">Réservez votre siège en quelques clics</p>
            </div>

            <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/30 text-white font-black text-[10px] uppercase tracking-widest">
              ✨ Rapide & Sécurisé
            </div>
          </div>

          {/* Formulaire de recherche — EXACTEMENT comme la maquette */}
          <div className="bg-white p-7 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 leading-tight">
              Bonjour Julien ! 👋
            </h2>
            <p className="text-slate-400 font-bold text-xs mb-8 uppercase tracking-widest">
              Où souhaitez-vous aller ?
            </p>

            <div className="space-y-4">
              {/* De */}
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600 font-black text-[10px] uppercase tracking-wider z-10">De</span>
                <select
                  value={villeDepart}
                  onChange={(e) => setVilleDepart(e.target.value)}
                  className="w-full pl-14 pr-5 py-5 bg-slate-50 rounded-2xl font-black text-slate-900 outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer text-sm"
                >
                  {VILLES.map(v => <option key={v}>{v}</option>)}
                </select>
                <svg className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>

              {/* À */}
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600 font-black text-[10px] uppercase tracking-wider z-10">À</span>
                <select
                  value={villeArrivee}
                  onChange={(e) => setVilleArrivee(e.target.value)}
                  className="w-full pl-14 pr-5 py-5 bg-slate-50 rounded-2xl font-black text-slate-900 outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer text-sm"
                >
                  {VILLES.map(v => <option key={v}>{v}</option>)}
                </select>
                <svg className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>

              <button
                onClick={handleRechercher}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs mt-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                Rechercher
              </button>
            </div>

            <p className="text-center text-xs text-slate-400 font-bold mt-6">
              🎫 Réservez votre trajet et achetez en ligne
            </p>
          </div>
        </div>

        {/* ── DESTINATIONS PHARES ── */}
        <section>
          <div className="flex justify-between items-end mb-6 px-1">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Destinations phares</h3>
              <div className="h-1 w-10 bg-blue-600 rounded-full mt-1" />
            </div>
            <button
              onClick={() => navigate('/client/trajets')}
              className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
            >
              Voir tout →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRAJETS_POPULAIRES.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/client/trajet/${t.id}`)}
                className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-7">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors">
                      <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ticket dès</p>
                    <span className="font-black text-blue-600 text-xl tracking-tighter">
                      {t.prix.toLocaleString()} F
                    </span>
                  </div>
                </div>

                <h4 className="font-black text-slate-900 text-lg mb-3">
                  {t.depart} <span className="text-blue-500">→</span> {t.arrivee}
                </h4>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    🕐 {t.heure}
                  </span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    💺 {t.places} places
                  </span>
                </div>

                <button className="mt-5 w-full py-3 bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-widest rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  Réserver →
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </LayoutClient>
  );
};

export default Dashboard;