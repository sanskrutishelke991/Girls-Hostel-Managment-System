import React, { useState } from 'react';
import { User, VisitorLog, RoomServiceRequest, StudentAdmission } from '../types';
import {
  UserCircle,
  Users,
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  Phone,
  Shield,
  FileText,
  Calendar,
  X,
  Building,
  Check,
  LogOut,
  Wrench,
} from 'lucide-react';

interface Props {
  currentUser: User;
  studentDossier?: StudentAdmission;
  visitors: VisitorLog[];
  onAddVisitor: (visitor: VisitorLog) => void;
  onCheckOutVisitor: (visitorId: string, exitTime: string) => void;
  roomServices: RoomServiceRequest[];
  onAddRoomService: (request: RoomServiceRequest) => void;
  onUpdateRoomServiceStatus: (id: string, status: 'scheduled' | 'completed', assignedStaff?: string) => void;
}

export const ProfileVisitorRoomServiceTab: React.FC<Props> = ({
  currentUser,
  studentDossier,
  visitors,
  onAddVisitor,
  onCheckOutVisitor,
  roomServices,
  onAddRoomService,
  onUpdateRoomServiceStatus,
}) => {
  const [subSection, setSubSection] = useState<'profile' | 'visitors' | 'room_service'>('profile');
  const [showAddVisitorModal, setShowAddVisitorModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  // Visitor form state
  const [visName, setVisName] = useState('');
  const [visRelation, setVisRelation] = useState('Parents (Father & Mother)');
  const [visPhone, setVisPhone] = useState('');
  const [visIdProof, setVisIdProof] = useState('Aadhaar Card');
  const [visIdNumber, setVisIdNumber] = useState('');
  const [visEntryTime, setVisEntryTime] = useState('04:00 PM');
  const [visPurpose, setVisPurpose] = useState('');

  // Room Service form state
  const [serviceType, setServiceType] = useState<RoomServiceRequest['serviceType']>('room_cleaning');
  const [preferredSlot, setPreferredSlot] = useState('Tomorrow 10:00 AM – 12:00 PM');
  const [serviceNotes, setServiceNotes] = useState('');

  const isRector = currentUser.role === 'chief_rector' || currentUser.role === 'rector';

  const handleRegisterVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visName.trim() || !visPhone.trim()) return;

    const newVisitor: VisitorLog = {
      id: `vis-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      roomNo: currentUser.roomNo || 'B-204',
      visitorName: visName.trim(),
      relation: visRelation,
      phone: visPhone.trim(),
      idProof: visIdProof,
      idNumber: visIdNumber.trim() || 'VERIFIED-ID',
      visitDate: new Date().toISOString().split('T')[0],
      entryTime: visEntryTime,
      purpose: visPurpose.trim() || 'Parental family visit',
      approvedBy: 'Prof. Meenakshi Joshi',
      status: 'inside',
    };

    onAddVisitor(newVisitor);
    setShowAddVisitorModal(false);
    setVisName('');
    setVisPhone('');
    setVisPurpose('');
  };

  const handleRequestRoomService = (e: React.FormEvent) => {
    e.preventDefault();

    const newReq: RoomServiceRequest = {
      id: `rs-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      roomNo: currentUser.roomNo || 'B-204',
      serviceType,
      preferredTimeSlot: preferredSlot,
      notes: serviceNotes.trim(),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    onAddRoomService(newReq);
    setShowAddServiceModal(false);
    setServiceNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-600 text-white">
                <UserCircle className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Resident Profile, Visitor Pass &amp; Room Services
                </h2>
                <p className="text-xs text-slate-500">
                  Manage Family Visits · Housekeeping &amp; Pest Control · Resident Verification Profile
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {subSection === 'visitors' && (
              <button
                onClick={() => setShowAddVisitorModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Visitor Entry</span>
              </button>
            )}

            {subSection === 'room_service' && (
              <button
                onClick={() => setShowAddServiceModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Book Room Service</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSubSection('profile')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subSection === 'profile'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserCircle className="w-3.5 h-3.5" />
            <span>Profile &amp; Emergency Contacts</span>
          </button>
          <button
            onClick={() => setSubSection('visitors')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subSection === 'visitors'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Visitor Entry Logs ({visitors.length})</span>
          </button>
          <button
            onClick={() => setSubSection('room_service')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subSection === 'room_service'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Room Cleaning &amp; Maintenance Service</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: PROFILE SECTION */}
      {subSection === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Main User Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 md:col-span-1">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md">
                {currentUser.name.charAt(0)}
              </div>
              <h3 className="mt-3 font-bold text-slate-900 text-base">{currentUser.name}</h3>
              <p className="text-xs text-rose-700 font-semibold font-mono uppercase">
                {currentUser.role.replace('_', ' ')}
              </p>
              {currentUser.roomNo && (
                <div className="mt-2 inline-block px-3 py-1 bg-rose-50 text-rose-900 text-xs font-bold rounded-lg border border-rose-200">
                  Room {currentUser.roomNo} ({currentUser.bedNo || 'Bed 1'})
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-mono text-slate-900 truncate max-w-[170px]">{currentUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-mono text-slate-900">{currentUser.phone}</span>
              </div>
              {currentUser.enrNo && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Enrollment ID:</span>
                  <span className="font-mono text-slate-900 font-semibold">{currentUser.enrNo}</span>
                </div>
              )}
              {currentUser.course && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Course / Year:</span>
                  <span className="font-medium text-slate-900">{currentUser.course}</span>
                </div>
              )}
            </div>
          </div>

          {/* Family & Emergency Information Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 md:col-span-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Registered Family Contacts &amp; Residence Dossier</span>
            </h3>

            {studentDossier ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Father's Details</span>
                    <span className="font-semibold text-slate-900 block text-sm">
                      {studentDossier.familyInfo.fatherName}
                    </span>
                    <span className="font-mono text-slate-700 mt-0.5 block">
                      {studentDossier.familyInfo.fatherPhone}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {studentDossier.familyInfo.fatherOccupation}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Mother's Details</span>
                    <span className="font-semibold text-slate-900 block text-sm">
                      {studentDossier.familyInfo.motherName}
                    </span>
                    <span className="font-mono text-slate-700 mt-0.5 block">
                      {studentDossier.familyInfo.motherPhone}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Local City Guardian</span>
                  <div className="flex items-center justify-between flex-wrap gap-2 mt-1">
                    <span className="font-bold text-slate-900 text-sm">
                      {studentDossier.familyInfo.localGuardianName} (
                      {studentDossier.familyInfo.localGuardianRelation})
                    </span>
                    <span className="font-mono font-semibold text-indigo-700 text-sm">
                      {studentDossier.familyInfo.localGuardianPhone}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-2">
                    Home Address: {studentDossier.familyInfo.homeAddress}, {studentDossier.familyInfo.city},{' '}
                    {studentDossier.familyInfo.state} – {studentDossier.familyInfo.pincode}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-900">
                      Hostel Undertaking &amp; Medical Declared
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-800">
                    Blood Group: {studentDossier.bloodGroup}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <p>Hostel Administrative Staff / Rector Profile.</p>
                <p>Responsible for resident safety, gate passes, attendance checks, and dining oversight.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: VISITOR LOGS */}
      {subSection === 'visitors' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Visitor Entry &amp; Exit Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Permitted visiting hours: 09:00 AM – 06:30 PM in the Ground Floor Visitor Lounge
                </p>
              </div>

              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                {visitors.filter((v) => v.status === 'inside').length} Visitors In Lounge
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="px-5 py-3">Visitor Name</th>
                    <th className="px-4 py-3">Resident &amp; Room</th>
                    <th className="px-4 py-3">Relationship</th>
                    <th className="px-4 py-3">ID Proof</th>
                    <th className="px-4 py-3">Entry Time</th>
                    <th className="px-4 py-3">Exit Time</th>
                    <th className="px-4 py-3">Status</th>
                    {isRector && <th className="px-5 py-3 text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visitors.map((v) => {
                    const isInside = v.status === 'inside';

                    return (
                      <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3 font-semibold text-slate-900">
                          <div>{v.visitorName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{v.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-slate-800">{v.studentName}</span>
                          <span className="text-rose-700 font-bold block">Room {v.roomNo}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{v.relation}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                          {v.idProof} ({v.idNumber})
                        </td>
                        <td className="px-4 py-3 font-mono">{v.entryTime}</td>
                        <td className="px-4 py-3 font-mono">
                          {v.exitTime || <span className="text-indigo-600 italic">In Lounge</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isInside
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isInside ? 'In Lounge' : 'Departed'}
                          </span>
                        </td>
                        {isRector && (
                          <td className="px-5 py-3 text-right">
                            {isInside ? (
                              <button
                                onClick={() => {
                                  const now = new Date();
                                  const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                                  onCheckOutVisitor(v.id, timeFormatted);
                                }}
                                className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded"
                              >
                                Mark Exit
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400">Checked Out</span>
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

      {/* VIEW 3: ROOM SERVICES */}
      {subSection === 'room_service' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roomServices.map((rs) => {
              const isCompleted = rs.status === 'completed';

              return (
                <div
                  key={rs.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                        {rs.serviceType.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : rs.status === 'scheduled'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rs.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">
                      Room {rs.roomNo} · {rs.studentName}
                    </h4>

                    <div className="text-xs text-slate-600 mt-1 space-y-1">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Slot: {rs.preferredTimeSlot}</span>
                      </div>
                      {rs.notes && (
                        <p className="text-slate-700 italic bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                          "{rs.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">
                      {rs.assignedStaff ? `Staff: ${rs.assignedStaff}` : 'Staff: Pending Assignment'}
                    </span>
                    {isRector && !isCompleted && (
                      <button
                        onClick={() => onUpdateRoomServiceStatus(rs.id, 'completed', 'Housekeeping Lead')}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded"
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Log New Visitor */}
      {showAddVisitorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-indigo-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Register Visitor Entry Pass</h3>
                <p className="text-xs text-indigo-200">Visitor lounge gate register</p>
              </div>
              <button
                onClick={() => setShowAddVisitorModal(false)}
                className="p-1 rounded-lg text-indigo-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterVisitor} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  required
                  value={visName}
                  onChange={(e) => setVisName(e.target.value)}
                  placeholder="e.g. Mr. Rajesh Sharma"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relationship to Resident</label>
                <select
                  value={visRelation}
                  onChange={(e) => setVisRelation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option>Parents (Father & Mother)</option>
                  <option>Mother</option>
                  <option>Father</option>
                  <option>Local Guardian</option>
                  <option>Brother / Sister</option>
                  <option>Immediate Family Member</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Visitor Mobile No *</label>
                  <input
                    type="text"
                    required
                    value={visPhone}
                    onChange={(e) => setVisPhone(e.target.value)}
                    placeholder="+91 98220 00000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Entry Time</label>
                  <input
                    type="text"
                    value={visEntryTime}
                    onChange={(e) => setVisEntryTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ID Proof Type</label>
                  <select
                    value={visIdProof}
                    onChange={(e) => setVisIdProof(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    <option>Aadhaar Card</option>
                    <option>Driving License</option>
                    <option>Voter ID</option>
                    <option>Govt Employee ID</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ID Card Last 4 Digits</label>
                  <input
                    type="text"
                    value={visIdNumber}
                    onChange={(e) => setVisIdNumber(e.target.value)}
                    placeholder="e.g. 9921"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  value={visPurpose}
                  onChange={(e) => setVisPurpose(e.target.value)}
                  placeholder="e.g. Family visit, bringing study supplies"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddVisitorModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-semibold"
                >
                  Issue Visitor Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Book Room Service */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-rose-600 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Book Hostel Room Service</h3>
                <p className="text-xs text-rose-100">Room {currentUser.roomNo || 'B-204'}</p>
              </div>
              <button
                onClick={() => setShowAddServiceModal(false)}
                className="p-1 rounded-lg text-rose-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestRoomService} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="room_cleaning">Room Deep Cleaning &amp; Mopping</option>
                  <option value="pest_control">Pest Control &amp; Insect Repellent</option>
                  <option value="fan_ac_repair">Ceiling Fan / Switch / Regulator Check</option>
                  <option value="bed_curtain_service">Mattress Sanitization &amp; Curtains</option>
                  <option value="water_purifier_check">Water Purifier &amp; Dispenser Check</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Time Slot</label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option>Tomorrow Morning (09:00 AM – 11:30 AM)</option>
                  <option>Tomorrow Afternoon (02:00 PM – 04:30 PM)</option>
                  <option>Saturday Morning (10:00 AM – 12:30 PM)</option>
                  <option>Saturday Afternoon (03:00 PM – 05:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specific Instructions / Notes</label>
                <textarea
                  rows={3}
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                  placeholder="e.g. Please clean balcony floor and wipe ceiling fan blades..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold"
                >
                  Schedule Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
