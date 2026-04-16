import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LayoutAgent from '../../components/LayoutAgent';
import { agentService } from '../../services/api';
import { extractErrorMessage } from '../../services/serviceAuth';

const ReservationAgentDetail = () => {
  const { id: idParam } = useParams();
  const id =
    idParam && String(idParam).trim() !== '' && idParam !== 'undefined' && idParam !== 'null'
      ? String(idParam).trim()
      : null;
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    if (!id) {
      setLoading(false);
      setError('Identifiant de réservation manquant ou invalide dans l’URL.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await agentService.getReservationById(id);
      setData(result);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const loadHistory = async () => {
    if (!id) return;
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const rows = await agentService.getReservationHistory(id);
      setHistory(Array.isArray(rows) ? rows : []);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const run = async (label, fn) => {
    if (!id) return;
    try {
      await fn();
      await loadData();
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || `${label} impossible.`);
    }
  };

  return (
    <LayoutAgent title={`Réservation #${id}`}>
      <section className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/agent/reservations')}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Retour liste
        </button>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Détail réservation</h2>

          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Chargement...</p>
          ) : error ? (
            <p className="mt-4 text-sm text-rose-600">{error}</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info label="ID" value={data?.id} />
              <Info label="Trip ID" value={data?.tripId ?? data?.trip?.id} />
              <Info label="Client" value={data?.client?.nom || data?.client?.name || data?.user?.email} />
              <Info label="Place" value={data?.placeId ?? data?.place?.id} />
              <Info label="Statut" value={data?.statut || data?.status} />
              <Info label="Montant" value={data?.montant ?? data?.trip?.prix} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!id}
            onClick={() => run('Validation', () => agentService.validateReservation(id))}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Valider (PAYE)
          </button>
          <button
            type="button"
            onClick={() => run('Rejet', () => agentService.rejectReservation(id))}
            className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
          >
            Rejeter
          </button>
          <button
            type="button"
            onClick={() => run('Annulation', () => agentService.cancelReservation(id))}
            className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => run('Confirmation forcée', () => agentService.forceConfirmReservation(id))}
            className="rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-100"
          >
            Forcer confirmation
          </button>
          <button
            type="button"
            onClick={loadHistory}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Historique
          </button>
        </div>

        {historyOpen && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Historique</h3>
            {historyLoading ? (
              <p className="mt-3 text-sm text-slate-500">Chargement...</p>
            ) : history.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Aucune entrée.</p>
            ) : (
              <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
                {JSON.stringify(history, null, 2)}
              </pre>
            )}
          </div>
        )}
      </section>
    </LayoutAgent>
  );
};

const Info = ({ label, value }) => (
  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-slate-900">{value ?? '-'}</p>
  </div>
);

export default ReservationAgentDetail;
