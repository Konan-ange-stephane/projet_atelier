import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LayoutClient from '../../components/LayoutClient';
import Chargeur from '../../components/Chargeur';
import { trajetService, reservationService } from '../../services/api';

const VueSieges = ({ trajet, places, onRetour, onConfirmer, submitting }) => {
  const [placeIdSelectionne, setPlaceIdSelectionne] = useState(null);

  const parNumero = useMemo(() => {
    const m = new Map();
    (places || []).forEach((p) => {
      if (p.numero != null) m.set(Number(p.numero), p);
    });
    return m;
  }, [places]);

  const numeros = useMemo(() => {
    const ns = [...parNumero.keys()].sort((a, b) => a - b);
    if (ns.length === 0) return Array.from({ length: 24 }, (_, i) => i + 1);
    const max = Math.max(...ns, 24);
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [parNumero]);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
          {typeof trajet.compagnie === 'string' ? trajet.compagnie : trajet.compagnieObj?.nom}
        </p>
        <h3 className="font-black text-slate-900 text-lg">
          {trajet.depart} ➔ {trajet.arrivee}
        </h3>
        <p className="text-xs font-bold text-slate-400 mt-1">
          {trajet.heureDepart || trajet.heure} • {trajet.prix?.toLocaleString()} F
        </p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
        <div className="text-center mb-6">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">🚌 AVANT DU BUS</span>
        </div>

        <div className="grid grid-cols-5 gap-3 max-w-xs mx-auto">
          {numeros.map((num) => {
            const place = parNumero.get(num);
            const isAisle = (num - 1) % 5 === 2;
            if (isAisle) {
              return (
                <div key={`a-${num}`} className="flex items-center justify-center text-[10px] font-bold text-slate-200">
                  {Math.ceil(num / 5)}
                </div>
              );
            }
            const dispo = place?.disponible === true;
            const selected = place && placeIdSelectionne === place.id;
            return (
              <button
                key={num}
                type="button"
                disabled={!dispo}
                onClick={() => {
                  if (!place) return;
                  setPlaceIdSelectionne(selected ? null : place.id);
                }}
                className={`h-10 rounded-xl font-black text-xs transition-all border-2 ${selected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-110'
                  : !place || !dispo
                    ? 'bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed'
                    : 'bg-white border-slate-100 text-slate-600 hover:border-blue-300'
                  }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-20 left-4 right-4 lg:relative lg:bottom-0 lg:left-0 lg:right-0 z-50">
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Place </p>
            <p className="font-black text-lg">
              {placeIdSelectionne
                ? `#${placeIdSelectionne}`
                : '—'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onRetour}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-black text-xs uppercase"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={() => onConfirmer(placeIdSelectionne)}
              disabled={!placeIdSelectionne || submitting}
              className="px-6 py-3 bg-blue-600 disabled:bg-slate-700 rounded-xl font-black text-xs uppercase shadow-lg"
            >
              {submitting ? '…' : 'Réserver'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrajetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trajet, setTrajet] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    let cancel = false;
    const run = async () => {
      setErreur('');
      setLoading(true);
      try {
        const [t, pl] = await Promise.all([
          trajetService.getTrajetById(id),
          trajetService.getPlacesDisponibles(id),
        ]);
        if (cancel) return;
        setTrajet(t);
        setPlaces(Array.isArray(pl) ? pl : []);
      } catch (e) {
        if (!cancel) setErreur(e?.message || 'Impossible de charger le trajet.');
      } finally {
        if (!cancel) setLoading(false);
      }
    };
    run();
    return () => {
      cancel = true;
    };
  }, [id]);

  const handleConfirmer = async (placeId) => {
    if (!placeId || !trajet) return;
    setSubmitting(true);
    setErreur('');
    try {
      const reservation = await reservationService.creerReservation({
        tripId: Number(id),
        placeId: Number(placeId),
      });
      navigate('/client/paiement', {
        state: {
          reservation,
          trajet,
          placeId,
        },
      });
    } catch (e) {
      setErreur(
        e?.response?.data?.message ||
        e?.message ||
        'La réservation a échoué. Réessayez ou choisissez une autre place.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Chargeur fullScreen />;

  if (!trajet) {
    return (
      <LayoutClient title="Trajet">
        <div className="bg-white p-8 rounded-2xl text-center text-slate-600">
          {erreur || 'Trajet introuvable.'}
        </div>
      </LayoutClient>
    );
  }

  return (
    <LayoutClient title="Choix de la place">
      <div className="max-w-xl mx-auto pb-32 lg:pb-10">
        {erreur && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm font-medium">{erreur}</div>
        )}
        <VueSieges
          trajet={trajet}
          places={places}
          submitting={submitting}
          onRetour={() => navigate('/client/trajets')}
          onConfirmer={handleConfirmer}
        />
      </div>
    </LayoutClient>
  );
};

export default TrajetDetails;
