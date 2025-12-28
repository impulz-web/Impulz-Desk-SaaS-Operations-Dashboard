
import React, { useState } from 'react';
import { User, Company, UserRole } from '../types';
import { ChevronRight, Building2, Users, Rocket, CheckCircle } from 'lucide-react';

interface OnboardingProps {
  user: User;
  onComplete: (company: Company) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('1-10');
  const [role, setRole] = useState<UserRole>('Admin');

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete({ name: companyName || 'New Venture', industry, size });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Progress Tracker */}
        <div className="flex items-center justify-center mb-12 space-x-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                step === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 
                step > s ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > s ? <CheckCircle size={16} /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="p-10">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Set up your company</h2>
                  <p className="text-slate-500 mt-2">Let's start by getting some basic details about your business.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Acme Innovations" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Industry</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    >
                      <option value="">Select an industry</option>
                      <option value="SaaS">SaaS / Software</option>
                      <option value="Fintech">Fintech</option>
                      <option value="Ecommerce">E-commerce</option>
                      <option value="Agency">Creative Agency</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Choose your role</h2>
                  <p className="text-slate-500 mt-2">How will you be using Impulz Desk primarily?</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'Admin', title: 'Admin / Owner', desc: 'Full access to all financial data and settings.' },
                    { id: 'Staff', title: 'Staff Member', desc: 'Manage tasks and view personal performance metrics.' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id as UserRole)}
                      className={`flex items-start p-4 border-2 rounded-2xl text-left transition-all ${
                        role === r.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className={`mt-1 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        role === r.id ? 'border-indigo-600' : 'border-slate-300'
                      }`}>
                        {role === r.id && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-slate-900">{r.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Rocket size={40} className="animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Ready to launch!</h2>
                  <p className="text-slate-500 mt-2">Everything is set. You can now access your dashboard and start inviting your team.</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-4 text-center">Setup Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Company</span>
                      <span className="text-slate-900 font-semibold">{companyName || 'Not Set'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Industry</span>
                      <span className="text-slate-900 font-semibold">{industry || 'Technology'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Your Role</span>
                      <span className="text-slate-900 font-semibold">{role}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 flex items-center space-x-3">
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
              )}
              <button 
                onClick={handleNext}
                disabled={step === 1 && !companyName}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-100"
              >
                <span>{step === 3 ? "Let's Go" : "Continue"}</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;