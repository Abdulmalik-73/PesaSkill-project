import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Star, Clock, ShieldCheck, Zap, MessageCircle, TrendingUp, Phone } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function ServiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [suggested, setSuggested] = useState(null);
  const [phone, setPhone] = useState(user?.phone || '');
  const [paying, setPaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/services/${id}`),
      api.get(`/ratings/service/${id}`),
    ]).then(([s, r]) => {
      setService(s.data);
      setRatings(r.data);
      // AI recommendations
      api.get('/services/ai-recommend', { params: { category: s.data.category } })
        .then(rec => setRecommended(rec.data.filter(x => x._id !== id).slice(0, 3)));
      // AI price suggestion
      api.get('/services/price-suggest', { params: { category: s.data.category } })
        .then(p => setSuggested(p.data));
    }).catch(() => toast.error('Service not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePay = async () => {
    if (!user) return navigate('/login');
    if (!phone) return toast.error('Enter your M-Pesa phone number');
    setPaying(true);
    try {
      const { data } = await api.post('/payments/initiate', { serviceId: id, phone });
      toast.success(data.simulated ? '✅ Payment simulated (sandbox)' : '📱 Check your phone for M-Pesa prompt');
      navigate(`/payment/${data.transactionId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-gray-100 rounded w-1/2 mb-4" />
      <div className="h-4 bg-gray-100 rounded w-full mb-2" />
      <div className="h-4 bg-gray-100 rounded w-3/4" />
    </div>
  );

  if (!service) return <div className="text-center py-20 text-gray-400">Service not found</div>;

  const isSeller = user?._id === service.seller?._id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="badge bg-purple-100 text-purple-700">{service.category}</span>
              {service.isFeatured && <span className="badge bg-amber-100 text-amber-700"><TrendingUp className="w-3 h-3" /> Featured</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{service.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <strong className="text-gray-700">{service.rating?.toFixed(1) || '0.0'}</strong>
                ({service.totalRatings} reviews)
              </span>
              <span>{service.ordersCompleted} orders completed</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {service.deliveryDays} day delivery</span>
            </div>
          </div>

          {/* Seller card */}
          <div className="card p-5 flex items-center gap-4">
            <div className="w-14 h-14 bg-mpesa-green rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {service.seller?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{service.seller?.name}</h3>
                {service.seller?.isVerified && <ShieldCheck className="w-4 h-4 text-mpesa-green" />}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{service.seller?.rating?.toFixed(1) || '0.0'}</span>
                <span>{service.seller?.jobsCompleted} jobs done</span>
              </div>
              {service.seller?.bio && <p className="text-sm text-gray-600 mt-1">{service.seller.bio}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-3">About this service</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{service.description}</p>
            {service.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {service.tags.map(t => (
                  <span key={t} className="badge bg-gray-100 text-gray-600">#{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* AI Price Insight */}
          {suggested && (
            <div className="card p-5 border-l-4 border-mpesa-green bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-mpesa-green" />
                <span className="text-sm font-semibold text-mpesa-green">AI Price Insight</span>
              </div>
              <p className="text-sm text-gray-600">
                Average price for <strong>{service.category}</strong> services: <strong>KES {suggested.suggested?.toLocaleString()}</strong>
                {' '}(range: KES {suggested.min?.toLocaleString()} – {suggested.max?.toLocaleString()})
              </p>
            </div>
          )}

          {/* Reviews */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Reviews ({ratings.length})</h2>
            {ratings.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {ratings.map(r => (
                  <div key={r._id} className="border-b border-gray-50 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                        {r.buyer?.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{r.buyer?.name}</span>
                      <div className="flex ml-auto">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600 ml-9">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — Payment */}
        <div className="space-y-4">
          <div className="card p-6 sticky top-20">
            <div className="text-center mb-5">
              <p className="text-sm text-gray-500">Service Price</p>
              <p className="text-4xl font-extrabold text-gray-900 mt-1">KES {service.price?.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">5% platform fee applies</p>
            </div>

            {/* Escrow badge */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5 flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-mpesa-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-mpesa-green">Escrow Protected</p>
                <p className="text-xs text-gray-500 mt-0.5">Payment held securely until you confirm the work is done.</p>
              </div>
            </div>

            {!isSeller && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">M-Pesa Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="251777564882"
                      className="input pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Format: 251XXXXXXXXX or 09XXXXXXXX</p>
                </div>
                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="w-full bg-mpesa-green hover:bg-mpesa-dark text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-60"
                >
                  <Zap className="w-5 h-5" />
                  {paying ? 'Processing...' : 'Pay with M-Pesa'}
                </button>
              </>
            )}

            {isSeller && (
              <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
                This is your service
              </div>
            )}

            <div className="mt-4 space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-mpesa-green" /> Funds held in escrow</div>
              <div className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-mpesa-green" /> Released only after your approval</div>
              <div className="flex items-center gap-2"><MessageCircle className="w-3.5 h-3.5 text-mpesa-green" /> Dispute protection available</div>
            </div>
          </div>

          {/* AI Recommendations */}
          {recommended.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-mpesa-green" /> You may also like
              </h3>
              <div className="space-y-3">
                {recommended.map(r => (
                  <Link key={r._id} to={`/services/${r._id}`} className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                    <div className="w-8 h-8 bg-mpesa-green/10 rounded-lg flex items-center justify-center text-mpesa-green text-xs font-bold flex-shrink-0">
                      {r.category[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{r.title}</p>
                      <p className="text-xs text-mpesa-green font-semibold">KES {r.price?.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
