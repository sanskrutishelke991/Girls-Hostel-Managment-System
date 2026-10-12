import React, { useState } from 'react';
import { User, Notice, HostelEvent } from '../types';
import {
  Bell,
  Calendar,
  Pin,
  AlertTriangle,
  Plus,
  X,
  Clock,
  MapPin,
  Tag,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface Props {
  currentUser: User;
  notices: Notice[];
  onAddNotice: (notice: Notice) => void;
  events: HostelEvent[];
  onAddEvent: (event: HostelEvent) => void;
}

export const NoticesAndEventsTab: React.FC<Props> = ({
  currentUser,
  notices,
  onAddNotice,
  events,
  onAddEvent,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'notices' | 'events'>('notices');
  const [selectedNoticeCategory, setSelectedNoticeCategory] = useState<string>('all');
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // Notice form state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<Notice['category']>('general');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticePriority, setNoticePriority] = useState<'normal' | 'high'>('normal');
  const [noticeIsPinned, setNoticeIsPinned] = useState(false);

  // Event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-10-20');
  const [eventTime, setEventTime] = useState('05:00 PM – 07:00 PM');
  const [eventVenue, setEventVenue] = useState('Hostel Amphitheatre');
  const [eventCategory, setEventCategory] = useState<HostelEvent['category']>('celebration');
  const [eventDescription, setEventDescription] = useState('');

  const isRector = currentUser.role === 'chief_rector' || currentUser.role === 'rector';

  const filteredNotices = notices.filter((n) => {
    if (selectedNoticeCategory === 'all') return true;
    return n.category === selectedNoticeCategory;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;

    const newN: Notice = {
      id: `not-${Date.now()}`,
      title: noticeTitle.trim(),
      category: noticeCategory,
      content: noticeContent.trim(),
      date: new Date().toISOString().split('T')[0],
      postedBy: currentUser.name,
      isPinned: noticeIsPinned,
      priority: noticePriority,
    };

    onAddNotice(newN);
    setShowAddNoticeModal(false);
    setNoticeTitle('');
    setNoticeContent('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDescription) return;

    const newE: HostelEvent = {
      id: `evt-${Date.now()}`,
      title: eventTitle.trim(),
      date: eventDate,
      time: eventTime,
      venue: eventVenue.trim(),
      description: eventDescription.trim(),
      category: eventCategory,
      organizer: currentUser.name,
    };

    onAddEvent(newE);
    setShowAddEventModal(false);
    setEventTitle('');
    setEventDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-600 text-white">
                <Bell className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Essential Circulars &amp; Event Calendar
                </h2>
                <p className="text-xs text-slate-500">
                  Official Rectorate Notifications · Curfew Rules · Hostel Celebrations &amp; Health Camps
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRector && activeSubTab === 'notices' && (
              <button
                onClick={() => setShowAddNoticeModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Circular</span>
              </button>
            )}

            {isRector && activeSubTab === 'events' && (
              <button
                onClick={() => setShowAddEventModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule New Event</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('notices')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'notices'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Essential Notices Window ({notices.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('events')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'events'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Hostel Event Calendar ({events.length})</span>
            </button>
          </div>

          {activeSubTab === 'notices' && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {['all', 'urgent', 'curfew', 'mess', 'maintenance', 'general'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedNoticeCategory(cat)}
                  className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                    selectedNoticeCategory === cat
                      ? 'bg-purple-100 text-purple-900 font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* VIEW 1: NOTICES BOARD */}
      {activeSubTab === 'notices' && (
        <div className="space-y-4">
          {filteredNotices.map((notice) => {
            const isUrgent = notice.priority === 'high' || notice.category === 'urgent';

            return (
              <div
                key={notice.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${
                  notice.isPinned
                    ? 'border-purple-300 ring-1 ring-purple-400/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {notice.isPinned && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                        <Pin className="w-3 h-3 text-purple-600 fill-purple-600" />
                        Pinned Notice
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        notice.category === 'curfew'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : notice.category === 'mess'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : notice.category === 'maintenance'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {notice.category}
                    </span>
                    {isUrgent && (
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                        URGENT
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono shrink-0">{notice.date}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-2">
                  {notice.title}
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mb-3">
                  {notice.content}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Issued By: <strong className="text-slate-800">{notice.postedBy}</strong></span>
                  <span className="text-purple-700 font-medium">Ananya Rectorate Board</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: EVENT CALENDAR */}
      {activeSubTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                    {evt.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono font-semibold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{evt.date}</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-2 leading-snug">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {evt.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span className="font-medium text-slate-800">{evt.venue}</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Organizer: {evt.organizer}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Publish Notice Modal */}
      {showAddNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-purple-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Publish Official Circular / Notice</h3>
                <p className="text-xs text-purple-200">
                  Broadcasts to student mobile and web dashboards
                </p>
              </div>
              <button
                onClick={() => setShowAddNoticeModal(false)}
                className="p-1 rounded-lg text-purple-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Notice Headline *
                </label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Mandatory Wing Assembly Regarding Curfew"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    <option value="general">General</option>
                    <option value="curfew">Curfew &amp; Security</option>
                    <option value="mess">Mess &amp; Dining</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High (Red Alert)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Body / Content *</label>
                <textarea
                  rows={4}
                  required
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Provide comprehensive instructions for residents..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={noticeIsPinned}
                  onChange={(e) => setNoticeIsPinned(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">
                  Pin to Top of Notice Board
                </span>
              </label>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddNoticeModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-indigo-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Schedule New Hostel Event</h3>
                <p className="text-xs text-indigo-200">
                  Adds to the hostel resident community calendar
                </p>
              </div>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="p-1 rounded-lg text-indigo-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Annual Badminton Tournament"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="05:00 PM – 07:00 PM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Venue / Location</label>
                <input
                  type="text"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Category</label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="celebration">Celebration / Festival</option>
                  <option value="cultural">Cultural &amp; Arts</option>
                  <option value="health_camp">Health Camp / Medical</option>
                  <option value="sports">Sports &amp; Fitness</option>
                  <option value="meeting">Meeting / Assembly</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Details, participation instructions..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-semibold"
                >
                  Add Event to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
