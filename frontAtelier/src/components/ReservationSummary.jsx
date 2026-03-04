import React from 'react';

const ReservationSummary = ({ details }) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
      <h3 className="text-xl font-black text-slate-900 mb-4">Résumé de votre commande</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-600 font-medium">Départ</span>
          <span className="font-bold text-slate-900">{details.depart}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 font-medium">Arrivée</span>
          <span className="font-bold text-slate-900">{details.arrivee}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 font-medium">Siège</span>
          <span className="font-bold text-indigo-600">N°{details.siege}</span>
        </div>
        <hr className="border-slate-200" />
        <div className="flex justify-between text-lg">
          <span className="font-black text-slate-900">Total</span>
          <span className="font-black text-indigo-600 text-2xl">{details.prix.toLocaleString()} F</span>
        </div>
      </div>
    </div>
  );
};

export default ReservationSummary;