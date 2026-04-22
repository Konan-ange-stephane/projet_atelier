/**
 * Appels API métier via axios (`serviceAuth` : base /api, Bearer, 401).
 *
 * Public (client) :
 * - GET/POST /api/trips*, /api/reservations* (+ GET .../history si exposé)
 * - Liste compagnies réservation : réutilise GET /api/admin/companies (companyService) si le JWT l’autorise
 *
 * Agent (/api/agent) :
 * - trips CRUD (corps typique : villeDepart, villeArrivee, dateDepart, heureDepart, prix, vehicleId)
 * - places, passengers, trip reservations
 * - reservations list/detail, validate, reject, cancel, force-confirm, patch, history
 * - vehicles CRUD + detail
 *
 * Admin (/api/admin) :
 * - GET /users, PUT /users/{id}/role-agent
 * - GET/POST /companies (corps : nomCompagnie, adresse, telephone), GET /stats
 */
import api from './serviceAuth';

function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (data?.content && Array.isArray(data.content)) return data.content;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

/** Évite les appels `/.../undefined` → Spring : « The given id must not be null ». */
function requirePathId(value, label = 'id') {
  if (value === null || value === undefined) {
    throw new Error(`${label} manquant.`);
  }
  const s = String(value).trim();
  if (!s || s === 'undefined' || s === 'null') {
    throw new Error(`${label} invalide.`);
  }
  return s;
}

/**
 * Identifiant réservation dans les listes agent (le backend peut envoyer `reservationId` au lieu de `id`).
 */
export function agentReservationRowId(row) {
  if (!row || typeof row !== 'object') return null;
  const v = row.id ?? row.reservationId ?? row.bookingId ?? row.reservation_id;
  if (v === null || v === undefined || v === '') return null;
  const s = String(v).trim();
  if (!s || s === 'undefined' || s === 'null') return null;
  return v;
}

/** Adapte les réponses (champs variables) vers le format UI. */
export function normalizeTripForUi(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const t = raw;
  const compagnieObjRaw =
    typeof t.compagnie === 'object' && t.compagnie != null
      ? t.compagnie
      : {
          id: t.compagnieId ?? 0,
          nom:
            t.compagnieNom ??
            t.nomCompagnie ??
            (typeof t.compagnie === 'string' ? t.compagnie : '') ??
            '',
          logo: t.compagnieLogo ?? '🚌',
        };
  const compagnieObj =
    typeof compagnieObjRaw === 'object' && compagnieObjRaw != null
      ? {
          ...compagnieObjRaw,
          nom:
            compagnieObjRaw.nom ??
            compagnieObjRaw.nomCompagnie ??
            compagnieObjRaw.nom_compagnie ??
            compagnieObjRaw.NOM_COMPAGNIE ??
            compagnieObjRaw.name ??
            '',
        }
      : compagnieObjRaw;

  return {
    id: t.id ?? t.tripId,
    depart: t.depart ?? t.villeDepart ?? t.departureCity ?? t.origine ?? '',
    arrivee: t.arrivee ?? t.villeArrivee ?? t.arrivalCity ?? t.destination ?? '',
    date: String(t.date ?? t.dateDepart ?? t.departureDate ?? '').slice(0, 10),
    heure: t.heure ?? t.heureDepart ?? t.departureTime ?? '',
    heureDepart: t.heureDepart ?? t.heure ?? t.departureTime ?? '',
    heureArrivee: t.heureArrivee ?? t.heureArriveePrevue ?? '',
    prix: (() => {
      const v = t.prix ?? t.price ?? t.montant ?? t.amount ?? t.total;
      if (v == null || v === '') return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    })(),
    duree: t.duree ?? t.duration ?? '',
    placesTotal: t.placesTotal ?? t.capacite ?? t.totalSeats,
    placesLibres: t.placesLibres ?? t.siegesDisponibles ?? t.availableSeats,
    compagnie:
      typeof compagnieObj === 'object'
        ? String(compagnieObj.nom ?? compagnieObj.nomCompagnie ?? '').trim() || '—'
        : String(compagnieObj ?? '—'),
    compagnieObj:
      typeof compagnieObj === 'object'
        ? compagnieObj
        : { nom: String(compagnieObj ?? '—') },
    compagnieId:
      typeof compagnieObj === 'object' && compagnieObj != null && compagnieObj.id != null
        ? compagnieObj.id
        : t.compagnieId ?? t.companyId ?? undefined,
    _raw: t,
  };
}

