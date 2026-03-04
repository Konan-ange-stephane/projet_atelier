import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LayoutClient from '../../components/LayoutClient';

const ProfilClient = () => {
  const { user, updateUser } = useAuth();
  
  const [modeEdition, setModeEdition] = useState(false);
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    adresse: user?.adresse || ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedUser = { ...user, ...formData };
    updateUser(updatedUser);
    
    setModeEdition(false);
    setMessage('Profil mis à jour avec succès !');
    
    setTimeout(() => setMessage(''), 3000);
  };

  const annulerEdition = () => {
    setFormData({
      nom: user?.nom || '',
      email: user?.email || '',
      telephone: user?.telephone || '',
      adresse: user?.adresse || ''
    });
    setModeEdition(false);
  };

  return (
    <LayoutClient 
      title="Mon profil" 
      subtitle="Gérez vos informations personnelles"
    >
      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-[2rem] font-medium">
          ✅ {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte de profil */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-black mb-4 shadow-lg shadow-indigo-100">
              {user?.nom?.charAt(0).toUpperCase() || 'C'}
            </div>
            <h3 className="text-xl font-black text-slate-900">{user?.nom || 'Client'}</h3>
            <p className="text-slate-600 text-sm mt-1">{user?.email || 'email@example.com'}</p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600">Membre depuis</p>
              <p className="text-sm font-bold text-slate-800">Février 2026</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
            <h4 className="font-black text-slate-900 mb-4">Statistiques</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm font-medium">Voyages effectués</span>
                <span className="font-black text-slate-900 text-lg">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm font-medium">Points fidélité</span>
                <span className="font-black text-indigo-600 text-lg">350</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm font-medium">Économies totales</span>
                <span className="font-black text-green-600 text-lg">15 000 F</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire d'édition */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">Informations personnelles</h3>
              {!modeEdition && (
                <button
                  onClick={() => setModeEdition(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all"
                >
                  Modifier
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    disabled={!modeEdition}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!modeEdition}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    disabled={!modeEdition}
                    placeholder="+225 XX XX XX XX XX"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Adresse
                  </label>
                  <textarea
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    disabled={!modeEdition}
                    rows="3"
                    placeholder="Votre adresse complète"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed outline-none transition-all"
                  />
                </div>
              </div>

              {modeEdition && (
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={annulerEdition}
                    className="flex-1 px-4 py-3 bg-slate-600 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Section sécurité */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
            <h3 className="text-xl font-black text-slate-900 mb-4">Sécurité</h3>
            <button className="w-full px-4 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all">
              Changer le mot de passe
            </button>
          </div>
        </div>
      </div>
    </LayoutClient>
  );
};

export default ProfilClient;