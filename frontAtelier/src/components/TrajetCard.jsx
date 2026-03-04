import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';

// Composant Button interne pour éviter les erreurs de résolution de chemin
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
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600"
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
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
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
  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group font-sans">
    <div className="flex justify-between items-start mb-6">
      <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
        Places disponibles
      </div>
      <div className="text-right">
        <span className="text-2xl font-black text-slate-900">{trajet.prix?.toLocaleString()}</span>
        <span className="text-xs font-bold text-slate-400 ml-1 uppercase">CFA</span>
      </div>
    </div>

    <div className="space-y-4 relative mb-8">
      {/* Ligne décorative entre les points */}
      <div className="absolute left-[5px] top-3 bottom-3 w-0.5 bg-slate-100"></div>
      
      <div className="flex items-center gap-4 relative">
        <div className="w-3 h-3 rounded-full border-2 border-indigo-600 bg-white z-10"></div>
        <span className="font-bold text-slate-700">{trajet.depart}</span>
      </div>
      
      <div className="flex items-center gap-4 relative">
        <div className="w-3 h-3 rounded-full bg-indigo-600 z-10 shadow-sm shadow-indigo-200"></div>
        <span className="font-bold text-slate-700">{trajet.arrivee}</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50 mb-6">
      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
        <Calendar size={14} className="text-indigo-400" /> {trajet.date}
      </div>
      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
        <Clock size={14} className="text-indigo-400" /> {trajet.heure}
      </div>
    </div>

    <Button fullWidth onClick={() => onReserver(trajet.id)}>
      Réserver <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
    </Button>
  </div>
);

export default TrajetCard;