export function normalizePlaceForUi(p) {
  if (p == null) return null;
  if (typeof p === 'number' || typeof p === 'string') {
    return { id: p, numero: Number(p), disponible: true };
  }
  const id = p.id ?? p.placeId;
  const numero = p.numero ?? p.numeroPlace ?? p.seatNumber ?? p.number ?? id;
  const statut = (p.statut ?? p.status ?? '').toString().toUpperCase();
  const disponible =
    p.disponible === true ||
    statut === '' ||
    statut === 'LIBRE' ||
    statut === 'DISPONIBLE' ||
    statut === 'AVAILABLE';
  return { id, numero: Number(numero), disponible, statut, _raw: p };
}

/**
 * Compagnie côté API (id, adresse, nomCompagnie, telephone) — tolère variantes de noms.
 */
export function normalizeCompanyForUi(c) {
  if (!c || typeof c !== 'object') return null;
  const nomCompagnie =
    c.nomCompagnie ??
    c.nom_compagnie ??
    c.NOM_COMPAGNIE ??
    c.nom ??
    c.name ??
    '';
  return {
    id: c.id,
    nomCompagnie: String(nomCompagnie),
    adresse: c.adresse ?? c.ADRESSE ?? '',
    telephone: c.telephone ?? c.TELEPHONE ?? '',
    _raw: c,
  };
}

/** Véhicule agent : compagnie nested (compagnie/company), ids compagnieId/companyId, champs plats. */
export function normalizeVehicleForUi(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const v = raw;
  const nested = v.compagnie ?? v.company;
  const compagnieId =
    v.compagnieId ??
    v.companyId ??
    (nested && typeof nested === 'object' && nested.id != null ? nested.id : undefined);

  const nestedNorm =
    nested && typeof nested === 'object' && Object.keys(nested).length
      ? normalizeCompanyForUi(nested)
      : null;

  const flatName =
    v.nomCompagnie ?? v.compagnieNom ?? v.compagnieName ?? v.NOM_COMPAGNIE ?? '';

  let compagnieOut = nested ?? v.compagnie ?? v.company;
  if (nestedNorm?.nomCompagnie) {
    compagnieOut = {
      id: nestedNorm.id ?? compagnieId,
      nomCompagnie: nestedNorm.nomCompagnie,
      nom: nestedNorm.nomCompagnie,
    };
  } else if (flatName) {
    compagnieOut = {
      id: compagnieId,
      nomCompagnie: String(flatName),
      nom: String(flatName),
    };
  }

  return {
    ...v,
    compagnieId: compagnieId ?? v.compagnieId ?? v.companyId,
    compagnie: compagnieOut,
    matricule: v.matricule ?? v.immatriculation,
    marque: v.marque ?? v.modele,
    _raw: v,
  };
}

export function statutReservationVersUi(apiStatut, paiements = []) {
  const s = (apiStatut ?? '').toString().toUpperCase();
  if (s.includes('ANNULE')) return 'Annulée';
  const paye = paiements.some((p) =>
    (p.statut ?? p.status ?? '').toString().toUpperCase().includes('PAYE')
  );
  if (paye || s.includes('PAYE') || s.includes('CONFIRME')) return 'Confirmée';
  if (s.includes('ATTENTE') || s.includes('EN_ATTENTE')) return 'En attente';
  if (s.includes('TERMINE')) return 'Terminée';
  return apiStatut || 'En attente';
}

