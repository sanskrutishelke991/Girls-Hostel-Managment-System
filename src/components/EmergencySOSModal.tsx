import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X, CheckCircle2, Siren } from 'lucide-react';
import { HELPLINE_CONTACTS } from '../data/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStudentRoom?: string;
  currentStudentName?: string;
}

export const EmergencySOSModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentStudentRoom = 'B-204',
  currentStudentName = 'Ananya Sharma',
}) => {
  const [sosTriggered, setSosTriggered] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  if (!isOpen) return null;

  const handleBroadcastSOS = () => {
    setSosTriggered(true);
    setTimeout(() => {
      setAlertSent(true);
    }, 800);
  };

  const handleReset = () => {
    setSosTriggered(false);
    setAlertSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden">
        {/* Header banner */}
        <div className="bg-red-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Siren className="w-6 h-6 animate-pulse text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">24/7 Women's Safety &amp; Emergency SOS</h3>
              <p className="text-xs text-red-100">Immediate rector, gate security &amp; police dispatch</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {alertSent ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-semibold text-emerald-900 text-base">Emergency Broadcast Transmitted</h4>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Security Main Gate, Floor Warden, and Chief Rector have received high-priority alert for{' '}
                <span className="font-semibold">{currentStudentName} (Room {currentStudentRoom})</span>. Security guards are dispatched to your block.
              </p>
              <div className="pt-2 text-xs text-slate-500">
                Audio siren triggered at Gate Station. Stay safe inside room or contact direct line below.
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-red-800 font-semibold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Instant Distress Alarm for Resident in Need</span>
              </div>
              <p className="text-xs text-red-700">
                Pressing the button below instantly sounds the emergency siren at the Security Gate Desk and alerts all on-duty Wardens with your Room <span className="font-semibold">{currentStudentRoom}</span> location coordinates.
              </p>
              <button
                onClick={handleBroadcastSOS}
                disabled={sosTriggered}
                className="w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-5 h-5" />
                {sosTriggered ? 'Transmitting Alert to Wardens...' : 'TRIGGER EMERGENCY SOS ALARM NOW'}
              </button>
            </div>
          )}

          {/* Quick Click-to-Call Emergency Directory */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Direct Emergency Hotlines
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {HELPLINE_CONTACTS.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-slate-900 truncate">{c.title}</p>
                    <p className="text-xs text-slate-500 truncate">{c.name} · {c.timing}</p>
                  </div>
                  <a
                    href={`tel:${c.phone.replace(/\s+/g, '')}`}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{c.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Toll-Free National Women Helpline: <strong>1091</strong></span>
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-white border border-slate-300 rounded-md font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
