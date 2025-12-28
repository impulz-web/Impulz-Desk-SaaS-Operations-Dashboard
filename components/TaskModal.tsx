
import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, User as UserIcon, AlertCircle, Tag, AlignLeft, Trash2 } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  editingTask?: Task | null;
  currentUserRole: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, onDelete, editingTask, currentUserRole }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('Todo');
  const [assignee, setAssignee] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.dueDate);
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
      setAssignee(editingTask.assignee);
      setTags(editingTask.tags?.join(', ') || '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
      setStatus('Todo');
      setAssignee(currentUserRole === 'Admin' ? '' : 'Me'); // Placeholder logic
      setTags('');
    }
    setError('');
  }, [editingTask, isOpen, currentUserRole]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (dueDate && dueDate < today) {
      setError('Due date cannot be in the past');
      return;
    }

    onSave({
      id: editingTask?.id,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      status,
      assignee: assignee || 'Unassigned',
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== '')
    });
    onClose();
  };

  const isAdmin = currentUserRole === 'Admin';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Check size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Define clear goals for your team</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {editingTask && onDelete && isAdmin && (
              <button 
                onClick={() => { if(window.confirm('Delete this task?')) { onDelete(editingTask.id); onClose(); } }}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                title="Delete Task"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Task Title *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Q4 Marketing Strategy"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-lg font-semibold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center">
              <AlignLeft size={14} className="mr-1 text-slate-400" /> Description
            </label>
            <textarea 
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="Describe the objective, steps, or expected outcomes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center">
                <Calendar size={14} className="mr-1 text-slate-400" /> Due Date
              </label>
              <input 
                type="date" 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center">
                <AlertCircle size={14} className="mr-1 text-slate-400" /> Priority
              </label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center">
                <UserIcon size={14} className="mr-1 text-slate-400" /> Assignee
              </label>
              <select 
                disabled={!isAdmin}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option value="">Unassigned</option>
                <option value="Sarah Chen">Sarah Chen</option>
                <option value="Alex Miller">Alex Miller</option>
                <option value="Marcus Aurelius">Marcus Aurelius</option>
                <option value="Dev Team">Dev Team</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center">
                <Tag size={14} className="mr-1 text-slate-400" /> Status
              </label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="Todo">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center">
              <Tag size={14} className="mr-1 text-slate-400" /> Tags
            </label>
            <input 
              type="text" 
              placeholder="e.g. Design, Q4, Internal (comma separated)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 flex items-center space-x-3 bg-white">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2"
          >
            <Check size={18} />
            <span>{editingTask ? 'Save Changes' : 'Create Task'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