/** Libellé statut paiement pour l’UI client. */
export function statutPaiementVersUi(apiStatut) {
  const s = (apiStatut ?? '').toString().toUpperCase();
  if (s.includes('PAYE') || s.includes('PAID') || s.includes('SUCCESS') || s.includes('COMPLETED'))
    return 'Payé';
  if (s.includes('ATTENTE') || s.includes('PENDING') || s.includes('PROCESS')) return 'En attente';
  if (s.includes('ECHOUE') || s.includes('FAIL') || s.includes('REFUS') || s.includes('CANCELLED'))
    return 'Échoué';
  return apiStatut ? String(apiStatut) : '—';
}

/** Ligne paiement : tolère les noms de champs variables du backend. */
export function normalizePaymentRow(p) {
  if (!p || typeof p !== 'object') return null;
  const montant = p.montant ?? p.amount ?? p.prix ?? p.total ?? p.montantPaye;
  const statutBrut = p.statut ?? p.status ?? '';
  return {
    id: p.id ?? p.paymentId,
    mode: p.modePaiement ?? p.mode ?? p.paymentMethod ?? p.typePaiement ?? '—',
    statutBrut: String(statutBrut),
    statutUi: statutPaiementVersUi(statutBrut),
    montant: montant != null && montant !== '' ? Number(montant) : null,
    date: p.datePaiement ?? p.date ?? p.createdAt ?? p.created_at ?? p.instant ?? '',
    reference: p.reference ?? p.transactionRef ?? p.referencePaiement ?? p.ref ?? '',
    _raw: p,
  };
}

/** Entrée d’historique réservation (audit / timeline). */
export function normalizeReservationHistoryItem(h, index = 0) {
  if (!h || typeof h !== 'object') return null;
  return {
    id: h.id ?? h.historyId ?? `hist-${index}`,
    titre: h.action ?? h.type ?? h.event ?? h.libelle ?? h.statut ?? 'Événement',
    detail: h.detail ?? h.message ?? h.description ?? h.commentaire ?? '',
    date: h.date ?? h.createdAt ?? h.timestamp ?? h.instant ?? h.at ?? '',
    _raw: h,
  };
}

