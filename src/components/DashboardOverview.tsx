import React from 'react';
import {
  User,
  StudentAdmission,
  DayMessMenu,
  FeeRecord,
  AttendanceWindowConfig,
  DailyAttendanceRecord,
  InOutGateLog,
  Notice,
  Complaint,
} from '../types';
import {
  Utensils,
  CreditCard,
  Clock,
  Users,
  Bell,
  MessageSquareWarning,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Siren,
  Sparkles,
  PhoneCall,
  Calendar,
} from 'lucide-react';

interface Props {
  currentUser: User;
  students: StudentAdmission[];
  weeklyMenu: DayMessMenu[];
  feeRecords: FeeRecord[];
  attendanceWindow: AttendanceWindowConfig;
  attendanceRecords: DailyAttendanceRecord[];
  gateLogs: InOutGateLog[];
  notices: Notice[];
  complaints: Complaint[];
  onNavigateTab: (tabKey: string) => void;
  onOpenSOS: () => void;
}

export const DashboardOverview: React.FC<Props> = ({
  currentUser,
  students,
  weeklyMenu,
  feeRecords,
  attendanceWindow,
  attendanceRecords,
  gateLogs,
  notices,
  complaints,
  onNavigateTab,
  onOpenSOS,
}) => {
  const isStudent = currentUser.role === 'student';
  const isRector = currentUser.role === 'chief_rector' || currentUser.role === 'rector';
  const isMessOwner = currentUser.role === 'mess_owner';

  const todayMenu = weeklyMenu[0]; // Monday (Today)
  const outsideCount = gateLogs.filter((g) => g.status === 'outside').length;
  const pendingDues = feeRecords.filter((f) => f.status === 'due' || f.status === 'overdue');
  const openComplaintsCount = complaints.filter((c) => c.status !== 'resolved').length;

  const myFeeDue = feeRecords.find(
    (f) => (f.enrNo === currentUser.enrNo || f.studentId === currentUser.id) && (f.status === 'due' || f.status === 'overdue')
  );

  const myGatePass = gateLogs.find(
    (g) => (g.enrNo === currentUser.enrNo || g.studentId === currentUser.id) && g.status === 'outside'
  );

  const myAttendance = attendanceRecords.find(
    (a) => (a.enrNo === currentUser.enrNo || a.studentId === currentUser.id) && a.date === '2026-10-12'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-semibold backdrop-blur-sm border border-white/10">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Welcome, {currentUser.name}</span>
            <span className="opacity-60">·</span>
            <span className="capitalize">{currentUser.role.replace('_', ' ')}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ananya Girls Hostel &amp; Mess System
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isStudent &&
              `You are logged in as Resident of Room ${currentUser.roomNo || 'B-204'}. Check today's meal schedule, roll call status, and fee dues below.`}
            {isRector &&
              `Active administration dashboard for ${students.length} residents across Block A, B & C. Roll call attendance window is currently ${attendanceWindow.isActive ? 'ACTIVE' : 'INACTIVE'}.`}
            {isMessOwner &&
              `Mess Catering Control: Review today's 4-meal plan, dietary accommodations, and resident meal ratings.`}
          </p>
        </div>
      </div>

      {/* High Priority Alerts (Due fees, Gate Pass, SOS) */}
      {isStudent && myFeeDue && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase">
                Hostel &amp; Mess Fee Due: {myFeeDue.month} {myFeeDue.year}
              </h4>
              <p className="text-xs text-amber-800">
                Amount ₹{myFeeDue.total.toLocaleString()} due by {myFeeDue.dueDate}. Download instant digitally signed receipt upon payment.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('fees')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            Settle Online &amp; Get Receipt →
          </button>
        </div>
      )}

      {isStudent && myGatePass && (
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-orange-100 text-orange-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-orange-900 uppercase">
                Active Out-Gate Pass (Outside Hostel)
              </h4>
              <p className="text-xs text-orange-800">
                Destination: {myGatePass.destination}. Expected return strictly by <strong>{myGatePass.expectedInTime}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('attendance')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            Mark Safe Return →
          </button>
        </div>
      )}

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div
          onClick={() => onNavigateTab('admissions')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Residents</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {students.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across Wings A, B, C</div>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Currently Outside</span>
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {outsideCount}
          </div>
          <div className="text-[11px] text-orange-600 font-medium mt-1">On Approved Gate Passes</div>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => onNavigateTab('fees')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Pending Dues</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {pendingDues.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Residents With Reminders</div>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => onNavigateTab('complaints')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Open Grievances</span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <MessageSquareWarning className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {openComplaintsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Maintenance Tickets Active</div>
        </div>
      </div>

      {/* Main Split: Today's Mess Dining Snapshot & Today's Roll Call Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Today's Mess Schedule Preview (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500 text-white">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Today's Mess Menu Schedule (Monday)
                </h3>
                <p className="text-xs text-slate-500">
                  Four designated daily meal slots with live timing
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('mess')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Weekly Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Breakfast */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Morning (Breakfast)</span>
                <span className="text-[10px] text-slate-500 font-mono">{todayMenu.morning.timeRange}</span>
              </div>
              <p className="font-medium text-slate-700 truncate">{todayMenu.morning.items.slice(0, 2).join(', ')}</p>
              <span className="text-[10px] text-emerald-700 font-semibold block">Completed</span>
            </div>

            {/* Lunch */}
            <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-1 text-xs ring-1 ring-emerald-400/30">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950">Afternoon (Lunch)</span>
                <span className="text-[10px] text-emerald-700 font-mono">{todayMenu.afternoon.timeRange}</span>
              </div>
              <p className="font-medium text-slate-800 truncate">{todayMenu.afternoon.items.slice(0, 2).join(', ')}</p>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Serving Now
              </span>
            </div>

            {/* Evening */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Evening (Tea &amp; Snacks)</span>
                <span className="text-[10px] text-slate-500 font-mono">{todayMenu.evening.timeRange}</span>
              </div>
              <p className="font-medium text-slate-700 truncate">{todayMenu.evening.items.slice(0, 2).join(', ')}</p>
              <span className="text-[10px] text-slate-500">Upcoming at 05:00 PM</span>
            </div>

            {/* Dinner */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Dinner (Night Meal)</span>
                <span className="text-[10px] text-slate-500 font-mono">{todayMenu.dinner.timeRange}</span>
              </div>
              <p className="font-medium text-slate-700 truncate">{todayMenu.dinner.items.slice(0, 2).join(', ')}</p>
              <span className="text-[10px] text-slate-500">Upcoming at 08:00 PM</span>
            </div>
          </div>
        </div>

        {/* Right: Roll Call & Curfew Tracker (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Rector Attendance Window</span>
              </h3>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Active
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="font-semibold text-slate-900 block">{attendanceWindow.title}</span>
              <div className="flex items-center justify-between font-mono text-slate-600">
                <span>Start: {attendanceWindow.startTime}</span>
                <span>End: {attendanceWindow.endTime}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                All residents must mark presence before floor warden desk.
              </p>
            </div>

            {isStudent && (
              <div className="mt-3">
                {myAttendance ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Attendance verified for tonight ({myAttendance.markedTime} hrs).</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigateTab('attendance')}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Mark Roll Call Attendance Now →
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Curfew Closes: <strong>09:30 PM</strong></span>
            <button
              onClick={() => onNavigateTab('helpline')}
              className="text-red-600 font-semibold hover:text-red-700 flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Safety Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Notices Kicker Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Essential Notices &amp; Announcements</h3>
          </div>
          <button
            onClick={() => onNavigateTab('notices')}
            className="text-xs text-purple-700 font-semibold hover:text-purple-800 flex items-center gap-1"
          >
            <span>View All ({notices.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {notices.slice(0, 2).map((notice) => (
            <div
              key={notice.id}
              onClick={() => onNavigateTab('notices')}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer text-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800 uppercase text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                  {notice.category}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">{notice.date}</span>
              </div>
              <h4 className="font-bold text-slate-900 line-clamp-1">{notice.title}</h4>
              <p className="text-slate-600 line-clamp-2 mt-1">{notice.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
