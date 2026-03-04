import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trajetService } from '../../services/trajetService';
import LayoutClient from '../../components/LayoutClient';
import TrajetCard from '../../components/TrajetCard';
import Chargeur from '../../components/Chargeur';

const Trajets = () => {
  const navigate = useNavigate();
  const [trajets, setTrajets] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtreDepart, setFiltreDepart] = useState('');
  const [filtreArrivee, setFiltreArrivee] = useState('');

  useEffect(() => {
    chargerTrajets();
  }, []);

  const chargerTrajets = async () => {
    try {
      const data = await trajetService.getTrajets();
      setTrajets(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setChargement(false);
    }
  };

  const handleReserver = (trajetId) => {
    navigate(`/client/trajet/${trajetId}`);
  };

  const trajetsFiltres = trajets.filter((trajet) => {
    const matchDepart = filtreDepart === '' || trajet.depart.toLowerCase().includes(filtreDepart.toLowerCase());
    const matchArrivee = filtreArrivee === '' || trajet.arrivee.toLowerCase().includes(filtreArrivee.toLowerCase());
    return matchDepart && matchArrivee;
  });

  if (chargement) {
    return <Chargeur fullScreen />;
  }

  return (
    <LayoutClient 
      title="Trajets disponibles" 
      subtitle="Trouvez votre prochaine destination au meilleur prix"
    >
      {/* Filtres */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
        <h3 className="text-lg font-black text-slate-900 mb-4">Rechercher un trajet</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Ville de départ</label>
            <input
              type="text"
              value={filtreDepart}
              onChange={(e) => setFiltreDepart(e.target.value)}
              placeholder="Ex: Abidjan"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Ville d'arrivée</label>
            <input
              type="text"
              value={filtreArrivee}
              onChange={(e) => setFiltreArrivee(e.target.value)}
              placeholder="Ex: Yamoussoukro"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Liste des trajets */}
      {trajetsFiltres.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-slate-100 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-slate-500 text-lg font-medium">Aucun trajet trouvé avec ces critères.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trajetsFiltres.map((trajet) => (
            <TrajetCard key={trajet.id} trajet={trajet} onReserver={handleReserver} />
          ))}
        </div>
      )}
    </LayoutClient>
  );
};

export default Trajets;