const configs = {
  pending_payment: { label: 'Pending Payment', cls: 'bg-yellow-100 text-yellow-700' },
  in_escrow:       { label: 'In Escrow 🔒',    cls: 'bg-blue-100 text-blue-700' },
  in_progress:     { label: 'In Progress',      cls: 'bg-indigo-100 text-indigo-700' },
  completed:       { label: 'Awaiting Confirm', cls: 'bg-orange-100 text-orange-700' },
  released:        { label: 'Released ✅',       cls: 'bg-green-100 text-green-700' },
  disputed:        { label: 'Disputed ⚠️',       cls: 'bg-red-100 text-red-700' },
  refunded:        { label: 'Refunded',          cls: 'bg-gray-100 text-gray-600' },
  cancelled:       { label: 'Cancelled',         cls: 'bg-gray-100 text-gray-500' },
};

export default function StatusBadge({ status }) {
  const c = configs[status] || { label: status, cls: 'bg-gray-100 text-gray-600' };
  return <span className={`badge ${c.cls} font-medium`}>{c.label}</span>;
}
