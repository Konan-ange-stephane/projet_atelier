import React, { useEffect, useState } from 'react';
import LayoutAdmin from '../../components/LayoutAdmin';
import { adminService, companyService } from '../../services/api';
import { UserCog, Building2, X, Check } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // États pour le modal de promotion
  const [promotionModal, setPromotionModal] = useState({
    isOpen: false,
    user: null,
    selectedCompanyId: '',
    processing: false
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
      const comps = await companyService.getCompanies();
      setCompanies(Array.isArray(comps) ? comps : []);
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

  const openPromotionModal = (user) => {
    setPromotionModal({
      isOpen: true,
      user,
      selectedCompanyId: '',
      processing: false
    });
  };

  const closePromotionModal = () => {
    setPromotionModal(prev => ({ ...prev, isOpen: false }));
  };

  const handlePromote = async () => {
    const { user, selectedCompanyId } = promotionModal;
    if (!selectedCompanyId) return;

    setPromotionModal(prev => ({ ...prev, processing: true }));
    try {
      await adminService.promoteUserToAgent(user.id, { compagnieId: selectedCompanyId });
      closePromotionModal();
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || 'Action impossible.');
      setPromotionModal(prev => ({ ...prev, processing: false }));
    }
  };

  return (
    <LayoutAdmin title="Gestion des Utilisateurs">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Annuaire des utilisateurs</h2>
            <p className="text-sm text-slate-500">Gérez les rôles et les accès des membres de la plateforme</p>
          </div>
          <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
            <UserCog size={20} />
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
            <p className="mt-4 text-sm text-slate-500">Chargement de la liste...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Utilisateur</th>
                  <th className="px-6 py-4 font-medium">Rôle Actuel</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u, idx) => {
                  const id = u.id ?? u.userId ?? idx;
                  const rawRoles = String(u.roles || u.role || u.authority || '').split(',');
                  const label = u.email || u.username || [u.prenom, u.nom].filter(Boolean).join(' ') || `Utilisateur #${id}`;
                  
                  // Formattage des rôles pour l'affichage
                  const formattedRoles = rawRoles.map(r => {
                    const clean = r.replace('ROLE_', '').trim();
                    if (clean === 'ADMIN') return { label: 'Administrateur', color: 'bg-rose-100 text-rose-700' };
                    if (clean === 'AGENT') return { label: 'Agent', color: 'bg-amber-100 text-amber-700' };
                    return { label: 'Client', color: 'bg-slate-100 text-slate-700' };
                  });

                  const isAgent = rawRoles.some(r => r.includes('AGENT'));
                  
                  return (
                    <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">#{id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">{label}</span>
                          <span className="text-xs text-slate-500">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <div className="flex flex-wrap gap-1">
                            {formattedRoles.map((roleObj, i) => (
                              <span key={i} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleObj.color}`}>
                                {roleObj.label}
                              </span>
                            ))}
                          </div>
                          {isAgent && u.compagnieNom && (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                              <Building2 size={12} className="text-slate-400" />
                              {u.compagnieNom}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            disabled={isAgent}
                            onClick={() => openPromotionModal({ ...u, id })}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                              isAgent 
                                ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                            }`}
                          >
                            <Building2 size={14} />
                            Rôle Agent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="flex h-32 flex-col items-center justify-center text-slate-500">
                <p>Aucun utilisateur trouvé.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Modal de promotion */}
      {promotionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Affectation d'Agent</h3>
              <button onClick={closePromotionModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-slate-600">
                Vous allez promouvoir <span className="font-bold text-slate-900">{promotionModal.user?.email}</span> au rôle d'agent.
              </p>
              <p className="mt-1 text-sm text-slate-600">Veuillez sélectionner sa compagnie de rattachement :</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <select
                  value={promotionModal.selectedCompanyId}
                  onChange={(e) => setPromotionModal(prev => ({ ...prev, selectedCompanyId: e.target.value }))}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                >
                  <option value="">Sélectionner une compagnie...</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.nomCompagnie}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Building2 size={16} />
                </div>
              </div>

              {promotionModal.selectedCompanyId && (
                <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100">
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    <Check size={14} className="inline mr-1 mb-0.5" />
                    Cet utilisateur pourra gérer les trajets, les véhicules et consulter les passagers pour le compte de 
                    <span className="font-bold ml-1">{companies.find(c => String(c.id) === String(promotionModal.selectedCompanyId))?.nomCompagnie}</span>.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={closePromotionModal}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handlePromote}
                disabled={!promotionModal.selectedCompanyId || promotionModal.processing}
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                {promotionModal.processing ? 'Traitement...' : 'Confirmer le rôle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutAdmin>
  );
};

export default AdminUsers;

