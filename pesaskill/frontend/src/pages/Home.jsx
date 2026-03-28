import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, Shield, Star, TrendingUp, ArrowRight, Users, DollarSign, Sparkles } from 'lucide-react';
import api from '../lib/api';
import ServiceCard from '../components/ServiceCard';

const CATEGORIES = ['All', 'Design', 'Coding', 'Writing', 'Marketing', 'Video', 'Music', 'Business', 'Other'];

const TRUST_ITEMS = [
  { icon: Shield,     label: 'Escrow Protection' },
  { icon: Star,       label: 'Verified Reviews' },
  { icon: Zap,        label: 'Instant M-Pesa' },
  { icon: TrendingUp, label: 'AI Matching' },
  { icon: Users,      label: '10,000+ Freelancers' },
];

export default function Home() {
  const [services, setServices] = useState([]);
  const [trending, setTrending] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('createdAt');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Trigger hero animation after mount
    const t = setTimeout(() => setHeroVisible(true), 50);
    api.get('/services/trending').then(r => setTrending(r.data)).catch(() => {});
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/services', { params: { category, search, sort, page, limit: 12 } })
      .then(r => { setServices(r.data.services); setTotalPages(r.data.pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search, sort, page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); };

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="text-white py-24 px-4 relative overflow-hidden min-h-[520px] flex items-center">

        {/* HUD background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hud-bg.jpg"
            alt=""
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.35) saturate(1.4) hue-rotate(140deg)' }}
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          {/* Green tint overlay */}
          <div className="absolute inset-0 bg-mpesa-green/10 mix-blend-color" />
        </div>

        {/* Animated scan line effect */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute w-full h-px bg-mpesa-green/20 animate-[scanline_4s_linear_infinite]"
            style={{ top: '30%' }} />
          <div className="absolute w-full h-px bg-mpesa-green/10 animate-[scanline_6s_linear_infinite]"
            style={{ top: '60%', animationDelay: '2s' }} />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-mpesa-green/10 rounded-full blur-3xl animate-float pointer-events-none z-0" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-float pointer-events-none z-0" style={{ animationDelay: '1.5s' }} />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — text content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className={`transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="inline-flex items-center gap-2 bg-mpesa-green/20 border border-mpesa-green/40
                                text-mpesa-green px-4 py-1.5 rounded-full text-sm font-medium mb-6
                                hover:bg-mpesa-green/30 transition-colors cursor-default backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                  Powered by M-Pesa Escrow
                </div>
              </div>

              {/* Headline */}
              <div className={`transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                  Turn Your Skills Into<br />
                  <span className="text-shimmer">Real Income</span>
                </h1>
              </div>

              {/* Subtitle */}
              <div className={`transition-all duration-700 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  The trusted marketplace for students and freelancers in East Africa.
                  Secure payments via M-Pesa escrow — get paid when work is done.
                </p>
              </div>

              {/* Search bar */}
              <div className={`transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto lg:mx-0 mb-8 group">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400
                                       group-focus-within:text-mpesa-green transition-colors" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search services..."
                      className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none
                                 focus:ring-2 focus:ring-mpesa-green shadow-lg backdrop-blur-sm
                                 transition-all duration-200 focus:shadow-mpesa-green/20 focus:shadow-xl"
                    />
                  </div>
                  <button type="submit"
                    className="btn-primary px-6 py-4 text-base shadow-lg hover:shadow-mpesa-green/30">
                    Search
                  </button>
                </form>
              </div>

              {/* Stats row */}
              <div className={`flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-400
                transition-all duration-700 delay-400 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {[
                  { icon: Users,      label: '10,000+ Freelancers' },
                  { icon: Shield,     label: 'Escrow Protected' },
                  { icon: DollarSign, label: 'M-Pesa Payments' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 hover:text-mpesa-green transition-colors cursor-default">
                    <Icon className="w-4 h-4 text-mpesa-green" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — HUD preview panel */}
            <div className={`hidden lg:block transition-all duration-1000 delay-500
              ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="relative">
                {/* Glowing border frame */}
                <div className="absolute -inset-1 bg-gradient-to-r from-mpesa-green via-emerald-400 to-mpesa-green
                                rounded-2xl blur-sm opacity-60 animate-pulse" />
                <div className="relative bg-black/60 backdrop-blur-md rounded-2xl border border-mpesa-green/40
                                overflow-hidden shadow-2xl shadow-mpesa-green/20">
                  <img
                    src="/hud-bg.jpg"
                    alt="PesaSkill AI Dashboard"
                    className="w-full h-72 object-cover object-center rounded-2xl"
                    style={{ filter: 'brightness(0.7) saturate(1.6) hue-rotate(140deg)' }}
                  />
                  {/* Overlay stats on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-2xl" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Active Jobs',  value: '2,847', color: 'text-mpesa-green' },
                        { label: 'Paid Out',     value: 'KES 4.2M', color: 'text-emerald-400' },
                        { label: 'Avg Rating',   value: '4.8 ⭐', color: 'text-amber-400' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="bg-black/50 backdrop-blur-sm rounded-xl p-2.5 border border-mpesa-green/20 text-center">
                          <p className={`text-sm font-bold ${color}`}>{value}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Corner decorations */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-mpesa-green rounded-tl-sm" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-mpesa-green rounded-tr-sm" />
                  <div className="absolute bottom-16 left-3 w-4 h-4 border-b-2 border-l-2 border-mpesa-green rounded-bl-sm" />
                  <div className="absolute bottom-16 right-3 w-4 h-4 border-b-2 border-r-2 border-mpesa-green rounded-br-sm" />
                </div>
                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 bg-mpesa-green text-white text-xs font-bold
                                px-3 py-1.5 rounded-full shadow-lg animate-bounce">
                  LIVE 🟢
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Scrolling trust bar ──────────────────────────────────────────── */}
      <section className="bg-mpesa-green py-3 overflow-hidden">
        <div className="flex gap-12 animate-[shimmer_0s_linear_infinite]"
          style={{ animation: 'none' }}>
          <div className="flex gap-12 items-center whitespace-nowrap
                          animate-[marquee_20s_linear_infinite]"
            style={{ animation: 'marquee 20s linear infinite' }}>
            {[...TRUST_ITEMS, ...TRUST_ITEMS].map(({ icon: Icon, label }, i) => (
              <span key={i} className="flex items-center gap-2 text-white text-sm font-medium
                                       hover:text-emerald-100 transition-colors cursor-default">
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* ── Trending ─────────────────────────────────────────────────── */}
        {trending.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6 animate-fade-in-left">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-mpesa-green" />
                  Trending Services
                </h2>
                <p className="text-gray-500 text-sm mt-1">Most popular this week</p>
              </div>
              <Link to="/" className="text-sm text-mpesa-green font-medium hover:underline
                                      flex items-center gap-1 group">
                View all
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trending.map((s, i) => (
                <ServiceCard key={s._id} service={s} featured index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── Filters ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c, i) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setPage(1); }}
                style={{ animationDelay: `${i * 30}ms` }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  active:scale-95 ${
                  category === c
                    ? 'bg-mpesa-green text-white shadow-sm shadow-mpesa-green/30 scale-105'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-mpesa-green hover:text-mpesa-green hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="input sm:w-44 text-sm cursor-pointer hover:border-mpesa-green transition-colors"
          >
            <option value="createdAt">Newest</option>
            <option value="rating">Top Rated</option>
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low</option>
            <option value="price_desc">Price: High</option>
          </select>
        </div>

        {/* ── Services grid ────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card p-5 overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="h-1.5 skeleton mb-4 -mx-5 -mt-5 rounded-none" />
                <div className="h-4 skeleton mb-3 w-1/3" />
                <div className="h-5 skeleton mb-2" />
                <div className="h-4 skeleton mb-1 w-3/4" />
                <div className="h-4 skeleton mb-4 w-1/2" />
                <div className="h-8 skeleton rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 animate-scale-in">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 text-lg mb-4">No services found.</p>
            <Link to="/post-service" className="btn-primary inline-flex items-center gap-2">
              Post the first one <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {services.map((s, i) => (
                <ServiceCard key={s._id} service={s} index={i} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10 animate-fade-in-up">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200
                      active:scale-90 ${
                      page === i + 1
                        ? 'bg-mpesa-green text-white shadow-sm shadow-mpesa-green/30 scale-110'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-mpesa-green hover:text-mpesa-green hover:-translate-y-0.5'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 px-4 mt-8">
        <div className="absolute inset-0 bg-gradient-to-r from-mpesa-green via-emerald-500 to-mpesa-green
                        bg-[length:200%_100%] animate-[shimmer_4s_linear_infinite]" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float"
          style={{ animationDelay: '1s' }} />

        <div className="max-w-3xl mx-auto text-center text-white relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
            Ready to earn with your skills?
          </h2>
          <p className="text-emerald-100 mb-8 text-lg animate-fade-in-up delay-100">
            Join thousands of students already earning via M-Pesa on PesaSkill.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-mpesa-green font-bold
                       px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200
                       shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95
                       animate-fade-in-up delay-200"
          >
            Start Earning Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Marquee keyframe injected inline */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
