import React, { useEffect, useState, useMemo } from 'react';
import LayoutAdmin from '../../components/LayoutAdmin';
import { statisticsService } from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, Users, MapPin, ClipboardList, Wallet,
  ArrowUpRight, ArrowDownRight, Calendar
} from 'lucide-react';

// Données de secours si l'API ne fournit pas encore d'historique
const MOCK_REVENUE_DATA = [
  { name: 'Jan', revenue: 450000 },
  { name: 'Fév', revenue: 520000 },
  { name: 'Mar', revenue: 480000 },
  { name: 'Avr', revenue: 610000 },
  { name: 'Mai', revenue: 550000 },
  { name: 'Juin', revenue: 670000 },
];

const MOCK_RESERVATIONS_DATA = [
  { name: 'Lun', bookings: 12 },
  { name: 'Mar', bookings: 19 },
  { name: 'Mer', bookings: 15 },
  { name: 'Jeu', bookings: 22 },
  { name: 'Ven', bookings: 30 },
  { name: 'Sam', bookings: 25 },
  { name: 'Dim', bookings: 18 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const AdminStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await statisticsService.getStatistics();
        setStatistics(data);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Chargement des statistiques impossible.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statsCards = useMemo(() => {
    const s = statistics || {};
    return [
      {
        label: 'Revenus Totaux',
        value: `${(s.totalRevenue || 0).toLocaleString()} FCFA`,
        icon: Wallet,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        trend: '+12.5%',
        up: true
      },
      {
        label: 'Réservations Totales',
        value: s.totalReservations || 0,
        icon: ClipboardList,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        trend: '+8.2%',
        up: true
      },
      {
        label: 'Utilisateurs',
        value: s.totalUsers || 0,
        icon: Users,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        trend: '+5.1%',
        up: true
      },
      {
        label: 'Trajets Actifs',
        value: s.totalTrips || 0,
        icon: MapPin,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        trend: '-2.4%',
        up: false
      },
    ];
  }, [statistics]);

  // Préparation des données pour le camembert des statuts avec les VRAIES données
  const statusData = useMemo(() => {
    const s = statistics || {};
    const data = [
      { name: 'Confirmées', value: s.reservationsConfirmees || 0 },
      { name: 'En attente', value: s.reservationsEnAttente || 0 },
      { name: 'Annulées', value: s.reservationsAnnulees || 0 },
    ];
    return data;
  }, [statistics]);


  if (loading) {
    return (
      <LayoutAdmin title="Statistiques">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
          <span className="ml-3 text-slate-500">Chargement des données...</span>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin title="Statistiques & Performance">
      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Cartes de résumé */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className={`rounded-xl ${card.bg} p-2.5 ${card.color}`}>
                <card.icon size={20} />
              </div>
              <div className={`flex items-center text-xs font-medium ${card.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                {card.trend}
                {card.up ? <ArrowUpRight size={14} className="ml-0.5" /> : <ArrowDownRight size={14} className="ml-0.5" />}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-500">{card.label}</h3>
              <p className="mt-1 text-2xl font-bold text-slate-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques principaux */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Evolution des revenus */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Flux de Trésorerie</h3>
              <p className="text-sm text-slate-500">Revenus mensuels générés par la plateforme</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 text-slate-400">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statistics?.revenueHistory || MOCK_REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(val) => [`${val.toLocaleString()} FCFA`, 'Revenu']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activité hebdomadaire */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Activité Hebdomadaire</h3>
              <p className="text-sm text-slate-500">Volume de réservations sur les 7 derniers jours</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 text-slate-400">
              <Calendar size={20} />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statistics?.weeklyActivity || MOCK_RESERVATIONS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar
                  dataKey="bookings"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Répartition des statuts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <h3 className="mb-6 text-lg font-semibold text-slate-900">État des Réservations</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-slate-600">{entry.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Compagnies (Simulé si pas dans l'API) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-6 text-lg font-semibold text-slate-900">Performance des Compagnies</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="pb-3 pr-4 font-medium">Compagnie</th>
                  <th className="pb-3 pr-4 font-medium">Trajets</th>
                  <th className="pb-3 pr-4 font-medium">Réservations</th>
                  <th className="pb-3 text-right font-medium">Revenus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(statistics?.companyPerformances || []).map((company, i) => (
                  <tr key={i} className="group">
                    <td className="py-4 pr-4 font-medium text-slate-900">{company.name}</td>
                    <td className="py-4 pr-4 text-slate-600">{company.trips}</td>
                    <td className="py-4 pr-4 text-slate-600">{company.bookings}</td>
                    <td className="py-4 text-right font-semibold text-slate-900">{company.revenue.toLocaleString()} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default AdminStatistics;

