import React, { useEffect, useState } from 'react';
import LayoutAdmin from '../../components/LayoutAdmin';
import { adminService } from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Chargement impossible.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const promote = async (userId) => {
    if (!window.confirm('Promouvoir cet utilisateur au rôle agent ?')) return;
    try {
      await adminService.promoteUserToAgent(userId);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || 'Action impossible.');
    }
  };

  return (
    <LayoutAdmin title="Utilisateurs">
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3 md:px-5">
          <h2 className="text-base font-semibold text-slate-900">Liste des utilisateurs</h2>
        </div>

        {error && <p className="px-5 py-3 text-sm text-rose-600">{error}</p>}
        {loading ? (
          <p className="px-5 py-6 text-sm text-slate-500">Chargement...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nom / email</th>
                  <th className="px-4 py-3">Rôle</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u, idx) => {
                  const id = u.id ?? u.userId ?? idx;
                  const role = u.role ?? u.authority ?? '—';
                  const label =
                    u.email || u.username || [u.prenom, u.nom].filter(Boolean).join(' ') || `Utilisateur #${id}`;
                  return (
                    <tr key={id}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">#{id}</td>
                      <td className="px-4 py-3 text-slate-800">{label}</td>
                      <td className="px-4 py-3 text-slate-600">{String(role)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => promote(id)}
                            className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-800 hover:bg-indigo-100"
                          >
                            Rôle agent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {users.length === 0 && <p className="px-5 py-6 text-sm text-slate-500">Aucun utilisateur.</p>}
          </div>
        )}
      </section>
    </LayoutAdmin>
  );
};

export default AdminUsers;
