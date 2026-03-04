import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { trajetService } from '../../services/trajetService';
import LayoutClient from '../../components/LayoutClient';
import SeatSelector from '../../components/SeatSelector';
import Chargeur from '../../components/Chargeur';

const TrajetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [trajet, setTrajet] = useState(null);
  const [siegeSelectionne, setSiegeSelectionne] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    chargerTrajet();
  }, [id]);

  const chargerTrajet = async () => {
    try {
      const data = await trajetService.getTrajetById(id);
      setTrajet(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setChargement(false);
    }
  };

  const handleSelectSeat = (numeroSiege) => {
    setSiegeSelectionne(numeroSiege);
  };

  const handleReserver = () => {
    if (!siegeSelectionne) {
      alert('Veuillez sélectionner un siège');
      return;
    }
    
    navigate('/client/paiement', {
      state: {
        trajet,
        siege: siegeSelectionne
      }
    });
  };

  if (chargement) {
    return <Chargeur fullScreen />;
  }

  if (!trajet) {
    return (
      <LayoutClient title="Trajet" subtitle="Détails du trajet">
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-slate-100 text-center">
          <div className="text-6xl mb-4">🚌</div>
          <h2 className="text-2xl font-black text-slate-800 mb-4">Trajet introuvable</h2>
          <Link 
            to="/client/trajets" 
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            Retour aux trajets
          </Link>
        </div>
      </LayoutClient>
    );
  }

  return (
    <LayoutClient 
      title={`${trajet.depart} → ${trajet.arrivee}`} 
      subtitle="Sélectionnez votre siège et réservez"
    >
      <Link 
        to="/client/trajets" 
        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7"/>
          <path d="M19 12H5"/>
        </svg>
        Retour aux trajets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informations du trajet */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-100">
                🚌
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  {trajet.depart} → {trajet.arrivee}
                </h3>
                <p className="text-sm text-slate-600 font-medium">{trajet.compagnie?.nom || 'Transport'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-600 font-bold mb-1">Date de départ</p>
                <p className="text-lg font-black text-slate-900">{trajet.date}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-600 font-bold mb-1">Heure de départ</p>
                <p className="text-lg font-black text-slate-900">{trajet.heure}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-600 font-bold mb-1">Durée du trajet</p>
                <p className="text-lg font-black text-slate-900">{trajet.duree}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <p className="text-xs text-indigo-600 font-bold mb-1">Sièges disponibles</p>
                <p className="text-lg font-black text-indigo-600">{trajet.siegesDisponibles} places</p>
              </div>
            </div>
          </div>

          {/* Sélection de siège */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
            <h3 className="text-xl font-black text-slate-900 mb-4">Choisir votre siège</h3>
            <SeatSelector totalSeats={40} onSelectSeat={handleSelectSeat} />
            
            {siegeSelectionne && (
              <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-2xl">
                <p className="text-green-800 font-bold">
                  ✅ Siège sélectionné : N°{siegeSelectionne}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Récapitulatif et réservation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 sticky top-4">
            <h3 className="text-xl font-black text-slate-900 mb-4">Récapitulatif</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Trajet</span>
                <span className="font-bold text-slate-900">{trajet.depart} → {trajet.arrivee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Date</span>
                <span className="font-bold text-slate-900">{trajet.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Heure</span>
                <span className="font-bold text-slate-900">{trajet.heure}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Compagnie</span>
                <span className="font-bold text-slate-900">{trajet.compagnie?.nom || 'N/A'}</span>
              </div>
              {siegeSelectionne && (
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Siège</span>
                  <span className="font-bold text-indigo-600">N°{siegeSelectionne}</span>
                </div>
              )}
              <hr className="border-slate-200" />
              <div className="flex justify-between text-lg">
                <span className="font-black text-slate-900">Total</span>
                <span className="font-black text-indigo-600 text-2xl">{trajet.prix.toLocaleString()} F</span>
              </div>
            </div>

            <button
              onClick={handleReserver}
              disabled={!siegeSelectionne}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed shadow-lg shadow-orange-100"
            >
              {siegeSelectionne ? 'Procéder au paiement' : 'Sélectionnez un siège'}
            </button>

            <p className="text-xs text-slate-500 text-center mt-4">
              🔒 Paiement sécurisé • En réservant, vous acceptez nos conditions générales
            </p>
          </div>
        </div>
      </div>
    </LayoutClient>
  );
};

export default TrajetDetails;