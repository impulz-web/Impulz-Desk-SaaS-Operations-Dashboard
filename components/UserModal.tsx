
import React, { useState, useEffect } from 'react';
import { X, UserPlus, Mail, Shield, Briefcase, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { User, UserRole, UserStatus } from '../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Omit<User, 'id'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  editingUser?: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, onDelete, editingUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Staff');
  const [status, setStatus] = useState<UserStatus>('Active');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setRole(editingUser.role);
      setStatus(editingUser.status);
      setDepartment(editingUser.department || '');
    } else {
      setName('');
      setEmail('');
      setRole('Staff');
      setStatus('Active');
      setDepartment('');
    }
    setError('');
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and Email are required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    onSave({
      id: editingUser?.id,
      name: name.trim(),
      email: email.trim(),
      role,
      status,
      department: department.trim(),
      lastLogin: editingUser?.lastLogin || '-'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {editingUser ? 'Edit Team Member' : 'Invite Team Member'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Control access and define roles</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {editingUser && onDelete && (
              <button 
                onClick={() => { if(window.confirm('Remove this user from the team?')) { onDelete(editingUser.id); onClose(); } }}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Full Name *</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center">
              <Mail size={14} className="mr-1 text-slate-400" /> Email Address *
            </label>
            <input 
              type="email" 
              placeholder="john@company.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center">
                <Shield size={14} className="mr-1 text-slate-400" /> Role
              </label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
                <option value="Guest">Guest</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center">
                <CheckCircle size={14} className="mr-1 text-slate-400" /> Status
              </label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center">
              <Briefcase size={14} className="mr-1 text-slate-400" /> Department
            </label>
            <input 
              type="text" 
              placeholder="e.g. Product, Sales, Tech"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div className="pt-6 flex items-center space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2"
            >
              <CheckCircle size={18} />
              <span>{editingUser ? 'Save Changes' : 'Invite User'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
