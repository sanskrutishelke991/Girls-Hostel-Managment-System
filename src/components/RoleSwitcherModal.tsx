import React from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { ShieldCheck, UserCheck, GraduationCap, Utensils, X, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSelectUser: (user: User) => void;
}

export const RoleSwitcherModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  const roleIcons: Record<UserRole, React.ElementType> = {
    chief_rector: ShieldCheck,
    rector: UserCheck,
    student: GraduationCap,
    mess_owner: Utensils,
  };

  const roleTags: Record<UserRole, string> = {
    chief_rector: 'Super Administrator',
    rector: 'Resident Warden',
    student: 'Resident Student',
    mess_owner: 'Mess Contractor',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Switch Active User / Role</h3>
            <p className="text-xs text-slate-500">Test different permissions and views across the hostel system</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2.5">
          {INITIAL_USERS.map((user) => {
            const Icon = roleIcons[user.role];
            const isSelected = currentUser.id === user.id;

            return (
              <button
                key={user.id}
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm truncate">
                        {user.name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {roleTags[user.role]} · {user.email}
                    </div>
                    {user.roomNo && (
                      <div className="text-[11px] text-rose-700 font-medium">
                        Room {user.roomNo} ({user.enrNo})
                      </div>
                    )}
                  </div>
                </div>

                {isSelected ? (
                  <Check className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                ) : (
                  <span className="text-xs text-slate-400 font-medium shrink-0 ml-2">Switch</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
