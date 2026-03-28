import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Zap, User, Mail, Lock, Phone, Eye, EyeOff, X } from 'lucide-react';

const SKILL_OPTIONS = ['Design', 'Coding', 'Writing', 'Marketing', 'Video Editing', 'Music', 'Translation', 'Data Entry', 'Social Media'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'both', skills: [] });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (s) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to PesaSkill 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12
                    bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-56 h-56 bg-mpesa-green/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '1.2s' }} />

      <div className="w-full max-w-lg animate-scale-in">
        <div className="card p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-mpesa-green rounded-2xl flex items-center justify-center
                            mx-auto mb-4 shadow-lg shadow-mpesa-green/30 animate-float">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Join PesaSkill</h1>
            <p className="text-gray-500 mt-1">Start earning with your skills today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1 animate-fade-in-left delay-100">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-mpesa-green transition-colors" />
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name" className="input pl-10" />
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 animate-fade-in-right delay-100">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (M-Pesa)</label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-mpesa-green transition-colors" />
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="251777564882" className="input pl-10" />
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up delay-150">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-mpesa-green transition-colors" />
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" className="input pl-10" />
              </div>
            </div>

            <div className="animate-fade-in-up delay-200">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-mpesa-green transition-colors" />
                <input type={show ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-mpesa-green transition-colors active:scale-90">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="animate-fade-in-up delay-250">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">I want to</label>
              <div className="grid grid-cols-3 gap-2">
                {['buyer', 'seller', 'both'].map(r => (
                  <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                    className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200
                      capitalize active:scale-95 ${
                      form.role === r
                        ? 'border-mpesa-green bg-mpesa-green/5 text-mpesa-green scale-105 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-mpesa-green/50 hover:-translate-y-0.5'
                    }`}>
                    {r === 'both' ? 'Buy & Sell' : r === 'buyer' ? 'Buy Services' : 'Sell Services'}
                  </button>
                ))}
              </div>
            </div>

            <div className="animate-fade-in-up delay-300">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Skills (optional)</label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((s, i) => (
                  <button key={s} type="button" onClick={() => toggleSkill(s)}
                    style={{ animationDelay: `${i * 30}ms` }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
                      active:scale-90 ${
                      form.skills.includes(s)
                        ? 'bg-mpesa-green text-white border-mpesa-green scale-105 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-mpesa-green hover:-translate-y-0.5'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="animate-fade-in-up delay-400">
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 mt-2 disabled:opacity-60 text-base">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading-dot" />
                    <span className="loading-dot" />
                    <span className="loading-dot" />
                  </span>
                ) : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6 animate-fade-in-up delay-500">
            Already have an account?{' '}
            <Link to="/login" className="text-mpesa-green font-semibold hover:underline transition-all hover:tracking-wide">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
