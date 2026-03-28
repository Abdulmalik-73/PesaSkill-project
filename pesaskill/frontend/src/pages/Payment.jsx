import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import {
  Shield, CheckCircle, AlertTriangle, Clock, Star,
  Zap, ArrowLeft, Lock, Unlock, RefreshCw,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const STEPS = [
  { key: 'pending_payment', label: 'Payment',  short: '1' },
  { key: 'in_escrow',       label: 'Escrow',   short: '2' },
  { key: 'in_progress',     label: 'Working',  short: '3' },
  { key: 'completed',       label: 'Review',   short: '4' },
  { key: 'released',        label: 'Released', short: '5' },
];

export default function Payment() {
  const { transactionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [rated, setRated] = useState(false);
  const [sellerNote, setSellerNote] = useState('');

  const fetchTx = () => {
    api.get(`/payments/${transactionId}`)
      .then(r => setTx(r.data))
      .catch(() => toast.error('Transaction not found'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTx(); }, [transactionId]);

  const isBuyer  = tx?.buyer?._id  === user?._id;
  const isSeller = tx?.seller?._id === user?._id;

  const markDone = async () => {
    setActionLoading('done');
    try {
      await api.put(`/payments/${transactionId}/mark-done`, { note: sellerNote });
      toast.success('Marked as done! Waiting for buyer confirmation.');
      fetchTx();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setActionLoading(''); }
  };

  const confirmRelease = async () => {
    setActionLoading('confirm');
    try {
      await api.put(`/payments/${transactionId}/confirm`);
      toast.success('Payment released to seller!');
      fetchTx();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setActionLoading(''); }
  };

  const raiseDispute = async () => {
    const reason = prompt('Describe the issue:');
    if (!reason) return;
    setActionLoading('dispute');
    try {
      await api.put(`/payments/${transactionId}/dispute`, { reason });
      toast.success('Dispute raised. Funds are held securely.');
      fetchTx();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setActionLoading(''); }
  };

  const submitRating = async () => {
    if (!rating) return toast.error('Select a rating');
    setActionLoading('rate');
    try {
      await api.post('/ratings', { transactionId, rating, comment });
      toast.success('Rating submitted!');
      setRated(true);
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setActionLoading(''); }
  };

  const requestRefund = async () => {
    setActionLoading('refund');
    try {
      await api.put(`/payments/${transactionId}/refund`);
      toast.success('Refund initiated via M-Pesa reversal');
      fetchTx();
    } catch (err) { toast.error(err.response?.data?.message || 'Refund failed'); }
    finally { setActionLoading(''); }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
      <div className="h-8 skeleton rounded-xl w-1/2" />
      <div className="h-56 skeleton rounded-2xl" />
      <div className="h-32 skeleton rounded-2xl" />
    </div>
  );

  if (!tx) return (
    <div className="text-center py-24">
      <Shield className="w-12 h-12 text-gray-200 mx-auto mb-3" />
      <p className="text-gray-400">Transaction not found</p>
      <Link to="/orders" className="text-mpesa-green text-sm font-medium hover:underline mt-2 inline-block">← Back to orders</Link>
    </div>
  );

  const stepIndex = STEPS.findIndex(s => s.key === tx.status);
  const isTerminal = ['disputed', 'refunded', 'cancelled'].includes(tx.status);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-16 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-mpesa-green transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <div className="text-center">
            <p className="text-xs text-gray-400">Transaction</p>
            <p className="text-sm font-mono font-semibold text-gray-700">#{tx._id?.slice(-8).toUpperCase()}</p>
          </div>
          <StatusBadge status={tx.status} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-4">

        {/* ── Progress stepper ────────────────────────────────────────── */}
        {!isTerminal && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fade-in-up">
            <div className="flex items-center justify-between relative">
              {/* connector line */}
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-100 z-0 mx-8" />
              <div
                className="absolute left-8 top-5 h-0.5 bg-mpesa-green z-0 transition-all duration-700"
                style={{ width: stepIndex > 0 ? `calc(${(stepIndex / (STEPS.length - 1)) * 100}% - 4rem)` : '0%' }}
              />
              {STEPS.map((s, i) => {
                const done    = i < stepIndex;
                const current = i === stepIndex;
                return (
                  <div key={s.key} className="flex flex-col items-center gap-1.5 z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                      border-2 transition-all duration-300 ${
                      done    ? 'bg-mpesa-green border-mpesa-green text-white shadow-sm shadow-mpesa-green/30' :
                      current ? 'bg-white border-mpesa-green text-mpesa-green shadow-md animate-pulse-ring' :
                                'bg-white border-gray-200 text-gray-400'
                    }`}>
                      {done ? <CheckCircle className="w-5 h-5" /> : s.short}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${
                      current ? 'text-mpesa-green' : done ? 'text-gray-600' : 'text-gray-400'
                    }`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Service summary card ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up delay-100">
          {/* Amount hero */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Total Amount</p>
                <p className="text-3xl font-extrabold">KES {tx.amount?.toLocaleString()}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                tx.status === 'released' ? 'bg-mpesa-green/20' :
                tx.status === 'disputed' ? 'bg-red-500/20' : 'bg-white/10'
              }`}>
                {tx.status === 'released' ? <Unlock className="w-7 h-7 text-mpesa-green" /> :
                 tx.status === 'disputed' ? <AlertTriangle className="w-7 h-7 text-red-400" /> :
                 <Lock className="w-7 h-7 text-white/70" />}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-5 space-y-3">
            {[
              { label: 'Service',       value: tx.service?.title },
              { label: 'Buyer',         value: tx.buyer?.name },
              { label: 'Seller',        value: tx.seller?.name },
              { label: 'Platform Fee',  value: `KES ${tx.platformFee?.toLocaleString()} (5%)` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
              <span className="text-gray-500 font-medium">Seller Receives</span>
              <span className="font-bold text-mpesa-green text-base">KES {tx.sellerAmount?.toLocaleString()}</span>
            </div>
            {tx.mpesaReceiptNumber && (
              <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                <span className="text-gray-500">M-Pesa Receipt</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-700">
                  {tx.mpesaReceiptNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Escrow info banner ───────────────────────────────────────── */}
        {['in_escrow', 'in_progress', 'completed'].includes(tx.status) && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200
                          rounded-2xl p-4 flex items-start gap-3 animate-fade-in-up delay-150 animate-glow">
            <div className="w-10 h-10 bg-mpesa-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-mpesa-green" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-mpesa-green text-sm">Funds Secured in Escrow 🔒</p>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                KES {tx.amount?.toLocaleString()} is held securely and will only be released after you confirm the work is done.
              </p>
              {tx.autoReleaseAt && (
                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Auto-releases: {new Date(tx.autoReleaseAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Seller note ─────────────────────────────────────────────── */}
        {tx.sellerNote && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 animate-fade-in-up">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Seller's Note</p>
            <p className="text-sm text-gray-700">{tx.sellerNote}</p>
          </div>
        )}

        {/* ── Action cards ────────────────────────────────────────────── */}

        {/* Seller: mark done */}
        {isSeller && ['in_escrow', 'in_progress'].includes(tx.status) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-mpesa-green/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-mpesa-green" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mark Work as Done</h3>
                <p className="text-xs text-gray-500">Notify the buyer that you've completed the work</p>
              </div>
            </div>
            <textarea value={sellerNote} onChange={e => setSellerNote(e.target.value)}
              placeholder="Add a delivery note for the buyer (optional)..."
              rows={3} className="input resize-none mb-3 text-sm" />
            <button onClick={markDone} disabled={actionLoading === 'done'}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
              {actionLoading === 'done' ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Submitting...</>
              ) : (
                <><CheckCircle className="w-4 h-4" /> Mark as Completed</>
              )}
            </button>
          </div>
        )}

        {/* Buyer: confirm or dispute */}
        {isBuyer && tx.status === 'completed' && (
          <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Work Delivered!</h3>
                <p className="text-xs text-gray-500">Review the work and release payment or raise a dispute</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={confirmRelease} disabled={actionLoading === 'confirm'}
                className="btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                {actionLoading === 'confirm' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : <CheckCircle className="w-4 h-4" />}
                Confirm & Release
              </button>
              <button onClick={raiseDispute} disabled={actionLoading === 'dispute'}
                className="py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-sm
                           hover:bg-red-50 transition-all duration-200 flex items-center justify-center gap-2
                           active:scale-95 disabled:opacity-60">
                <AlertTriangle className="w-4 h-4" />
                Dispute
              </button>
            </div>
          </div>
        )}

        {/* Buyer: rate after release */}
        {isBuyer && tx.status === 'released' && !rated && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Rate this Service</h3>
                <p className="text-xs text-gray-500">Help others by sharing your experience</p>
              </div>
            </div>
            {/* Star picker */}
            <div className="flex gap-2 mb-4 justify-center">
              {[1,2,3,4,5].map(n => (
                <button key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-all duration-150 active:scale-90">
                  <Star className={`w-9 h-9 transition-all duration-150 ${
                    n <= (hoverRating || rating)
                      ? 'text-amber-400 fill-amber-400 scale-110'
                      : 'text-gray-200 fill-gray-200'
                  }`} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm font-medium text-amber-600 mb-3">
                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
              </p>
            )}
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Share your experience (optional)..."
              rows={2} className="input resize-none mb-3 text-sm" />
            <button onClick={submitRating} disabled={actionLoading === 'rate'}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
              {actionLoading === 'rate' ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Submitting...</>
              ) : (
                <><Star className="w-4 h-4" /> Submit Rating</>
              )}
            </button>
          </div>
        )}

        {/* Released success */}
        {tx.status === 'released' && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200
                          rounded-2xl p-6 text-center animate-scale-in">
            <div className="w-16 h-16 bg-mpesa-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-9 h-9 text-mpesa-green" />
            </div>
            <p className="font-bold text-mpesa-green text-lg">Transaction Complete!</p>
            <p className="text-sm text-gray-500 mt-1">
              KES {tx.sellerAmount?.toLocaleString()} has been released to {tx.seller?.name}.
            </p>
            <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-mpesa-green
                                          font-medium hover:underline mt-3">
              View all orders →
            </Link>
          </div>
        )}

        {/* Disputed */}
        {tx.status === 'disputed' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 animate-scale-in">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-red-700">Dispute Active</p>
                <p className="text-sm text-gray-600 mt-0.5">
                  Funds are locked securely. Our team will review and resolve this dispute.
                </p>
                {tx.disputeReason && (
                  <p className="text-xs text-gray-500 mt-1.5 bg-white/60 rounded-lg px-2 py-1">
                    Reason: {tx.disputeReason}
                  </p>
                )}
              </div>
            </div>
            {isBuyer && (
              <button onClick={requestRefund} disabled={actionLoading === 'refund'}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl
                           transition-all duration-200 flex items-center justify-center gap-2
                           active:scale-95 disabled:opacity-60 shadow-sm hover:shadow-md">
                {actionLoading === 'refund' ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4" /> Request Refund (M-Pesa Reversal)</>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
