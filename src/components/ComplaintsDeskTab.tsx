import React, { useState } from 'react';
import { User, Complaint } from '../types';
import {
  MessageSquareWarning,
  Plus,
  Clock,
  CheckCircle2,
  Wrench,
  AlertCircle,
  X,
  UserX,
  Filter,
  Search,
} from 'lucide-react';

interface Props {
  currentUser: User;
  complaints: Complaint[];
  onAddComplaint: (complaint: Complaint) => void;
  onUpdateComplaint: (updated: Complaint) => void;
}

export const ComplaintsDeskTab: React.FC<Props> = ({
  currentUser,
  complaints,
  onAddComplaint,
  onUpdateComplaint,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Form state
  const [cat, setCat] = useState<Complaint['category']>('electrical');
  const [urgency, setUrgency] = useState<Complaint['urgency']>('medium');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Rector action state inside modal
  const [techName, setTechName] = useState('');
  const [remarks, setRemarks] = useState('');

  const isRector = currentUser.role === 'chief_rector' || currentUser.role === 'rector';

  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return c.status !== 'resolved';
    if (statusFilter === 'resolved') return c.status === 'resolved';
    return true;
  });

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newC: Complaint = {
      id: `cmp-${Date.now()}`,
      studentId: currentUser.id,
      studentName: isAnonymous ? 'Anonymous Resident' : currentUser.name,
      roomNo: currentUser.roomNo || 'General Wing',
      category: cat,
      description: description.trim(),
      urgency,
      status: 'submitted',
      filedDate: new Date().toISOString().split('T')[0],
      isAnonymous,
    };

    onAddComplaint(newC);
    setShowAddModal(false);
    setDescription('');
  };

  const handleAssignTechnician = (complaint: Complaint) => {
    if (!techName.trim()) return;
    const updated: Complaint = {
      ...complaint,
      status: 'technician_assigned',
      technicianName: techName.trim(),
      notes: remarks.trim() || 'Technician scheduled for inspection.',
    };
    onUpdateComplaint(updated);
    setSelectedComplaint(updated);
    setTechName('');
    setRemarks('');
  };

  const handleResolveComplaint = (complaint: Complaint) => {
    const updated: Complaint = {
      ...complaint,
      status: 'resolved',
      resolvedDate: new Date().toISOString().split('T')[0],
      resolutionRemarks: remarks.trim() || 'Work inspected and completed to resident satisfaction.',
    };
    onUpdateComplaint(updated);
    setSelectedComplaint(updated);
    setRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-orange-600 text-white">
                <MessageSquareWarning className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Hostel Complaint Box &amp; Grievance Redressal
                </h2>
                <p className="text-xs text-slate-500">
                  Direct Grievance Submission · Maintenance Tracking · Anonymous Option · 24-48hr SLA
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>File New Complaint</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Tickets ({complaints.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            In Progress / Pending ({complaints.filter((c) => c.status !== 'resolved').length})
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Resolved ({complaints.filter((c) => c.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Complaints List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredComplaints.map((item) => {
          const isResolved = item.status === 'resolved';
          const isHigh = item.urgency === 'high' || item.urgency === 'emergency';

          return (
            <div
              key={item.id}
              onClick={() => setSelectedComplaint(item)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isHigh
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.urgency} Urgency
                    </span>
                    {item.isAnonymous && (
                      <span className="text-[10px] text-slate-500 flex items-center gap-0.5 font-medium">
                        <UserX className="w-3 h-3" /> Anonymous
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{item.filedDate}</span>
                </div>

                <div className="mb-2">
                  <span className="text-xs font-bold text-rose-700">
                    Room {item.roomNo} · By {item.studentName}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  {isResolved ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Resolved on {item.resolvedDate}
                    </span>
                  ) : item.technicianName ? (
                    <span className="text-indigo-700 font-medium flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5" />
                      Assigned: {item.technicianName}
                    </span>
                  ) : (
                    <span className="text-amber-700 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Status: Under Review
                    </span>
                  )}
                </div>

                <span className="text-slate-400 text-[11px] font-medium hover:text-slate-600">
                  View Details →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* File Complaint Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">File Hostel Grievance / Maintenance Ticket</h3>
                <p className="text-xs text-slate-300">Room {currentUser.roomNo || 'Campus'}</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issue Category *</label>
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="electrical">Electrical (Fan, Light, Switch)</option>
                  <option value="plumbing">Plumbing (Tap, Leak, Geyser, Washroom)</option>
                  <option value="housekeeping">Cleanliness &amp; Housekeeping</option>
                  <option value="wifi">Hostel Wi-Fi &amp; Internet</option>
                  <option value="mess_quality">Mess Food Hygiene &amp; Quality</option>
                  <option value="carpentry">Carpentry &amp; Furniture Repair</option>
                  <option value="other">General Grievance</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Urgency Level</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="low">Low (Routine check within 48h)</option>
                  <option value="medium">Medium (Standard attention)</option>
                  <option value="high">High (Urgent electrical/water issue)</option>
                  <option value="emergency">Emergency (Immediate hazard)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Describe the Issue &amp; Exact Location *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. In Room B-204, the ceiling fan speed regulator is sparking when turned to speed 3..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">Submit Anonymously</span>
                  <span className="text-[10px] text-slate-500">
                    Your name will be hidden from technicians and public boards.
                  </span>
                </div>
              </label>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-sm"
                >
                  Submit Complaint Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Details & Rector Resolution Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Grievance Ticket #{selectedComplaint.id}</h3>
                <p className="text-xs text-slate-300">
                  Room {selectedComplaint.roomNo} · Filed {selectedComplaint.filedDate}
                </p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-bold uppercase text-slate-800">
                    {selectedComplaint.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Urgency:</span>
                  <span className="font-bold text-rose-600 uppercase">
                    {selectedComplaint.urgency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resident:</span>
                  <span className="font-medium text-slate-900">{selectedComplaint.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Issue Description:</span>
                  <p className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-800 leading-relaxed font-sans">
                    {selectedComplaint.description}
                  </p>
                </div>
              </div>

              {/* Status info */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold capitalize text-slate-900">
                    {selectedComplaint.status.replace('_', ' ')}
                  </span>
                </div>
                {selectedComplaint.technicianName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Technician:</span>
                    <span className="font-medium text-indigo-700">
                      {selectedComplaint.technicianName}
                    </span>
                  </div>
                )}
                {selectedComplaint.resolutionRemarks && (
                  <div className="pt-1 text-slate-600">
                    <span className="font-semibold text-emerald-800 block">Resolution Remarks:</span>
                    <p className="italic">{selectedComplaint.resolutionRemarks}</p>
                  </div>
                )}
              </div>

              {/* Rector action options */}
              {isRector && selectedComplaint.status !== 'resolved' && (
                <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
                  <h4 className="font-bold text-indigo-900 uppercase tracking-wider text-[11px]">
                    Rector Action / Dispatch Technician
                  </h4>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Assign Technician / Handyman Name
                    </label>
                    <input
                      type="text"
                      value={techName}
                      onChange={(e) => setTechName(e.target.value)}
                      placeholder="e.g. Santosh Kumar (Electrician)"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Remarks / Resolution Notes
                    </label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Replaced capacitor; switch tested safe."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleAssignTechnician(selectedComplaint)}
                      className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-semibold text-xs"
                    >
                      Assign Technician
                    </button>
                    <button
                      onClick={() => handleResolveComplaint(selectedComplaint)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
