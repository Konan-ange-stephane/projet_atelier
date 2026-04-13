// src/pages/client/MesReservations.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutClient from '../../components/LayoutClient';
import Chargeur from '../../components/Chargeur';

// ── Mock de secours ─────────────────────────────────────────────────────
const RESERVATIONS_MOCK = [
  { id: 1, trajet: 'Abidjan → Bouaké',       date: '2026-04-15', heure: '08:30', siege: 12, prix: 5000,  statut: 'Confirmée' },
  { id: 2, trajet: 'Abidjan → Yamoussoukro', date: '2026-04-20', heure: '14:00', siege: 5,  prix: 4000,  statut: 'En attente' },
  { id: 3, trajet: 'Bouaké → San-Pédro',     date: '2026-03-10', heure: '07:00', siege: 22, prix: 7500,  statut: 'Terminée' },
  { id: 4, trajet: 'Abidjan → Korhogo',      date: '2026-02-28', heure: '06:00', siege: 8,  prix: 9000,  statut: 'Annulée' },
];
// ────────────────────────────────────────────────────────────────────────

const STATUTS = ['Toutes', 'Confirmée', 'En attente', 'Terminée', 'Annulée'];

const STATUT_STYLES = {
  'Confirmée':  { badge: 'bg-green-100 text-green-700 border border-green-200',  icon: '✅', dot: 'bg-green-500' },
  'En attente': { badge: 'bg-orange-100 text-orange-700 border border-orange-200', icon: '⏳', dot: 'bg-orange-400' },
  'Terminée':   { badge: 'bg-slate-100 text-slate-600 border border-slate-200',  icon: '🏁', dot: 'bg-slate-400' },
  'Annulée':    { badge: 'bg-rose-100 text-rose-700 border border-rose-200',     icon: '❌', dot: 'bg-rose-500' },
};

// ── Composant Ticket modal (inline, sans import externe) ─────────────────
const TicketModal = ({ reservation, onFermer }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="relative w-full max-w-sm">
      <button
        onClick={onFermer}
        className="absolute -top-3 -right-3 z-10 bg-rose-600 hover:bg-rose-700 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg transition-all font-black text-sm"
      >
        ✕
      </button>

      {/* Ticket */}
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Header bleu */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white text-center">
          <div className="text-3xl mb-2">🎫</div>
          <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">SmartTrip — Billet de voyage</p>
          <h3 className="text-xl font-black">{reservation.trajet}</h3>
        </div>

        {/* Découpe */}
        <div className="flex items-center">
          <div className="w-5 h-5 bg-slate-50 rounded-full -ml-2.5 border-r border-slate-100" />
          <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2" />
          <div className="w-5 h-5 bg-slate-50 rounded-full -mr-2.5 border-l border-slate-100" />
        </div>

        {/* Infos */}
        <div className="p-6 space-y-4">
          {[
            { label: 'Date',    value: new Date(reservation.date).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) },
            { label: 'Heure',   value: reservation.heure },
            { label: 'Siège',   value: `N°${reservation.siege}` },
            { label: 'Prix',    value: `${reservation.prix?.toLocaleString()} FCFA` },
            { label: 'Réf.',    value: `#${reservation.id}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
              <span className="font-black text-slate-900 text-sm">{value}</span>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
              ✅ Réservation confirmée
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MesReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations]   = useState([]);
  const [chargement, setChargement]       = useState(true);
  const [filtreStatut, setFiltreStatut]   = useState('Toutes');
  const [ticketAffiche, setTicketAffiche] = useState(null);

  useEffect(() => { chargerReservations(); }, []);

  const chargerReservations = async () => {
    try {
      const { reservationService } = await import('../../services/reservationService');
      const data = await reservationService.getMesReservations();
      setReservations(data && data.length > 0 ? data : RESERVATIONS_MOCK);
    } catch {
      setReservations(RESERVATIONS_MOCK);
    } finally {
      setChargement(false);
    }
  };

  const reservationsFiltrees = filtreStatut === 'Toutes'
    ? reservations
    : reservations.filter(r => r.statut === filtreStatut);

  if (chargement) return <Chargeur fullScreen />;

  return (
    <LayoutClient title="Mes réservations">
      <div className="max-w-5xl mx-auto space-y-5">

        <div className="overflow-x-auto pb-1 -mx-1 px-1">
          <div className="flex gap-2 min-w-max">
            {STATUTS.map((statut) => (
              <button
                key={statut}
                onClick={() => setFiltreStatut(statut)}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                  filtreStatut === statut
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                    : 'bg-white text-slate-500 border border-slate-100 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                {statut}
                {statut !== 'Toutes' && (
                  <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-lg ${
                    filtreStatut === statut ? 'bg-white/20' : 'bg-slate-100'
                  }`}>
                    {reservations.filter(r => r.statut === statut).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {reservationsFiltrees.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-slate-100 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <p className="text-slate-500 text-lg font-medium mb-2">Aucune réservation trouvée</p>
            <p className="text-slate-400 text-sm mb-6">Vous n'avez pas encore de réservation {filtreStatut !== 'Toutes' ? `"${filtreStatut}"` : ''}.</p>
            <button
              onClick={() => navigate('/client/trajets')}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Réserver un trajet →
            </button>
          </div>
        ) : (
          <>
            <div className="md:hidden space-y-3">
              {reservationsFiltrees.map((r) => {
                const style = STATUT_STYLES[r.statut] || STATUT_STYLES['En attente'];
                return (
                  <div key={r.id} className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm overflow-hidden">
                    {/* Barre colorée haut */}
                    <div className={`h-1.5 w-full ${style.dot}`} />

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Réf. #{r.id}</p>
                          <h4 className="font-black text-slate-900 text-base">{r.trajet}</h4>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider flex-shrink-0 ml-2 ${style.badge}`}>
                          {style.icon} {r.statut}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                          { label: 'Date',   value: new Date(r.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) },
                          { label: 'Heure',  value: r.heure },
                          { label: 'Siège',  value: `N°${r.siege}` },
                          { label: 'Prix',   value: `${r.prix?.toLocaleString()} F` },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                            <p className="font-black text-slate-900 text-sm">{value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Action */}
                      {r.statut === 'Confirmée' && (
                        <button
                          onClick={() => setTicketAffiche(r)}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-100 active:scale-95"
                        >
                          🎫 Voir mon billet
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {['Réf.', 'Trajet', 'Date & Heure', 'Siège', 'Prix', 'Statut', 'Action'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {reservationsFiltrees.map((r) => {
                      const style = STATUT_STYLES[r.statut] || STATUT_STYLES['En attente'];
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/70 transition-colors group">
                          <td className="px-6 py-4">
                            <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">#{r.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-black text-slate-900 text-sm">{r.trajet}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-700">
                              {new Date(r.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-slate-400 font-bold">{r.heure}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">N°{r.siege}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-black text-slate-900">{r.prix?.toLocaleString()} F</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${style.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                              {r.statut}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {r.statut === 'Confirmée' && (
                              <button
                                onClick={() => setTicketAffiche(r)}
                                className="px-4 py-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all"
                              >
                                🎫 Billet
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer compteur */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400">
                  {reservationsFiltrees.length} réservation{reservationsFiltrees.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── MODAL TICKET ── */}
      {ticketAffiche && (
        <TicketModal reservation={ticketAffiche} onFermer={() => setTicketAffiche(null)} />
      )}
    </LayoutClient>
  );
};

export default MesReservations;