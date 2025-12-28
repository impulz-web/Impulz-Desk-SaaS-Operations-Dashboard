
import React, { useState } from 'react';
import { Search, Filter, UserPlus, MoreVertical, Mail, Shield, CheckCircle2, Clock, Ban } from 'lucide-react';
import { User, UserRole, UserStatus } from '../types';

interface UsersProps {
  users: User[];
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onUpdateStatus: (id: string, status: UserStatus) => void;
}

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const styles = {
    'Admin': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Manager': 'bg-violet-50 text-violet-700 border-violet-100',
    'Staff': 'bg-slate-50 text-slate-700 border-slate-100',
    'Guest': 'bg-orange-50 text-orange-700 border-orange-100'
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[role]}`}>
      {role}
    </span>
  );
};

const StatusIndicator: React.FC<{ status: UserStatus }> = ({ status }) => {
  const styles = {
    'Active': 'bg-emerald-500',
    'Pending': 'bg-amber-500',
    'Inactive': 'bg-slate-300'
  };
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${styles[status]}`}></div>
      <span className="text-xs font-semibold text-slate-600">{status}</span>
    </div>
  );
};

const Users: React.FC<UsersProps> = ({ users, onAddUser, onEditUser, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500">Manage team members, roles, and system access.</p>
        </div>
        <button 
          onClick={onAddUser}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
        >
          <UserPlus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-100 text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none hover:bg-slate-50 transition-colors"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admins</option>
              <option value="Manager">Managers</option>
              <option value="Staff">Staff</option>
              <option value="Guest">Guests</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {user.department || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusIndicator status={user.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button 
                        onClick={() => onEditUser(user)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Edit User"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    No users found matching your filters.
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

export default Users;
