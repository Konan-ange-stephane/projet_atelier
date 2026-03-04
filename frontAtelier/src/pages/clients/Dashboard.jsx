import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trajetService } from '../../services/trajetService';
import { reservationService } from '../../services/reservationService';
import LayoutClient from '../../components/LayoutClient';
import TrajetCard from '../../components/TrajetCard';
import Chargeur from '../../components/Chargeur';

const Dashboard = () => {
  const navigate = useNavigate();
  const [trajetsPopulaires, setTrajetsPopulaires] = useState([]);
  const [prochainsVoyages, setProchainsVoyages] = useState([]);
  const [statistiques, setStatistiques] = useState({
    voyagesEffectues: 0,
    reservationsActives: 0,
    pointsFidelite: 0
  });
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      const trajets = await trajetService.getTrajets();
      setTrajetsPopulaires(trajets.slice(0, 3));

      const reservations = await reservationService.getMesReservations();
      const prochains = reservations.filter(r => 
        r.statut === 'Confirmée' && new Date(r.date) >= new Date()
      );
      setProchainsVoyages(prochains);

      setStatistiques({
        voyagesEffectues: reservations.filter(r => r.statut === 'Terminée').length,
        reservationsActives: prochains.length,
        pointsFidelite: reservations.filter(r => r.statut === 'Terminée').length * 50
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setChargement(false);
    }
  };

  const handleReserver = (trajetId) => {
    navigate(`/client/trajet/${trajetId}`);
  };

  if (chargement) {
    return <Chargeur fullScreen />;
  }

  return (
    <LayoutClient 
      title="Tableau de bord" 
      subtitle="Vue d'ensemble de vos voyages"
    >
      {/* Action rapide */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-[2rem] shadow-lg p-8 mb-8 text-white">
        <h3 className="text-2xl font-black mb-2">Prêt pour votre prochain voyage ?</h3>
        <p className="text-indigo-100 mb-6">Réservez votre trajet en quelques clics</p>
        <button
          onClick={() => navigate('/client/trajets')}
          className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all"
        >
          Réserver maintenant →
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-bold">Voyages effectués</p>
              <p className="text-3xl font-black text-slate-900 mt-2">{statistiques.voyagesEffectues}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-bold">Réservations actives</p>
              <p className="text-3xl font-black text-indigo-600 mt-2">{statistiques.reservationsActives}</p>
            </div>
            <div className="text-4xl">🎫</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-bold">Points fidélité</p>
              <p className="text-3xl font-black text-green-600 mt-2">{statistiques.pointsFidelite}</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Prochains voyages */}
      {prochainsVoyages.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-black text-slate-900 mb-4">📅 Vos prochains voyages</h3>
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            {prochainsVoyages.map((voyage) => (
              <div key={voyage.id} className="p-6 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{voyage.trajet}</h4>
                    <p className="text-slate-600 mt-1 text-sm">
                      {voyage.date} à {voyage.heure} • Siège N°{voyage.siege}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Compagnie: {voyage.compagnie}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black rounded-full uppercase tracking-wider">
                      {voyage.statut}
                    </span>
                    <p className="text-xs text-slate-500 mt-2">Code: {voyage.codeReservation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trajets populaires */}
      <section>
        <h3 className="text-xl font-black text-slate-900 mb-4">🔥 Trajets populaires</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trajetsPopulaires.map((trajet) => (
            <TrajetCard key={trajet.id} trajet={trajet} onReserver={handleReserver} />
          ))}
        </div>
      </section>
    </LayoutClient>
  );
};

export default Dashboard;