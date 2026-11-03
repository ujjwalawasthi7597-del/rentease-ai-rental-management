import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'payment' | 'maintenance' | 'property' | 'priority' | 'lease';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'payment', size = 'sm' }) => {
  const s = (status || '').toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (s === 'paid' || s === 'resolved' || s === 'available' || s === 'active') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (s === 'pending' || s === 'in progress' || s === 'under maintenance' || s === 'expiring soon' || s === 'medium') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (s === 'overdue' || s === 'high' || s === 'expired') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (s === 'occupied' || s === 'submitted' || s === 'low') {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs font-semibold' : 'px-3 py-1 text-sm font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {status}
    </span>
  );
};
