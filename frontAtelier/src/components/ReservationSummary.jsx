import React from 'react';
import { MapPin, Armchair, Banknote, ShieldCheck } from 'lucide-react';

const ReservationSummary = ({ details, reference }) => (
  <aside className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
    <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
      <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Récapitulatif</h3>
      {reference != null && (
        <p className="text-xs text-slate-500 mt-1 font-mono">Réf. {reference}</p>
      )}
    </div>

    <div className="p-6 space-y-5">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <MapPin className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Itinéraire</p>
          <p className="text-sm font-semibold text-slate-900 leading-snug">
            {details.depart}
            <span className="mx-1.5 text-slate-300">→</span>
            {details.arrivee}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Armchair className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="flex-1 flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Place</p>
            <p className="text-sm font-semibold text-slate-900">Siège n°{details.siege}</p>
          </div>
          <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 tabular-nums">
            {details.siege}
          </span>
        </div>
      </div>

      <div className="border-t border-dashed border-slate-200 pt-5">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Banknote className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium">Montant</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {details.prix != null ? Number(details.prix).toLocaleString('fr-FR') : '—'}
              <span className="text-sm font-medium text-slate-500 ml-1">FCFA</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">TVA incluse le cas échéant</p>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-4 flex gap-3">
      <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2} />
      <p className="text-xs text-slate-600 leading-relaxed">
        Transaction traitée de façon sécurisée. Après validation, votre billet sera disponible dans l’onglet « Mes réservations ».
      </p>
    </div>
  </aside>
);

export default ReservationSummary;
