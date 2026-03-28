import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import {
  User, Phone, Star, Briefcase, ShieldCheck, Save, Edit3,
  Wallet, Calendar, Award, ChevronRight, Zap, CheckCircle,
} from 'lucide-react';

const SKILL_OPTIONS = [
  { name: 'Design',      emoji: '🎨' },
  { name: 'Coding',      emoji: '💻' },
  { name: 'Writing',     emoji: '✍️' },
  { name: 'Marketing',   emoji: '📣' },
  { name: 'Video Editing', emoji: '🎬' },
  { name: 'Music',       emoji: '🎵' },
  { name: 'Translation', emoji: '🌍' },
  { name: 'Data Entry',  emoji: '📊' },
  { name: 'Social Media', emoji: '📱' },
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    role: user?.role || 'both',
  });
  const [loading, setLoading] = useState(false);

  const toggleSkill = (s) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '', skills: user?.skills || [], role: user?.role || 'both' });
    setEditing(false);
  };

  const ratingStars = Math.round(user?.rating || 0);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">

      {/* ── Hero banner ─────────────────────────────────────────────── */}
      <div className="bg-animated text-white px-4 pt-10 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-4 right-16 w-40 h-40 bg-white rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-8 w-56 h-56 bg-mpesa-green rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="max-w-2xl mx-auto relative z-10 flex items-center justify-between">
          <p className="text-emerald-300 text-sm font-medium flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> My Profile
          </p>
          <button
            onClick={() => editing ? handleCancel() : setEditing(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
              transition-all duration-200 active:scale-95 ${
              editing
                ? 'bg-white/20 text-white hover:bg-white/30'
                : 'bg-white text-mpesa-green hover:bg-gray-50 shadow-sm'
            }`}>
            <Edit3 className="w-3.5 h-3.5" />
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-10 space-y-4">

        {/* ── Avatar card ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 animate-scale-in">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-mpesa-green to-emerald-600
                              rounded-2xl flex items-center justify-center text-white text-3xl font-extrabold
                              shadow-lg shadow-mpesa-green/30 animate-float">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              {user?.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-mpesa-green rounded-full
                                flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                {user?.isVerified && (
                  <span className="badge bg-mpesa-green/10 text-mpesa-green text-xs">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>

              {/* Stars */}
              <div className="flex items-center gap-1 mt-2">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} className={`w-4 h-4 ${n <= ratingStars ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                ))}
                <span className="text-sm font-semibold text-gray-700 ml-1">{user?.rating?.toFixed(1) || '0.0'}</span>
                <span className="text-xs text-gray-400">({user?.totalRatings || 0} reviews)</span>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-4 mt-2.5">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Briefcase className="w-3.5 h-3.5 text-mpesa-green" />
                  {user?.jobsCompleted || 0} jobs
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet strip */}
          <div className="mt-5 bg-gradient-to-r from-mpesa-green/5 to-emerald-50
                          border border-mpesa-green/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-mpesa-green/10 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-mpesa-green" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Wallet Balance</p>
                <p className="text-xl font-extrabold text-mpesa-green">
                  KES {(user?.walletBalance || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <Link to="/dashboard"
              className="flex items-center gap-1 text-xs text-mpesa-green font-semibold hover:underline">
              Dashboard <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── Edit form ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up delay-100">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <Award className="w-4 h-4 text-mpesa-green" />
            <h3 className="font-semibold text-gray-900 text-sm">Profile Details</h3>
            {editing && <span className="badge bg-mpesa-green/10 text-mpesa-green ml-auto">Editing</span>}
          </div>

          <div className="p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400
                                 group-focus-within:text-mpesa-green transition-colors" />
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  disabled={!editing}
                  className="input pl-10 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-default" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">M-Pesa Phone</label>
              <div className="relative group">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400
                                  group-focus-within:text-mpesa-green transition-colors" />
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  disabled={!editing} placeholder="251777564882"
                  className="input pl-10 disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-default" />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Bio</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                disabled={!editing} rows={3}
                placeholder={editing ? 'Tell buyers about yourself...' : 'No bio yet'}
                className="input resize-none disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-default" />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Account Role</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'buyer',  label: 'Buyer',     desc: 'Hire talent' },
                  { key: 'seller', label: 'Seller',    desc: 'Offer services' },
                  { key: 'both',   label: 'Both',      desc: 'Buy & sell' },
                ].map(({ key, label, desc }) => (
                  <button key={key} type="button" disabled={!editing}
                    onClick={() => setForm({ ...form, role: key })}
                    className={`py-3 rounded-xl border-2 transition-all duration-200 text-center
                      disabled:cursor-default ${
                      form.role === key
                        ? 'border-mpesa-green bg-mpesa-green/5 text-mpesa-green'
                        : 'border-gray-100 text-gray-600 bg-gray-50 hover:border-mpesa-green/40'
                    }`}>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Skills
                {form.skills.length > 0 && (
                  <span className="ml-2 badge bg-mpesa-green/10 text-mpesa-green normal-case font-medium">
                    {form.skills.length} selected
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map(({ name, emoji }) => (
                  <button key={name} type="button" disabled={!editing}
                    onClick={() => toggleSkill(name)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200
                      flex items-center gap-1.5 disabled:cursor-default active:scale-95 ${
                      form.skills.includes(name)
                        ? 'bg-mpesa-green text-white border-mpesa-green shadow-sm'
                        : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-mpesa-green/40'
                    }`}>
                    <span>{emoji}</span> {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Save button */}
            {editing && (
              <button onClick={handleSave} disabled={loading}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
                {loading ? (
                  <><span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" /></>
                ) : (
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ── Quick links ─────────────────────────────────────────────── */}
        {!editing && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up delay-200">
            {[
              { to: '/dashboard', icon: Zap,      label: 'Seller Dashboard',  desc: 'Earnings, jobs & services' },
              { to: '/orders',    icon: Briefcase, label: 'My Orders',         desc: 'Buying & selling history' },
              { to: '/post-service', icon: CheckCircle, label: 'Post a Service', desc: 'Start earning today' },
            ].map(({ to, icon: Icon, label, desc }, i) => (
              <Link key={to} to={to}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group
                  ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                <div className="w-9 h-9 bg-mpesa-green/10 rounded-xl flex items-center justify-center flex-shrink-0
                                group-hover:bg-mpesa-green/20 transition-colors">
                  <Icon className="w-4 h-4 text-mpesa-green" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-mpesa-green group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
