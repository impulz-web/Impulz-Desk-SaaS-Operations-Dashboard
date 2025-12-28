
import React, { useState, useEffect } from 'react';
import { User as UserType, Shield, Bell, CreditCard, Laptop, Save, Trash2, Globe } from 'lucide-react';

type SettingsTab = 'profile' | 'security' | 'billing' | 'notifications';

interface SettingsProps {
  user: UserType;
  onUpdateUser: (updatedUser: Partial<UserType>) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Sync state when prop changes
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const handleSaveProfile = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      onUpdateUser({ name, email });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your account preferences and company configurations.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-slate-50/50 border-r border-slate-100 p-4 space-y-1">
          {[
            { id: 'profile', icon: <UserType size={18} />, label: 'Profile Settings' },
            { id: 'security', icon: <Shield size={18} />, label: 'Security' },
            { id: 'billing', icon: <CreditCard size={18} />, label: 'Billing & Plans' },
            { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-black border-4 border-white shadow-md">
                    {name.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm">
                    <Laptop size={12} />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Your Avatar</h3>
                  <p className="text-sm text-slate-500">Avatar will be visible to all team members.</p>
                  <div className="mt-2 flex space-x-2">
                    <button className="text-xs font-bold text-indigo-600 px-3 py-1.5 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">Upload New</button>
                    <button className="text-xs font-bold text-red-600 px-3 py-1.5 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Remove</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Company Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" defaultValue="https://company.com" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end items-center space-x-3">
                {saveStatus === 'saved' && (
                  <span className="text-sm font-bold text-emerald-600 animate-in fade-in slide-in-from-right-2">Profile updated!</span>
                )}
                <button className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={saveStatus === 'saving'}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70"
                >
                  {saveStatus === 'saving' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Save size={18} />
                  )}
                  <span>{saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start space-x-3">
                <Shield className="text-amber-500 mt-0.5" size={18} />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">Two-Factor Authentication</h4>
                  <p className="text-xs text-amber-700 mt-1">2FA is currently disabled. We highly recommend enabling it to protect your sensitive business data.</p>
                  <button className="mt-2 text-xs font-bold text-amber-900 underline">Enable Now</button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Change Password</h3>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                </div>
                <button className="text-sm font-bold text-indigo-600">Update Password</button>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="font-bold text-red-600 flex items-center space-x-2">
                  <Trash2 size={18} />
                  <span>Danger Zone</span>
                </h3>
                <p className="text-sm text-slate-500 mt-2">Deleting your account is permanent and cannot be undone. All your data will be wiped immediately.</p>
                <button className="mt-4 px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="p-6 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h4 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Current Plan</h4>
                    <h3 className="text-2xl font-bold mb-1">Scale Plan ($49/mo)</h3>
                    <p className="text-slate-400 text-sm">Next billing date: Dec 1, 2023</p>
                  </div>
                  <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                    Upgrade to Enterprise
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Payment Methods</h3>
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-slate-100 rounded-md flex items-center justify-center font-bold text-xs text-slate-400 italic">VISA</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Visa ending in 4242</p>
                      <p className="text-xs text-slate-500">Expiry 12/26</p>
                    </div>
                  </div>
                  <button className="text-sm font-bold text-indigo-600">Edit</button>
                </div>
                <button className="text-sm font-bold text-indigo-600">+ Add New Payment Method</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Weekly Performance Report', desc: 'Receive a summarized report of your business every Monday.', checked: true },
                    { label: 'Task Assignments', desc: 'Notify me when I am assigned to a new task.', checked: true },
                    { label: 'Daily Activity Feed', desc: 'A daily digest of everything that happened yesterday.', checked: false },
                    { label: 'System Alerts', desc: 'Crucial security and billing notifications.', checked: true },
                  ].map((notif, idx) => (
                    <div key={idx} className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <p className="text-sm font-bold text-slate-900">{notif.label}</p>
                        <p className="text-xs text-slate-500">{notif.desc}</p>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${notif.checked ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${notif.checked ? 'left-6' : 'left-1'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
