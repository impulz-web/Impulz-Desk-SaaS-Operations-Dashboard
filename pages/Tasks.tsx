
import React, { useState } from 'react';
import { 
  Filter, 
  MoreHorizontal, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ExternalLink
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../types';
import EmptyState from '../components/EmptyState';

const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const styles = {
    'Todo': 'bg-slate-100 text-slate-600',
    'In Progress': 'bg-indigo-50 text-indigo-600',
    'Review': 'bg-amber-50 text-amber-600',
    'Done': 'bg-emerald-50 text-emerald-600'
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${styles[status]}`}>{status}</span>;
};

const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const styles = {
    'Low': 'text-slate-400',
    'Medium': 'text-amber-500',
    'High': 'text-red-500'
  };
  return (
    <div className="flex items-center space-x-1">
      <div className={`w-1.5 h-1.5 rounded-full ${styles[priority].replace('text', 'bg')}`}></div>
      <span className={`text-xs font-semibold ${styles[priority]}`}>{priority}</span>
    </div>
  );
};

interface TasksProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onCreateTask: () => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, onEditTask, onCreateTask, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmpty, setShowEmpty] = useState(false);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Management</h1>
          <p className="text-slate-500">Manage, assign, and track company-wide tasks.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setShowEmpty(!showEmpty)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
            {showEmpty ? 'Show Data' : 'Test Empty State'}
          </button>
          <button 
            onClick={onCreateTask}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-100"
          >
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {!showEmpty ? (
        <>
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-4 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search tasks or assignees..." className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-100 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"><Filter size={16} /><span>Filters</span></button>
              <button className="flex items-center space-x-2 px-3 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"><span>Date Range</span></button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Task Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assignee</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                    <tr key={task.id} onClick={() => onEditTask(task)} className="hover:bg-indigo-50/30 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button onClick={(e) => { e.stopPropagation(); onUpdateStatus(task.id, 'Done'); }} className={`${task.status === 'Done' ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-600'} transition-colors`}>
                            <CheckCircle2 size={18} />
                          </button>
                          <span className={`text-sm font-semibold ${task.status === 'Done' ? 'text-slate-400 line-through font-normal' : 'text-slate-900'}`}>{task.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">{task.assignee.split(' ').map(n => n[0]).join('')}</div>
                          <span className="text-sm text-slate-600">{task.assignee}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                      <td className="px-6 py-4"><PriorityBadge priority={task.priority} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 text-sm text-slate-500"><Clock size={14} /><span>{task.dueDate || 'No Date'}</span></div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={(e) => { e.stopPropagation(); onEditTask(task); }} className="p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all flex items-center justify-center inline-flex">
                          <ExternalLink size={16} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No tasks match your search criteria.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <EmptyState title="No tasks yet" description="It looks like you haven't created any tasks for your team. Start by adding your first project or operational goal." actionLabel="Create Your First Task" onAction={() => { setShowEmpty(false); onCreateTask(); }} />
      )}
    </div>
  );
};

export default Tasks;
