import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, ShieldCheck, X } from 'lucide-react';

const PaymentSimulator = ({ isOpen, onClose, onSuccess, amount, method }) => {
  const [step, setStep] = useState('processing'); // 'processing', 'success'

  useEffect(() => {
    if (isOpen) {
      setStep('processing');
      const timer = setTimeout(() => {
        setStep('success');
      }, 2500);

      const successTimer = setTimeout(() => {
        onSuccess();
      }, 4000);

      return () => {
        clearTimeout(timer);
        clearTimeout(successTimer);
      };
    }
  }, [isOpen, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 pt-10 text-center">
          {step === 'processing' ? (
            <div className="space-y-6">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Traitement en cours</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Paiement sécurisé via <span className="font-semibold text-indigo-600">SmartPay</span>
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex justify-between text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <span>Montant</span>
                  <span>Méthode</span>
                </div>
                <div className="mt-1 flex justify-between font-bold text-slate-900">
                  <span>{amount.toLocaleString('fr-FR')} FCFA</span>
                  <span className="capitalize">{method || 'Mobile Money'}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Paiement sécurisé
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4 animate-in zoom-in duration-500">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-16 w-16" strokeWidth={1.5} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">Paiement Réussi !</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Votre transaction a été effectué avec succès.
                </p>
              </div>

              <div className="text-xs text-slate-400">
                Redirection automatique vers vos billets...
              </div>
            </div>
          )}
        </div>

        {/* Footer decoration */}
        <div className="h-2 w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
      </div>
    </div>
  );
};

export default PaymentSimulator;
