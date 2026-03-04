import React from 'react';
import { Link } from 'react-router-dom';

const Chargeur = ({ size = 'medium', fullScreen = false }) => {
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-10 h-10 border-4",
    large: "w-16 h-16 border-4"
  };

  const spinner = (
    <div className={`${sizeClasses[size]} border-indigo-100 border-t-indigo-600 rounded-full animate-spin`}></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
        {spinner}
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs font-sans">Chargement SmartTrip</p>
      </div>
    );
  }
  return spinner;
};

export default Chargeur;