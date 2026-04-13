import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LayoutClient from '../../components/LayoutClient';
import Chargeur from '../../components/Chargeur';
import { trajetService } from '../../services/trajetService';

// ── Simulation de données (MOCK) ──────────────────────────────────────────
const MOCK_TRAJETS = [
  {
    id: 1, depart: 'Abidjan', arrivee: 'Bouaké',
    heureDepart: '08:30', heureArrivee: '13:00',
    prix: 5000, placesLibres: 26, placesTotal: 45,
    compagnie: 'Trans-Ivoire Express', immatriculation: 'AB-1234-CI',
    siegesOccupes: [3, 7, 12, 15, 18, 21, 22, 24, 2, 5],
  }
];

// ── Composant : Sélection de siège ────────────────────────────────────────
const VueSieges = ({ trajet, onRetour, onConfirmer }) => {
  const [siegeSelectionne, setSiegeSelectionne] = useState(null);
  const totalSieges = trajet.placesTotal || 45;
  const siegesOccupes = trajet.siegesOccupes || [];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Récapitulatif rapide */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{trajet.compagnie}</p>
        <h3 className="font-black text-slate-900 text-lg">{trajet.depart} ➔ {trajet.arrivee}</h3>
        <p className="text-xs font-bold text-slate-400 mt-1">{trajet.heureDepart} • {trajet.prix?.toLocaleString()} F</p>
      </div>

      {/* Grille des sièges */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
        <div className="text-center mb-6">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">🚌 AVANT DU BUS</span>
        </div>

        <div className="grid grid-cols-5 gap-3 max-w-xs mx-auto">
          {Array.from({ length: totalSieges }, (_, i) => i + 1).map((num) => {
            const isOccupied = siegesOccupes.includes(num);
            const isSelected = siegeSelectionne === num;
            const isAisle = (num - 1) % 5 === 2; // Allée centrale

            if (isAisle) {
              return <div key={`a-${num}`} className="flex items-center justify-center text-[10px] font-bold text-slate-200">{Math.ceil(num/5)}</div>;
            }

            return (
              <button
                key={num}
                disabled={isOccupied}
                onClick={() => setSiegeSelectionne(isSelected ? null : num)}
                className={`h-10 rounded-xl font-black text-xs transition-all border-2 ${
                  isSelected 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-110' 
                    : isOccupied 
                      ? 'bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed' 
                      : 'bg-white border-slate-100 text-slate-600 hover:border-blue-300'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Barre d'action basse */}
      <div className="fixed bottom-20 left-4 right-4 lg:relative lg:bottom-0 lg:left-0 lg:right-0 z-50">
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Siège choisi</p>
            <p className="font-black text-lg">{siegeSelectionne ? `N° ${siegeSelectionne}` : '--'}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onRetour} className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-black text-xs uppercase">Retour</button>
            <button 
              onClick={() => onConfirmer(siegeSelectionne)}
              disabled={!siegeSelectionne}
              className="px-6 py-3 bg-blue-600 disabled:bg-slate-700 rounded-xl font-black text-xs uppercase shadow-lg"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Composant Principal ───────────────────────────────────────────────────
const TrajetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trajet, setTrajet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrajet = async () => {
      try {
        const data = await trajetService.getTrajetById(id);
        setTrajet(data || MOCK_TRAJETS[0]);
      } catch (error) {
        console.error("Erreur chargement trajet", error);
        setTrajet(MOCK_TRAJETS[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrajet();
  }, [id]);

  const handleConfirmer = (siege) => {
    if (!siege) return;
    // On va vers la page de paiement avec les infos
    navigate('/client/paiement', { state: { trajet, siege } });
  };

  if (loading) return <Chargeur fullScreen />;

  return (
    <LayoutClient title="Choix du siège">
      <div className="max-w-xl mx-auto pb-32 lg:pb-10">
        {trajet && (
          <VueSieges 
            trajet={trajet} 
            onRetour={() => navigate('/client/trajets')} 
            onConfirmer={handleConfirmer} 
          />
        )}
      </div>
    </LayoutClient>
  );
};

export default TrajetDetails;
