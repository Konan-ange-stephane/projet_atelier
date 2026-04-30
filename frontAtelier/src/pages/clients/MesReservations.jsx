// src/pages/clients/MesReservations.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bus,
  Calendar,
  Clock,
  MapPin,
  Receipt,
  CreditCard,
  X,
  ChevronRight,
  Ticket,
  Inbox,
  CheckCircle2,
} from 'lucide-react';
import LayoutClient from '../../components/LayoutClient';
import Chargeur from '../../components/Chargeur';
import {
  reservationService,
  normalizeTripForUi,
  formatIsoDateFr,
  formatMontantFcfa,
} from '../../services/api';

const STATUTS = ['Toutes', 'En attente', 'Confirmée', 'Terminée', 'Annulée'];

const STATUT_CLASS = {
  Confirmée: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80',
  'En attente': 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/80',
  Terminée: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200/80',
  Annulée: 'bg-rose-50 text-rose-800 ring-1 ring-rose-200/80',
};

function StatutPill({ statut }) {
  const cls = STATUT_CLASS[statut] || STATUT_CLASS['En attente'];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden />
      {statut}
    </span>
  );
}

const PAIMENT_OK_KEY = 'smarttrip_paiement_ok';

function TicketModal({ reservation, onFermer }) {
  const node = (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-title"
    >
      <div className="relative w-full max-w-md">
        <button
          type="button"
          onClick={onFermer}
          className="absolute -right-1 -top-1 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-50 hover:text-slate-900"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
          <div className="bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 px-8 py-8 text-center text-white">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <Ticket className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <p id="ticket-title" className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
              Document de voyage
            </p>
            <h3 className="mt-2 text-lg font-semibold leading-snug">
              {reservation.trajet}
              {reservation.heure && reservation.heure !== '—' && (
                <span className="ml-2 text-indigo-300">({reservation.heure})</span>
              )}
            </h3>
          </div>

          <div className="flex items-center bg-slate-50 px-4">
            <div className="h-2.5 w-2.5 shrink-0 rounded-full border border-slate-200 bg-white -translate-x-1" />
            <div className="h-px flex-1 border-t border-dashed border-slate-300" />
            <div className="h-2.5 w-2.5 shrink-0 rounded-full border border-slate-200 bg-white translate-x-1" />
          </div>

          <div className="space-y-4 px-8 py-7">
            {[
              {
                label: 'Date',
                value: formatIsoDateFr(reservation.date, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }),
              },
              { label: 'Heure de départ', value: reservation.heure || '—' },
              { label: 'Siège attribué', value: `N° ${reservation.siege ?? '—'}` },
              {
                label: 'Montant',
                value: formatMontantFcfa(reservation.prix),
              },
              {
                label: 'Référence',
                value: reservation.id != null ? `RES-${reservation.id}` : '—',
                mono: true,
              },
            ].map(({ label, value, mono }) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
                <span
                  className={`text-right text-sm font-semibold text-slate-900 ${mono ? 'font-mono text-xs' : ''}`}
                >
                  {value}
                </span>
              </div>
            ))}

            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-xs font-medium text-emerald-900 ring-1 ring-emerald-100">
              Réservation confirmée — présentez ce récapitulatif ou votre référence au contrôle.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return typeof document !== 'undefined' ? createPortal(node, document.body) : null;
}

const MesReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('Toutes');
  const [ticketAffiche, setTicketAffiche] = useState(null);
  const [bandeauPaiementOk, setBandeauPaiementOk] = useState(false);

  useEffect(() => {
    chargerReservations();
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(PAIMENT_OK_KEY)) {
        sessionStorage.removeItem(PAIMENT_OK_KEY);
        setBandeauPaiementOk(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const chargerReservations = async () => {
    try {
      const data = await reservationService.getMesReservations();
      setReservations(Array.isArray(data) ? data : []);
    } catch {
      setReservations([]);
    } finally {
      setChargement(false);
    }
  };

  const allerPaiement = (r) => {
    const raw = r._raw ?? {};
    const resPayload = raw.id != null ? raw : { id: r.id, reservationId: r.id, ...raw };
    const tripRaw = raw.trip ?? raw.trajet ?? {};
    const trajet =
      normalizeTripForUi(tripRaw) || {
        depart: r.trajet?.includes('→') ? r.trajet.split('→')[0]?.trim() : '',
        arrivee: r.trajet?.includes('→') ? r.trajet.split('→')[1]?.trim() : '',
        prix: r.prix,
        date: r.date,
        heure: r.heure,
      };
    navigate('/client/paiement', {
      state: {
        reservation: resPayload,
        trajet,
        placeId: raw.placeId ?? raw.place?.id ?? r.placeId,
      },
    });
  };

  const annuler = async (r) => {
    if (!window.confirm('Annuler cette réservation ? La place sera à nouveau proposée à la vente.')) return;
    const rid = r.id ?? r._raw?.reservationId ?? r._raw?.id;
    if (rid == null) {
      alert('Référence réservation introuvable.');
      return;
    }
    try {
      await reservationService.annulerReservation(rid);
      await chargerReservations();
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || 'Annulation impossible.');
    }
  };

  const reservationsFiltrees =
    filtreStatut === 'Toutes'
      ? reservations
      : reservations.filter((r) => r.statut === filtreStatut);

  if (chargement) return <Chargeur fullScreen />;

  return (
    <LayoutClient
      title="Mes réservations"
      subtitle="Suivez vos trajets, effectuez le paiement ou consultez vos billets."
    >
      <div className="mx-auto max-w-6xl space-y-8">
        {bandeauPaiementOk && (
          <div
            className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            role="status"
          >
            <div className="flex items-start gap-3 sm:items-center">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />
              <p className="leading-relaxed">
                <span className="font-semibold">Paiement enregistré.</span> Votre réservation est à jour. Vous pouvez
                consulter le détail ou afficher votre billet depuis la liste.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBandeauPaiementOk(false)}
              className="shrink-0 self-end rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-800 underline-offset-2 hover:underline sm:self-auto"
            >
              Fermer
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-sm text-slate-600 leading-relaxed">
            Toutes vos réservations sont listées ci-dessous. Les montants en attente de paiement peuvent être réglés en
            ligne jusqu’au départ, selon les conditions de la compagnie.
          </p>
          <Link
            to="/client/trajets"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            <Bus className="h-4 w-4" strokeWidth={2} />
            Nouveau trajet
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUTS.map((statut) => {
            const count =
              statut === 'Toutes' ? reservations.length : reservations.filter((r) => r.statut === statut).length;
            const active = filtreStatut === statut;
            return (
              <button
                key={statut}
                type="button"
                onClick={() => setFiltreStatut(statut)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-900/10'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {statut}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs tabular-nums ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {reservationsFiltrees.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white px-8 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Inbox className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Aucune réservation à afficher</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {filtreStatut === 'Toutes'
                ? 'Vous n’avez pas encore réservé de trajet. Explorez les lignes disponibles pour commencer.'
                : `Aucune réservation ne correspond au filtre « ${filtreStatut} ».`}
            </p>
            <button
              type="button"
              onClick={() => navigate('/client/trajets')}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
              Parcourir les trajets
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 md:hidden">
              {reservationsFiltrees.map((r) => (
                <article
                  key={String(r.id)}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-slate-400">#{r.id}</p>
                      <h3 className="mt-1 flex items-start gap-2 text-base font-semibold text-slate-900">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" strokeWidth={2} />
                        <span className="leading-snug">
                          {r.trajet}
                          {r.heure && r.heure !== '—' && (
                            <span className="ml-2 text-indigo-600">({r.heure})</span>
                          )}
                          {r.compagnie ? (
                            <span className="mt-0.5 block text-xs font-normal text-slate-500">{r.compagnie}</span>
                          ) : null}
                        </span>
                      </h3>
                    </div>
                    <StatutPill statut={r.statut} />
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-slate-100">
                    {[
                      {
                        icon: Calendar,
                        label: 'Date',
                        val: formatIsoDateFr(r.date),
                      },
                      { icon: Clock, label: 'Heure', val: r.heure || '—' },
                      { icon: Receipt, label: 'Siège', val: `N° ${r.siege ?? '—'}` },
                      {
                        icon: CreditCard,
                        label: 'Montant',
                        val: formatMontantFcfa(r.prix),
                      },
                    ].map((item) => (
                      <div key={item.label} className="bg-white px-4 py-3">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                          {React.createElement(item.icon, { className: 'h-3.5 w-3.5', strokeWidth: 2 })}
                          {item.label}
                        </div>
                        <p className="mt-1 text-sm font-semibold text-slate-800 tabular-nums">{item.val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 p-4">
                    <Link
                      to={`/client/mes-reservations/${r.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Détails
                      <ChevronRight className="h-4 w-4 opacity-60" />
                    </Link>
                    {r.statut === 'En attente' && (
                      <>
                        <button
                          type="button"
                          onClick={() => allerPaiement(r)}
                          className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                        >
                          Régler le montant
                        </button>
                        <button
                          type="button"
                          onClick={() => annuler(r)}
                          className="w-full rounded-xl border border-rose-200 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                        >
                          Annuler la réservation
                        </button>
                      </>
                    )}
                    {r.statut === 'Confirmée' && (
                      <button
                        type="button"
                        onClick={() => setTicketAffiche(r)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 py-2.5 text-sm font-medium text-emerald-900 transition hover:bg-emerald-50"
                      >
                        <Ticket className="h-4 w-4" />
                        Afficher le billet
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90">
                      {['Référence', 'Trajet', 'Départ', 'Place', 'Montant', 'Statut', ''].map((h) => (
                        <th
                          key={h || 'a'}
                          className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reservationsFiltrees.map((r) => (
                      <tr key={String(r.id)} className="transition hover:bg-slate-50/80">
                        <td className="px-5 py-4 font-mono text-xs text-slate-500">#{r.id}</td>
                        <td className="max-w-[220px] px-5 py-4">
                          <p className="font-medium text-slate-900 truncate">{r.trajet}</p>
                          {r.compagnie ? (
                            <p className="mt-0.5 truncate text-xs text-slate-500">{r.compagnie}</p>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          <span className="block font-medium text-slate-800">{formatIsoDateFr(r.date)}</span>
                          <span className="text-xs text-slate-500">{r.heure || '—'}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
                            {r.siege}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-semibold tabular-nums text-slate-900">
                          {r.prix != null && !Number.isNaN(Number(r.prix))
                            ? `${Number(r.prix).toLocaleString('fr-FR')} FCFA`
                            : '—'}
                        </td>
                        <td className="px-5 py-4">
                          <StatutPill statut={r.statut} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex flex-col items-end gap-1.5">
                            <Link
                              to={`/client/mes-reservations/${r.id}`}
                              className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                            >
                              Détails →
                            </Link>
                            {r.statut === 'En attente' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => allerPaiement(r)}
                                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                  Paiement
                                </button>
                                <button
                                  type="button"
                                  onClick={() => annuler(r)}
                                  className="text-xs font-medium text-rose-600 hover:text-rose-800"
                                >
                                  Annuler
                                </button>
                              </>
                            )}
                            {r.statut === 'Confirmée' && (
                              <button
                                type="button"
                                onClick={() => setTicketAffiche(r)}
                                className="text-xs font-medium text-emerald-700 hover:text-emerald-900"
                              >
                                Billet
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{reservationsFiltrees.length}</span> réservation
                  {reservationsFiltrees.length !== 1 ? 's' : ''} affichée{reservationsFiltrees.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {ticketAffiche && <TicketModal reservation={ticketAffiche} onFermer={() => setTicketAffiche(null)} />}
    </LayoutClient>
  );
};

export default MesReservations;
