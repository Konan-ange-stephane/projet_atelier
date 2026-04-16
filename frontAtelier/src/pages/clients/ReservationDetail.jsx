import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Armchair,
  Banknote,
  CreditCard,
  Loader2,
  Receipt,
  ChevronRight,
  Building2,
  History,
} from 'lucide-react';
import LayoutClient from '../../components/LayoutClient';
import Chargeur from '../../components/Chargeur';
import {
  reservationService,
  normalizeReservationListItem,
  normalizeTripForUi,
  normalizePaymentRow,
  formatIsoDateFr,
  formatMontantFcfa,
} from '../../services/api';

const STATUT_CLASS = {
  Confirmée: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80',
  'En attente': 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/80',
  Terminée: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200/80',
  Annulée: 'bg-rose-50 text-rose-800 ring-1 ring-rose-200/80',
};

function StatutPill({ statut }) {
  const cls = STATUT_CLASS[statut] || STATUT_CLASS['En attente'];
  return (
    <span className={`inline-flex gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {statut}
    </span>
  );
}

function formatDateTimeFr(value) {
  if (value == null || value === '') return '—';
  const s = String(value).trim();
  const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T12:00:00`) : new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const ReservationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [ligne, setLigne] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [action, setAction] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setChargement(true);
      setErreur('');
      try {
        const [raw, hist] = await Promise.all([
          reservationService.getReservationById(id),
          reservationService.getReservationHistory(id).catch(() => []),
        ]);
        if (cancel) return;
        setData(raw);
        setLigne(raw?.ligne ?? normalizeReservationListItem(raw));
        setHistorique(Array.isArray(hist) ? hist : []);
      } catch (e) {
        if (!cancel) {
          setErreur(
            e?.response?.data?.message || e?.message || 'Réservation introuvable.'
          );
        }
      } finally {
        if (!cancel) setChargement(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [id]);

  const paiementsUi = useMemo(() => {
    const list = data?.paiements ?? data?.payments ?? [];
    return list.map((p) => normalizePaymentRow(p)).filter(Boolean);
  }, [data]);

  const reservationRef = data?.id ?? data?.reservationId ?? id;

  const statutApi = (data?.statut ?? data?.status ?? '').toString().toUpperCase();
  const enAttente =
    statutApi.includes('EN_ATTENTE') ||
    statutApi.includes('ATTENTE') ||
    ligne?.statut === 'En attente';
  const peutAnnuler = enAttente && !statutApi.includes('ANNULE');
  const peutPayer = enAttente;

  const annuler = async () => {
    if (!window.confirm('Annuler cette réservation ? La place sera libérée pour d’autres voyageurs.')) return;
    setAction(true);
    try {
      await reservationService.annulerReservation(reservationRef);
      navigate('/client/mes-reservations', { replace: true });
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || 'Annulation impossible.');
    } finally {
      setAction(false);
    }
  };

  const allerPaiement = () => {
    const tripRaw = data?.trip ?? data?.trajet ?? {};
    const trajet =
      normalizeTripForUi(tripRaw) ||
      (ligne && {
        depart: ligne.trajet?.includes('→') ? ligne.trajet.split('→')[0]?.trim() : '',
        arrivee: ligne.trajet?.includes('→') ? ligne.trajet.split('→')[1]?.trim() : '',
        prix: ligne.prix,
        date: ligne.date,
        heure: ligne.heure,
      });
    navigate('/client/paiement', {
      state: {
        reservation: data,
        trajet,
        placeId: data?.placeId ?? data?.place?.id ?? ligne?.placeId,
      },
    });
  };

  if (chargement) return <Chargeur fullScreen />;

  if (erreur || !data) {
    return (
      <LayoutClient title="Réservation" subtitle="Détail d’une réservation">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white px-8 py-12 text-center shadow-sm">
          <p className="text-slate-600">{erreur || 'Cette réservation est introuvable ou n’existe plus.'}</p>
          <Link
            to="/client/mes-reservations"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à mes réservations
          </Link>
        </div>
      </LayoutClient>
    );
  }

  return (
    <LayoutClient
      title={`Réservation n°${reservationRef}`}
      subtitle="Synthèse du trajet, de la place, des paiements et de l’historique."
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/client/mes-reservations" className="font-medium text-indigo-600 hover:text-indigo-800">
            Mes réservations
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className="font-mono text-slate-700">#{reservationRef}</span>
        </nav>

        {ligne && (
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white px-6 py-5 md:px-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <h2 className="flex items-start gap-2 text-lg font-semibold text-slate-900 md:text-xl">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-indigo-500" strokeWidth={2} />
                    <span className="leading-snug">{ligne.trajet}</span>
                  </h2>
                  {ligne.compagnie ? (
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <Building2 className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
                      {ligne.compagnie}
                    </p>
                  ) : null}
                  <p className="mt-2 text-sm text-slate-500">
                    Vérifiez les informations avant de procéder au paiement ou d’annuler.
                  </p>
                </div>
                <StatutPill statut={ligne.statut} />
              </div>
            </div>

            <dl className="grid gap-px bg-slate-100 sm:grid-cols-2">
              {[
                {
                  icon: Calendar,
                  label: 'Date de départ',
                  value: ligne.date
                    ? formatIsoDateFr(ligne.date, {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '—',
                },
                { icon: Clock, label: 'Heure', value: ligne.heure && ligne.heure !== '—' ? ligne.heure : '—' },
                { icon: Armchair, label: 'Place attribuée', value: `Siège n° ${ligne.siege}` },
                {
                  icon: Banknote,
                  label: 'Montant',
                  value: formatMontantFcfa(ligne.prix),
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4 bg-white px-6 py-5 md:px-8">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-slate-900">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4 md:px-8">
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <Receipt className="h-5 w-5 text-slate-500" strokeWidth={2} />
              Paiements
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Montants et statuts issus de l’API pour cette réservation.
            </p>
          </div>
          {paiementsUi.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500 md:px-8">
              Aucun paiement enregistré pour l’instant.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:px-8">
                      Date
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:px-8">
                      Mode
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:px-8">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:px-8">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:px-8">
                      Réf.
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paiementsUi.map((p, idx) => (
                    <tr key={p.id != null ? String(p.id) : `pay-${idx}-${p.date}-${p.mode}`}>
                      <td className="whitespace-nowrap px-6 py-3.5 text-slate-700 md:px-8">
                        {p.date ? formatDateTimeFr(p.date) : '—'}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-slate-800 md:px-8">{p.mode}</td>
                      <td className="whitespace-nowrap px-6 py-3.5 font-medium tabular-nums text-slate-900 md:px-8">
                        {formatMontantFcfa(p.montant)}
                      </td>
                      <td className="px-6 py-3.5 md:px-8">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800">
                          {p.statutUi}
                        </span>
                        {p.statutBrut && p.statutBrut !== p.statutUi ? (
                          <span className="mt-1 block text-[10px] text-slate-400">{p.statutBrut}</span>
                        ) : null}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-xs text-slate-600 md:px-8">
                        {p.reference || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4 md:px-8">
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <History className="h-5 w-5 text-slate-500" strokeWidth={2} />
              Historique
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Journal des événements (si le backend expose la route{' '}
              <span className="font-mono text-[11px]">GET /api/reservations/:id/history</span>).
            </p>
          </div>
          {historique.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500 md:px-8">
              Aucun événement d’historique disponible pour cette réservation.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 px-6 py-2 md:px-8">
              {historique.map((h) => (
                <li key={h.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{h.titre}</p>
                    {h.detail ? <p className="mt-1 text-sm text-slate-600">{h.detail}</p> : null}
                  </div>
                  <time className="shrink-0 text-xs text-slate-500 sm:text-right">
                    {h.date ? formatDateTimeFr(h.date) : '—'}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {peutPayer && (
            <button
              type="button"
              disabled={action}
              onClick={allerPaiement}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {action ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              Payer en ligne
            </button>
          )}
          {peutAnnuler && (
            <button
              type="button"
              disabled={action}
              onClick={annuler}
              className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white px-6 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
            >
              Annuler la réservation
            </button>
          )}
          <Link
            to="/client/mes-reservations"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Liste des réservations
          </Link>
        </div>
      </div>
    </LayoutClient>
  );
};

export default ReservationDetail;
