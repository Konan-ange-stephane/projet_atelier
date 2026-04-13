import React from 'react';

// Correction : On utilise "details" partout sans accent pour éviter les erreurs
const ReservationSummary = ({ details }) => {
  
  // Correction : On utilise "return" au lieu de "retour"
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
      <h3 className="text-xl font-black text-slate-900 mb-6">Résumé de votre commande</h3>
      
      <div className="space-y-4">
        {/* Trajet */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Itinéraire</span>
          <span className="font-black text-slate-900">{details.depart} ➔ {details.arrivee}</span>
        </div>

        {/* Siège */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Siège</span>
          <span className="font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">N°{details.siege}</span>
        </div>

        {/* Ligne de séparation stylisée */}
        <div className="border-t-2 border-dashed border-slate-100 my-4" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="font-black text-slate-900 uppercase tracking-tighter text-lg">Total</span>
          <div className="text-right">
            <span className="font-black text-blue-600 text-3xl tracking-tighter">
              {details.prix?.toLocaleString()} F
            </span>
            <p className="text-[10px] font-bold text-slate-400 uppercase">TVA incluse</p>
          </div>
        </div>
      </div>

      {/* Petit message de confiance pour le projet de groupe */}
      <div className="mt-8 p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
        <div className="text-xl">🛡️</div>
        <p className="text-[10px] font-bold text-slate-500 leading-tight">
          Paiement sécurisé. Votre billet sera généré immédiatement après validation.
        </p>
      </div>
    </div>
  );
};

// Correction : On utilise "export default" au lieu de "exporter par défaut"
export default ReservationSummary;