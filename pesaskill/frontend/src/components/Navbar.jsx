import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu, X, Zap, User, LogOut, LayoutDashboard,
  PlusCircle, ShoppingBag, Home, CreditCard, ChevronDown,
  Bell, Wallet, Star,
} from 'lucide-react';

/* ── Page nav items (always visible in header) ─────────────────── */
const NAV_PAGES = [
  { to: '/',             label: 'Home',        icon: Home,          emoji: '🏠' },
  { to: '/post-service', label: 'Post Service', icon: PlusCircle,   emoji: '➕', authOnly: true },
  { to: '/dashboard',    label: 'Dashboard',   icon: LayoutDashboard, emoji: '📊', authOnly: true },
  { to: '/orders',       label: 'Orders',      icon: ShoppingBag,   emoji: '💳', authOnly: true },
  { to: '/profile',      label: 'Profile',     icon: User,          emoji: '👤', authOnly: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen]       = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setDropOpen(false); setOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (p) => location.pathname === p;

  const visiblePages = NAV_PAGES.filter(p => !p.authOnly || user);

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/96 backdrop-blur-lg shadow-lg border-b border-gray-100'
          : 'bg-white border-b border-gray-100 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ──────────────────────────────────────────── */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 bg-mpesa-green rounded-xl flex items-center justify-center
                              shadow-sm shadow-mpesa-green/30 group-hover:scale-110 group-hover:rotate-3
                              transition-all duration-300 animate-float">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-extrabold text-gray-900 tracking-tight leading-none">
                  Pesa<span className="text-shimmer">Skill</span>
                </span>
                <p className="text-[10px] text-gray-400 font-medium -mt-0.5 tracking-wide">
                  Skills → Income
                </p>
              </div>
            </Link>

            {/* ── Desktop page nav ──────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {visiblePages.map(({ to, label, icon: Icon, emoji }) => {
                const active = isActive(to);
                return (
                  <Link key={to} to={to}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm
                      font-medium transition-all duration-200 group ${
                      active
                        ? 'text-mpesa-green bg-mpesa-green/8'
                        : 'text-gray-600 hover:text-mpesa-green hover:bg-gray-50'
                    }`}>
                    <span className="text-base leading-none">{emoji}</span>
                    <span>{label}</span>
                    {/* Active underline */}
                    {active && (
                      <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5
                                       bg-mpesa-green rounded-full animate-scale-in" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── Right side ────────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  {/* Wallet chip */}
                  <Link to="/dashboard"
                    className="hidden lg:flex items-center gap-1.5 bg-mpesa-green/8 hover:bg-mpesa-green/15
                               text-mpesa-green px-3 py-1.5 rounded-xl text-xs font-semibold
                               transition-all duration-200 border border-mpesa-green/20 hover:border-mpesa-green/40">
                    <Wallet className="w-3.5 h-3.5" />
                    KES {(user.walletBalance || 0).toLocaleString()}
                  </Link>

                  {/* Post Service CTA */}
                  <Link to="/post-service"
                    className="hidden lg:flex items-center gap-1.5 btn-primary text-xs py-2 px-3.5">
                    <PlusCircle className="w-3.5 h-3.5" />
                    Sell
                  </Link>

                  {/* User dropdown */}
                  <div className="relative">
                    <button onClick={() => setDropOpen(!dropOpen)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl
                        transition-all duration-200 border ${
                        dropOpen
                          ? 'bg-mpesa-green/8 border-mpesa-green/30 ring-2 ring-mpesa-green/20'
                          : 'bg-gray-50 border-gray-200 hover:border-mpesa-green/40 hover:bg-gray-100'
                      }`}>
                      {/* Avatar */}
                      <div className="w-7 h-7 bg-gradient-to-br from-mpesa-green to-emerald-600
                                      rounded-full flex items-center justify-center text-white
                                      text-xs font-bold shadow-sm flex-shrink-0">
                        {user.name[0].toUpperCase()}
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-xs font-semibold text-gray-800 leading-none">
                          {user.name.split(' ')[0]}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{user.role}</p>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200
                        ${dropOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {dropOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl
                                      border border-gray-100 py-2 z-50 animate-slide-menu origin-top-right">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-mpesa-green to-emerald-600
                                            rounded-xl flex items-center justify-center text-white font-bold text-sm">
                              {user.name[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                              <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                          </div>
                          {/* Mini stats */}
                          <div className="flex gap-3 mt-2.5 pt-2.5 border-t border-gray-50">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              {user.rating?.toFixed(1) || '0.0'}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Wallet className="w-3 h-3 text-mpesa-green" />
                              KES {(user.walletBalance || 0).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Nav items — all 5 pages */}
                        <div className="py-1">
                          {[
                            { to: '/',             icon: Home,            label: 'Home',         desc: 'Browse services',   emoji: '🏠' },
                            { to: '/post-service', icon: PlusCircle,      label: 'Post Service', desc: 'List your skill',   emoji: '➕' },
                            { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard',    desc: 'Earnings & jobs',   emoji: '📊' },
                            { to: '/orders',       icon: ShoppingBag,     label: 'Orders',       desc: 'Payment history',   emoji: '💳' },
                            { to: '/profile',      icon: User,            label: 'Profile',      desc: 'Rating & skills',   emoji: '👤' },
                          ].map(({ to, icon: Icon, label, desc, emoji }) => (
                            <Link key={to} to={to}
                              className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-150 group ${
                                isActive(to)
                                  ? 'bg-mpesa-green/5 text-mpesa-green'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-mpesa-green'
                              }`}>
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm
                                flex-shrink-0 transition-colors ${
                                isActive(to) ? 'bg-mpesa-green/10' : 'bg-gray-100 group-hover:bg-mpesa-green/10'
                              }`}>
                                {emoji}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium leading-none">{label}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                              </div>
                              {isActive(to) && (
                                <div className="ml-auto w-1.5 h-1.5 bg-mpesa-green rounded-full" />
                              )}
                            </Link>
                          ))}
                        </div>

                        <hr className="my-1 border-gray-100" />
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500
                                     hover:bg-red-50 w-full transition-all duration-150 group">
                          <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center
                                          group-hover:bg-red-100 transition-colors flex-shrink-0">
                            <LogOut className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                  <Link to="/register"
                    className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* ── Mobile toggle ─────────────────────────────────── */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors active:scale-90"
              onClick={() => setOpen(!open)}>
              <div className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>
                {open ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
              </div>
            </button>
          </div>
        </div>

        {/* ── Page indicator strip ──────────────────────────────── */}
        <div className="hidden lg:block border-t border-gray-50 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 h-9 overflow-x-auto scrollbar-hide">
              {visiblePages.map(({ to, label, emoji }) => {
                const active = isActive(to);
                return (
                  <Link key={to} to={to}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium
                      whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                      active
                        ? 'bg-mpesa-green text-white shadow-sm'
                        : 'text-gray-500 hover:text-mpesa-green hover:bg-white hover:shadow-sm'
                    }`}>
                    <span>{emoji}</span>
                    {label}
                  </Link>
                );
              })}
              <div className="ml-auto flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
                <span className="w-1.5 h-1.5 bg-mpesa-green rounded-full animate-pulse" />
                M-Pesa Escrow Protected
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu ───────────────────────────────────────────── */}
      <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`} onClick={() => setOpen(false)} />

        {/* Drawer */}
        <div className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl
                         transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Drawer header */}
          <div className="bg-animated text-white px-5 pt-12 pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg">PesaSkill</span>
              </div>
              <button onClick={() => setOpen(false)}
                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center
                           hover:bg-white/20 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center
                                text-white font-bold text-lg">
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-emerald-200 text-xs">{user.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-emerald-200 text-sm">Sign in to start earning</p>
            )}
          </div>

          {/* Drawer nav — all 5 pages */}
          <div className="px-3 py-4 space-y-1 overflow-y-auto">
            {[
              { to: '/',             label: 'Home',         desc: 'Browse services',   emoji: '🏠' },
              { to: '/post-service', label: 'Post Service', desc: 'List your skill',   emoji: '➕', authOnly: true },
              { to: '/dashboard',    label: 'Dashboard',    desc: 'Earnings & jobs',   emoji: '📊', authOnly: true },
              { to: '/orders',       label: 'Orders',       desc: 'Payment history',   emoji: '💳', authOnly: true },
              { to: '/profile',      label: 'Profile',      desc: 'Rating & skills',   emoji: '👤', authOnly: true },
            ].filter(p => !p.authOnly || user).map(({ to, label, desc, emoji }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 ${
                  isActive(to)
                    ? 'bg-mpesa-green/10 text-mpesa-green'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                  isActive(to) ? 'bg-mpesa-green/15' : 'bg-gray-100'
                }`}>
                  {emoji}
                </div>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                {isActive(to) && <div className="ml-auto w-2 h-2 bg-mpesa-green rounded-full" />}
              </Link>
            ))}
          </div>

          {/* Drawer footer */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-6 pt-3 border-t border-gray-100 bg-white">
            {user ? (
              <>
                <div className="flex items-center justify-between bg-mpesa-green/5 rounded-xl px-3 py-2.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Wallet className="w-3.5 h-3.5 text-mpesa-green" />
                    Wallet Balance
                  </div>
                  <span className="text-sm font-bold text-mpesa-green">
                    KES {(user.walletBalance || 0).toLocaleString()}
                  </span>
                </div>
                <button onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                             text-sm font-semibold text-red-500 border border-red-100
                             hover:bg-red-50 transition-colors active:scale-95">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary flex-1 text-center text-sm py-2.5">Login</Link>
                <Link to="/register" className="btn-primary flex-1 text-center text-sm py-2.5">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
