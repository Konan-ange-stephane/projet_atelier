import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Smartphone,
  CreditCard,
  Banknote,
  Loader2,
  Shield,
  Bus,
  AlertCircle,
} from 'lucide-react';
import LayoutClient from '../../components/LayoutClient';
import ReservationSummary from '../../components/ReservationSummary';
import { reservationService, mapUiModeToApi, normalizeTripForUi } from '../../services/api';

const modes = [
  {
    id: 'mobile',
    title: 'Mobile money',
    description: 'Orange Money, MTN MoMo, Wave, etc.',
    icon: Smartphone,
    accent: 'from-amber-500 to-orange-600',
  },
  {
    id: 'carte',
    title: 'Carte bancaire',
    description: 'Visa, Mastercard — saisie sécurisée',
    icon: CreditCard,
    accent: 'from-indigo-500 to-violet-600',
  },
  {
    id: 'especes',
    title: 'Espèces au guichet',
    description: 'Règlement sur place avant le départ',
    icon: Banknote,
    accent: 'from-emerald-500 to-teal-600',
  },
];

const Paiement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { reservation: resState, trajet: trajetState, placeId } = location.state || {};
  const trajet =
    trajetState ||
    (resState?.trip ? normalizeTripForUi(resState.trip) : null) ||
    (resState?.trajet ? normalizeTripForUi(resState.trajet) : null);
  const reservationId = resState?.id ?? resState?.reservationId;
  
  const [methodePaiement, setMethodePaiement] = useState('');
  const [numeroTelephone, setNumeroTelephone] = useState('');
  const [numeroCarte, setNumeroCarte] = useState('');
  const [nomCarte, setNomCarte] = useState('');
  const [dateExpiration, setDateExpiration] = useState('');
  const [cvv, setCvv] = useState('');
  const [traitement, setTraitement] = useState(false);
  const [erreurPaiement, setErreurPaiement] = useState('');

  if (!trajet || !reservationId) {
    return (
      <LayoutClient
        title="Paiement"
        subtitle="Finalisation de la réservation"
      >
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white px-8 py-14 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Bus className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Aucune réservation à régler</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Choisissez un trajet et une place, puis validez la réservation pour accéder à cette étape.
          </p>
          <button
            type="button"
            onClick={() => navigate('/client/trajets')}
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Voir les trajets
          </button>
        </div>
      </LayoutClient>
    );
  }

  const numeroSiege =
    resState?.place?.numero ??
    resState?.place?.numeroPlace ??
    placeId ??
    '—';

  const detailsReservation = {
    depart: trajet.depart,
    arrivee: trajet.arrivee,
    siege: numeroSiege,
    prix: trajet.prix,
  };

  const handlePaiement = async (e) => {
    e.preventDefault();
    setErreurPaiement('');
    
    if (!methodePaiement) {
      setErreurPaiement('Veuillez sélectionner un mode de paiement.');
      return;
    }

    setTraitement(true);
    try {
      await reservationService.effectuerPaiement(reservationId, {
        modePaiement: mapUiModeToApi(methodePaiement),
      });
      // Évite navigate(replace) + setState sur la page cible (race React 19 / removeChild)
      try {
        sessionStorage.setItem('smarttrip_paiement_ok', '1');
      } catch {
        /* quota / navigation privée */
      }
      navigate('/client/mes-reservations');
    } catch (err) {
      setErreurPaiement(
        err?.response?.data?.message ||
          err?.message ||
          'Le paiement n’a pas pu être enregistré. Vérifiez vos informations ou réessayez plus tard.'
      );
    } finally {
      setTraitement(false);
    }
  };

  return (
    <LayoutClient 
      title="Paiement sécurisé"
      subtitle="Choisissez un mode de règlement pour confirmer votre réservation."
    >
      <div className="mx-auto mb-8 flex max-w-3xl items-center gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800">
          1
        </div>
        <div className="h-px flex-1 bg-slate-200" />
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
          2
                    </div>
        <div className="min-w-0 flex-1 pl-2 text-xs text-slate-600 sm:text-sm">
          <span className="font-medium text-slate-400">Étape 1 · Réservation</span>
          <span className="mx-2 text-slate-300 hidden sm:inline">|</span>
          <span className="font-semibold text-slate-900">Étape 2 · Paiement</span>
                    </div>
                  </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {erreurPaiement && (
            <div
              className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" strokeWidth={2} />
              <p>{erreurPaiement}</p>
                    </div>
          )}

          <form onSubmit={handlePaiement} className="space-y-6">
            <fieldset className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
              <legend className="sr-only">Mode de paiement</legend>
              <h3 className="text-base font-semibold text-slate-900">Mode de règlement</h3>
              <p className="mt-1 text-sm text-slate-500">
                Le montant appliqué est celui du trajet, tel que défini par le transporteur.
              </p>

              <div className="mt-6 space-y-3">
                {modes.map(({ id, title, description, icon: IconComponent, accent }) => {
                  const selected = methodePaiement === id;
                  return (
                    <label
                      key={id}
                      className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition ${
                        selected
                          ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                      }`}
                    >
                  <input
                    type="radio"
                    name="methodePaiement"
                        value={id}
                        checked={selected}
                    onChange={(e) => setMethodePaiement(e.target.value)}
                        className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-md ${accent}`}
                      >
                        {React.createElement(IconComponent, {
                          className: 'h-6 w-6',
                          strokeWidth: 1.75,
                        })}
                    </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900">{title}</p>
                        <p className="text-sm text-slate-500">{description}</p>
                  </div>
                </label>
                  );
                })}
              </div>
            </fieldset>

            {methodePaiement === 'mobile' && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
                <h3 className="text-base font-semibold text-slate-900">Coordonnées Mobile Money</h3>
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Numéro de téléphone</label>
                    <input
                      type="tel"
                      value={numeroTelephone}
                      onChange={(e) => setNumeroTelephone(e.target.value)}
                      placeholder="+225 …"
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50/80 px-4 py-3 text-sm text-indigo-900">
                    <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                    <p>
                      Une demande de confirmation peut vous être envoyée sur ce numéro selon l’opérateur et la
                      configuration du transporteur.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {methodePaiement === 'carte' && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
                <h3 className="text-base font-semibold text-slate-900">Carte bancaire</h3>
                <p className="mt-1 text-sm text-slate-500">Les champs ci-dessous sont indicatifs pour votre maquette.</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">Numéro de carte</label>
                    <input
                      type="text"
                      value={numeroCarte}
                      onChange={(e) => setNumeroCarte(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm tracking-wide focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">Nom figurant sur la carte</label>
                    <input
                      type="text"
                      value={nomCarte}
                      onChange={(e) => setNomCarte(e.target.value)}
                      placeholder="NOM PRÉNOM"
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                    <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Expiration</label>
                      <input
                        type="text"
                        value={dateExpiration}
                        onChange={(e) => setDateExpiration(e.target.value)}
                        placeholder="MM/AA"
                      maxLength={5}
                        required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">CVV</label>
                      <input
                      type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                        required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                  </div>
                </div>
              </div>
            )}

            {methodePaiement === 'especes' && (
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-6 md:p-8">
                <h3 className="text-base font-semibold text-amber-950">Paiement en agence</h3>
                <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
                  Votre place reste réservée en attente de paiement. Munissez-vous de la référence de réservation et
                  présentez-vous au guichet ou au point de vente indiqué par la compagnie, dans les délais communiqués
                  sur votre billet.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={traitement || !methodePaiement}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {traitement ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Traitement…
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" strokeWidth={2} />
                  Valider le paiement
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <ReservationSummary details={detailsReservation} reference={reservationId} />

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900">Bon à savoir</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  Présentez-vous au moins 30 minutes avant l’heure affichée.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  Une pièce d’identité peut être demandée à l’embarquement.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  Les conditions d’annulation et de modification dépendent du transporteur.
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
