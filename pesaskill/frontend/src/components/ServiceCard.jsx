import { Link } from 'react-router-dom';
import { Star, ShieldCheck, TrendingUp, ArrowUpRight } from 'lucide-react';

const categoryColors = {
  Design:    { badge: 'bg-purple-100 text-purple-700', bar: 'from-purple-400 to-purple-600' },
  Coding:    { badge: 'bg-blue-100 text-blue-700',     bar: 'from-blue-400 to-blue-600' },
  Writing:   { badge: 'bg-yellow-100 text-yellow-700', bar: 'from-yellow-400 to-yellow-500' },
  Marketing: { badge: 'bg-pink-100 text-pink-700',     bar: 'from-pink-400 to-pink-600' },
  Video:     { badge: 'bg-red-100 text-red-700',       bar: 'from-red-400 to-red-600' },
  Music:     { badge: 'bg-indigo-100 text-indigo-700', bar: 'from-indigo-400 to-indigo-600' },
  Business:  { badge: 'bg-orange-100 text-orange-700', bar: 'from-orange-400 to-orange-500' },
  Other:     { badge: 'bg-gray-100 text-gray-700',     bar: 'from-gray-300 to-gray-400' },
};

export default function ServiceCard({ service, featured, index = 0 }) {
  const cat = categoryColors[service.category] || categoryColors.Other;
  return (
    <Link
      to={`/services/${service._id}`}
      className="service-card group block animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      <div className={`h-1.5 bg-gradient-to-r ${featured ? 'from-mpesa-green to-emerald-400' : cat.bar} transition-all duration-300 group-hover:h-2`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className={`badge ${cat.badge} transition-transform duration-200 group-hover:scale-105`}>{service.category}</span>
          {featured && <span className="badge bg-amber-100 text-amber-700 animate-pulse"><TrendingUp className="w-3 h-3" /> Trending</span>}
        </div>
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-mpesa-green transition-colors duration-200">{service.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 group-hover:text-gray-600 transition-colors duration-200">{service.description}</p>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-mpesa-green rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm transition-transform duration-200 group-hover:scale-110">
            {service.seller?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
              {service.seller?.name}
              {service.seller?.isVerified && <ShieldCheck className="w-3 h-3 text-mpesa-green" />}
            </p>
            <p className="text-xs text-gray-400">{service.seller?.jobsCompleted || 0} jobs done</p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-mpesa-green ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 group-hover:border-mpesa-green/20 transition-colors duration-200">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-gray-700">{service.rating?.toFixed(1) || '0.0'}</span>
            <span className="text-xs text-gray-400">({service.totalRatings || 0})</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Starting at</p>
            <p className="text-lg font-bold text-mpesa-green transition-transform duration-200 group-hover:scale-105 inline-block">KES {service.price?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
