import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HeaderClient = ({ title, subtitle }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, titre: 'Nouveau trajet disponible', message: 'Abidjan → Bouaké à 7000 FCFA', heure: 'Il y a 2h', lu: false },
    { id: 2, titre: 'Rappel de voyage', message: 'Votre voyage vers Yamoussoukro est demain à 8h', heure: 'Il y a 5h', lu: false },
    { id: 3, titre: 'Points fidélité', message: 'Vous avez gagné 50 points !', heure: 'Hier', lu: true },
  ]);

  const notificationsNonLues = notifications.filter(n => !n.lu).length;

  return (
    <header className="mb-10 flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-slate-500 font-medium mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Bouton Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 group-hover:text-indigo-600 transition-colors">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            {notificationsNonLues > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {notificationsNonLues}
              </span>
            )}
          </button>

          {/* Dropdown Notifications */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-black text-slate-900">Notifications</h3>
                  <p className="text-xs text-slate-500 mt-1">{notificationsNonLues} non lue(s)</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!notif.lu ? 'bg-indigo-50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${!notif.lu ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">{notif.titre}</p>
                          <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 mt-2">{notif.heure}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-slate-100">
                  <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                    Tout marquer comme lu
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bouton Paramètres */}
        <Link
          to="/client/profil"
          className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 group-hover:text-indigo-600 transition-colors">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </Link>
      </div>
    </header>
  );
};

export default HeaderClient;