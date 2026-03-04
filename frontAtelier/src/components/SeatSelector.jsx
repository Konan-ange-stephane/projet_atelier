import React from 'react';
import { Link } from 'react-router-dom';
import { Armchair } from 'lucide-react';

const SeatSelector = ({ totalSeats = 40, onSelectSeat, selectedSeat }) => {
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 font-sans">
      <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-900">
        <Armchair className="text-indigo-600" /> Choisir votre place
      </h3>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3">
        {seats.map(seat => (
          <button 
            key={seat} 
            onClick={() => onSelectSeat(seat)}
            className={`aspect-square flex flex-col items-center justify-center rounded-xl font-bold text-sm transition-all ${
              selectedSeat === seat 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
          >
            <Armchair size={16} className="mb-1" />
            {seat}
          </button>
        ))}
      </div>
      <div className="mt-8 flex gap-6 text-[10px] font-black uppercase tracking-widest justify-center">
        <div className="flex items-center gap-2 text-slate-400"><div className="w-3 h-3 bg-slate-100 rounded-sm"></div> Libre</div>
        <div className="flex items-center gap-2 text-indigo-600"><div className="w-3 h-3 bg-indigo-600 rounded-sm"></div> Sélectionné</div>
      </div>
    </div>
  );
};

export default SeatSelector;