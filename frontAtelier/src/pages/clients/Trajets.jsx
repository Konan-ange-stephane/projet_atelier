import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { trajetService, companyService } from '../../services/api';
import LayoutClient from '../../components/LayoutClient';
import TrajetCard from '../../components/TrajetCard';
import Chargeur from '../../components/Chargeur';

const STORAGE_COMPAGNIE = 'smarttrip_client_compagnie_id';

function tripCompagnieId(t) {
  if (!t || typeof t !== 'object') return null;
  const v = t.compagnieId ?? t.compagnieObj?.id ?? t._raw?.compagnieId ?? t._raw?.compagnie?.id;
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function filtreTrajetsParCompagnie(trajets, compagnieId) {
  const cid = Number(compagnieId);
  if (!Number.isFinite(cid)) return trajets;
  return trajets.filter((t) => {
    const tid = tripCompagnieId(t);
    if (tid == null) return false;
    return tid === cid;
  });
}

const Trajets = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [compagnies, setCompagnies] = useState([]);
  const [compagnieId, setCompagnieId] = useState('');
  const [trajets, setTrajets] = useState([]);
  const [chargementCompagnies, setChargementCompagnies] = useState(true);
  const [chargementTrajets, setChargementTrajets] = useState(false);
  const [erreurCompagnies, setErreurCompagnies] = useState('');
  const [erreurTrajets, setErreurTrajets] = useState('');
  const [filtreDepart, setFiltreDepart] = useState(searchParams.get('from') || '');
  const [filtreArrivee, setFiltreArrivee] = useState(searchParams.get('to') || '');
  const [filtreDate, setFiltreDate] = useState(searchParams.get('date') || '');

  useEffect(() => {
    let cancel = false;
    (async () => {
      setChargementCompagnies(true);
      setErreurCompagnies('');
      try {
        const list = await companyService.getCompanies();
        if (cancel) return;
        setCompagnies(Array.isArray(list) ? list : []);
        try {
          const saved = sessionStorage.getItem(STORAGE_COMPAGNIE);
          if (saved && list.some((c) => String(c.id) === saved)) {
            setCompagnieId(saved);
          }
        } catch {
          /* ignore */
        }
      } catch (e) {
        if (!cancel) {
          const msg = e?.response?.data?.message || e?.message || 'Impossible de charger les compagnies.';
          try {
            const trips = await trajetService.getTrajets({});
            const map = new Map();
            (Array.isArray(trips) ? trips : []).forEach((t) => {
              const id = tripCompagnieId(t);
              if (id == null) return;
              if (!map.has(id)) {
                map.set(id, {
                  id,
                  nomCompagnie: t.compagnie && t.compagnie !== '—' ? String(t.compagnie) : `Compagnie #${id}`,
                  adresse: '',
                  telephone: '',
                });
              }
            });
            const derived = [...map.values()];
            if (derived.length > 0) {
              setCompagnies(derived);
              setErreurCompagnies('');
            } else {
              setErreurCompagnies(msg);
              setCompagnies([]);
            }
          } catch {
            setErreurCompagnies(msg);
            setCompagnies([]);
          }
        }
      } finally {
        if (!cancel) setChargementCompagnies(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const chargerTrajets = useCallback(async (cid) => {
    if (!cid) {
      setTrajets([]);
      return;
    }
    setChargementTrajets(true);
    setErreurTrajets('');
    try {
      const data = await trajetService.getTrajets({
        compagnieId: Number(cid),
      });
      const liste = Array.isArray(data) ? data : [];
      setTrajets(filtreTrajetsParCompagnie(liste, cid));
    } catch (e) {
      setTrajets([]);
      setErreurTrajets(e?.response?.data?.message || e?.message || 'Impossible de charger les trajets.');
    } finally {
      setChargementTrajets(false);
    }
  }, []);

  useEffect(() => {
    if (!compagnieId) {
      setTrajets([]);
      return;
    }
    try {
      sessionStorage.setItem(STORAGE_COMPAGNIE, String(compagnieId));
    } catch {
      /* ignore */
    }
    chargerTrajets(compagnieId);
  }, [compagnieId, chargerTrajets]);

  const handleReserver = (trajetId) => {
    navigate(`/client/trajet/${trajetId}`);
  };

  const trajetsFiltres = trajets.filter((trajet) => {
    const matchDepart =
      filtreDepart === '' || String(trajet.depart || '').toLowerCase().includes(filtreDepart.toLowerCase());
    const matchArrivee =
      filtreArrivee === '' || String(trajet.arrivee || '').toLowerCase().includes(filtreArrivee.toLowerCase());
    const matchDate =
      filtreDate === '' || String(trajet.date || '').startsWith(filtreDate);
    return matchDepart && matchArrivee && matchDate;
  });

  if (chargementCompagnies) {
    return <Chargeur fullScreen />;
  }

  const compagnieChoisie = compagnies.find((c) => String(c.id) === String(compagnieId));

  return (
    <LayoutClient
      title="Trajets disponibles"
      subtitle="Choisissez d’abord une compagnie, puis parcourez les lignes proposées."
    >
      <div className="mb-8 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-black text-slate-900">Compagnie</h3>
        <p className="mb-4 text-sm text-slate-600">
          Les trajets affichés correspondent uniquement à la compagnie sélectionnée.
        </p>
        {erreurCompagnies && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {erreurCompagnies}
            <span className="mt-2 block text-xs opacity-90">
              Vérifiez que le compte a accès à <span className="font-mono">GET /api/admin/companies</span> (rôle admin
              ou règle Spring adaptée).
            </span>
          </div>
        )}
        <label className="mb-2 block text-sm font-bold text-slate-700">Dans quelle compagnie souhaitez-vous réserver ?</label>
        <select
          value={compagnieId}
          onChange={(e) => setCompagnieId(e.target.value)}
          className="w-full max-w-xl rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">— Choisir une compagnie —</option>
          {compagnies.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.nomCompagnie || `Compagnie #${c.id}`}
            </option>
          ))}
        </select>
        {compagnieChoisie?.adresse ? (
          <p className="mt-2 text-xs text-slate-500">{compagnieChoisie.adresse}</p>
        ) : null}
      </div>

      {!compagnieId ? (
        <div className="rounded-[2rem] border border-slate-100 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-700">Sélectionnez une compagnie</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Une fois la compagnie choisie, la liste des trajets disponibles pour cette compagnie s’affichera ici.
          </p>
        </div>
      ) : (
        <>
          {erreurTrajets && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {erreurTrajets}
            </div>
          )}

          <div className="mb-8 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-black text-slate-900">Rechercher un trajet</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Ville de départ</label>
                <input
                  type="text"
                  value={filtreDepart}
                  onChange={(e) => setFiltreDepart(e.target.value)}
                  placeholder="Ex. Abidjan"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Ville d&apos;arrivée</label>
                <input
                  type="text"
                  value={filtreArrivee}
                  onChange={(e) => setFiltreArrivee(e.target.value)}
                  placeholder="Ex. Yamoussoukro"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Date de départ</label>
                <input
                  type="date"
                  value={filtreDate}
                  onChange={(e) => setFiltreDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {chargementTrajets ? (
            <div className="flex justify-center py-16">
              <Chargeur />
            </div>
          ) : trajetsFiltres.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-100 bg-white p-12 text-center shadow-sm">
              <div className="mb-4 text-5xl">🔍</div>
              <p className="text-lg font-medium text-slate-600">Aucun trajet pour cette compagnie</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Essayez une autre compagnie ou d’autres critères de recherche. Si le backend filtre déjà par
                compagnie, seuls les trajets associés sont renvoyés.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trajetsFiltres.map((trajet) => (
                <TrajetCard key={trajet.id} trajet={trajet} onReserver={handleReserver} />
              ))}
            </div>
          )}
        </>
      )}
    </LayoutClient>
  );
};

export default Trajets;
