import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BarreNav from '../components/BarreNav';
import PiedPage from '../components/PiedPage';

const Connexion = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const gererConnexion = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    const result = await login({ email, password: mdp });
    setChargement(false);

    if (result.success) {
      // On récupère le rôle renvoyé par le serveur
      const role = result.data?.user?.role;
      
      // On définit les directions
      const routes = {
        'CLIENT':    '/client/trajets',
        'COMPAGNIE': '/compagnie/dashboard', // Assure-toi que cette page existe
        'AGENT':     '/agent/trips',
        'ADMIN':     '/admin/statistics',
      };

      // On redirige, si le rôle est inconnu on va à l'accueil
      navigate(routes[role] || '/');
    } else {
      setErreur(result.error || "Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BarreNav />
      <div className="max-w-md mx-auto py-24 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-3xl font-extrabold text-center mb-8">Bon retour !</h1>

          {erreur && <div className="mb-5 p-3 bg-red-50 text-red-600 rounded-xl text-sm">⚠️ {erreur}</div>}

          <form onSubmit={gererConnexion} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={chargement}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition"
            >
              {chargement ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">Pas encore de compte ?</p>
            <div className="grid grid-cols-3 gap-2">
              <Link to="/inscription" className="text-[10px] p-2 border rounded-lg hover:bg-gray-50">Voyageur</Link>
              <Link to="/inscription?role=compagnie" className="text-[10px] p-2 border rounded-lg hover:bg-gray-50">Compagnie</Link>
              <Link to="/inscription?role=agent" className="text-[10px] p-2 border rounded-lg hover:bg-gray-50">Agent</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connexion;