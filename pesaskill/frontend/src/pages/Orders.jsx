import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { ShoppingBag, DollarSign, CheckCircle, Clock } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

export default function Orders() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('buying');

  useEffect(() => {
    const role = tab === 'buying' ? 'buyer' : 'seller';
    setLoading(true);
    api.get(`/dashboard/${role === 'buyer' ? 'buyer' : 'seller'}`)
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [tab]);

  const transactions = tab === 'buying' ? data?.transactions : data?.recentTransactions;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-mpesa-green" /> My Orders
        </h1>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{data.stats?.totalOrders || data.stats?.activeOrders || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Total Orders</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-mpesa-green">{data.stats?.completedOrders || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Completed</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              KES {(data.stats?.totalSpent || data.totalEarnings || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">{tab === 'buying' ? 'Total Spent' : 'Total Earned'}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {['buying', 'selling'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t === 'buying' ? 'As Buyer' : 'As Seller'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : !transactions?.length ? (
        <div className="card p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No orders yet</p>
          {tab === 'buying' && <Link to="/" className="btn-primary mt-4 inline-block">Browse Services</Link>}
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map(tx => (
            <Link key={tx._id} to={`/payment/${tx._id}`}
              className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-mpesa-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5 text-mpesa-green" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{tx.service?.title}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span>{tab === 'buying' ? `Seller: ${tx.seller?.name}` : `Buyer: ${tx.buyer?.name}`}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(tx.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900">KES {tx.amount?.toLocaleString()}</p>
                <div className="mt-1"><StatusBadge status={tx.status} /></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