/** Date ISO ou yyyy-MM-dd → affichage fr sans décalage pour date seule. */
export function formatIsoDateFr(iso, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (iso == null || iso === '') return '—';
  const s = String(iso).trim();
  const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T12:00:00`) : new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString('fr-FR', options);
}

export function formatMontantFcfa(value) {
  if (value == null || value === '') return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return `${n.toLocaleString('fr-FR')} FCFA`;
}

/** Premier nombre fini parmi les candidats (DTO réservation / trajet / paiements). */
function firstFiniteNumber(...candidates) {
  for (const v of candidates) {
    if (v == null || v === '') continue;
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function sumMontantsPaiementsPayes(paiements) {
  if (!Array.isArray(paiements)) return null;
  let total = 0;
  let found = false;
  for (const p of paiements) {
    const st = (p.statut ?? p.status ?? '').toString().toUpperCase();
    if (!st.includes('PAYE') && !st.includes('PAID') && !st.includes('SUCCESS') && !st.includes('COMPLETED')) {
      continue;
    }
    const m = p.montant ?? p.amount ?? p.prix ?? p.total;
    if (m == null || m === '') continue;
    const n = Number(m);
    if (Number.isFinite(n)) {
      total += n;
      found = true;
    }
  }
  return found ? total : null;
}

export function normalizeReservationListItem(r) {
  if (!r || typeof r !== 'object') return null;
  const reservationId = r.id ?? r.reservationId ?? r.bookingId ?? r.reservation_id;
  if (reservationId == null || reservationId === '') return null;

  const trip = r.trip ?? r.trajet ?? r.tripDto ?? {};
  const tNorm =
    trip && typeof trip === 'object' && Object.keys(trip).length > 0 ? normalizeTripForUi(trip) : null;

  const place = r.place ?? r.placeDto ?? r.seat ?? r.placeEntity ?? {};
  const paiements = r.paiements ?? r.payments ?? [];
  const statutUi = statutReservationVersUi(r.statut ?? r.status, paiements);

  const depart =
    tNorm?.depart ??
    trip.villeDepart ??
    trip.depart ??
    trip.ville_depart ??
    r.villeDepart ??
    r.depart ??
    r.departureCity ??
    r.origine ??
    '';
  const arrivee =
    tNorm?.arrivee ??
    trip.villeArrivee ??
    trip.arrivee ??
    trip.ville_arrivee ??
    r.villeArrivee ??
    r.arrivee ??
    r.arrivalCity ??
    r.destination ??
    '';

  const dateStr = String(
    tNorm?.date ??
      trip.dateDepart ??
      trip.date ??
      r.dateDepart ??
      r.dateReservation ??
      r.dateReservationDepart ??
      r.dateVoyage ??
      r.date ??
      ''
  ).slice(0, 10);

  const heureRaw =
    tNorm?.heure ??
    trip.heureDepart ??
    trip.heure ??
    r.heureDepart ??
    r.heureReservation ??
    r.heure ??
    '';
  const heureStr = String(heureRaw || '');
  const heure = heureStr.length >= 5 ? heureStr.slice(0, 5) : heureStr || '—';

  const siege =
    place.numero ??
    place.numeroPlace ??
    place.number ??
    r.numeroPlace ??
    r.numeroSiege ??
    r.numeroSalle ??
    r.siege ??
    r.seatNumber ??
    r.placeNumber ??
    r.placeNumero ??
    (place.numero == null && place.id != null ? place.id : null) ??
    '—';

  let prix = firstFiniteNumber(
    r.prix,
    r.montant,
    r.montantTotal,
    r.montantPaye,
    r.amount,
    r.total,
    r.tarif,
    r.prixTotal,
    r.prixReservation,
    trip.prix,
    trip.price,
    trip.montant,
    tNorm?.prix
  );
  if (prix == null) {
    prix = sumMontantsPaiementsPayes(paiements);
  }

  const compagnieCandidates = [
    typeof trip.compagnie === 'string' ? trip.compagnie : null,
    typeof trip.compagnie === 'object' && trip.compagnie != null
      ? trip.compagnie.nomCompagnie ?? trip.compagnie.nom ?? null
      : null,
    tNorm?.compagnie && tNorm.compagnie !== '—' ? String(tNorm.compagnie) : null,
    trip.compagnieNom,
    r.compagnieNom,
    r.nomCompagnie,
    typeof r.compagnie === 'string' ? r.compagnie : null,
    r.compagnie && typeof r.compagnie === 'object'
      ? r.compagnie.nomCompagnie ?? r.compagnie.nom
      : null,
  ];
  const compagnieStr = compagnieCandidates.find((s) => s != null && String(s).trim() !== '') ?? '';

  const tripRef = trip.id ?? trip.tripId ?? r.tripId ?? tNorm?.id;
  let trajetLib =
    depart && arrivee
      ? `${depart} → ${arrivee}`
      : r.libelleTrajet ?? r.routeLabel ?? r.intituleTrajet ?? '';
  if (!trajetLib) {
    if (depart || arrivee) trajetLib = `${depart}${arrivee ? ` → ${arrivee}` : ''}`.trim();
    else if (tripRef != null && tripRef !== '') trajetLib = `Trajet n°${tripRef}`;
    else trajetLib = 'Trajet';
  }

  return {
    id: reservationId,
    trajet: trajetLib,
    date: dateStr,
    heure,
    siege,
    prix,
    statut: statutUi,
    statutApi: r.statut ?? r.status,
    paiements,
    compagnie: compagnieStr,
    tripId: tripRef,
    placeId: place.id ?? r.placeId ?? r.place?.id,
    _raw: r,
  };
}

/** Valeurs UI formulaire paiement → API */
export function mapUiModeToApi(modeUi) {
  const m = String(modeUi || '').toLowerCase();
  if (m === 'carte') return 'CARTE';
  if (m === 'especes' || m === 'espèces') return 'ESPECES';
  if (m === 'mobile') return 'MOBILE';
  return 'MOBILE';
}

/** GET /api/trips, GET /api/trips/{id}, GET /api/trips/{id}/places */
export const trajetService = {
  getTrajets: async (filters = {}) => {
    const params = { ...filters };
    if (params.compagnieId != null && params.companyId == null) {
      params.companyId = params.compagnieId;
    }
    const { data } = await api.get('/trips', { params });
    return unwrapList(data)
      .map((t) => normalizeTripForUi(t))
      .filter(Boolean);
  },

  getTrajetById: async (id) => {
    const { data } = await api.get(`/trips/${id}`);
    return normalizeTripForUi(data);
  },

  getPlacesDisponibles: async (tripId) => {
    const { data } = await api.get(`/trips/${tripId}/places`);
    return unwrapList(data)
      .map(normalizePlaceForUi)
      .filter(Boolean);
  },
};

/** Réservations : /api/reservations* */
export const reservationService = {
  getMesReservations: async () => {
    const { data } = await api.get('/reservations/me');
    return unwrapList(data)
      .map(normalizeReservationListItem)
      .filter(Boolean);
  },

  getReservationById: async (reservationId) => {
    const { data } = await api.get(`/reservations/${reservationId}`);
    return { ...data, ligne: normalizeReservationListItem(data) };
  },

  /** Historique / audit réservation (GET /api/reservations/{id}/history) — ignoré si 404. */
  getReservationHistory: async (reservationId) => {
    const rid = String(reservationId ?? '').trim();
    if (!rid || rid === 'undefined' || rid === 'null') {
      throw new Error('Identifiant réservation manquant.');
    }
    const { data } = await api.get(`/reservations/${rid}/history`);
    return unwrapList(data)
      .map((h, i) => normalizeReservationHistoryItem(h, i))
      .filter(Boolean);
  },

  creerReservation: async ({ tripId, placeId }) => {
    const { data } = await api.post('/reservations', { tripId, placeId });
    return data;
  },

  annulerReservation: async (reservationId) => {
    const { data } = await api.delete(`/reservations/${reservationId}`);
    return data;
  },

  effectuerPaiement: async (reservationId, { modePaiement }) => {
    const { data } = await api.post(`/reservations/${reservationId}/payment`, {
      modePaiement,
    });
    return data;
  },
};

/** Statistiques plateforme (admin) */
export const statisticsService = {
  getStatistics: async () => {
    const { data } = await api.get('/admin/stats');
    return data;
  },
};

/** Compagnies : GET/POST /api/admin/companies — utilisé par le dashboard admin et le choix compagnie (page trajets client). */
export const companyService = {
  getCompanies: async () => {
    const { data } = await api.get('/admin/companies');
    return unwrapList(data).map(normalizeCompanyForUi).filter(Boolean);
  },

  createCompany: async (companyData) => {
    const { data } = await api.post('/admin/companies', companyData);
    return data;
  },
};

/** Administration : utilisateurs */
export const adminService = {
  getUsers: async () => {
    const { data } = await api.get('/admin/users');
    return unwrapList(data);
  },

  promoteUserToAgent: async (userId, body) => {
    const uid = requirePathId(userId, 'userId');
    const { data } = await api.put(`/admin/users/${uid}/role-agent`, body);
    return data;
  },
};

/** Agent : /api/agent/* */
export const agentService = {
  getTrips: async (params = {}) => {
    const { data } = await api.get('/agent/trips', { params });
    return unwrapList(data)
      .map((t) => normalizeTripForUi(t))
      .filter(Boolean);
  },

  getTripById: async (tripId) => {
    const tid = requirePathId(tripId, 'tripId');
    const { data } = await api.get(`/agent/trips/${tid}`);
    return normalizeTripForUi(data);
  },

  createTrip: async (body) => {
    const { data } = await api.post('/agent/trips', body);
    return data;
  },

  updateTrip: async (tripId, body) => {
    const tid = requirePathId(tripId, 'tripId');
    const { data } = await api.put(`/agent/trips/${tid}`, body);
    return data;
  },

  deleteTrip: async (tripId) => {
    const tid = requirePathId(tripId, 'tripId');
    const { data } = await api.delete(`/agent/trips/${tid}`);
    return data;
  },

  getTripPassengers: async (tripId) => {
    const tid = requirePathId(tripId, 'tripId');
    const { data } = await api.get(`/agent/trips/${tid}/passengers`);
    return unwrapList(data);
  },

  getTripPlaces: async (tripId) => {
    const tid = requirePathId(tripId, 'tripId');
    const { data } = await api.get(`/agent/trips/${tid}/places`);
    return unwrapList(data)
      .map(normalizePlaceForUi)
      .filter(Boolean);
  },

  getTripReservations: async (tripId) => {
    const tid = requirePathId(tripId, 'tripId');
    const { data } = await api.get(`/agent/trips/${tid}/reservations`);
    return unwrapList(data);
  },

  getReservations: async (params = {}) => {
    const { data } = await api.get('/agent/reservations', { params });
    return unwrapList(data).map((row) => {
      const rid = agentReservationRowId(row);
      if (rid != null && (row.id === undefined || row.id === null || row.id === '')) {
        const n = Number(rid);
        return { ...row, id: Number.isFinite(n) && String(n) === String(rid) ? n : rid };
      }
      return row;
    });
  },

  getReservationById: async (reservationId) => {
    const rid = requirePathId(reservationId, 'reservationId');
    const { data } = await api.get(`/agent/reservations/${rid}`);
    return data;
  },

  validateReservation: async (reservationId) => {
    const rid = requirePathId(reservationId, 'reservationId');
    const { data } = await api.put(`/agent/reservations/${rid}/validate`);
    return data;
  },

  rejectReservation: async (reservationId, payload = {}) => {
    const rid = requirePathId(reservationId, 'reservationId');
    const { data } = await api.put(`/agent/reservations/${rid}/reject`, payload);
    return data;
  },

  cancelReservation: async (reservationId) => {
    const rid = requirePathId(reservationId, 'reservationId');
    const { data } = await api.put(`/agent/reservations/${rid}/cancel`);
    return data;
  },

  forceConfirmReservation: async (reservationId) => {
    const rid = requirePathId(reservationId, 'reservationId');
    const { data } = await api.put(`/agent/reservations/${rid}/force-confirm`);
    return data;
  },

  patchReservation: async (reservationId, body) => {
    const rid = requirePathId(reservationId, 'reservationId');
    const { data } = await api.patch(`/agent/reservations/${rid}`, body);
    return data;
  },

  getReservationHistory: async (reservationId) => {
    const rid = requirePathId(reservationId, 'reservationId');
    const { data } = await api.get(`/agent/reservations/${rid}/history`);
    return unwrapList(data);
  },

  /** Liste des compagnies (sélection véhicule, etc.) — GET /api/agent/companies */
  getCompanies: async () => {
    const { data } = await api.get('/agent/companies');
    return unwrapList(data).map(normalizeCompanyForUi).filter(Boolean);
  },

  getVehicles: async () => {
    const { data } = await api.get('/agent/vehicles');
    return unwrapList(data).map(normalizeVehicleForUi).filter(Boolean);
  },

  getVehicleById: async (vehicleId) => {
    const vid = requirePathId(vehicleId, 'vehicleId');
    const { data } = await api.get(`/agent/vehicles/${vid}`);
    return normalizeVehicleForUi(data) ?? data;
  },

  createVehicle: async (vehicleData) => {
    const { data } = await api.post('/agent/vehicles', vehicleData);
    return data;
  },

  updateVehicle: async (vehicleId, vehicleData) => {
    const vid = requirePathId(vehicleId, 'vehicleId');
    const { data } = await api.put(`/agent/vehicles/${vid}`, vehicleData);
    return data;
  },

  deleteVehicle: async (vehicleId) => {
    const vid = requirePathId(vehicleId, 'vehicleId');
    const { data } = await api.delete(`/agent/vehicles/${vid}`);
    return data;
  },
};
