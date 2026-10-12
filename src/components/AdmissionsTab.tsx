import React, { useState } from 'react';
import { User, StudentAdmission } from '../types';
import {
  Users,
  Search,
  Plus,
  FileCheck,
  FileX,
  Phone,
  Home,
  UserCheck,
  ShieldAlert,
  ChevronRight,
  X,
  Filter,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Building,
} from 'lucide-react';

interface Props {
  currentUser: User;
  students: StudentAdmission[];
  onAddStudent: (newStudent: StudentAdmission) => void;
  onUpdateStudent: (updatedStudent: StudentAdmission) => void;
}

export const AdmissionsTab: React.FC<Props> = ({
  currentUser,
  students,
  onAddStudent,
  onUpdateStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentAdmission | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending_approval'>('all');

  const isStaff = currentUser.role === 'chief_rector' || currentUser.role === 'rector';

  // Form states for New Admission
  const [formName, setFormName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formEnr, setFormEnr] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCourse, setFormCourse] = useState('B.Tech');
  const [formBranch, setFormBranch] = useState('Computer Engineering');
  const [formYear, setFormYear] = useState('1st Year');
  const [formRoom, setFormRoom] = useState('A-105');
  const [formBed, setFormBed] = useState('Bed 1');
  const [formBlood, setFormBlood] = useState('B+');

  // Family Info states
  const [formFatherName, setFormFatherName] = useState('');
  const [formFatherPhone, setFormFatherPhone] = useState('');
  const [formFatherOcc, setFormFatherOcc] = useState('');
  const [formMotherName, setFormMotherName] = useState('');
  const [formMotherPhone, setFormMotherPhone] = useState('');
  const [formGuardianName, setFormGuardianName] = useState('');
  const [formGuardianPhone, setFormGuardianPhone] = useState('');
  const [formGuardianRel, setFormGuardianRel] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('Maharashtra');
  const [formPincode, setFormPincode] = useState('');

  // Essential Documents state
  const [docCollegeId, setDocCollegeId] = useState(true);
  const [docAadhaar, setDocAadhaar] = useState(true);
  const [docMedical, setDocMedical] = useState(true);
  const [docUndertaking, setDocUndertaking] = useState(true);
  const [docParentConsent, setDocParentConsent] = useState(true);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.mobileNo.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formMobile || !formEnr || !formRoom) return;

    const newAdmission: StudentAdmission = {
      id: `std-${Date.now()}`,
      fullName: formName.trim(),
      mobileNo: formMobile.trim(),
      enrollmentNo: formEnr.trim().toUpperCase(),
      email: formEmail.trim() || `${formEnr.toLowerCase()}@college.edu`,
      course: formCourse,
      branch: formBranch,
      year: formYear,
      roomNo: formRoom.trim(),
      bedNo: formBed,
      bloodGroup: formBlood,
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'active',
      emergencyContact: formFatherPhone.trim() || formMobile.trim(),
      familyInfo: {
        fatherName: formFatherName.trim(),
        fatherPhone: formFatherPhone.trim(),
        fatherOccupation: formFatherOcc.trim(),
        motherName: formMotherName.trim(),
        motherPhone: formMotherPhone.trim(),
        localGuardianName: formGuardianName.trim(),
        localGuardianPhone: formGuardianPhone.trim(),
        localGuardianRelation: formGuardianRel.trim(),
        homeAddress: formAddress.trim(),
        city: formCity.trim(),
        state: formState.trim(),
        pincode: formPincode.trim(),
      },
      documents: {
        collegeIdUploaded: docCollegeId,
        aadhaarUploaded: docAadhaar,
        medicalDeclarationUploaded: docMedical,
        undertakingSigned: docUndertaking,
        parentConsentUploaded: docParentConsent,
        documentNotes: 'Verified at Rector Desk during admission intake.',
      },
    };

    onAddStudent(newAdmission);
    setShowAddModal(false);
    // Reset form
    setFormName('');
    setFormMobile('');
    setFormEnr('');
  };

  const handleApproveAdmission = (student: StudentAdmission) => {
    const updated = { ...student, status: 'active' as const };
    onUpdateStudent(updated);
    if (selectedStudent && selectedStudent.id === student.id) {
      setSelectedStudent(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with stats and action */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-600 text-white">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Student Admission Records &amp; Resident Dossier
                </h2>
                <p className="text-xs text-slate-500">
                  Enrollment Records · Room Allotment · Family &amp; Guardian Contacts · Essential Document Verification
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isStaff && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Student Admission</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Name, Enr No, Room..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Residents ({students.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'active'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({students.filter((s) => s.status === 'active').length})
            </button>
            <button
              onClick={() => setStatusFilter('pending_approval')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'pending_approval'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Approval ({students.filter((s) => s.status === 'pending_approval').length})
            </button>
          </div>
        </div>
      </div>

      {/* Students Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((std) => {
          const docCount = Object.values(std.documents).filter((v) => v === true).length;
          const isPending = std.status === 'pending_approval';

          return (
            <div
              key={std.id}
              onClick={() => setSelectedStudent(std)}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{std.fullName}</h3>
                    <p className="text-xs text-rose-700 font-mono font-semibold">{std.enrollmentNo}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPending
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}
                  >
                    {isPending ? 'Pending Approval' : 'Active'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Allotted Room:</span>
                    <span className="font-semibold text-slate-900">{std.roomNo} ({std.bedNo})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Branch &amp; Year:</span>
                    <span className="truncate max-w-[160px] text-right font-medium">
                      {std.branch} · {std.year}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mobile No:</span>
                    <span className="font-mono text-slate-800">{std.mobileNo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Blood Group:</span>
                    <span className="font-semibold text-rose-600">{std.bloodGroup}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Docs: {docCount}/5 Verified</span>
                </div>
                <span className="text-rose-600 font-semibold flex items-center gap-0.5">
                  View Dossier
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Dossier Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white font-bold text-lg">
                  {selectedStudent.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    {selectedStudent.fullName}
                  </h3>
                  <p className="text-xs text-slate-300 font-mono">
                    {selectedStudent.enrollmentNo} · Room {selectedStudent.roomNo} ({selectedStudent.bedNo})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Approval Alert if Pending */}
              {selectedStudent.status === 'pending_approval' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Admission Awaiting Rector Countersignature
                    </h4>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Documents uploaded. Chief Rector / Rector approval confirms room keys and gate privileges.
                    </p>
                  </div>
                  {isStaff && (
                    <button
                      onClick={() => handleApproveAdmission(selectedStudent)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm shrink-0"
                    >
                      Approve Admission
                    </button>
                  )}
                </div>
              )}

              {/* Section 1: Academic & Room Allocation */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Academic &amp; Allotment Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block">Course &amp; Branch</span>
                    <span className="font-semibold text-slate-900">
                      {selectedStudent.course} {selectedStudent.branch}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Academic Year</span>
                    <span className="font-semibold text-slate-900">{selectedStudent.year}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Admission Date</span>
                    <span className="font-semibold text-slate-900">{selectedStudent.admissionDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Room Number</span>
                    <span className="font-semibold text-rose-700">{selectedStudent.roomNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Bed Assignment</span>
                    <span className="font-semibold text-slate-900">{selectedStudent.bedNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Blood Group</span>
                    <span className="font-semibold text-rose-600">{selectedStudent.bloodGroup}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Family Information */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Family &amp; Guardian Information
                </h4>
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 block">Father's Full Name</span>
                      <span className="font-semibold text-slate-900">
                        {selectedStudent.familyInfo.fatherName}
                      </span>
                      <div className="flex items-center gap-1 text-slate-600 font-mono mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{selectedStudent.familyInfo.fatherPhone}</span>
                      </div>
                      {selectedStudent.familyInfo.fatherOccupation && (
                        <span className="text-[11px] text-slate-500">
                          Occupation: {selectedStudent.familyInfo.fatherOccupation}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-slate-400 block">Mother's Full Name</span>
                      <span className="font-semibold text-slate-900">
                        {selectedStudent.familyInfo.motherName}
                      </span>
                      <div className="flex items-center gap-1 text-slate-600 font-mono mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{selectedStudent.familyInfo.motherPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-slate-400 block">Local Guardian (City Contact)</span>
                    <div className="flex items-center justify-between flex-wrap gap-2 mt-0.5">
                      <span className="font-semibold text-slate-900">
                        {selectedStudent.familyInfo.localGuardianName} (
                        {selectedStudent.familyInfo.localGuardianRelation})
                      </span>
                      <div className="flex items-center gap-1 text-slate-700 font-mono font-medium">
                        <Phone className="w-3 h-3 text-indigo-600" />
                        <span>{selectedStudent.familyInfo.localGuardianPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-slate-400 block">Permanent Home Residence Address</span>
                    <div className="flex items-start gap-1.5 text-slate-700 mt-1">
                      <Home className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        {selectedStudent.familyInfo.homeAddress}, {selectedStudent.familyInfo.city},{' '}
                        {selectedStudent.familyInfo.state} – {selectedStudent.familyInfo.pincode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Essential Documents Checklist */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Essential Documents Verification
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                    <span className="font-medium text-slate-700">College ID Proof</span>
                    {selectedStudent.documents.collegeIdUploaded ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">Missing</span>
                    )}
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                    <span className="font-medium text-slate-700">Aadhaar / Govt ID Card</span>
                    {selectedStudent.documents.aadhaarUploaded ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">Missing</span>
                    )}
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                    <span className="font-medium text-slate-700">Medical Fitness Declaration</span>
                    {selectedStudent.documents.medicalDeclarationUploaded ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">Missing</span>
                    )}
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                    <span className="font-medium text-slate-700">Signed Hostel Undertaking</span>
                    {selectedStudent.documents.undertakingSigned ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold">Awaiting Sign</span>
                    )}
                  </div>
                </div>

                {selectedStudent.documents.documentNotes && (
                  <p className="text-[11px] text-slate-500 italic mt-2">
                    Note: {selectedStudent.documents.documentNotes}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-500">
                Hostel Wing In-Charge verified
              </span>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Student Admission Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-rose-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base">New Resident Student Admission</h3>
                <p className="text-xs text-rose-100">
                  Register student, assign room, record family info &amp; documents
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmission} className="p-6 overflow-y-auto space-y-5">
              {/* Part 1: Basic info */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Student Identity &amp; Room Assignment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Priyadarshini Shinde"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="text"
                      required
                      value={formMobile}
                      onChange={(e) => setFormMobile(e.target.value)}
                      placeholder="+91 98220 00000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Enrollment Number (Enr No) *</label>
                    <input
                      type="text"
                      required
                      value={formEnr}
                      onChange={(e) => setFormEnr(e.target.value)}
                      placeholder="e.g. ENR-2025-CS088"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Student Email</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="student@college.edu"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Branch / Department</label>
                    <input
                      type="text"
                      value={formBranch}
                      onChange={(e) => setFormBranch(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Academic Year</label>
                    <select
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year (Final)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Allotted Room No *</label>
                    <input
                      type="text"
                      required
                      value={formRoom}
                      onChange={(e) => setFormRoom(e.target.value)}
                      placeholder="e.g. B-205"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Bed No &amp; Blood Group</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={formBed}
                        onChange={(e) => setFormBed(e.target.value)}
                        className="px-2 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                      >
                        <option>Bed 1</option>
                        <option>Bed 2</option>
                        <option>Bed 3</option>
                      </select>
                      <input
                        type="text"
                        value={formBlood}
                        onChange={(e) => setFormBlood(e.target.value)}
                        placeholder="O+, B+, etc."
                        className="px-2 py-2 border border-slate-300 rounded-lg text-sm text-center font-bold text-rose-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 2: Family Information */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Family &amp; Local Guardian Contacts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Father's Name</label>
                    <input
                      type="text"
                      value={formFatherName}
                      onChange={(e) => setFormFatherName(e.target.value)}
                      placeholder="Father's Name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Father's Mobile No</label>
                    <input
                      type="text"
                      value={formFatherPhone}
                      onChange={(e) => setFormFatherPhone(e.target.value)}
                      placeholder="+91 98000 00000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Mother's Name</label>
                    <input
                      type="text"
                      value={formMotherName}
                      onChange={(e) => setFormMotherName(e.target.value)}
                      placeholder="Mother's Name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Mother's Mobile No</label>
                    <input
                      type="text"
                      value={formMotherPhone}
                      onChange={(e) => setFormMotherPhone(e.target.value)}
                      placeholder="+91 98000 00000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Local Guardian Name &amp; Relation</label>
                    <input
                      type="text"
                      value={formGuardianName}
                      onChange={(e) => setFormGuardianName(e.target.value)}
                      placeholder="e.g. Mr. S. K. Roy (Uncle)"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Local Guardian Phone</label>
                    <input
                      type="text"
                      value={formGuardianPhone}
                      onChange={(e) => setFormGuardianPhone(e.target.value)}
                      placeholder="+91 94000 00000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-700 mb-1">Home Address</label>
                    <input
                      type="text"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder="Permanent Residence Street Address"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">City / Town</label>
                    <input
                      type="text"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      placeholder="e.g. Pune"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={formPincode}
                      onChange={(e) => setFormPincode(e.target.value)}
                      placeholder="e.g. 411005"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Part 3: Essential Documents Checklist */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  3. Essential Documents Checklist
                </h4>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={docCollegeId}
                      onChange={(e) => setDocCollegeId(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-800">College Bonafide / ID Card Submitted</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={docAadhaar}
                      onChange={(e) => setDocAadhaar(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-800">Govt Aadhaar / Identity Verification Uploaded</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={docMedical}
                      onChange={(e) => setDocMedical(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-800">Medical Fitness Certificate by Registered Physician</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={docUndertaking}
                      onChange={(e) => setDocUndertaking(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span className="font-medium text-slate-800">Hostel Rules &amp; Anti-Ragging Undertaking Signed</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Complete Admission Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
