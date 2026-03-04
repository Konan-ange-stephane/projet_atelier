import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LayoutClient from '../../components/LayoutClient';
import ReservationSummary from '../../components/ReservationSummary';

const Paiement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { trajet, siege } = location.state || {};
  
  const [methodePaiement, setMethodePaiement] = useState('');
  const [numeroTelephone, setNumeroTelephone] = useState('');
  const [numeroCarte, setNumeroCarte] = useState('');
  const [nomCarte, setNomCarte] = useState('');
  const [dateExpiration, setDateExpiration] = useState('');
  const [cvv, setCvv] = useState('');
  const [traitement, setTraitement] = useState(false);

  if (!trajet) {
    return (
      <LayoutClient title="Paiement" subtitle="Finaliser votre réservation">
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-slate-100 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-black text-slate-800 mb-4">Aucune réservation en cours</h2>
          <button
            onClick={() => navigate('/client/trajets')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            Retour aux trajets
          </button>
        </div>
      </LayoutClient>
    );
  }

  const detailsReservation = {
    depart: trajet.depart,
    arrivee: trajet.arrivee,
    siege: siege,
    prix: trajet.prix
  };

  const handlePaiement = async (e) => {
    e.preventDefault();
    
    if (!methodePaiement) {
      alert('Veuillez choisir une méthode de paiement');
      return;
    }

    setTraitement(true);

    setTimeout(() => {
      setTraitement(false);
      alert('Paiement réussi ! Votre réservation est confirmée.');
      navigate('/client/mes-reservations');
    }, 2000);
  };

  return (
    <LayoutClient 
      title="Paiement" 
      subtitle="Finalisez votre réservation en toute sécurité"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de paiement */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePaiement}>
            {/* Choix de la méthode de paiement */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 mb-6">
              <h3 className="text-xl font-black text-slate-900 mb-4">Méthode de paiement</h3>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all group">
                  <input
                    type="radio"
                    name="methodePaiement"
                    value="mobile"
                    checked={methodePaiement === 'mobile'}
                    onChange={(e) => setMethodePaiement(e.target.value)}
                    className="mr-3 w-5 h-5 text-indigo-600"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-orange-100">
                      📱
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Mobile Money</p>
                      <p className="text-sm text-slate-600">Orange Money, MTN Money, Moov Money</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all group">
                  <input
                    type="radio"
                    name="methodePaiement"
                    value="carte"
                    checked={methodePaiement === 'carte'}
                    onChange={(e) => setMethodePaiement(e.target.value)}
                    className="mr-3 w-5 h-5 text-indigo-600"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-100">
                      💳
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Carte bancaire</p>
                      <p className="text-sm text-slate-600">Visa, Mastercard</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all group">
                  <input
                    type="radio"
                    name="methodePaiement"
                    value="especes"
                    checked={methodePaiement === 'especes'}
                    onChange={(e) => setMethodePaiement(e.target.value)}
                    className="mr-3 w-5 h-5 text-indigo-600"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-green-100">
                      💵
                    </div>
                    <div>
                      <p className="font-black text-slate-900">Espèces</p>
                      <p className="text-sm text-slate-600">Paiement au guichet</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Formulaire Mobile Money */}
            {methodePaiement === 'mobile' && (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 mb-6">
                <h3 className="text-xl font-black text-slate-900 mb-4">Informations Mobile Money</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      value={numeroTelephone}
                      onChange={(e) => setNumeroTelephone(e.target.value)}
                      placeholder="+225 XX XX XX XX XX"
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                    <p className="text-sm text-indigo-800 font-medium">
                      📲 Vous recevrez un message sur votre téléphone pour confirmer le paiement.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Formulaire Carte bancaire */}
            {methodePaiement === 'carte' && (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 mb-6">
                <h3 className="text-xl font-black text-slate-900 mb-4">Informations de carte</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Numéro de carte
                    </label>
                    <input
                      type="text"
                      value={numeroCarte}
                      onChange={(e) => setNumeroCarte(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Nom sur la carte
                    </label>
                    <input
                      type="text"
                      value={nomCarte}
                      onChange={(e) => setNomCarte(e.target.value)}
                      placeholder="NOM PRENOM"
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Date d'expiration
                      </label>
                      <input
                        type="text"
                        value={dateExpiration}
                        onChange={(e) => setDateExpiration(e.target.value)}
                        placeholder="MM/AA"
                        maxLength="5"
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        maxLength="3"
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Message pour paiement en espèces */}
            {methodePaiement === 'especes' && (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 mb-6">
                <h3 className="text-xl font-black text-slate-900 mb-4">Paiement en espèces</h3>
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                  <p className="text-orange-800 mb-3 font-bold">
                    💵 Votre réservation sera confirmée. Vous devrez payer au guichet avant le départ.
                  </p>
                  <p className="text-sm text-orange-700">
                    Présentez-vous au moins 30 minutes avant l'heure de départ avec votre code de réservation.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={traitement || !methodePaiement}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all disabled:bg-slate-400 disabled:cursor-not-allowed shadow-lg shadow-green-100"
            >
              {traitement ? 'Traitement en cours...' : 'Confirmer le paiement'}
            </button>
          </form>
        </div>

        {/* Résumé de la réservation */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <ReservationSummary details={detailsReservation} />
            
            <div className="mt-4 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
              <h4 className="font-black text-slate-900 mb-3">Informations importantes</h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Arrivez 30 min avant le départ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Présentez une pièce d'identité</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Annulation gratuite 24h avant</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Modification possible jusqu'à 12h avant</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </LayoutClient>
  );
};

export default Paiement;