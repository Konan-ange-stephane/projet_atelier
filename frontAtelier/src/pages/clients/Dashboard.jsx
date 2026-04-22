import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutClient from '../../components/LayoutClient';
import { Search, MapPin, Bus, Navigation, Calendar } from 'lucide-react';
import busImage from '../../assets/images/bus1.png';

const Dashboard = () => {
  const navigate = useNavigate();

  const [depart, setDepart] = useState('Abidjan (Gare Nord)');
  const [destination, setDestination] = useState('Bouaké (Centre)');
  const [dateDepart, setDateDepart] = useState('');

  const handleSearch = () => {
    console.log("Recherche lancée pour :", depart, "vers", destination, "le", dateDepart);
    const params = new URLSearchParams();
    if (depart) params.append('from', depart);
    if (destination) params.append('to', destination);
    if (dateDepart) params.append('date', dateDepart);

    navigate(`/client/trajets?${params.toString()}`);
  };

  return (
    <LayoutClient title="Accueil">
      <div className="w-full space-y-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          <div className="lg:col-span-7 rounded-[2.5rem] overflow-hidden relative min-h-[380px] flex flex-col justify-between shadow-sm">
            <img src={busImage} alt="Bus" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/10" />
            <div className="relative z-10 p-8">
              <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"> ✨ Voyagez malin </span>
            </div>
            <div className="relative z-10 p-8">
              <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-lg">Bonjour!</h2>
              <p className="text-white/70 font-bold mt-1 uppercase tracking-widest text-sm">Où allons-nous aujourd'hui ?</p>
            </div>
          </div>

          {/* BLOC DROITE : Formulaire */}
          <div className="lg:col-span-5 bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-blue-50 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h3 className="text-xl font-black text-slate-900">Votre itinéraire</h3>
                <div className="h-1.5 w-10 bg-blue-600 rounded-full mt-2 mx-auto lg:mx-0" />
              </div>

              <div className="space-y-4">
                {/* Départ */}
                <div className="group">
                  <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 ml-2">Point de départ</label>
                  <div className="relative">
                    <select
                      value={depart}
                      onChange={(e) => setDepart(e.target.value)} // On met à jour quand on change
                      className="w-full pl-6 pr-12 py-5 bg-slate-50 rounded-2xl font-bold text-slate-900 outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option>Abidjan (Gare Nord)</option>
                      <option>Yamoussoukro</option>
                    </select>
                    <Navigation className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  </div>
                </div>

                {/* Destination */}
                <div className="group">
                  <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 ml-2">Destination</label>
                  <div className="relative">
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)} // On met à jour quand on change
                      className="w-full pl-6 pr-12 py-5 bg-slate-50 rounded-2xl font-bold text-slate-900 outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option>Bouaké (Centre)</option>
                      <option>San-Pédro</option>
                    </select>
                    <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  </div>
                </div>

                {/* Date */}
                <div className="group">
                  <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 ml-2">Date de départ</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dateDepart}
                      onChange={(e) => setDateDepart(e.target.value)}
                      className="w-full pl-6 pr-12 py-5 bg-slate-50 rounded-2xl font-bold text-slate-900 outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all"
                    />
                    <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  </div>
                </div>


                <button
                  onClick={handleSearch}
                  className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm mt-6"
                >
                  <Search size={20} strokeWidth={3} />
                  Rechercher un trajet
                </button>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-2"> <Bus size={24} /> </div>
          <h4 className="text-xl font-black text-slate-900">Bienvenue sur SmartTrip !</h4>
          <p className="text-slate-400 font-medium max-w-md"> Réservez votre trajet en quelques clics et voyagez en toute sérénité. </p>
        </div>

      </div>
    </LayoutClient>
  );
};

export default Dashboard;