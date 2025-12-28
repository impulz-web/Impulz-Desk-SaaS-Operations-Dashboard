
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Settings as SettingsIcon, 
  LogOut, 
  Bell,
  Search,
  User as UserIcon,
  ChevronDown,
  UserCircle,
  Users as UsersIcon
} from 'lucide-react';
import { User, Company } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  company: Company;
  activePage: string;
  onNavigate: (page: any) => void;
  onLogout: () => void;
}

const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick: () => void 
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <span className={active ? 'text-white' : 'text-slate-500'}>{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

const Layout: React.FC<LayoutProps> = ({ children, user, company, activePage, onNavigate, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = user.role === 'Admin';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">
              I
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Impulz Desk</h1>
              <p className="text-xs text-slate-500 truncate max-w-[120px]">{company.name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activePage === 'dashboard'} 
            onClick={() => onNavigate('dashboard')}
          />
          <SidebarItem 
            icon={<CheckSquare size={20} />} 
            label="Tasks" 
            active={activePage === 'tasks'} 
            onClick={() => onNavigate('tasks')}
          />
          {isAdmin && (
            <SidebarItem 
              icon={<UsersIcon size={20} />} 
              label="Users" 
              active={activePage === 'users'} 
              onClick={() => onNavigate('users')}
            />
          )}
          <SidebarItem 
            icon={<BarChart3 size={20} />} 
            label="Analytics" 
            active={activePage === 'analytics'} 
            onClick={() => onNavigate('analytics')}
          />
          <SidebarItem 
            icon={<SettingsIcon size={20} />} 
            label="Settings" 
            active={activePage === 'settings'} 
            onClick={() => onNavigate('settings')}
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold border-2 border-white">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
            <button 
              onClick={() => {
                if(window.confirm('Are you sure you want to logout?')) onLogout();
              }} 
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-20">
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-slate-50 border-none rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-100 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            
            {/* Header User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div 
                className={`flex items-center space-x-2 cursor-pointer p-1.5 rounded-lg transition-colors ${dropdownOpen ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 py-2 animate-in fade-in slide-in-from-top-1 duration-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <button 
                      onClick={() => { onNavigate('settings'); setDropdownOpen(false); }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors text-left"
                    >
                      <UserCircle size={18} />
                      <span className="font-medium">My Profile</span>
                    </button>
                    <button 
                      onClick={() => { onNavigate('settings'); setDropdownOpen(false); }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors text-left"
                    >
                      <SettingsIcon size={18} />
                      <span className="font-medium">Account Settings</span>
                    </button>
                  </div>
                  <div className="p-1 border-t border-slate-50 mt-1">
                    <button 
                      onClick={() => { setDropdownOpen(false); onLogout(); }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;