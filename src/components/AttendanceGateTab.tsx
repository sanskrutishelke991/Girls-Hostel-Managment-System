import React, { useState } from 'react';
import { User, AttendanceWindowConfig, DailyAttendanceRecord, InOutGateLog, StudentAdmission } from '../types';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  LogOut,
  LogIn,
  MapPin,
  Calendar,
  Phone,
  Shield,
  Edit2,
  X,
  Bell,
  Search,
  Filter,
} from 'lucide-react';

interface Props {
  currentUser: User;
  students: StudentAdmission[];
  attendanceWindow: AttendanceWindowConfig;
  onUpdateWindow: (config: AttendanceWindowConfig) => void;
  attendanceRecords: DailyAttendanceRecord[];
  onMarkAttendance: (record: DailyAttendanceRecord) => void;
  gateLogs: InOutGateLog[];
  onLogGateOut: (log: InOutGateLog) => void;
  onLogGateIn: (logId: string, inTime: string) => void;
}

export const AttendanceGateTab: React.FC<Props> = ({
  currentUser,
  students,
  attendanceWindow,
  onUpdateWindow,
  attendanceRecords,
  onMarkAttendance,
  gateLogs,
  onLogGateOut,
  onLogGateIn,
}) => {
  const [subTab, setSubTab] = useState<'attendance' | 'in_out_gate'>('attendance');
  const [showEditWindowModal, setShowEditWindowModal] = useState(false);
  const [showGatePassModal, setShowGatePassModal] = useState(false);

  // Rector window edit state
  const [windowTitle, setWindowTitle] = useState(attendanceWindow.title);
  const [windowStart, setWindowStart] = useState(attendanceWindow.startTime);
  const [windowEnd, setWindowEnd] = useState(attendanceWindow.endTime);
  const [windowInstructions, setWindowInstructions] = useState(attendanceWindow.instructions);
  const [windowActive, setWindowActive] = useState(attendanceWindow.isActive);

  // Student Gate Pass Form state
  const [gateDestination, setGateDestination] = useState('');
  const [gatePurpose, setGatePurpose] = useState('');
  const [gateOutTime, setGateOutTime] = useState('17:30');
  const [gateExpectedIn, setGateExpectedIn] = useState('19:30');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [parentAlertId, setParentAlertId] = useState<string | null>(null);

  const isRector = currentUser.role === 'chief_rector' || currentUser.role === 'rector';
  const isStudent = currentUser.role === 'student';

  const todayStr = '2026-10-12';

  // Check if current student has marked attendance
  const myAttendanceRecord = attendanceRecords.find(
    (r) => (r.enrNo === currentUser.enrNo || r.studentId === currentUser.id) && r.date === todayStr
  );

  // Check if current student has an active "outside" gate pass
  const myActivePass = gateLogs.find(
    (l) => (l.enrNo === currentUser.enrNo || l.studentId === currentUser.id) && l.status === 'outside'
  );

  const handleSaveWindow = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWindow({
      ...attendanceWindow,
      title: windowTitle,
      startTime: windowStart,
      endTime: windowEnd,
      instructions: windowInstructions,
      isActive: windowActive,
      updatedBy: currentUser.name,
    });
    setShowEditWindowModal(false);
  };

  const handleStudentMarkAttendance = () => {
    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRecord: DailyAttendanceRecord = {
      id: `att-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      enrNo: currentUser.enrNo || 'ENR-2023-CS042',
      roomNo: currentUser.roomNo || 'B-204',
      date: todayStr,
      windowType: attendanceWindow.title,
      status: 'present',
      markedTime: timeFormatted,
      locationVerified: true,
      rectorVerified: true,
    };
    onMarkAttendance(newRecord);
  };

  const handleCreateGatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gateDestination || !gatePurpose) return;

    const newLog: InOutGateLog = {
      id: `gate-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      enrNo: currentUser.enrNo || 'ENR-2023-CS042',
      roomNo: currentUser.roomNo || 'B-204',
      date: todayStr,
      outTime: gateOutTime,
      expectedInTime: gateExpectedIn,
      destination: gateDestination.trim(),
      purpose: gatePurpose.trim(),
      guardianNotified: true,
      status: 'outside',
      approvedBy: 'Prof. Meenakshi Joshi',
    };

    onLogGateOut(newLog);
    setShowGatePassModal(false);
    setGateDestination('');
    setGatePurpose('');
  };

  const handleReturnGatePass = (logId: string) => {
    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    onLogGateIn(logId, timeFormatted);
  };

  const handleNotifyGuardianSimulate = (logId: string) => {
    setParentAlertId(logId);
    setTimeout(() => {
      setParentAlertId(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-600 text-white">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Attendance &amp; Daily In/Out Gate Pass
                </h2>
                <p className="text-xs text-slate-500">
                  Rector-Specified Roll Call Windows · Real-time Entry &amp; Exit Timestamps · Safety Oversight
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRector && (
              <button
                onClick={() => setShowEditWindowModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-indigo-700" />
                <span>Configure Rector Window</span>
              </button>
            )}

            {isStudent && (
              <button
                onClick={() => setShowGatePassModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Request In/Out Gate Pass</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tabs: Attendance Window vs In/Out Gate Logs */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => setSubTab('attendance')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'attendance'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Night Roll Call Attendance</span>
          </button>
          <button
            onClick={() => setSubTab('in_out_gate')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'in_out_gate'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Daily In &amp; Out Movement Logs ({gateLogs.filter((g) => g.status === 'outside').length} Outside)</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ATTENDANCE ROLL CALL */}
      {subTab === 'attendance' && (
        <div className="space-y-5">
          {/* Active Rector Time Window Banner */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    Mandatory Time Window
                  </span>
                  <span className="text-xs text-indigo-200">
                    Set by {attendanceWindow.updatedBy}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{attendanceWindow.title}</h3>
                <div className="flex items-center gap-2 text-indigo-200 text-xs font-mono">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>
                    Scheduled Window: <strong>{attendanceWindow.startTime}</strong> –{' '}
                    <strong>{attendanceWindow.endTime}</strong> (Daily)
                  </span>
                </div>
                <p className="text-xs text-indigo-200/80 pt-1 max-w-xl">
                  {attendanceWindow.instructions}
                </p>
              </div>

              {/* Student Action inside the window */}
              {isStudent && (
                <div className="shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center space-y-2">
                  {myAttendanceRecord ? (
                    <div>
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto mb-1">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-emerald-300 block">
                        Attendance Marked Present
                      </span>
                      <span className="text-[11px] text-indigo-200 font-mono block">
                        Timestamp: {myAttendanceRecord.markedTime} hrs
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-indigo-200 mb-2">
                        Window is currently open for Roll Call
                      </p>
                      <button
                        onClick={handleStudentMarkAttendance}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                      >
                        ✓ Mark My Attendance (Room {currentUser.roomNo})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Attendance KPI overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-slate-400 text-xs block">Total Registered</span>
              <span className="text-xl font-bold text-slate-900 font-mono">
                {students.length} Residents
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-emerald-600 text-xs font-semibold block">Present Tonight</span>
              <span className="text-xl font-bold text-emerald-700 font-mono">
                {attendanceRecords.filter((a) => a.status === 'present').length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-amber-600 text-xs font-semibold block">Approved Home Leave</span>
              <span className="text-xl font-bold text-amber-700 font-mono">
                {attendanceRecords.filter((a) => a.status === 'on_leave').length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-rose-600 text-xs font-semibold block">Unaccounted / Absent</span>
              <span className="text-xl font-bold text-rose-700 font-mono">
                {students.length - attendanceRecords.filter((a) => a.status === 'present' || a.status === 'on_leave').length}
              </span>
            </div>
          </div>

          {/* Daily Attendance Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Daily Night Roll Call Attendance Roster ({todayStr})
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Verified by Rector Desk
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="px-5 py-3">Student / Enr No</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Roll Call Status</th>
                    <th className="px-4 py-3">Marked Timestamp</th>
                    <th className="px-4 py-3">Parent Contact</th>
                    {isRector && <th className="px-5 py-3 text-right">Rector Verification</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => {
                    const record = attendanceRecords.find(
                      (r) => (r.enrNo === student.enrollmentNo || r.studentId === student.id) && r.date === todayStr
                    );
                    const status = record ? record.status : 'absent';

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-900">{student.fullName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{student.enrollmentNo}</div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-rose-700">{student.roomNo}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              status === 'present'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : status === 'on_leave'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {status === 'present' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {status === 'absent' && <XCircle className="w-3 h-3 text-rose-600" />}
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600">
                          {record?.markedTime ? `${record.markedTime} hrs` : 'Not marked yet'}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600">
                          {student.familyInfo.fatherPhone || student.emergencyContact}
                        </td>
                        {isRector && (
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => {
                                const newStatus = status === 'present' ? 'absent' : 'present';
                                onMarkAttendance({
                                  id: `att-manual-${Date.now()}`,
                                  studentId: student.id,
                                  studentName: student.fullName,
                                  enrNo: student.enrollmentNo,
                                  roomNo: student.roomNo,
                                  date: todayStr,
                                  windowType: attendanceWindow.title,
                                  status: newStatus,
                                  markedTime: 'Manual by Rector',
                                  rectorVerified: true,
                                });
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                            >
                              Toggle Status
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DAILY IN & OUT MOVEMENT LOGS */}
      {subTab === 'in_out_gate' && (
        <div className="space-y-5">
          {/* Active Pass Alert for Student */}
          {isStudent && myActivePass && (
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-700 mt-0.5">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-orange-900 uppercase">
                    Currently Outside Campus (Active Gate Pass)
                  </h4>
                  <p className="text-xs text-orange-800 mt-0.5">
                    Departed at {myActivePass.outTime} for {myActivePass.destination}. Expected Return: <strong>{myActivePass.expectedInTime}</strong>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleReturnGatePass(myActivePass.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm whitespace-nowrap cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Mark My Entry Back Inside Hostel</span>
              </button>
            </div>
          )}

          {/* Search & Gate Roster */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Daily Gate In/Out Register &amp; Movement Tracker
                </h3>
                <p className="text-xs text-slate-500">
                  Every resident movement outside campus is timestamped and verified with guardian notice
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                  {gateLogs.filter((g) => g.status === 'outside').length} Residents Currently Outside
                </span>
              </div>
            </div>

            {parentAlertId && (
              <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Guardian SMS alert successfully dispatched with student out-time coordinates!</span>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="px-5 py-3">Resident / Room</th>
                    <th className="px-4 py-3">Out Time</th>
                    <th className="px-4 py-3">Expected Return</th>
                    <th className="px-4 py-3">Actual In Time</th>
                    <th className="px-4 py-3">Destination &amp; Purpose</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    {isRector && <th className="px-5 py-3 text-right">Warden Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gateLogs.map((log) => {
                    const isOutside = log.status === 'outside';
                    const isLate = log.status === 'late_return';

                    return (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-900">{log.studentName}</div>
                          <div className="text-[11px] text-rose-700 font-semibold font-mono">
                            Room {log.roomNo} · {log.enrNo}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono font-medium text-slate-700">
                          {log.outTime} hrs
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-700">
                          {log.expectedInTime}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {log.actualInTime ? (
                            <span className="text-emerald-700 font-medium">{log.actualInTime} hrs</span>
                          ) : (
                            <span className="text-amber-600 italic">Outside Campus</span>
                          )}
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="font-semibold text-slate-900">{log.destination}</p>
                          <p className="text-[11px] text-slate-500 truncate">{log.purpose}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isOutside
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : isLate
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isOutside ? 'Outside' : isLate ? 'Late Return' : 'Returned'}
                          </span>
                        </td>
                        {isRector && (
                          <td className="px-5 py-3 text-right">
                            {isOutside ? (
                              <button
                                onClick={() => handleNotifyGuardianSimulate(log.id)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition-colors"
                              >
                                Notify Guardian
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400">Logged</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Rector Modal: Configure Attendance Time Window */}
      {showEditWindowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-indigo-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Configure Rector Attendance Window</h3>
                <p className="text-xs text-indigo-200">
                  Set daily mandatory roll call check timing
                </p>
              </div>
              <button
                onClick={() => setShowEditWindowModal(false)}
                className="p-1 rounded-lg text-indigo-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWindow} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Roll Call Window Name
                </label>
                <input
                  type="text"
                  value={windowTitle}
                  onChange={(e) => setWindowTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time (24h)
                  </label>
                  <input
                    type="time"
                    value={windowStart}
                    onChange={(e) => setWindowStart(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time (24h)
                  </label>
                  <input
                    type="time"
                    value={windowEnd}
                    onChange={(e) => setWindowEnd(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Instructions for Residents
                </label>
                <textarea
                  rows={3}
                  value={windowInstructions}
                  onChange={(e) => setWindowInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={windowActive}
                  onChange={(e) => setWindowActive(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">
                  Window Is Currently Active &amp; Open for Check-in
                </span>
              </label>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEditWindowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Modal: Request In/Out Gate Pass */}
      {showGatePassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-rose-600 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Hostel In/Out Movement Gate Pass</h3>
                <p className="text-xs text-rose-100">
                  Log your departure and expected return time
                </p>
              </div>
              <button
                onClick={() => setShowGatePassModal(false)}
                className="p-1 rounded-lg text-rose-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGatePass} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block">Resident</span>
                <span className="font-bold text-slate-900">{currentUser.name}</span>
                <span className="text-rose-700 font-semibold block font-mono">
                  Room {currentUser.roomNo} · {currentUser.enrNo}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination *
                </label>
                <input
                  type="text"
                  required
                  value={gateDestination}
                  onChange={(e) => setGateDestination(e.target.value)}
                  placeholder="e.g. University Central Library, Coaching Center"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Purpose of Leaving Hostel *
                </label>
                <input
                  type="text"
                  required
                  value={gatePurpose}
                  onChange={(e) => setGatePurpose(e.target.value)}
                  placeholder="e.g. Academic project books, medical consultation"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Departure / Out Time
                  </label>
                  <input
                    type="time"
                    value={gateOutTime}
                    onChange={(e) => setGateOutTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expected In Time
                  </label>
                  <input
                    type="time"
                    value={gateExpectedIn}
                    onChange={(e) => setGateExpectedIn(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Notice: Main security gate closes at 09:30 PM. Parents receive automated SMS notification upon gate card swipe.
              </p>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowGatePassModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Generate Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
