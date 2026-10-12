import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { ShieldCheck, UserCheck, Utensils, GraduationCap, Lock, Mail, ArrowRight, Building2, KeyRound } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
}

export const AuthScreen: React.FC<Props> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const roleProfiles = [
    {
      role: 'chief_rector' as UserRole,
      title: 'Chief Rector',
      subtitle: 'Administration & Institutional Oversight',
      icon: ShieldCheck,
      color: 'border-purple-600 bg-purple-50 text-purple-700',
      activeColor: 'bg-purple-700 text-white shadow-md',
      demoUser: INITIAL_USERS.find((u) => u.role === 'chief_rector')!,
    },
    {
      role: 'rector' as UserRole,
      title: 'Rector / Warden',
      subtitle: 'Attendance, In/Out Logs, Grievances & Security',
      icon: UserCheck,
      color: 'border-indigo-600 bg-indigo-50 text-indigo-700',
      activeColor: 'bg-indigo-700 text-white shadow-md',
      demoUser: INITIAL_USERS.find((u) => u.role === 'rector')!,
    },
    {
      role: 'student' as UserRole,
      title: 'Student Resident',
      subtitle: 'Mess Menu, Fees & Receipts, Gate Pass, Roll Call',
      icon: GraduationCap,
      color: 'border-rose-600 bg-rose-50 text-rose-700',
      activeColor: 'bg-rose-700 text-white shadow-md',
      demoUser: INITIAL_USERS.find((u) => u.role === 'student')!,
    },
    {
      role: 'mess_owner' as UserRole,
      title: 'Mess Contractor',
      subtitle: 'Daily 4-Slot Menu, Timings, Diet Specials & Feedback',
      icon: Utensils,
      color: 'border-amber-600 bg-amber-50 text-amber-700',
      activeColor: 'bg-amber-700 text-white shadow-md',
      demoUser: INITIAL_USERS.find((u) => u.role === 'mess_owner')!,
    },
  ];

  const currentRoleProfile = roleProfiles.find((r) => r.role === selectedRole)!;

  const handleQuickLogin = (role: UserRole) => {
    const user = INITIAL_USERS.find((u) => u.role === role);
    if (user) {
      onLogin(user);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Please enter your Registered ID / Email');
      return;
    }
    // Match against user or create session user for the selected role
    const existing = INITIAL_USERS.find((u) => u.role === selectedRole);
    if (existing) {
      onLogin({
        ...existing,
        email: emailInput.trim(),
        name: emailInput.split('@')[0] ? emailInput.split('@')[0].replace('.', ' ') : existing.name,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4 py-8">
      {/* Brand Header */}
      <div className="max-w-xl w-full text-center mb-6">
        <div className="inline-flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <Building2 className="w-4 h-4 text-rose-600" />
          <span>Official Residence Management Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Ananya Girls Hostel &amp; Mess
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
          Single sign-on access for Residents, Rectorate Administration, and Mess Operations.
        </p>
      </div>

      <div className="max-w-3xl w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Role Selection Tabs */}
        <div className="border-b border-slate-200 bg-slate-50 p-3 sm:p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Select Your Role to Authenticate
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {roleProfiles.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedRole === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(item.role);
                    setErrorMsg('');
                    setEmailInput(item.demoUser.email);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10">
                      {item.role === 'chief_rector' ? 'SUPER' : item.role === 'rector' ? 'WARDEN' : item.role === 'mess_owner' ? 'MESS' : 'RESIDENT'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-xs leading-tight">{item.title}</div>
                    <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.demoUser.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body and One-Click Sign In */}
        <div className="p-6 sm:p-8 grid md:grid-cols-5 gap-8 items-center">
          {/* Left Column: Form */}
          <div className="md:col-span-3 space-y-5">
            <div>
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                {currentRoleProfile.title} Portal
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Secure Credential Login
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {currentRoleProfile.subtitle}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered ID / Email / Enrollment No.
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={emailInput || currentRoleProfile.demoUser.email}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. enr-2023-cs042@college.edu"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Security Passkey / Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passwordInput || '••••••••••'}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter passkey"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Log In as {currentRoleProfile.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Instant Demo Access */}
          <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8 space-y-4">
            <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-4">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider mb-2">
                <KeyRound className="w-4 h-4 text-rose-600" />
                <span>Instant Demo Login</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Pre-configured verified session for instant feature inspection.
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-rose-200 mb-3 text-xs">
                <p className="font-semibold text-slate-900">{currentRoleProfile.demoUser.name}</p>
                <p className="text-slate-500 text-[11px] font-mono mt-0.5 truncate">
                  {currentRoleProfile.demoUser.email}
                </p>
                {currentRoleProfile.demoUser.roomNo && (
                  <p className="text-[11px] text-rose-700 font-medium mt-1">
                    Room {currentRoleProfile.demoUser.roomNo} · {currentRoleProfile.demoUser.enrNo}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleQuickLogin(selectedRole)}
                className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Enter as {currentRoleProfile.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed">
              <p className="font-medium text-slate-700">Need account assistance?</p>
              <p>Contact Rectorate Office, Administrative Wing A (Ext: 104) or reach 24/7 Security Desk.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500">
        <p>Ananya Mahila Chhatralaya System · Secured with 256-bit encryption &amp; biometric verification</p>
      </div>
    </div>
  );
};
