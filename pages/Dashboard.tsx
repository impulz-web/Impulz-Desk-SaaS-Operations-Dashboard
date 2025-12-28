
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Activity, ArrowRight, Zap, Plus, DollarSign, Wallet } from 'lucide-react';
import StatCard from '../components/StatCard';
import FinanceModal from '../components/FinanceModal';
import { MOCK_KPI_DATA, COLORS } from '../constants';
import { FinanceEntry, ChartDataPoint, FinanceType, Task } from '../types';

interface DashboardProps {
  tasks: Task[];
  financeEntries: FinanceEntry[];
  onSaveFinanceEntry: (entry: Omit<FinanceEntry, 'id'> & { id?: string }) => void;
  onCreateTask: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, financeEntries, onSaveFinanceEntry, onCreateTask }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FinanceType>('revenue');

  const taskStats = useMemo(() => {
    const total = tasks.length;
    if (total === 0) return { todo: 0, progress: 0, review: 0, done: 0, total: 0 };
    
    const todo = tasks.filter(t => t.status === 'Todo').length;
    const progress = tasks.filter(t => t.status === 'In Progress').length;
    const review = tasks.filter(t => t.status === 'Review').length;
    const done = tasks.filter(t => t.status === 'Done').length;
    
    return {
      todo: Math.round((todo / total) * 100),
      progress: Math.round((progress / total) * 100),
      review: Math.round((review / total) * 100),
      done: Math.round((done / total) * 100),
      total
    };
  }, [tasks]);

  const taskDistributionData = [
    { name: 'Todo', value: taskStats.todo, color: COLORS.secondary },
    { name: 'In Progress', value: taskStats.progress, color: COLORS.primary },
    { name: 'Review', value: taskStats.review, color: COLORS.warning },
    { name: 'Done', value: taskStats.done, color: COLORS.success },
  ];

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // We'll show the current year's data or the range existing in financeEntries
    const dataMap: Record<string, ChartDataPoint> = {};
    months.slice(0, 7).forEach(m => dataMap[m] = { name: m, revenue: 0, expenses: 0 });

    financeEntries.forEach(entry => {
      const date = new Date(entry.date);
      const month = months[date.getMonth()];
      if (dataMap[month]) {
        if (entry.type === 'revenue') dataMap[month].revenue += entry.amount;
        else dataMap[month].expenses += entry.amount;
      }
    });
    return Object.values(dataMap);
  }, [financeEntries]);

  const handleOpenModal = (type: FinanceType) => {
    setModalType(type);
    setModalOpen(true);
  };

  const kpis = useMemo(() => {
    // Dynamically calculate Monthly Revenue based on current entries
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const thisMonthRevenue = financeEntries
      .filter(e => {
        const d = new Date(e.date);
        return e.type === 'revenue' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    return MOCK_KPI_DATA.map(kpi => {
      if (kpi.label === 'Active Tasks') {
        return { ...kpi, value: taskStats.total.toString() };
      }
      if (kpi.label === 'Monthly Revenue' && thisMonthRevenue > 0) {
        return { ...kpi, value: `$${thisMonthRevenue.toLocaleString()}` };
      }
      return kpi;
    });
  }, [taskStats.total, financeEntries]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <FinanceModal 
        isOpen={modalOpen} 
        type={modalType} 
        onClose={() => setModalOpen(false)} 
        onSave={onSaveFinanceEntry} 
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, Admin</h1>
          <p className="text-slate-500">Real-time data for your company's performance.</p>
        </div>
        <div className="flex space-x-3">
          <button className="hidden md:block px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            Generate Report
          </button>
          <button 
            onClick={onCreateTask}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-95 flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <StatCard key={idx} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Revenue Overview</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Automated aggregation of financial logs</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleOpenModal('revenue')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                <Plus size={14} />
                <span>Add Revenue</span>
              </button>
              <button 
                onClick={() => handleOpenModal('expense')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                <Plus size={14} />
                <span>Add Expense</span>
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ fontWeight: 600 }} 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Task Distribution</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={taskDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {taskDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{taskStats.total}</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total</p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {taskDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="text-slate-900 font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
            <button className="text-indigo-600 text-sm font-semibold hover:underline flex items-center">
              Finance Hub <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {financeEntries.slice(-4).reverse().map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${entry.type === 'revenue' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                    {entry.type === 'revenue' ? <DollarSign size={18} /> : <Wallet size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{entry.category}</p>
                    <p className="text-xs text-slate-500">{entry.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${entry.type === 'revenue' ? 'text-indigo-600' : 'text-slate-900'}`}>
                  {entry.type === 'revenue' ? '+' : '-'}${entry.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-2xl shadow-xl shadow-indigo-100 text-white relative overflow-hidden">
          <Zap className="absolute top-4 right-4 text-white/10" size={140} />
          <div className="relative z-10">
            <h3 className="text-xl font-bold flex items-center mb-6"><Zap size={20} className="mr-2" />AI Cash Flow Pulse</h3>
            <p className="text-indigo-100 leading-relaxed mb-6 max-w-md">
              Based on your latest entries, your business momentum is growing. Tracking every revenue source ensures high-accuracy profit projections.
            </p>
            <button className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors">Full Strategy Scan</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
