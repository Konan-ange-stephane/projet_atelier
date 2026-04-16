import React, { useEffect, useMemo, useState } from 'react';
import LayoutAdmin from '../../components/LayoutAdmin';
import { companyService, statisticsService } from '../../services/api';

const EMPTY_FORM = {
  nomCompagnie: '',
  adresse: '',
  telephone: '',
};

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, companiesData] = await Promise.all([
        statisticsService.getStatistics(),
        companyService.getCompanies(),
      ]);
      setStats(statsData);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Chargement impossible.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const cards = useMemo(
    () => [
      { label: 'Compagnies', value: stats?.companiesCount ?? stats?.compagnies ?? companies.length },
      { label: 'Trajets', value: stats?.tripsCount ?? stats?.trajets ?? '-' },
      { label: 'Reservations', value: stats?.reservationsCount ?? stats?.reservations ?? '-' },
      { label: 'Revenus', value: stats?.revenues ?? stats?.revenu ?? '-' },
    ],
    [stats, companies.length]
  );

  const onSubmitCompany = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await companyService.createCompany({
        nomCompagnie: form.nomCompagnie.trim(),
        adresse: form.adresse.trim(),
        telephone: form.telephone.trim(),
      });
      setForm(EMPTY_FORM);
      await loadData();
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || 'Creation compagnie impossible.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <LayoutAdmin title="Dashboard administrateur">
      {error && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmitCompany} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Creer une compagnie</h2>

          <div className="mt-4 space-y-3">
            <input
              required
              value={form.nomCompagnie}
              onChange={(e) => setForm((prev) => ({ ...prev, nomCompagnie: e.target.value }))}
              placeholder="Nom compagnie (ex. SmartTrip Transport)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              required
              value={form.adresse}
              onChange={(e) => setForm((prev) => ({ ...prev, adresse: e.target.value }))}
              placeholder="Adresse (ex. 1 rue du Voyage)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              required
              value={form.telephone}
              onChange={(e) => setForm((prev) => ({ ...prev, telephone: e.target.value }))}
              placeholder="Téléphone (ex. 0102030405)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {saving ? 'Creation...' : 'Creer la compagnie'}
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-3">
            <h2 className="text-base font-semibold text-slate-900">Compagnies</h2>
          </div>
          {loading ? (
            <p className="px-4 py-4 text-sm text-slate-500">Chargement...</p>
          ) : companies.length === 0 ? (
            <p className="px-4 py-4 text-sm text-slate-500">Aucune compagnie.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {companies.map((c, idx) => (
                <li key={c.id ?? idx} className="px-4 py-3">
                  <p className="font-medium text-slate-900">{c.nomCompagnie || '-'}</p>
                  <p className="text-sm text-slate-500">{c.adresse || '—'}</p>
                  <p className="text-sm text-slate-500">{c.telephone || '—'}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </LayoutAdmin>
  );
};

export default DashboardAdmin;
