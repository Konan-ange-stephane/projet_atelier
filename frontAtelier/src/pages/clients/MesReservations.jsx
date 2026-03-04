import React, { useState, useEffect } from 'react';
import { reservationService } from '../../services/reservationService';
import LayoutClient from '../../components/LayoutClient';
import Ticket from '../../components/Ticket';
import Chargeur from '../../components/Chargeur';

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('Toutes');
  const [ticketAffiche, setTicketAffiche] = useState(null);

  useEffect(() => {
    chargerReservations();
  }, []);

  const chargerReservations = async () => {
    try {
      const data = await reservationService.getMesReservations();
      setReservations(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setChargement(false);
    }
  };

  const reservationsFiltrees = filtreStatut === 'Toutes' 
    ? reservations 
    : reservations.filter(r => r.statut === filtreStatut);

  const afficherTicket = (reservation) => {
    setTicketAffiche(reservation);
  };

  const fermerTicket = () => {
    setTicketAffiche(null);
  };

  const getStatutColor = (statut) => {
    switch(statut) {
      case 'Confirmée':
        return 'bg-green-100 text-green-700';
      case 'Terminée':
        return 'bg-slate-100 text-slate-700';
      case 'Annulée':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-indigo-100 text-indigo-700';
    }
  };

  if (chargement) {
    return <Chargeur fullScreen />;
  }

  return (
    <LayoutClient 
      title="Mes réservations" 
      subtitle="Gérez vos voyages passés et à venir"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {['Toutes', 'Confirmée', 'Terminée', 'Annulée'].map((statut) => (
            <button
              key={statut}
              onClick={() => setFiltreStatut(statut)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                filtreStatut === statut
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {statut}
            </button>
          ))}
        </div>
      </div>

      {reservationsFiltrees.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-slate-100 text-center">
          <div className="text-6xl mb-4">🎫</div>
          <p className="text-slate-500 text-lg font-medium mb-4">Aucune réservation trouvée.</p>
          <button
            onClick={() => window.location.href = '/client/trajets'}
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            Réserver un trajet
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase tracking-wider">Trajet</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase tracking-wider">Siège</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase tracking-wider">Prix</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservationsFiltrees.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      #{reservation.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {reservation.trajet}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {reservation.date} à {reservation.heure}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      N°{reservation.siege}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {reservation.prix} FCFA
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs font-black rounded-full uppercase tracking-wider ${getStatutColor(reservation.statut)}`}>
                        {reservation.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {reservation.statut === 'Confirmée' && (
                        <button
                          onClick={() => afficherTicket(reservation)}
                          className="text-indigo-600 hover:text-indigo-800 font-bold"
                        >
                          Voir le billet
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal du ticket */}
      {ticketAffiche && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <button
              onClick={fermerTicket}
              className="absolute -top-4 -right-4 bg-rose-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-rose-700 transition shadow-lg"
            >
              ✕
            </button>
            <Ticket reservation={ticketAffiche} />
          </div>
        </div>
      )}
    </LayoutClient>
  );
};

export default MesReservations;