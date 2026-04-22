import React, { useEffect, useState } from 'react';
import LayoutAgent from '../../components/LayoutAgent';
import { agentService } from '../../services/api';

const EMPTY_TRIP = {
  villeDepart: '',
  villeArrivee: '',
  dateDepart: '',
  heureDepart: '',
  prix: '',
  vehicleId: '',
};

function vehicleOptionLabel(v) {
  const m = v?.matricule ?? v?.immatriculation ?? '';
  const marque = v?.marque ?? v?.modele ?? '';
  const bits = [m, marque].filter(Boolean).join(' · ');
  return bits || `Véhicule #${v?.id ?? '?'}`;
}

/** Corps API : villeDepart, villeArrivee, dateDepart, heureDepart, prix, vehicleId */
const GestionTrajetsAgent = () => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(EMPTY_TRIP);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await agentService.getTrips();
      setTrips(Array.isArray(data) ? data : []);
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    try {
      const data = await agentService.getVehicles();
      setVehicles(Array.isArray(data) ? data : []);
    } catch {
      setVehicles([]);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    loadVehicles();
  }, []);

  const buildPayload = () => {
    const vid = form.vehicleId === '' ? NaN : Number(form.vehicleId);
    return {
      villeDepart: form.villeDepart.trim(),
      villeArrivee: form.villeArrivee.trim(),
      dateDepart: form.dateDepart.trim(),
      heureDepart: form.heureDepart.trim(),
      prix: form.prix === '' ? NaN : Number(form.prix),
      vehicleId: Number.isFinite(vid) && vid >= 1 ? vid : NaN,
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = buildPayload();
    if (!payload.villeDepart || !payload.villeArrivee || !payload.dateDepart || !payload.heureDepart) return;
    if (!Number.isFinite(payload.vehicleId) || payload.vehicleId < 1) {
      alert('Choisissez un véhicule.');
      return;
    }
    if (!Number.isFinite(payload.prix)) {
      alert('Indiquez un prix valide.');
      return;
    }

    try {
      if (editingId) {
        await agentService.updateTrip(editingId, payload);
      } else {
        await agentService.createTrip(payload);
      }
      setForm(EMPTY_TRIP);
      setEditingId(null);
      await loadTrips();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Enregistrement impossible.');
    }
  };

  const onEdit = async (t) => {
    setEditingId(t.id);
    try {
      const full = await agentService.getTripById(t.id);
      const raw = full?._raw ?? full ?? t;
      const heure = String(raw.heureDepart ?? raw.heure ?? t.heure ?? '').slice(0, 8);
      const heureShort = heure.length >= 5 ? heure.slice(0, 5) : heure;
      setForm({
        villeDepart: raw.villeDepart ?? raw.depart ?? t.depart ?? '',
        villeArrivee: raw.villeArrivee ?? raw.arrivee ?? t.arrivee ?? '',
        dateDepart: String(raw.dateDepart ?? raw.date ?? t.date ?? '').slice(0, 10),
        heureDepart: heureShort,
        prix: String(raw.prix ?? t.prix ?? ''),
        vehicleId: String(raw.vehicleId ?? raw.vehicle?.id ?? t.vehicleId ?? ''),
      });
    } catch {
      setForm({
        villeDepart: t.depart ?? '',
        villeArrivee: t.arrivee ?? '',
        dateDepart: String(t.date ?? '').slice(0, 10),
        heureDepart: String(t.heure ?? '').slice(0, 5),
        prix: String(t.prix ?? ''),
        vehicleId: String(t.vehicleId ?? ''),
      });
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Supprimer ce trajet ?')) return;
    try {
      await agentService.deleteTrip(id);
      setEditingId(null);
      setForm(EMPTY_TRIP);
      await loadTrips();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Suppression impossible.');
    }
  };

  return (
    <LayoutAgent title="Trajets">
      <section className="space-y-4">
        <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">GESTION DES TRAJETS</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input
              required
              value={form.villeDepart}
              onChange={(e) => setForm((p) => ({ ...p, villeDepart: e.target.value }))}
              placeholder="Ville départ"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              required
              value={form.villeArrivee}
              onChange={(e) => setForm((p) => ({ ...p, villeArrivee: e.target.value }))}
              placeholder="Ville arrivée"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              required
              type="date"
              value={form.dateDepart}
              onChange={(e) => setForm((p) => ({ ...p, dateDepart: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              required
              type="time"
              value={form.heureDepart}
              onChange={(e) => setForm((p) => ({ ...p, heureDepart: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              required
              type="number"
              inputMode="decimal"
              step="0.01"
              min={0}
              value={form.prix}
              onChange={(e) => setForm((p) => ({ ...p, prix: e.target.value }))}
              placeholder="Prix"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <select
              required
              value={form.vehicleId}
              onChange={(e) => setForm((p) => ({ ...p, vehicleId: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">— Véhicule —</option>
              {vehicles.map((v) => (
                <option key={v.id} value={String(v.id)}>
                  {vehicleOptionLabel(v)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white">
              {editingId ? 'Mettre à jour' : 'Créer'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY_TRIP);
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Mes trajets</h3>
          </div>
          {loading ? (
            <p className="px-4 py-4 text-sm text-slate-500">Chargement...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Trajet</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Prix</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trips.map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">#{t.id}</td>
                      <td className="px-4 py-3">
                        {t.depart} → {t.arrivee}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {t.date} {t.heure}
                      </td>
                      <td className="px-4 py-3">{t.prix != null ? Number(t.prix).toLocaleString('fr-FR') : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit(t)}
                            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(t.id)}
                            className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && trips.length === 0 && (
                <p className="px-4 py-4 text-sm text-slate-500">Aucun trajet.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </LayoutAgent>
  );
};

export default GestionTrajetsAgent;
