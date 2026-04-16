import React from 'react';
import { MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';

// 1. Composant Button interne corrigé
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  fullWidth = false,
  loading = false,
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600"
  };

  const sizes = {
    small: "px-3 py-1.5 text-xs",
    medium: "px-5 py-3 text-sm",
    large: "px-8 py-4 text-base"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.medium} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

const TrajetCard = ({ trajet, onReserver }) => (
  <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group font-sans">
    {trajet.compagnie && trajet.compagnie !== '—' ? (
      <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">{trajet.compagnie}</p>
    ) : null}
    <div className="flex justify-between items-start mb-6">
      <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
        Places disponibles
      </div>
      <div className="text-right">
        <span className="text-2xl font-black text-slate-900">{trajet.prix?.toLocaleString()}</span>
        <span className="text-xs font-bold text-slate-400 ml-1 uppercase">F</span>
      </div>
    </div>

    <div className="space-y-4 relative mb-8 ml-2">
      {/* Ligne décorative */}
      <div className="absolute left-[5px] top-3 bottom-3 w-0.5 bg-slate-100"></div>
      
      <div className="flex items-center gap-4 relative">
        <div className="w-3 h-3 rounded-full border-2 border-blue-600 bg-white z-10"></div>
        <span className="font-bold text-slate-700">{trajet.depart}</span>
      </div>
      
      <div className="flex items-center gap-4 relative">
        <div className="w-3 h-3 rounded-full bg-blue-600 z-10 shadow-sm shadow-blue-200"></div>
        <span className="font-bold text-slate-700">{trajet.arrivee}</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50 mb-6">
      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
        <Calendar size={14} className="text-blue-400" /> {trajet.date}
      </div>
      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
        <Clock size={14} className="text-blue-400" /> {trajet.heure}
      </div>
    </div>

    {/* APPEL À LA FONCTION ONRESERVER */}
    <Button 
      fullWidth 
      onClick={() => onReserver(trajet.id)} 
    >
      Réserver <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
    </Button>
  </div>
);

export default TrajetCard;