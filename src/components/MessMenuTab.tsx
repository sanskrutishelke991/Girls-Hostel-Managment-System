import React, { useState } from 'react';
import { User, DayMessMenu, MealSlot, MessFeedback } from '../types';
import {
  Utensils,
  Clock,
  Sun,
  Coffee,
  Moon,
  Sparkles,
  Edit3,
  Star,
  CheckCircle,
  Plus,
  Send,
  MessageSquare,
  AlertCircle,
  Calendar,
} from 'lucide-react';

interface Props {
  currentUser: User;
  weeklyMenu: DayMessMenu[];
  onUpdateMenu: (updatedWeek: DayMessMenu[]) => void;
  feedbacks: MessFeedback[];
  onAddFeedback: (feedback: MessFeedback) => void;
}

export const MessMenuTab: React.FC<Props> = ({
  currentUser,
  weeklyMenu,
  onUpdateMenu,
  feedbacks,
  onAddFeedback,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [editingSlot, setEditingSlot] = useState<{
    day: string;
    slotKey: 'morning' | 'afternoon' | 'evening' | 'dinner';
    slotData: MealSlot;
  } | null>(null);

  // Student Feedback form state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMeal, setFeedbackMeal] = useState('Lunch');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Edit form state for mess owner
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editItemsText, setEditItemsText] = useState('');
  const [editSpecialNote, setEditSpecialNote] = useState('');

  const isMessOwnerOrRector = currentUser.role === 'mess_owner' || currentUser.role === 'chief_rector' || currentUser.role === 'rector';

  const currentDayMenu = weeklyMenu.find((m) => m.day === selectedDay) || weeklyMenu[0];

  const mealSlotsConfig = [
    {
      key: 'morning' as const,
      label: 'Morning (Breakfast)',
      icon: Coffee,
      bgGradient: 'from-amber-50 to-orange-50 border-amber-200',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      timingStandard: '07:30 AM – 09:30 AM',
    },
    {
      key: 'afternoon' as const,
      label: 'Afternoon (Lunch)',
      icon: Sun,
      bgGradient: 'from-emerald-50 to-teal-50 border-emerald-200',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      timingStandard: '12:30 PM – 02:30 PM',
    },
    {
      key: 'evening' as const,
      label: 'Evening (High Tea & Snacks)',
      icon: Sparkles,
      bgGradient: 'from-orange-50 to-rose-50 border-orange-200',
      badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
      timingStandard: '05:00 PM – 06:30 PM',
    },
    {
      key: 'dinner' as const,
      label: 'Dinner (Night Meal)',
      icon: Moon,
      bgGradient: 'from-indigo-50 to-slate-50 border-indigo-200',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      timingStandard: '08:00 PM – 10:00 PM',
    },
  ];

  const handleOpenEditSlot = (slotKey: 'morning' | 'afternoon' | 'evening' | 'dinner', slotData: MealSlot) => {
    setEditingSlot({
      day: selectedDay,
      slotKey,
      slotData,
    });
    setEditTitle(slotData.title);
    setEditTime(slotData.timeRange);
    setEditItemsText(slotData.items.join('\n'));
    setEditSpecialNote(slotData.specialNote || '');
  };

  const handleSaveSlotEdit = () => {
    if (!editingSlot) return;

    const items = editItemsText
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const updated = weeklyMenu.map((day) => {
      if (day.day === editingSlot.day) {
        return {
          ...day,
          [editingSlot.slotKey]: {
            ...day[editingSlot.slotKey],
            title: editTitle.trim() || day[editingSlot.slotKey].title,
            timeRange: editTime.trim() || day[editingSlot.slotKey].timeRange,
            items: items.length > 0 ? items : day[editingSlot.slotKey].items,
            specialNote: editSpecialNote.trim(),
          },
        };
      }
      return day;
    });

    onUpdateMenu(updated);
    setEditingSlot(null);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    const newFb: MessFeedback = {
      id: `fb-${Date.now()}`,
      studentName: currentUser.name,
      roomNo: currentUser.roomNo || 'Hostel Resident',
      mealType: feedbackMeal,
      rating: feedbackRating,
      comment: feedbackText.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    onAddFeedback(newFb);
    setFeedbackText('');
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setShowFeedbackModal(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Timing Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500 text-white">
                <Utensils className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Annapurna Mess Dining Hall
                </h2>
                <p className="text-xs text-slate-500">
                  Daily 4-Slot Meal Timings · Hygienic FSSAI Certified Kitchen · Pure Vegetarian &amp; Jain Counters
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {isMessOwnerOrRector && (
              <span className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-semibold flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                <span>Mess Admin: Click any meal slot to edit menu</span>
              </span>
            )}
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Submit Meal Review</span>
            </button>
          </div>
        </div>

        {/* Day of Week Selector */}
        <div className="pt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {day}
                {day === 'Monday' && <span className="ml-1 text-[10px] opacity-80">(Today)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Meal Slots Grid: Morning, Afternoon, Evening, Dinner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mealSlotsConfig.map((config) => {
          const slot = currentDayMenu[config.key];
          const SlotIcon = config.icon;
          const isServing = slot.status === 'serving_now';
          const isDone = slot.status === 'completed';

          return (
            <div
              key={config.key}
              className={`rounded-2xl border p-5 transition-all relative overflow-hidden bg-white hover:shadow-md ${
                isServing ? 'ring-2 ring-emerald-500/20 border-emerald-300' : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2.5 rounded-xl border ${config.bgGradient}`}>
                    <SlotIcon className="w-5 h-5 text-slate-800" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {config.label}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{slot.timeRange || config.timingStandard}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isServing && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                      Serving Now
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Completed
                    </span>
                  )}
                  {isMessOwnerOrRector && (
                    <button
                      onClick={() => handleOpenEditSlot(config.key, slot)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-amber-700 hover:bg-amber-50 hover:border-amber-200 transition-colors cursor-pointer"
                      title="Edit this meal slot"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title / Theme */}
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-slate-800">
                  {slot.title}
                </h4>
              </div>

              {/* Food Items List */}
              <div className="space-y-1.5 mb-4">
                {slot.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-slate-700 py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Special Note / Dietary Info */}
              {slot.specialNote && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{slot.specialNote}</span>
                </div>
              )}

              {slot.isSpecialDietAvailable && (
                <div className="mt-2 text-[10px] text-emerald-700 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Jain &amp; Diet Friendly options prepared separately</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mess Feedback & Resident Reviews */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-600" />
              <span>Resident Mess Feedback &amp; Quality Ratings</span>
            </h3>
            <p className="text-xs text-slate-500">
              Reviewed daily by Hostel Mess Committee &amp; Chief Rector
            </p>
          </div>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            + Give Today's Feedback
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {feedbacks.slice(0, 3).map((fb) => (
            <div
              key={fb.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{fb.studentName}</span>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {fb.mealType} · Room {fb.roomNo}
              </div>
              <p className="text-slate-700 italic">"{fb.comment}"</p>
              <div className="text-[10px] text-slate-400 text-right">{fb.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mess Owner Slot Edit Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-amber-600 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Edit Mess Menu — {editingSlot.day}</h3>
                <p className="text-xs text-amber-100 capitalize">
                  {editingSlot.slotKey} Meal Slot
                </p>
              </div>
              <button
                onClick={() => setEditingSlot(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Meal Title / Special Theme
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Serving Timing Range
                </label>
                <input
                  type="text"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  placeholder="e.g. 12:30 PM – 02:30 PM"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dishes &amp; Items (one per line)
                </label>
                <textarea
                  rows={5}
                  value={editItemsText}
                  onChange={(e) => setEditItemsText(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Note or Dietary Instructions
                </label>
                <input
                  type="text"
                  value={editSpecialNote}
                  onChange={(e) => setEditSpecialNote(e.target.value)}
                  placeholder="e.g. Jain counter at Counter 2, Extra sweets on token"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingSlot(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSlotEdit}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
              >
                Save Menu Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Rate Mess Food Quality</h3>
                <p className="text-xs text-slate-300">Feedback reaches contractor &amp; Rector</p>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="p-6 space-y-4">
              {feedbackSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm text-emerald-900">Thank you for your rating!</p>
                  <p className="text-xs text-emerald-700">Your feedback has been logged to the mess review board.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Meal Type
                    </label>
                    <select
                      value={feedbackMeal}
                      onChange={(e) => setFeedbackMeal(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Morning Breakfast">Morning Breakfast</option>
                      <option value="Afternoon Lunch">Afternoon Lunch</option>
                      <option value="Evening Snacks & Chai">Evening Snacks &amp; Chai</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Rating (1 to 5 Stars)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= feedbackRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 hover:text-amber-200'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-slate-600 ml-2 font-semibold">
                        {feedbackRating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Comments / Taste / Hygiene Remarks
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="e.g. Sabzi taste was great, curd fresh..."
                      required
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Feedback</span>
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
