import React, { useEffect, useState } from 'react';
import LayoutAdmin from '../../components/LayoutAdmin';
import { statisticsService } from '../../services/api';

const AdminStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await statisticsService.getStatistics();
        setStatistics(data);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Chargement des statistiques impossible.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <LayoutAdmin title="Statistiques">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Apercu plateforme</h2>

        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Chargement...</p>
        ) : error ? (
          <p className="mt-4 text-sm text-rose-600">{error}</p>
        ) : (
          <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
            {JSON.stringify(statistics, null, 2)}
          </pre>
        )}
      </section>
    </LayoutAdmin>
  );
};

export default AdminStatistics;
