import React from 'react';
import { HelplineContact } from '../types';
import { HELPLINE_CONTACTS } from '../data/mockData';
import {
  PhoneCall,
  Shield,
  Siren,
  HeartHandshake,
  AlertTriangle,
  Building2,
  Clock,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  onTriggerSOS: () => void;
}

export const HelplineDeskTab: React.FC<Props> = ({ onTriggerSOS }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-600 text-white">
                <Siren className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  24/7 Women's Safety &amp; Emergency Helpline Desk
                </h2>
                <p className="text-xs text-slate-500">
                  Instant Direct Telephony to Warden, Security Gate Desk, Campus Ambulance &amp; Women Helpline (1091)
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onTriggerSOS}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>TRIGGER EMERGENCY SOS NOW</span>
          </button>
        </div>
      </div>

      {/* Emergency Hotlines Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {HELPLINE_CONTACTS.map((c) => {
          const isGovtOrAmbulance = c.phone === '1091' || c.phone === '112' || c.type === 'medical';

          return (
            <div
              key={c.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                isGovtOrAmbulance ? 'border-red-200 ring-1 ring-red-500/10' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      c.type === 'police' || c.type === 'medical'
                        ? 'bg-red-100 text-red-800'
                        : c.type === 'warden'
                        ? 'bg-purple-100 text-purple-800'
                        : c.type === 'security'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {c.type}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{c.timing}</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-0.5">{c.title}</h3>
                <p className="text-xs font-semibold text-slate-700">{c.name}</p>
                <p className="text-[11px] text-slate-500 mb-4">{c.designation}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <a
                  href={`tel:${c.phone.replace(/\s+/g, '')}`}
                  className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                  <span>Call {c.phone}</span>
                </a>

                {c.altPhone && (
                  <p className="text-[11px] text-center text-slate-400 font-mono">
                    Alt: {c.altPhone}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Protocols & Rights Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-3">
        <h3 className="font-bold text-base flex items-center gap-2 text-rose-300">
          <Shield className="w-5 h-5 text-rose-400" />
          <span>Hostel Safety Standards &amp; Anti-Ragging Zero Tolerance Policy</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Ananya Mahila Chhatralaya strictly enforces a zero-tolerance policy against any form of ragging, harassment, or intimidation under Supreme Court Regulations. CCTV surveillance covers all entry corridors and campus perimeters 24/7. Female security personnel are stationed on every floor and gate at all times.
        </p>
        <div className="pt-2 flex flex-wrap gap-4 text-xs text-rose-200 font-mono">
          <span>• Emergency Siren Gate Desk: Dial Ext 100</span>
          <span>• Medical Center Night Nurse: Dial Ext 102</span>
          <span>• ICC Confidential Helpdesk: icc@ananyahostel.edu</span>
        </div>
      </div>
    </div>
  );
};
