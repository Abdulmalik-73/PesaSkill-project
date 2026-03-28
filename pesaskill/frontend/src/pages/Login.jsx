import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12
                    bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 left-10 w-48 h-48 bg-mpesa-green/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md animate-scale-in">
        <div className="card p-8 shadow-xl border-gray-100">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-mpesa-green rounded-2xl flex items-center justify-center
                            mx-auto mb-4 shadow-lg shadow-mpesa-green/30 animate-float">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 mt-1">Sign in to your PesaSkill account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-fade-in-up delay-100">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400
                                 group-focus-within:text-mpesa-green transition-colors" />
                <input type="email" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" className="input pl-10" />
              </div>
            </div>

            <div className="animate-fade-in-up delay-200">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400
                                 group-focus-within:text-mpesa-green transition-colors" />
                <input type={show ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-mpesa-green transition-colors active:scale-90">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="animate-fade-in-up delay-300">
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 mt-2 disabled:opacity-60 text-base">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading-dot" />
                    <span className="loading-dot" />
                    <span className="loading-dot" />
                  </span>
                ) : 'Sign In'}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6 animate-fade-in-up delay-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-mpesa-green font-semibold hover:underline
                                            transition-all hover:tracking-wide">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
