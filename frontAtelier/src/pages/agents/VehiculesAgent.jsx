import React, { useEffect, useState } from 'react';
import LayoutAgent from '../../components/LayoutAgent';
import { agentService, companyService } from '../../services/api';

const EMPTY_FORM = {
  compagnieId: '',
  matricule: '',
  marque: '',
  capacite: '',
};

function vehicleMatricule(v) {
  return v?.matricule ?? v?.immatriculation ?? '';
}

function vehicleMarque(v) {
  return v?.marque ?? v?.modele ?? '';
}

function vehicleCompagnieId(v) {
  if (v?.compagnieId != null) return v.compagnieId;
  if (v?.companyId != null) return v.companyId;
  const nested = v?.compagnie ?? v?.company;
  if (nested && typeof nested === 'object' && nested.id != null) {
    return nested.id;
  }
  return '';
}

/** Libellé compagnie : objet embarqué, puis liste chargée depuis la DB. */
function vehicleCompagnieLabel(v, companies) {
  const nested = v?.compagnie ?? v?.company;
  if (nested && typeof nested === 'object') {
    const label =
      nested.nomCompagnie ||
      nested.nom ||
      nested.name ||
      nested.nom_compagnie ||
      nested.NOM_COMPAGNIE;
    if (label) return String(label);
  }
  const flat =
    v?.nomCompagnie ?? v?.compagnieNom ?? v?.compagnieName ?? v?.NOM_COMPAGNIE ?? '';
  if (flat) return String(flat);
  const id = vehicleCompagnieId(v);
  if (id === '' || id == null) return '—';
  const n = Number(id);
  const c = companies.find((x) => Number(x.id) === n);
  return c?.nomCompagnie || `Compagnie #${id}`;
}

const VehiculesAgent = () => {
  const [vehicles, setVehicles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadVehicles = async () => {
    try {
      const data = await agentService.getVehicles();
      setVehicles(Array.isArray(data) ? data : []);
    } catch {
      setVehicles([]);
    }
  };

  const loadCompanies = async () => {
    try {
      const data = await agentService.getCompanies();
      setCompanies(Array.isArray(data) ? data : []);
      return;
    } catch {
      /* route agent/companies souvent absente : repli admin */
    }
    try {
      const data = await companyService.getCompanies();
      setCompanies(Array.isArray(data) ? data : []);
    } catch {
      setCompanies([]);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await Promise.all([loadVehicles(), loadCompanies()]);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const companyLabel = (c) => c?.nomCompagnie || `#${c?.id ?? '?'}`;

  const onSubmit = async (e) => {
    e.preventDefault();
    const compagnieId = Number(form.compagnieId);
    const capacite = Number(form.capacite);
    const payload = {
      compagnieId,
      matricule: form.matricule.trim(),
      marque: form.marque.trim(),
      capacite,
    };
    if (!Number.isFinite(compagnieId) || compagnieId < 1) {
      alert('Choisissez une compagnie.');
      return;
    }
    if (!payload.matricule || !payload.marque || !Number.isFinite(capacite) || capacite < 1) {
      alert('Renseignez matricule, marque et une capacité valide.');
      return;
    }

    try {
      if (editingId) {
        await agentService.updateVehicle(editingId, payload);
      } else {
        await agentService.createVehicle(payload);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadVehicles();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Enregistrement impossible.');
    }
  };

  const onEdit = async (v) => {
    setEditingId(v.id);
    try {
      const full = await agentService.getVehicleById(v.id);
      const src = full && typeof full === 'object' ? full : v;
      setForm({
        compagnieId: String(vehicleCompagnieId(src) ?? ''),
        matricule: vehicleMatricule(src),
        marque: vehicleMarque(src),
        capacite: String(src.capacite ?? ''),
      });
    } catch {
      setForm({
        compagnieId: String(vehicleCompagnieId(v) ?? ''),
        matricule: vehicleMatricule(v),
        marque: vehicleMarque(v),
        capacite: String(v.capacite ?? ''),
      });
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Supprimer ce véhicule ?')) return;
    try {
      await agentService.deleteVehicle(id);
      await loadVehicles();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Suppression impossible.');
    }
  };

  return (
    <LayoutAgent title="Véhicules">
      <section className="space-y-4">
        <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">CRUD véhicules</h2>

          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <select
              value={form.compagnieId}
              onChange={(e) => setForm((prev) => ({ ...prev, compagnieId: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">— Compagnie —</option>
              {companies.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {companyLabel(c)}
                </option>
              ))}
            </select>
            <input
              value={form.matricule}
              onChange={(e) => setForm((prev) => ({ ...prev, matricule: e.target.value }))}
              placeholder="Matricule"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={form.marque}
              onChange={(e) => setForm((prev) => ({ ...prev, marque: e.target.value }))}
              placeholder="Marque"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              min={1}
              value={form.capacite}
              onChange={(e) => setForm((prev) => ({ ...prev, capacite: e.target.value }))}
              placeholder="Capacité"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white">
              {editingId ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY_FORM);
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
            <h3 className="text-sm font-semibold text-slate-900">Liste</h3>
          </div>
          {loading ? (
            <p className="px-4 py-4 text-sm text-slate-500">Chargement...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Compagnie</th>
                    <th className="px-4 py-3">Matricule</th>
                    <th className="px-4 py-3">Marque</th>
                    <th className="px-4 py-3">Capacité</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vehicles.map((v) => (
                    <tr key={v.id}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">#{v.id}</td>
                      <td className="px-4 py-3">{vehicleCompagnieLabel(v, companies)}</td>
                      <td className="px-4 py-3">{vehicleMatricule(v) || '—'}</td>
                      <td className="px-4 py-3">{vehicleMarque(v) || '—'}</td>
                      <td className="px-4 py-3">{v.capacite ?? '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit(v)}
                            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(v.id)}
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
              {!loading && vehicles.length === 0 && (
                <p className="px-4 py-4 text-sm text-slate-500">Aucun véhicule.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </LayoutAgent>
  );
};

export default VehiculesAgent;
