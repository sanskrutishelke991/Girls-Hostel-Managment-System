import React, { useState, useEffect } from 'react';
import {
  User,
  StudentAdmission,
  DayMessMenu,
  MessFeedback,
  FeeRecord,
  AttendanceWindowConfig,
  DailyAttendanceRecord,
  InOutGateLog,
  Notice,
  HostelEvent,
  Complaint,
  VisitorLog,
  RoomServiceRequest,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_MESS_WEEK,
  INITIAL_MESS_FEEDBACK,
  INITIAL_FEES,
  INITIAL_ATTENDANCE_WINDOW,
  INITIAL_DAILY_ATTENDANCE,
  INITIAL_GATE_LOGS,
  INITIAL_NOTICES,
  INITIAL_EVENTS,
  INITIAL_COMPLAINTS,
  INITIAL_VISITORS,
  INITIAL_ROOM_SERVICE,
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { AuthScreen } from './components/AuthScreen';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { DashboardOverview } from './components/DashboardOverview';
import { MessMenuTab } from './components/MessMenuTab';
import { AdmissionsTab } from './components/AdmissionsTab';
import { FeesAndReceiptsTab } from './components/FeesAndReceiptsTab';
import { AttendanceGateTab } from './components/AttendanceGateTab';
import { NoticesAndEventsTab } from './components/NoticesAndEventsTab';
import { ComplaintsDeskTab } from './components/ComplaintsDeskTab';
import { ProfileVisitorRoomServiceTab } from './components/ProfileVisitorRoomServiceTab';
import { HelplineDeskTab } from './components/HelplineDeskTab';

import {
  LayoutDashboard,
  Utensils,
  Users,
  Receipt,
  Clock,
  Bell,
  MessageSquareWarning,
  UserCircle,
  Siren,
  PhoneCall,
  Menu,
  X,
} from 'lucide-react';

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[2]); // Default: Student (Ananya Sharma) for rich inspection
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data States
  const [students, setStudents] = useState<StudentAdmission[]>(INITIAL_STUDENTS);
  const [weeklyMenu, setWeeklyMenu] = useState<DayMessMenu[]>(INITIAL_MESS_WEEK);
  const [feedbacks, setFeedbacks] = useState<MessFeedback[]>(INITIAL_MESS_FEEDBACK);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(INITIAL_FEES);
  const [attendanceWindow, setAttendanceWindow] = useState<AttendanceWindowConfig>(INITIAL_ATTENDANCE_WINDOW);
  const [attendanceRecords, setAttendanceRecords] = useState<DailyAttendanceRecord[]>(INITIAL_DAILY_ATTENDANCE);
  const [gateLogs, setGateLogs] = useState<InOutGateLog[]>(INITIAL_GATE_LOGS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [events, setEvents] = useState<HostelEvent[]>(INITIAL_EVENTS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [visitors, setVisitors] = useState<VisitorLog[]>(INITIAL_VISITORS);
  const [roomServices, setRoomServices] = useState<RoomServiceRequest[]>(INITIAL_ROOM_SERVICE);

  // Current student dossier
  const currentStudentDossier = currentUser?.role === 'student'
    ? students.find((s) => s.enrollmentNo === currentUser.enrNo || s.id === currentUser.id)
    : undefined;

  // Handlers for Admissions
  const handleAddStudent = (newStudent: StudentAdmission) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: StudentAdmission) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  // Handlers for Mess
  const handleUpdateWeeklyMenu = (updatedWeek: DayMessMenu[]) => {
    setWeeklyMenu(updatedWeek);
  };

  const handleAddMessFeedback = (fb: MessFeedback) => {
    setFeedbacks((prev) => [fb, ...prev]);
  };

  // Handlers for Fees
  const handlePayFee = (recordId: string, method: 'UPI' | 'Credit/Debit Card' | 'Net Banking') => {
    const today = new Date().toISOString().split('T')[0];
    const txn = `TXN-${method.substring(0, 3).toUpperCase()}-${Math.floor(100000000 + Math.random() * 900000000)}`;

    setFeeRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === recordId) {
          return {
            ...rec,
            status: 'paid',
            paidDate: today,
            paymentMethod: method,
            transactionId: txn,
          };
        }
        return rec;
      })
    );
  };

  const handleSendDueReminders = () => {
    // Simulated bulk reminder
  };

  // Handlers for Attendance & Gate
  const handleUpdateAttendanceWindow = (config: AttendanceWindowConfig) => {
    setAttendanceWindow(config);
  };

  const handleMarkAttendance = (record: DailyAttendanceRecord) => {
    setAttendanceRecords((prev) => {
      const existingIdx = prev.findIndex(
        (r) => r.enrNo === record.enrNo && r.date === record.date
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = record;
        return copy;
      }
      return [record, ...prev];
    });
  };

  const handleLogGateOut = (log: InOutGateLog) => {
    setGateLogs((prev) => [log, ...prev]);
  };

  const handleLogGateIn = (logId: string, inTime: string) => {
    setGateLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId) {
          return {
            ...log,
            status: 'returned_on_time',
            actualInTime: inTime,
          };
        }
        return log;
      })
    );
  };

  // Handlers for Notices & Events
  const handleAddNotice = (notice: Notice) => {
    setNotices((prev) => [notice, ...prev]);
  };

  const handleAddEvent = (event: HostelEvent) => {
    setEvents((prev) => [event, ...prev]);
  };

  // Handlers for Complaints
  const handleAddComplaint = (c: Complaint) => {
    setComplaints((prev) => [c, ...prev]);
  };

  const handleUpdateComplaint = (c: Complaint) => {
    setComplaints((prev) => prev.map((item) => (item.id === c.id ? c : item)));
  };

  // Handlers for Visitors & Room Services
  const handleAddVisitor = (v: VisitorLog) => {
    setVisitors((prev) => [v, ...prev]);
  };

  const handleCheckOutVisitor = (visitorId: string, exitTime: string) => {
    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === visitorId) {
          return {
            ...v,
            exitTime,
            status: 'exited',
          };
        }
        return v;
      })
    );
  };

  const handleAddRoomService = (req: RoomServiceRequest) => {
    setRoomServices((prev) => [req, ...prev]);
  };

  const handleUpdateRoomServiceStatus = (id: string, status: 'scheduled' | 'completed', assignedStaff?: string) => {
    setRoomServices((prev) =>
      prev.map((rs) => {
        if (rs.id === id) {
          return {
            ...rs,
            status,
            assignedStaff: assignedStaff || rs.assignedStaff,
          };
        }
        return rs;
      })
    );
  };

  // Navigation Items
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'mess', label: 'Mess Food Menu', icon: Utensils },
    { key: 'admissions', label: 'Student Admissions', icon: Users },
    { key: 'fees', label: 'Fees & Receipts', icon: Receipt },
    { key: 'attendance', label: 'Attendance & Gate Pass', icon: Clock },
    { key: 'notices', label: 'Notices & Events', icon: Bell },
    { key: 'complaints', label: 'Complaint Box', icon: MessageSquareWarning },
    { key: 'profile', label: 'Profile & Visitors', icon: UserCircle },
    { key: 'helpline', label: '24/7 Helpline', icon: Siren },
  ];

  // If not logged in, render Authentication Screen
  if (!currentUser) {
    return <AuthScreen onLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenSOS={() => setIsSOSOpen(true)}
        onLogout={() => setCurrentUser(null)}
        onSwitchUser={() => setIsRoleSwitcherOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Desktop Sub-Navigation Bar */}
      <nav className="no-print bg-white border-b border-slate-200 shadow-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            currentUser={currentUser}
            students={students}
            weeklyMenu={weeklyMenu}
            feeRecords={feeRecords}
            attendanceWindow={attendanceWindow}
            attendanceRecords={attendanceRecords}
            gateLogs={gateLogs}
            notices={notices}
            complaints={complaints}
            onNavigateTab={(tabKey) => setActiveTab(tabKey)}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        )}

        {activeTab === 'mess' && (
          <MessMenuTab
            currentUser={currentUser}
            weeklyMenu={weeklyMenu}
            onUpdateMenu={handleUpdateWeeklyMenu}
            feedbacks={feedbacks}
            onAddFeedback={handleAddMessFeedback}
          />
        )}

        {activeTab === 'admissions' && (
          <AdmissionsTab
            currentUser={currentUser}
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
          />
        )}

        {activeTab === 'fees' && (
          <FeesAndReceiptsTab
            currentUser={currentUser}
            feeRecords={feeRecords}
            onPayFee={handlePayFee}
            onSendDueReminders={handleSendDueReminders}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceGateTab
            currentUser={currentUser}
            students={students}
            attendanceWindow={attendanceWindow}
            onUpdateWindow={handleUpdateAttendanceWindow}
            attendanceRecords={attendanceRecords}
            onMarkAttendance={handleMarkAttendance}
            gateLogs={gateLogs}
            onLogGateOut={handleLogGateOut}
            onLogGateIn={handleLogGateIn}
          />
        )}

        {activeTab === 'notices' && (
          <NoticesAndEventsTab
            currentUser={currentUser}
            notices={notices}
            onAddNotice={handleAddNotice}
            events={events}
            onAddEvent={handleAddEvent}
          />
        )}

        {activeTab === 'complaints' && (
          <ComplaintsDeskTab
            currentUser={currentUser}
            complaints={complaints}
            onAddComplaint={handleAddComplaint}
            onUpdateComplaint={handleUpdateComplaint}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileVisitorRoomServiceTab
            currentUser={currentUser}
            studentDossier={currentStudentDossier}
            visitors={visitors}
            onAddVisitor={handleAddVisitor}
            onCheckOutVisitor={handleCheckOutVisitor}
            roomServices={roomServices}
            onAddRoomService={handleAddRoomService}
            onUpdateRoomServiceStatus={handleUpdateRoomServiceStatus}
          />
        )}

        {activeTab === 'helpline' && (
          <HelplineDeskTab onTriggerSOS={() => setIsSOSOpen(true)} />
        )}
      </main>

      {/* Mobile Bottom Fixed Navigation Bar (15% Viewport Cap Compliant) */}
      <nav className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                  isActive ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-rose-600' : 'text-slate-400'}`} />
                <span className="truncate max-w-[56px]">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}

          {/* More trigger for mobile */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
              ['notices', 'complaints', 'profile', 'helpline'].includes(activeTab)
                ? 'text-rose-600 font-bold'
                : 'text-slate-500'
            }`}
          >
            <Menu className="w-4 h-4 mb-0.5 text-slate-400" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* Mobile Full Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">All Hostel Portals</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveTab(item.key);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                      isActive
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsRoleSwitcherOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-indigo-700 font-semibold"
              >
                Switch Role ({currentUser.role.replace('_', ' ')})
              </button>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-600 font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency SOS Alarm Modal */}
      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        currentStudentName={currentUser.name}
        currentStudentRoom={currentUser.roomNo || 'Campus Main Block'}
      />

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        currentUser={currentUser}
        onSelectUser={(user) => setCurrentUser(user)}
      />
    </div>
  );
}
