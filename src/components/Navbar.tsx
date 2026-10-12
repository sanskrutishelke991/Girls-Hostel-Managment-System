import React from 'react';
import { User } from '../types';
import {
  Building2,
  Siren,
  LogOut,
  UserCheck,
  ShieldCheck,
  GraduationCap,
  Utensils,
  ChevronDown,
} from 'lucide-react';

interface Props {
  currentUser: User;
  onOpenSOS: () => void;
  onLogout: () => void;
  onSwitchUser: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<Props> = ({
  currentUser,
  onOpenSOS,
  onLogout,
  onSwitchUser,
}) => {
  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'chief_rector':
        return {
          label: 'Chief Rector',
          icon: ShieldCheck,
          classes: 'bg-purple-100 text-purple-900 border-purple-200',
        };
      case 'rector':
        return {
          label: 'Rector / Warden',
          icon: UserCheck,
          classes: 'bg-indigo-100 text-indigo-900 border-indigo-200',
        };
      case 'mess_owner':
        return {
          label: 'Mess Contractor',
          icon: Utensils,
          classes: 'bg-amber-100 text-amber-900 border-amber-200',
        };
      default:
        return {
          label: `Student · ${currentUser.roomNo || 'Hostel'}`,
          icon: GraduationCap,
          classes: 'bg-rose-100 text-rose-900 border-rose-200',
        };
    }
  };

  const badge = getRoleBadge();
  const BadgeIcon = badge.icon;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 transition-shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap">
                Ananya Residence
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Girls Hostel
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Hostel Administration &amp; Mess Management Portal
            </p>
          </div>
        </div>

        {/* Zone 3: Actions & Role Info */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Emergency SOS Alarm Button */}
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg text-xs font-bold shadow-sm shadow-red-500/20 transition-all cursor-pointer shrink-0"
            title="Trigger 24/7 Safety SOS & Helpline"
          >
            <Siren className="w-4 h-4 animate-pulse" />
            <span className="hidden xs:inline">SOS HELPLINE</span>
          </button>

          {/* Current Role Switcher Pill */}
          <button
            onClick={onSwitchUser}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${badge.classes}`}
            title="Switch demo account role"
          >
            <BadgeIcon className="w-3.5 h-3.5" />
            <span className="truncate max-w-[140px] font-semibold">{currentUser.name}</span>
            <span className="text-[10px] opacity-75">({badge.label})</span>
            <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
          </button>

          {/* Mobile Role Switch Button */}
          <button
            onClick={onSwitchUser}
            className="sm:hidden flex items-center p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            title="Switch User Role"
          >
            <BadgeIcon className="w-4 h-4 text-slate-800" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="Sign out to authentication screen"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
