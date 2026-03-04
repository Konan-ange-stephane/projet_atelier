import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket as TicketIcon, MapPin } from 'lucide-react';

const Ticket = ({ reservation }) => (
  <div className="max-w-sm mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 relative font-sans">
    <div className="bg-indigo-600 p-6 text-white text-center">
      <div className="flex justify-center mb-2"><TicketIcon size={32} /></div>
      <h2 className="text-xl font-black tracking-tighter uppercase">Billet de Voyage</h2>
    </div>
    
    <div className="p-8 space-y-6 relative">
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-r border-slate-100"></div>
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-l border-slate-100"></div>
      
      <div className="flex justify-between border-b border-slate-50 pb-4">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Passager</p>
          <p className="font-black text-slate-800 uppercase">{reservation.nom}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Siège</p>
          <p className="font-black text-indigo-600 text-lg">N°{reservation.siege}</p>
        </div>
      </div>

      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Trajet</p>
        <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
          <MapPin size={16} className="text-indigo-400" /> {reservation.trajet}
        </div>
      </div>

      <div className="pt-6 flex flex-col items-center gap-3">
        <div className="w-full h-12 bg-slate-50 rounded flex items-center justify-center border-t-2 border-slate-100 border-dashed">
          <span className="text-slate-300 font-mono tracking-[0.4em] font-bold uppercase text-xs">SMARTTRIP-{reservation.id}</span>
        </div>
        <p className="text-[9px] text-slate-400 font-bold uppercase">Présentez ce code lors de l'embarquement</p>
      </div>
    </div>
  </div>
);

export default Ticket;