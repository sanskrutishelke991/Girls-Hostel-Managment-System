export type UserRole = 'chief_rector' | 'rector' | 'student' | 'mess_owner';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  roomNo?: string;
  bedNo?: string;
  enrNo?: string;
  course?: string;
  avatar?: string;
}

export interface FamilyInfo {
  fatherName: string;
  fatherPhone: string;
  fatherOccupation: string;
  motherName: string;
  motherPhone: string;
  localGuardianName: string;
  localGuardianPhone: string;
  localGuardianRelation: string;
  homeAddress: string;
  city: string;
  state: string;
  pincode: string;
}

export interface EssentialDocuments {
  collegeIdUploaded: boolean;
  aadhaarUploaded: boolean;
  medicalDeclarationUploaded: boolean;
  undertakingSigned: boolean;
  parentConsentUploaded: boolean;
  documentNotes?: string;
}

export interface StudentAdmission {
  id: string;
  fullName: string;
  mobileNo: string;
  enrollmentNo: string;
  email: string;
  course: string;
  branch: string;
  year: string;
  roomNo: string;
  bedNo: string;
  bloodGroup: string;
  admissionDate: string;
  status: 'active' | 'pending_approval' | 'vacated';
  familyInfo: FamilyInfo;
  documents: EssentialDocuments;
  emergencyContact: string;
}

export interface MealSlot {
  title: string;
  timeRange: string;
  items: string[];
  specialNote?: string;
  isSpecialDietAvailable: boolean;
  status: 'upcoming' | 'serving_now' | 'completed';
}

export interface DayMessMenu {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  dateStr: string;
  morning: MealSlot;   // Breakfast
  afternoon: MealSlot; // Lunch
  evening: MealSlot;   // High Tea & Snacks
  dinner: MealSlot;    // Dinner
}

export interface MessFeedback {
  id: string;
  studentName: string;
  roomNo: string;
  mealType: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  enrNo: string;
  roomNo: string;
  month: string;
  year: number;
  hostelFee: number;
  messFee: number;
  utilityFee: number;
  lateFee: number;
  total: number;
  status: 'paid' | 'due' | 'overdue';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'UPI' | 'Credit/Debit Card' | 'Net Banking' | 'NEFT/RTGS';
  transactionId?: string;
  receiptNumber: string;
}

export interface AttendanceWindowConfig {
  id: string;
  title: string;
  windowType: 'evening_rollcall' | 'morning_check' | 'special_assembly';
  startTime: string; // e.g. "20:30"
  endTime: string;   // e.g. "21:30"
  isActive: boolean;
  instructions: string;
  updatedBy: string;
}

export interface DailyAttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  enrNo: string;
  roomNo: string;
  date: string;
  windowType: string;
  status: 'present' | 'absent' | 'on_leave' | 'late';
  markedTime?: string;
  locationVerified?: boolean;
  rectorVerified: boolean;
}

export interface InOutGateLog {
  id: string;
  studentId: string;
  studentName: string;
  enrNo: string;
  roomNo: string;
  date: string;
  outTime: string;
  expectedInTime: string;
  actualInTime?: string;
  destination: string;
  purpose: string;
  guardianNotified: boolean;
  status: 'outside' | 'returned_on_time' | 'late_return' | 'pending_approval';
  approvedBy: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'urgent' | 'mess' | 'curfew' | 'maintenance' | 'general' | 'event';
  content: string;
  date: string;
  postedBy: string;
  isPinned: boolean;
  priority: 'high' | 'normal';
}

export interface HostelEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  category: 'cultural' | 'celebration' | 'sports' | 'health_camp' | 'meeting';
  organizer: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNo: string;
  category: 'electrical' | 'plumbing' | 'housekeeping' | 'wifi' | 'mess_quality' | 'carpentry' | 'other';
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  status: 'submitted' | 'under_review' | 'technician_assigned' | 'resolved';
  technicianName?: string;
  filedDate: string;
  resolvedDate?: string;
  resolutionRemarks?: string;
  notes?: string;
  isAnonymous?: boolean;
}

export interface VisitorLog {
  id: string;
  studentId: string;
  studentName: string;
  roomNo: string;
  visitorName: string;
  relation: string;
  phone: string;
  idProof: string;
  idNumber: string;
  visitDate: string;
  entryTime: string;
  exitTime?: string;
  purpose: string;
  approvedBy: string;
  status: 'inside' | 'exited';
}

export interface RoomServiceRequest {
  id: string;
  studentId: string;
  studentName: string;
  roomNo: string;
  serviceType: 'room_cleaning' | 'pest_control' | 'fan_ac_repair' | 'bed_curtain_service' | 'water_purifier_check';
  preferredTimeSlot: string;
  notes: string;
  requestDate: string;
  status: 'pending' | 'scheduled' | 'completed';
  assignedStaff?: string;
}

export interface HelplineContact {
  id: string;
  title: string;
  name: string;
  designation: string;
  phone: string;
  altPhone?: string;
  timing: string;
  type: 'warden' | 'security' | 'medical' | 'police' | 'counselor' | 'management';
}
