import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LayoutAgent from '../../components/LayoutAgent';
import { agentReservationRowId, agentService } from '../../services/api';
import { extractErrorMessage } from '../../services/serviceAuth';

const badgeClass = (status) => {
  const s = String(status || '').toUpperCase();
  if (s.includes('PAYE') || s.includes('VALID')) return 'bg-emerald-50 text-emerald-700';
  if (s.includes('REJET') || s.includes('ANNULE')) return 'bg-rose-50 text-rose-700';
  return 'bg-amber-50 text-amber-700';
};

const ReservationsAgent = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await agentService.getReservations();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onValidate = async (id) => {
    try {
      await agentService.validateReservation(id);
      await loadData();
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || 'Validation impossible.');
    }
  };

  const onReject = async (id) => {
    try {
      await agentService.rejectReservation(id);
      await loadData();
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || 'Rejet impossible.');
    }
  };

  return (
    <LayoutAgent title="Reservations">
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3 md:px-5">
          <h2 className="text-base font-semibold text-slate-900">Toutes les reservations</h2>
        </div>

        {loading ? (
          <p className="px-5 py-6 text-sm text-slate-500">Chargement...</p>
        ) : error ? (
          <div className="px-5 py-6 text-sm text-rose-700 leading-relaxed whitespace-pre-line">{error}</div>
        ) : rows.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-500">Aucune reservation trouvee.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Trip</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r, idx) => {
                  const rid = agentReservationRowId(r) ?? r.id;
                  const hasId = rid != null && String(rid).trim() !== '';
                  return (
                  <tr key={hasId ? String(rid) : `row-${idx}`}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">#{hasId ? rid : '—'}</td>
                    <td className="px-4 py-3 text-slate-700">{r.tripId ?? r.trip?.id ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {r.client?.nom || r.client?.name || r.user?.email || '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {r.montant != null ? Number(r.montant).toLocaleString('fr-FR') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${badgeClass(r.statut || r.status)}`}>
                        {r.statut || r.status || 'EN_ATTENTE'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {hasId ? (
                          <Link
                            to={`/agent/reservations/${rid}`}
                            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Detail
                          </Link>
                        ) : (
                          <span className="text-xs text-amber-600">ID manquant</span>
                        )}
                        <button
                          type="button"
                          disabled={!hasId}
                          onClick={() => onValidate(rid)}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-40"
                        >
                          Valider
                        </button>
                        <button
                          type="button"
                          disabled={!hasId}
                          onClick={() => onReject(rid)}
                          className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-40"
                        >
                          Rejeter
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </LayoutAgent>
  );
};

export default ReservationsAgent;
