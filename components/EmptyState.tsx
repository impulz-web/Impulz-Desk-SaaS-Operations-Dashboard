
import React from 'react';
import { Ghost, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
      <Ghost size={32} />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
    <p className="text-slate-500 text-center max-w-sm mb-6">{description}</p>
    {actionLabel && (
      <button 
        onClick={onAction}
        className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        <Plus size={18} />
        <span>{actionLabel}</span>
      </button>
    )}
  </div>
);

export default EmptyState;
