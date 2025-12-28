
import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, FileText, Check } from 'lucide-react';
import { FinanceEntry, FinanceType } from '../types';

interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<FinanceEntry, 'id'> & { id?: string }) => void;
  type?: FinanceType;
  editingEntry?: FinanceEntry | null;
}

const FinanceModal: React.FC<FinanceModalProps> = ({ isOpen, onClose, onSave, type = 'revenue', editingEntry }) => {
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (editingEntry) {
      setAmount(editingEntry.amount.toString());
      setDate(editingEntry.date);
      setCategory(editingEntry.category);
      setNotes(editingEntry.notes || '');
    } else {
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('');
      setNotes('');
    }
  }, [editingEntry, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onSave({
      id: editingEntry?.id,
      type: editingEntry?.type || type,
      amount: numAmount,
      date,
      category,
      notes
    });
    onClose();
  };

  const isRevenue = (editingEntry?.type || type) === 'revenue';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className={`p-6 border-b border-slate-50 flex items-center justify-between ${isRevenue ? 'bg-indigo-50/30' : 'bg-slate-50/50'}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRevenue ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'}`}>
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editingEntry ? 'Edit Transaction' : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Enter transaction details below</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center">
              <DollarSign size={14} className="mr-1 text-slate-400" /> Amount
            </label>
            <input 
              type="number" 
              step="0.01"
              required
              placeholder="0.00"
              autoFocus
              className="w-full text-3xl font-black px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center">
                <Calendar size={14} className="mr-1 text-slate-400" /> Date
              </label>
              <input 
                type="date" 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center">
                <Tag size={14} className="mr-1 text-slate-400" /> {isRevenue ? 'Source' : 'Category'}
              </label>
              <select 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select...</option>
                {isRevenue ? (
                  <>
                    <option value="Sales">Sales</option>
                    <option value="Service">Service</option>
                    <option value="Subscription">Subscription</option>
                    <option value="Other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="Marketing">Marketing</option>
                    <option value="Payroll">Payroll</option>
                    <option value="Tools">Tools</option>
                    <option value="Operations">Operations</option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center">
              <FileText size={14} className="mr-1 text-slate-400" /> Notes (Optional)
            </label>
            <textarea 
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="What was this for?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="pt-4 flex items-center space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`flex-1 py-3 text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-[0.98] ${
                isRevenue ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-100'
              }`}
            >
              <Check size={18} />
              <span>{editingEntry ? 'Update Transaction' : `Save ${type.charAt(0).toUpperCase() + type.slice(1)}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinanceModal;
