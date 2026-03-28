import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import {
  DollarSign, Briefcase, CheckCircle, Star, TrendingUp,
  PlusCircle, Trash2, Eye, ArrowRight, LayoutGrid, List,
  Wallet, Activity, ChevronRight, Sparkles,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

const TABS = [
  { key: 'overview',     label: 'Overview',     icon: Activity },
  { key: 'services',     label: 'My Services',  icon: LayoutGrid },
  { key: 'transactions', label: 'Transactions', icon: List },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  const fetchData = () => {
    api.get('/dashboard/seller')
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const deleteService = async (id) => {
    if (!confirm('Remove this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service removed');
      fetchData();
    } catch { toast.error('Failed to remove'); }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 skeleton rounded-2xl" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
      <div className="h-48 skeleton rounded-2xl" />
    </div>
  );

  const stats = [
    { label: 'Total Earnings', value: `KES ${(data?.totalEarnings || 0).toLocaleString()}`, icon: DollarSign, color: 'text-mpesa-green', bg: 'bg-gradient-to-br from-green-50 to-emerald-100', border: 'border-green-200' },
    { label: 'Wallet Balance', value: `KES ${(data?.walletBalance || 0).toLocaleString()}`, icon: Wallet,      color: 'text-blue-600',   bg: 'bg-gradient-to-br from-blue-50 to-sky-100',   border: 'border-blue-200' },
    { label: 'Active Jobs',    value: data?.activeJobs?.length || 0,                         icon: Briefcase,   color: 'text-orange-600', bg: 'bg-gradient-to-br from-orange-50 to-amber-100', border: 'border-orange-200' },
    { label: 'Completed',      value: data?.completedJobs?.length || 0,                      icon: CheckCircle, color: 'text-purple-600', bg: 'bg-gradient-to-br from-purple-50 to-violet-100', border: 'border-purple-200' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ── Header banner ─────────────────────────────────────────────── */}
      <div className="bg-animated text-white px-4 pt-10 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-20 w-40 h-40 bg-white rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-10 w-56 h-56 bg-mpesa-green rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in-left">
              <p className="text-emerald-300 text-sm font-medium mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Seller Dashboard
              </p>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-gray-300 text-sm mt-1">Here's what's happening with your services</p>
            </div>
            <Link to="/post-service"
              className="hidden sm:flex items-center gap-2 bg-white text-mpesa-green font-semibold
                         px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200
                         shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95
                         animate-fade-in-right">
              <PlusCircle className="w-4 h-4" /> New Service
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12 pb-12 relative z-10">

        {/* ── Stat cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={s.label}
              className={`bg-white rounded-2xl p-5 border ${s.border} shadow-sm
                          hover:-translate-y-1 hover:shadow-md transition-all duration-250
                          animate-fade-in-up cursor-default`}
              style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center mb-3 border ${s.border}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 leading-none">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Rating + quick CTA row ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Rating card */}
          <div className="sm:col-span-2 bg-white rounded-2xl p-5 border border-amber-100 shadow-sm
                          flex items-center gap-5 animate-fade-in-up delay-300">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl
                            flex items-center justify-center border border-amber-200 flex-shrink-0">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-extrabold text-gray-900">{user?.rating?.toFixed(1) || '0.0'}</span>
                <span className="text-gray-400 text-sm mb-1">/ 5.0</span>
              </div>
              <p className="text-sm text-gray-500">{user?.totalRatings || 0} reviews · {user?.jobsCompleted || 0} jobs completed</p>
              {/* Star visual */}
              <div className="flex gap-0.5 mt-1.5">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(user?.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Quick post CTA */}
          <Link to="/post-service"
            className="bg-gradient-to-br from-mpesa-green to-emerald-600 rounded-2xl p-5
                       text-white flex flex-col justify-between shadow-sm
                       hover:-translate-y-1 hover:shadow-lg transition-all duration-200
                       animate-fade-in-up delay-400 group">
            <PlusCircle className="w-7 h-7 opacity-80 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-bold text-base">Post New Service</p>
              <p className="text-emerald-100 text-xs mt-0.5">Start earning today</p>
            </div>
          </Link>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up delay-200">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all duration-200
                  border-b-2 flex-1 justify-center ${
                  tab === key
                    ? 'border-mpesa-green text-mpesa-green bg-mpesa-green/3'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* ── Overview ── */}
            {tab === 'overview' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Active Jobs</h2>
                  <span className="badge bg-orange-100 text-orange-700">{data?.activeJobs?.length || 0} active</span>
                </div>
                {!data?.activeJobs?.length ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No active jobs yet</p>
                    <Link to="/" className="text-mpesa-green text-sm font-medium hover:underline mt-1 inline-block">
                      Browse marketplace →
                    </Link>
                  </div>
                ) : (
                  data.activeJobs.map((tx, i) => (
                    <Link key={tx._id} to={`/payment/${tx._id}`}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100
                                 hover:border-mpesa-green/30 hover:bg-mpesa-green/2 transition-all duration-200
                                 group animate-fade-in-up"
                      style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0
                                      group-hover:bg-orange-100 transition-colors">
                        <Briefcase className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{tx.service?.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Buyer: {tx.buyer?.name}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-mpesa-green text-sm">KES {tx.sellerAmount?.toLocaleString()}</p>
                        <div className="mt-1"><StatusBadge status={tx.status} /></div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-mpesa-green group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* ── Services ── */}
            {tab === 'services' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Your Services</h2>
                  <Link to="/post-service" className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" /> Add New
                  </Link>
                </div>
                {!data?.services?.length ? (
                  <div className="text-center py-12">
                    <LayoutGrid className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm mb-4">No services yet</p>
                    <Link to="/post-service" className="btn-primary text-sm">Post your first service</Link>
                  </div>
                ) : (
                  data.services.map((s, i) => (
                    <div key={s._id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100
                                 hover:border-mpesa-green/30 hover:shadow-sm transition-all duration-200
                                 animate-fade-in-up"
                      style={{ animationDelay: `${i * 60}ms` }}>
                      {/* Category dot */}
                      <div className="w-10 h-10 bg-mpesa-green/10 rounded-xl flex items-center justify-center
                                      text-mpesa-green font-bold text-sm flex-shrink-0">
                        {s.category[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{s.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="badge bg-gray-100 text-gray-500 text-xs">{s.category}</span>
                          <span className="flex items-center gap-0.5 text-xs text-amber-500">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {s.rating?.toFixed(1) || '0.0'}
                          </span>
                          <span className="text-xs text-gray-400">{s.ordersCompleted} orders</span>
                        </div>
                      </div>
                      <p className="font-bold text-mpesa-green text-sm flex-shrink-0">
                        KES {s.price?.toLocaleString()}
                      </p>
                      <div className="flex gap-1 flex-shrink-0">
                        <Link to={`/services/${s._id}`}
                          className="p-2 text-gray-400 hover:text-mpesa-green hover:bg-green-50 rounded-lg transition-all active:scale-90">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => deleteService(s._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── Transactions ── */}
            {tab === 'transactions' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Transaction History</h2>
                  <span className="badge bg-gray-100 text-gray-600">{data?.recentTransactions?.length || 0} total</span>
                </div>
                {!data?.recentTransactions?.length ? (
                  <div className="text-center py-12">
                    <List className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No transactions yet</p>
                  </div>
                ) : (
                  data.recentTransactions.map((tx, i) => (
                    <Link key={tx._id} to={`/payment/${tx._id}`}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100
                                 hover:border-mpesa-green/30 hover:bg-gray-50/50 transition-all duration-200
                                 group animate-fade-in-up"
                      style={{ animationDelay: `${i * 50}ms` }}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        tx.status === 'released' ? 'bg-green-50' : tx.status === 'disputed' ? 'bg-red-50' : 'bg-blue-50'
                      }`}>
                        <DollarSign className={`w-5 h-5 ${
                          tx.status === 'released' ? 'text-mpesa-green' : tx.status === 'disputed' ? 'text-red-500' : 'text-blue-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{tx.service?.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(tx.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 text-sm">KES {tx.amount?.toLocaleString()}</p>
                        <div className="mt-1"><StatusBadge status={tx.status} /></div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-mpesa-green transition-colors" />
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
