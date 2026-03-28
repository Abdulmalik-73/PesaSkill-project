import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Heart, ExternalLink } from 'lucide-react';

/* ── Social icons as inline SVGs (no extra deps) ─────────────────── */
function TwitterX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function Facebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function Instagram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
function LinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function YouTube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
function WhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
function Telegram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

const SOCIAL = [
  { label: 'X (Twitter)', href: 'https://twitter.com/pesaskill',   icon: TwitterX,  color: 'hover:bg-black hover:text-white' },
  { label: 'Facebook',    href: 'https://facebook.com/pesaskill',  icon: Facebook,  color: 'hover:bg-blue-600 hover:text-white' },
  { label: 'Instagram',   href: 'https://instagram.com/pesaskill', icon: Instagram, color: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white' },
  { label: 'LinkedIn',    href: 'https://linkedin.com/company/pesaskill', icon: LinkedIn, color: 'hover:bg-blue-700 hover:text-white' },
  { label: 'YouTube',     href: 'https://youtube.com/@pesaskill',  icon: YouTube,   color: 'hover:bg-red-600 hover:text-white' },
  { label: 'WhatsApp',    href: 'https://wa.me/251777564882',       icon: WhatsApp,  color: 'hover:bg-green-500 hover:text-white' },
  { label: 'Telegram',    href: 'https://t.me/pesaskill',          icon: Telegram,  color: 'hover:bg-sky-500 hover:text-white' },
];

const LINKS = {
  Platform: [
    { label: '🏠 Browse Services', to: '/' },
    { label: '➕ Post a Service',  to: '/post-service' },
    { label: '📊 Dashboard',       to: '/dashboard' },
    { label: '💳 My Orders',       to: '/orders' },
    { label: '👤 Profile',         to: '/profile' },
  ],
  Company: [
    { label: 'About PesaSkill',  href: '#' },
    { label: 'How It Works',     href: '#' },
    { label: 'Pricing',          href: '#' },
    { label: 'Blog',             href: '#' },
    { label: 'Careers',          href: '#' },
  ],
  Support: [
    { label: 'Help Center',      href: '#' },
    { label: 'Contact Us',       href: '#' },
    { label: 'Dispute Policy',   href: '#' },
    { label: 'Privacy Policy',   href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-0">

      {/* ── Newsletter strip ──────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-mpesa-green via-emerald-500 to-mpesa-green
                      bg-[length:200%_100%] animate-[shimmer_6s_linear_infinite]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-bold text-lg">Stay in the loop 📬</h3>
              <p className="text-emerald-100 text-sm mt-0.5">
                Get notified about new services, tips, and M-Pesa updates.
              </p>
            </div>
            <form className="flex gap-2 w-full sm:w-auto" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl text-gray-900 text-sm
                           focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/95"
              />
              <button type="submit"
                className="bg-white text-mpesa-green font-semibold px-5 py-2.5 rounded-xl
                           text-sm hover:bg-gray-50 transition-colors active:scale-95 whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Main footer body ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group mb-4 w-fit">
              <div className="w-10 h-10 bg-mpesa-green rounded-xl flex items-center justify-center
                              shadow-lg shadow-mpesa-green/30 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Pesa<span className="text-mpesa-green">Skill</span>
                </span>
                <p className="text-[10px] text-gray-500 -mt-0.5 tracking-wide">Skills → Income</p>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
              The trusted marketplace for students and freelancers in East Africa.
              Secure payments via M-Pesa escrow — get paid when work is done.
            </p>

            {/* Social icons */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Follow Us
              </p>
              <div className="flex flex-wrap gap-2">
                {SOCIAL.map(({ label, href, icon: Icon, color }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    title={label}
                    className={`w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center
                                text-gray-400 border border-gray-700/50
                                transition-all duration-200 hover:scale-110 hover:border-transparent
                                active:scale-90 ${color}`}>
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-2">
              <a href="mailto:hello@pesaskill.com"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-mpesa-green transition-colors group">
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                hello@pesaskill.com
              </a>
              <a href="tel:+251777564882"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-mpesa-green transition-colors group">
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                +251 777 564 882
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Addis Ababa, Ethiopia 🇪🇹
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-mpesa-green rounded-full inline-block" />
                {section}
              </h4>
              <ul className="space-y-2.5">
                {items.map(({ label, to, href }) => (
                  <li key={label}>
                    {to ? (
                      <Link to={to}
                        className="text-sm text-gray-400 hover:text-mpesa-green transition-colors
                                   duration-150 flex items-center gap-1.5 group">
                        <span className="w-0 group-hover:w-2 h-0.5 bg-mpesa-green rounded-full
                                         transition-all duration-200 overflow-hidden" />
                        {label}
                      </Link>
                    ) : (
                      <a href={href}
                        className="text-sm text-gray-400 hover:text-mpesa-green transition-colors
                                   duration-150 flex items-center gap-1.5 group">
                        <span className="w-0 group-hover:w-2 h-0.5 bg-mpesa-green rounded-full
                                         transition-all duration-200 overflow-hidden" />
                        {label}
                        {href !== '#' && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trust badges ──────────────────────────────────────────── */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap justify-center gap-4 mb-5">
            {[
              { icon: '🔒', label: 'Escrow Protected' },
              { icon: '📱', label: 'M-Pesa Powered' },
              { icon: '⭐', label: 'Verified Reviews' },
              { icon: '🤖', label: 'AI Matching' },
              { icon: '🌍', label: 'East Africa Focus' },
              { icon: '💸', label: '5% Platform Fee' },
            ].map(({ icon, label }) => (
              <div key={label}
                className="flex items-center gap-1.5 bg-gray-800/60 border border-gray-700/50
                           px-3 py-1.5 rounded-full text-xs text-gray-400
                           hover:border-mpesa-green/40 hover:text-mpesa-green transition-all duration-200 cursor-default">
                <span>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────── */}
      <div className="border-t border-gray-800/60 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>
              © {year} PesaSkill. Made with{' '}
              <Heart className="w-3 h-3 text-red-500 fill-red-500 inline mx-0.5" />
              for East African students.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-mpesa-green transition-colors">Privacy</a>
              <a href="#" className="hover:text-mpesa-green transition-colors">Terms</a>
              <a href="#" className="hover:text-mpesa-green transition-colors">Cookies</a>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-mpesa-green rounded-full animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
