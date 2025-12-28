
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend }) => {
  const isPositive = trend >= 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-slate-500 text-sm font-medium mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {isPositive ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div className="mt-4 w-full h-1 bg-slate-50 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${isPositive ? 'bg-indigo-500' : 'bg-red-500'}`} 
          style={{ width: `${Math.min(100, Math.abs(trend) * 5)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatCard;
