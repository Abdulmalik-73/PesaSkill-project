import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { PlusCircle, Zap, DollarSign, Tag, Clock, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { name: 'Design',    emoji: '🎨' },
  { name: 'Coding',    emoji: '💻' },
  { name: 'Writing',   emoji: '✍️' },
  { name: 'Marketing', emoji: '📣' },
  { name: 'Video',     emoji: '🎬' },
  { name: 'Music',     emoji: '🎵' },
  { name: 'Business',  emoji: '💼' },
  { name: 'Other',     emoji: '✨' },
];

const STEPS = ['Details', 'Pricing', 'Review'];

export default function PostService() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'Design', tags: '', deliveryDays: 3,
  });
  const [suggested, setSuggested] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (form.category) {
      api.get('/services/price-suggest', { params: { category: form.category } })
        .then(r => setSuggested(r.data))
        .catch(() => {});
    }
  }, [form.category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      await api.post('/services', { ...form, price: Number(form.price), tags });
      toast.success('Service posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post service');
    } finally {
      setLoading(false);
    }
  };

  const canNext = step === 0
    ? form.title.trim() && form.description.trim() && form.category
    : form.price > 0;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="bg-animated text-white px-4 pt-10 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-4 right-16 w-32 h-32 bg-white rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-8 w-48 h-48 bg-mpesa-green rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2 animate-fade-in-left">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Post a Service</h1>
              <p className="text-gray-300 text-sm">List your skill and start earning via M-Pesa</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-5 animate-fade-in-up delay-100">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                  transition-all duration-300 ${
                  i < step  ? 'bg-white/20 text-white' :
                  i === step ? 'bg-white text-mpesa-green shadow-sm' :
                               'bg-white/10 text-white/50'
                }`}>
                  {i < step ? <CheckCircle className="w-3 h-3" /> : <span>{i + 1}</span>}
                  {s}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 w-6 rounded-full transition-all duration-300 ${i < step ? 'bg-white/60' : 'bg-white/20'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-12 relative z-10">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden animate-scale-in">

            {/* ── Step 0: Details ─────────────────────────────────────── */}
            {step === 0 && (
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Service Title</label>
                  <input required value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Professional Logo Design"
                    className="input text-base" />
                  <p className="text-xs text-gray-400 mt-1">Be specific — good titles get more clicks</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <div className="grid grid-cols-4 gap-2">
                    {CATEGORIES.map(({ name, emoji }) => (
                      <button key={name} type="button" onClick={() => setForm({ ...form, category: name })}
                        className={`py-3 rounded-xl text-sm font-medium border-2 transition-all duration-200
                          flex flex-col items-center gap-1 active:scale-95 ${
                          form.category === name
                            ? 'border-mpesa-green bg-mpesa-green/5 text-mpesa-green shadow-sm'
                            : 'border-gray-100 text-gray-600 hover:border-mpesa-green/40 hover:-translate-y-0.5 bg-gray-50'
                        }`}>
                        <span className="text-lg">{emoji}</span>
                        <span className="text-xs">{name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea required rows={5} value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe what you offer, your experience, and what buyers will receive..."
                    className="input resize-none" />
                  <p className="text-xs text-gray-400 mt-1">{form.description.length}/500 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                      placeholder="logo, branding, illustrator (comma separated)"
                      className="input pl-10" />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 1: Pricing ─────────────────────────────────────── */}
            {step === 1 && (
              <div className="p-6 space-y-5">
                {/* AI suggestion banner */}
                {suggested && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200
                                  rounded-xl p-4 flex items-start gap-3 animate-fade-in-up">
                    <div className="w-9 h-9 bg-mpesa-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-mpesa-green" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-mpesa-green">AI Price Suggestion</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Based on {suggested.sampleSize || 0} similar {form.category} services,
                        the optimal price is around <strong>KES {suggested.suggested?.toLocaleString()}</strong>
                        {' '}(range: KES {suggested.min?.toLocaleString()} – {suggested.max?.toLocaleString()})
                      </p>
                      <button type="button"
                        onClick={() => setForm({ ...form, price: String(suggested.suggested) })}
                        className="mt-2 text-xs text-mpesa-green font-semibold hover:underline flex items-center gap-1">
                        Use this price <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (KES)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="number" required min="1" value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      placeholder="500"
                      className="input pl-10 text-2xl font-bold" />
                  </div>
                  {form.price && (
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span>Buyer pays: <strong className="text-gray-700">KES {Number(form.price).toLocaleString()}</strong></span>
                      <span>You receive: <strong className="text-mpesa-green">KES {Math.round(form.price * 0.95).toLocaleString()}</strong></span>
                      <span className="text-gray-400">(5% platform fee)</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Time</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 5, 7, 10, 14, 30].map(d => (
                      <button key={d} type="button" onClick={() => setForm({ ...form, deliveryDays: d })}
                        className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200
                          active:scale-95 ${
                          form.deliveryDays === d
                            ? 'border-mpesa-green bg-mpesa-green/5 text-mpesa-green shadow-sm'
                            : 'border-gray-100 text-gray-600 hover:border-mpesa-green/40 bg-gray-50'
                        }`}>
                        {d}d
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Delivery in {form.deliveryDays} day{form.deliveryDays > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}

            {/* ── Step 2: Review ──────────────────────────────────────── */}
            {step === 2 && (
              <div className="p-6 space-y-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Review your service before posting</p>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  {[
                    { label: 'Title',    value: form.title },
                    { label: 'Category', value: `${CATEGORIES.find(c => c.name === form.category)?.emoji} ${form.category}` },
                    { label: 'Price',    value: `KES ${Number(form.price).toLocaleString()}` },
                    { label: 'Delivery', value: `${form.deliveryDays} day${form.deliveryDays > 1 ? 's' : ''}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-700 line-clamp-3">{form.description}</p>
                  </div>
                </div>

                {/* Earnings breakdown */}
                <div className="bg-mpesa-green/5 border border-mpesa-green/20 rounded-xl p-4">
                  <p className="text-xs font-semibold text-mpesa-green mb-2 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Earnings Breakdown
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Service price</span>
                      <span>KES {Number(form.price).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                      <span>Platform fee (5%)</span>
                      <span>- KES {Math.round(form.price * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-mpesa-green border-t border-mpesa-green/20 pt-1 mt-1">
                      <span>You receive</span>
                      <span>KES {Math.round(form.price * 0.95).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Footer nav ──────────────────────────────────────────── */}
            <div className="px-6 pb-6 flex gap-3">
              {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="btn-secondary flex-1 py-3">
                  Back
                </button>
              )}
              {step < 2 ? (
                <button type="button" onClick={() => setStep(s => s + 1)}
                  disabled={!canNext}
                  className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={loading}
                  className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? (
                    <><span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" /></>
                  ) : (
                    <><CheckCircle className="w-4 h-4" /> Post Service</>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
