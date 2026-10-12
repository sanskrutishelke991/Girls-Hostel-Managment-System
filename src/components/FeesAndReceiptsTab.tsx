import React, { useState } from 'react';
import { User, FeeRecord } from '../types';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  Receipt,
  Printer,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  QrCode,
  Building,
  ShieldCheck,
  Send,
  X,
  FileText,
  DollarSign,
} from 'lucide-react';

interface Props {
  currentUser: User;
  feeRecords: FeeRecord[];
  onPayFee: (recordId: string, method: 'UPI' | 'Credit/Debit Card' | 'Net Banking') => void;
  onSendDueReminders: () => void;
}

export const FeesAndReceiptsTab: React.FC<Props> = ({
  currentUser,
  feeRecords,
  onPayFee,
  onSendDueReminders,
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<FeeRecord | null>(null);
  const [payingRecord, setPayingRecord] = useState<FeeRecord | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit/Debit Card' | 'Net Banking'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [reminderSentAlert, setReminderSentAlert] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'due' | 'overdue'>('all');

  const isRector = currentUser.role === 'chief_rector' || currentUser.role === 'rector';
  const isStudent = currentUser.role === 'student';

  // Filter records based on role and status
  const visibleRecords = feeRecords.filter((rec) => {
    // If student, prioritize their own records or allow view
    const matchesUser = isStudent ? rec.enrNo === currentUser.enrNo || rec.studentId === currentUser.id : true;
    const matchesStatus = filterStatus === 'all' || rec.status === filterStatus;
    return matchesUser && matchesStatus;
  });

  const dueRecordsCount = feeRecords.filter((r) => r.status === 'due' || r.status === 'overdue').length;
  const myDueRecord = feeRecords.find(
    (r) => (r.enrNo === currentUser.enrNo || r.studentId === currentUser.id) && (r.status === 'due' || r.status === 'overdue')
  );

  const handleTriggerReminder = () => {
    onSendDueReminders();
    setReminderSentAlert(true);
    setTimeout(() => {
      setReminderSentAlert(false);
    }, 4000);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingRecord) return;

    setIsProcessing(true);
    setTimeout(() => {
      onPayFee(payingRecord.id, paymentMethod);
      setIsProcessing(false);
      const paid = {
        ...payingRecord,
        status: 'paid' as const,
        paidDate: new Date().toISOString().split('T')[0],
        paymentMethod,
        transactionId: `TXN-${paymentMethod.substring(0, 3)}-${Math.floor(100000000 + Math.random() * 900000000)}`,
      };
      setPayingRecord(null);
      setSelectedReceipt(paid);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe fallback
      }
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-600 text-white">
                <Receipt className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Hostel &amp; Mess Fees Management
                </h2>
                <p className="text-xs text-slate-500">
                  Automated Digital Tax Receipts · Monthly Due Reminders · Online Fee Settlement
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRector && (
              <button
                onClick={handleTriggerReminder}
                className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Monthly Due Reminders ({dueRecordsCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Due Reminder Alert for Student */}
        {isStudent && myDueRecord && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-start gap-2.5">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Upcoming Due Reminder: {myDueRecord.month} {myDueRecord.year} Fees
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Amount ₹{myDueRecord.total.toLocaleString()} is due by {myDueRecord.dueDate}. Settle early to avoid late clearance surcharge.
                </p>
              </div>
            </div>
            <button
              onClick={() => setPayingRecord(myDueRecord)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm whitespace-nowrap self-start sm:self-auto cursor-pointer"
            >
              Pay Now (₹{myDueRecord.total.toLocaleString()})
            </button>
          </div>
        )}

        {/* Reminder confirmation notification */}
        {reminderSentAlert && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Automated Due Reminders successfully dispatched to parent WhatsApp contacts and student portals for {dueRecordsCount} residents with pending balances!
            </span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Ledger Records
          </button>
          <button
            onClick={() => setFilterStatus('paid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'paid' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Paid (Receipt Ready)
          </button>
          <button
            onClick={() => setFilterStatus('due')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'due' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Due This Month
          </button>
          <button
            onClick={() => setFilterStatus('overdue')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'overdue' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Overdue
          </button>
        </div>
      </div>

      {/* Fee Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Student / Enr No</th>
                <th className="px-4 py-3.5">Room</th>
                <th className="px-4 py-3.5">Billing Period</th>
                <th className="px-4 py-3.5 text-right">Hostel Rent</th>
                <th className="px-4 py-3.5 text-right">Mess Fee</th>
                <th className="px-4 py-3.5 text-right">Utility</th>
                <th className="px-4 py-3.5 text-right">Total (₹)</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Action / Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {visibleRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-400">
                    No fee records found under this filter.
                  </td>
                </tr>
              ) : (
                visibleRecords.map((rec) => {
                  const isPaid = rec.status === 'paid';
                  const isOverdue = rec.status === 'overdue';

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-medium">
                        <div className="text-slate-900 font-semibold">{rec.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{rec.enrNo}</div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-rose-700">{rec.roomNo}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-slate-800">{rec.month} {rec.year}</span>
                        <div className="text-[10px] text-slate-400">Due: {rec.dueDate}</div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums">
                        ₹{rec.hostelFee.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums">
                        ₹{rec.messFee.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums text-slate-500">
                        ₹{rec.utilityFee.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-900 font-mono tabular-nums">
                        ₹{rec.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isOverdue
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {isPaid ? (
                          <button
                            onClick={() => setSelectedReceipt(rec)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-600" />
                            <span>View Receipt</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setPayingRecord(rec)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Now</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {payingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Hostel &amp; Mess Online Payment</h3>
                <p className="text-xs text-slate-300">
                  {payingRecord.month} {payingRecord.year} Dues · Room {payingRecord.roomNo}
                </p>
              </div>
              <button
                onClick={() => setPayingRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecutePayment} className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Resident Name:</span>
                  <span className="font-semibold text-slate-900">{payingRecord.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Enrollment No:</span>
                  <span className="font-mono text-slate-700">{payingRecord.enrNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hostel Room Rent:</span>
                  <span className="font-mono">₹{payingRecord.hostelFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mess Charges:</span>
                  <span className="font-mono">₹{payingRecord.messFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Utility / Wi-Fi:</span>
                  <span className="font-mono">₹{payingRecord.utilityFee.toLocaleString()}</span>
                </div>
                {payingRecord.lateFee > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Overdue Surcharge:</span>
                    <span className="font-mono font-bold">+₹{payingRecord.lateFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>Total Payable:</span>
                  <span className="font-mono text-emerald-700 text-base">
                    ₹{payingRecord.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Credit/Debit Card', 'Net Banking'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                        paymentMethod === method
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Simulator if UPI */}
              {paymentMethod === 'UPI' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1.5">
                  <div className="w-24 h-24 mx-auto bg-white border border-slate-300 p-2 rounded-lg flex items-center justify-center">
                    <QrCode className="w-20 h-20 text-slate-800" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Scan via Google Pay, PhonePe, Paytm, or BHIM
                  </p>
                  <p className="text-[10px] text-slate-400">
                    UPI ID: ananya.hostel@icici (Verified Merchant)
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Processing Secure Transaction...</span>
                ) : (
                  <>
                    <span>Confirm &amp; Generate Automated Receipt (₹{payingRecord.total.toLocaleString()})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Official Automated Digital Receipt Modal (Printable) */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="no-print bg-slate-900 px-6 py-3.5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Official Hostel Fee Receipt</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Paper Sheet */}
            <div className="p-8 overflow-y-auto space-y-6 bg-white font-sans text-slate-900">
              {/* Institution Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4">
                <div className="w-12 h-12 mx-auto rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2">
                  <Building className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold uppercase tracking-tight text-slate-900">
                  Ananya Hall of Residence
                </h2>
                <p className="text-xs text-slate-600">
                  Campus Autonomous Mahila Chhatralaya &amp; Dining Board
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Hostel Gate 2, University Enclave · Phone: +91 98220 11223 · GST/Tax ID: 27AABCA1234F1ZP
                </p>
              </div>

              {/* Receipt Metadata Bar */}
              <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-3 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">RECEIPT NUMBER</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.receiptNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">PAYMENT DATE</span>
                  <span className="font-semibold text-slate-800">
                    {selectedReceipt.paidDate || new Date().toISOString().split('T')[0]}
                  </span>
                </div>
              </div>

              {/* Resident Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">STUDENT NAME</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedReceipt.studentName}</span>
                  <span className="text-slate-500 block font-mono text-[11px] mt-0.5">
                    Enr: {selectedReceipt.enrNo}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">ALLOTTED ROOM &amp; WING</span>
                  <span className="font-bold text-rose-700 text-sm">Room {selectedReceipt.roomNo}</span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    Period: {selectedReceipt.month} {selectedReceipt.year}
                  </span>
                </div>
              </div>

              {/* Itemized Breakdown Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="px-4 py-2 text-left">Fee Particulars</th>
                      <th className="px-4 py-2 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="px-4 py-2.5 font-sans">
                        Hostel Accommodation &amp; Bed Maintenance
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        ₹{selectedReceipt.hostelFee.toLocaleString()}.00
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-sans">
                        Annapurna Mess Catering Board (4 Meals/Day)
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        ₹{selectedReceipt.messFee.toLocaleString()}.00
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-sans">
                        Electricity, High-speed Wi-Fi &amp; RO Water Utility
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        ₹{selectedReceipt.utilityFee.toLocaleString()}.00
                      </td>
                    </tr>
                    {selectedReceipt.lateFee > 0 && (
                      <tr className="text-rose-600">
                        <td className="px-4 py-2.5 font-sans">Overdue Clearance Charge</td>
                        <td className="px-4 py-2.5 text-right">
                          ₹{selectedReceipt.lateFee.toLocaleString()}.00
                        </td>
                      </tr>
                    )}
                    <tr className="bg-slate-50 font-bold text-slate-900 text-sm">
                      <td className="px-4 py-3 font-sans">Grand Total Paid</td>
                      <td className="px-4 py-3 text-right text-emerald-800 font-mono">
                        ₹{selectedReceipt.total.toLocaleString()}.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment Proof Details */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                <div className="flex justify-between text-emerald-900">
                  <span className="font-semibold">Transaction Status:</span>
                  <span className="font-bold uppercase tracking-wider text-emerald-700">PAID &amp; SETTLED</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-mono text-[11px]">
                  <span>Mode: {selectedReceipt.paymentMethod || 'UPI Online'}</span>
                  <span>Txn ID: {selectedReceipt.transactionId || 'TXN-UPI-9948201283'}</span>
                </div>
              </div>

              {/* Official Seal & Signature Section */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-rose-400 flex items-center justify-center mx-auto text-[10px] font-bold text-rose-700 uppercase tracking-tighter text-center leading-none p-1">
                    ANANYA HOSTEL SEAL
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Digital Timestamp Verified</span>
                </div>

                <div className="text-right">
                  <div className="h-10 flex items-end justify-end">
                    <span className="font-serif italic font-bold text-slate-800 text-sm">
                      Dr. Sunita Kulkarni
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 block">Chief Rector</span>
                  <span className="text-[10px] text-slate-500 block">Hostel Financial Authority</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="no-print px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
