import React, { useEffect, useState } from 'react';
import LayoutAgent from '../../components/LayoutAgent';
import { agentService } from '../../services/api';

const AgentPassengers = () => {
  const [trips, setTrips] = useState([]);
  const [tripId, setTripId] = useState('');
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await agentService.getTrips();
        setTrips(Array.isArray(data) ? data : []);
      } catch {
        setTrips([]);
      }
    })();
  }, []);

  const onLoadPassengers = async (selectedTripId) => {
    if (!selectedTripId) return;
    setLoading(true);
    try {
      const data = await agentService.getTripPassengers(selectedTripId);
      setPassengers(Array.isArray(data) ? data : []);
    } catch {
      setPassengers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAgent title="Passagers par trajet">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Liste des passagers</h2>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
            className="min-w-[220px] rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Choisir un trajet</option>
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                #{t.id} - {t.depart} → {t.arrivee}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onLoadPassengers(tripId)}
            disabled={!tripId || loading}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Consulter'}
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Nom</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Telephone</th>
                <th className="px-3 py-2">Place</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {passengers.map((p, idx) => (
                <tr key={p.id ?? p.userId ?? idx}>
                  <td className="px-3 py-2">{p.nom || p.name || '-'}</td>
                  <td className="px-3 py-2">{p.email || '-'}</td>
                  <td className="px-3 py-2">{p.telephone || p.phone || '-'}</td>
                  <td className="px-3 py-2">{p.placeNumero || p.seatNumber || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && passengers.length === 0 && (
            <p className="py-4 text-sm text-slate-500">Aucun passager a afficher.</p>
          )}
        </div>
      </section>
    </LayoutAgent>
  );
};

export default AgentPassengers;
