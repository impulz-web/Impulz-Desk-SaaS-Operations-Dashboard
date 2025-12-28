
import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { Download, Calendar, ArrowUpRight, TrendingUp, Plus, Edit2, Trash2, Search, Filter, DollarSign, PieChart as PieIcon, TrendingDown } from 'lucide-react';
import FinanceModal from '../components/FinanceModal';
import { FinanceEntry, ChartDataPoint, FinanceType } from '../types';

interface AnalyticsProps {
  entries: FinanceEntry[];
  onSaveEntry: (data: Omit<FinanceEntry, 'id'> & { id?: string }) => void;
  onDeleteEntry: (id: string) => void;
}

const PERFORMANCE_DATA = [
  { name: 'Week 1', productivity: 65, goal: 80 },
  { name: 'Week 2', productivity: 78, goal: 80 },
  { name: 'Week 3', productivity: 82, goal: 85 },
  { name: 'Week 4', productivity: 75, goal: 85 },
  { name: 'Week 5', productivity: 91, goal: 90 },
];

const Analytics: React.FC<AnalyticsProps> = ({ entries, onSaveEntry, onDeleteEntry }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FinanceType>('revenue');
  const [editingEntry, setEditingEntry] = useState<FinanceEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data: Record<string, ChartDataPoint> = {};
    months.slice(0, 7).forEach(m => data[m] = { name: m, revenue: 0, expenses: 0 });

    entries.forEach(entry => {
      const date = new Date(entry.date);
      const month = months[date.getMonth()];
      if (data[month]) {
        if (entry.type === 'revenue') data[month].revenue += entry.amount;
        else data[month].expenses += entry.amount;
      }
    });
    return Object.values(data);
  }, [entries]);

  const summary = useMemo(() => {
    const totalRevenue = entries.filter(e => e.type === 'revenue').reduce((s, e) => s + e.amount, 0);
    const totalExpenses = entries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
    const profit = totalRevenue - totalExpenses;
    return { totalRevenue, totalExpenses, profit };
  }, [entries]);

  const handleOpenModal = (type: FinanceType, entry?: FinanceEntry) => {
    setModalType(type);
    setEditingEntry(entry || null);
    setModalOpen(true);
  };

  const filteredEntries = entries.filter(e => 
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.amount.toString().includes(searchTerm)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <FinanceModal 
        isOpen={modalOpen} 
        type={modalType} 
        editingEntry={editingEntry}
        onClose={() => setModalOpen(false)} 
        onSave={onSaveEntry} 
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Advanced Analytics</h1>
          <p className="text-slate-500">Manage logs to drive dynamic operational metrics.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => handleOpenModal('revenue')}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          >
            <Plus size={18} />
            <span>Add Revenue</span>
          </button>
          <button className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download size={18} className="text-slate-400" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900">${summary.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Expenses</p>
            <p className="text-2xl font-bold text-slate-900">${summary.totalExpenses.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className={`w-12 h-12 ${summary.profit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} rounded-xl flex items-center justify-center`}>
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Net Profit</p>
            <p className={`text-2xl font-bold ${summary.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              ${summary.profit.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Comparison Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Revenue vs Expenses</h3>
              <p className="text-sm text-slate-500">Live comparison driven by log updates.</p>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                />
                <Legend iconType="circle" />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="revenue" animationDuration={1000} />
                <Bar dataKey="expenses" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="expenses" animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Operational Efficiency</h3>
            <p className="text-sm text-slate-500">Weekly productivity metrics vs target benchmarks.</p>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend />
                <Line type="monotone" dataKey="productivity" stroke="#6366f1" strokeWidth={3} dot={{r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff'}} name="Productivity" />
                <Line type="stepAfter" dataKey="goal" stroke="#cbd5e1" strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Finance Log Management Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Finance Log</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search log..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 border border-slate-200 bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-slate-600 font-medium">{entry.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      entry.type === 'revenue' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-semibold">{entry.category}</td>
                  <td className={`px-6 py-4 font-bold ${entry.type === 'revenue' ? 'text-indigo-600' : 'text-slate-900'}`}>
                    {entry.type === 'revenue' ? '+' : '-'}${entry.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(entry.type, entry)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteEntry(entry.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
