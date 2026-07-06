import React, { useState } from 'react';
import { Mentor, BookingRequest } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Star, 
  Briefcase, 
  Clock, 
  Bookmark, 
  BookmarkCheck,
  Video,
  Award,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Send,
  Sparkles,
  Github,
  Linkedin,
  Globe,
  Mail,
  CheckCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MentorProfileViewProps {
  mentor: Mentor;
  allMentors: Mentor[];
  savedMentorIds: string[];
  onToggleSaveMentor: (mentorId: string) => void;
  onBack: () => void;
  onSelectMentor: (mentorId: string) => void;
  onBookingSubmit: (requestData: Omit<BookingRequest, 'id' | 'dateRequested' | 'timeline'>) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export const MentorProfileView: React.FC<MentorProfileViewProps> = ({
  mentor,
  allMentors,
  savedMentorIds,
  onToggleSaveMentor,
  onBack,
  onSelectMentor,
  onBookingSubmit,
  addToast
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [sessionTopic, setSessionTopic] = useState(mentor.sessionFormats[0] || '1:1 career guidance');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-07-08');
  const [bookingTime, setBookingTime] = useState('4:00 PM');
  const [isSuccessState, setIsSuccessState] = useState(false);

  const isSaved = savedMentorIds.includes(mentor.id);

  // Suggested mentors: find mentors in same domain or company (exclude current mentor)
  const relatedMentors = allMentors
    .filter(m => m.id !== mentor.id && (m.domain === mentor.domain || m.company === mentor.company))
    .slice(0, 3);

  // If we don't have enough same-domain, grab any other mentors
  if (relatedMentors.length < 3) {
    const additional = allMentors
      .filter(m => m.id !== mentor.id && !relatedMentors.some(rm => rm.id === m.id))
      .slice(0, 3 - relatedMentors.length);
    relatedMentors.push(...additional);
  }

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
    // Split the slot like "Wednesday 4:00 PM" -> parse time and inject date
    const parts = slot.split(' ');
    const day = parts[0]; // "Wednesday" etc.
    const time = parts.slice(1).join(' '); // "4:00 PM"
    
    setBookingTime(time);
    
    // Convert day to next week dates for dummy booking picker
    const dateMapping: { [key: string]: string } = {
      'Monday': '2026-07-13',
      'Tuesday': '2026-07-14',
      'Wednesday': '2026-07-08',
      'Thursday': '2026-07-09',
      'Friday': '2026-07-10'
    };
    
    setBookingDate(dateMapping[day] || '2026-07-08');
    addToast(`Selected slot ${slot}. Ready to request mentorship.`, 'info');
  };

  const handleOpenBookingModal = () => {
    setIsBookingModalOpen(true);
    setIsSuccessState(false);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingMessage.trim().length < 10) {
      addToast('Please write a message explaining what you need guidance on (at least 10 characters).', 'warning');
      return;
    }

    onBookingSubmit({
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorRole: mentor.role,
      mentorCompany: mentor.company,
      mentorImageUrl: mentor.imageUrl,
      sessionTopic,
      date: bookingDate,
      time: bookingTime,
      status: 'Pending',
      message: bookingMessage
    });

    setIsSuccessState(true);
    addToast(`Mentorship request sent to ${mentor.name}!`, 'success');
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setIsSuccessState(false);
    setBookingMessage('');
  };

  return (
    <div className="space-y-6 pb-12" id="mentor-profile-container">
      {/* Back button link */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 font-semibold text-xs py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 bg-white shadow-xs"
        id="profile-back-to-directory-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Mentor Directory</span>
      </button>

      {/* Main Profile Grid Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="profile-detailed-grid">
        {/* Left Column: Core Header Card with contact badges */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center relative" id="profile-sticky-card">
            {/* Save bookmark absolute */}
            <button
              onClick={() => onToggleSaveMentor(mentor.id)}
              className="absolute top-4 right-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-amber-600 p-2.5 rounded-lg transition-colors cursor-pointer"
              title={isSaved ? 'Remove from Saved' : 'Save Mentor'}
              id={`profile-bookmark-toggle-${mentor.id}`}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-amber-600 fill-amber-500" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>

            {/* Profile Avatar */}
            <img 
              src={mentor.imageUrl} 
              alt={mentor.name} 
              className="w-32 h-32 rounded-lg object-cover border border-slate-200 shadow-md mb-4"
              id="profile-detail-avatar"
            />

            {/* Title / Company Info */}
            <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-1.5" id="profile-detail-name">
              {mentor.name}
              {mentor.isVerified && (
                <span className="bg-amber-500/15 text-amber-700 px-1.5 py-0.2 rounded text-[10px] font-bold" title="Verified Alumni">✓</span>
              )}
            </h2>
            <p className="text-sm font-semibold text-slate-700 mt-1">{mentor.role}</p>
            <p className="text-sm text-amber-600 font-bold mb-2">{mentor.company}</p>

            <span className="inline-flex px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 mb-4">
              {mentor.domain}
            </span>

            {/* Location & Grad Year */}
            <div className="w-full space-y-2 border-y border-slate-200 py-4 my-2 text-xs text-slate-600 text-left" id="profile-detail-metadata">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{mentor.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Graduation Year: {mentor.gradYear}</span>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{mentor.experience} Years of Industry Experience</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Availability: <strong className="text-amber-600">{mentor.availability}</strong></span>
              </div>
            </div>

            {/* Rating Stat Row */}
            <div className="flex items-center justify-around w-full py-2 mb-6" id="profile-rating-summary">
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-slate-950">{mentor.rating}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Rating</span>
              </div>
              <div className="border-l border-slate-200 h-8"></div>
              <div className="text-center">
                <span className="text-sm font-bold text-slate-950">{mentor.sessionsCount}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Sessions</span>
              </div>
            </div>

            {/* Social Links Placeholders */}
            <div className="flex items-center gap-3 mb-6 text-slate-400" id="profile-social-placeholders">
              <a href="#linkedin" className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 hover:text-amber-600 transition-colors"><Linkedin className="w-4 h-4" /></a>
              <a href="#github" className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"><Github className="w-4 h-4" /></a>
              <a href="#website" className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"><Globe className="w-4 h-4" /></a>
              <a href="#email" className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"><Mail className="w-4 h-4" /></a>
            </div>

            {/* Request Mentorship CTAs */}
            <button
              onClick={handleOpenBookingModal}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-amber-500/10 cursor-pointer uppercase tracking-wider"
              id="profile-action-request-session"
            >
              Request Mentorship
            </button>
          </div>
        </div>        {/* Right Column: Detailed Bio, Experience Timeline, Reviews, Slots */}
        <div className="lg:col-span-2 space-y-6">
          {/* About & Bio */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4" id="profile-about-card">
            <h3 className="text-lg font-serif font-bold text-slate-950 border-b border-slate-200 pb-2">About {mentor.name}</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{mentor.longBio}</p>
            
            {/* Expertise Tags */}
            <div className="pt-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Areas of Expertise</span>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((exp, idx) => (
                  <span key={idx} className="bg-slate-50 text-slate-700 border border-slate-200 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{exp}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Slots & Calender Scheduler Picker */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4" id="profile-slots-card">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-lg font-serif font-bold text-slate-955">Available Time Slots</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Select a slot to request</span>
            </div>
            
            <p className="text-xs text-slate-500">
              Alumni offer flexible micro-sessions throughout the week. Choose a slot below to automatically configure your calendar request form.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2" id="profile-slots-picker">
              {mentor.availableSlots.map((slot) => {
                const isCurrent = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => handleSelectSlot(slot)}
                    className={`p-3 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                      isCurrent 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10 scale-102' 
                        : 'bg-white border-slate-200 hover:border-amber-500 hover:bg-amber-50/20 text-slate-700'
                    }`}
                    id={`slot-picker-${slot.replace(/\s+/g, '-')}`}
                  >
                    <Calendar className="w-4 h-4 mx-auto mb-1 opacity-80" />
                    <span>{slot}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Work Experience Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4" id="profile-experience-card">
            <h3 className="text-lg font-serif font-bold text-slate-955 border-b border-slate-200 pb-2">Professional Experience</h3>
            <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-6" id="experience-timeline-container">
              {mentor.experienceTimeline.map((job, idx) => (
                <div key={idx} className="relative" id={`timeline-item-${idx}`}>
                  {/* Outer circle indicator */}
                  <span className="absolute -left-10 top-1 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs">
                    <Briefcase className="w-3.5 h-3.5" />
                  </span>
                  
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-100">
                      {job.period}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1.5">{job.role}</h4>
                    <p className="text-xs font-semibold text-slate-700">{job.company}</p>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{job.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4" id="profile-education-card">
            <h3 className="text-lg font-serif font-bold text-slate-950 border-b border-slate-200 pb-2">Education</h3>
            <div className="space-y-4" id="education-items-list">
              {mentor.education.map((edu, idx) => (
                <div key={idx} className="flex gap-3 items-start" id={`education-item-${idx}`}>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-500 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 text-xs">{edu.school}</h4>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">{edu.degree}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Class of {edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4" id="profile-reviews-card">
            <h3 className="text-lg font-serif font-bold text-slate-950 border-b border-slate-200 pb-2">Student Feedback</h3>
            {mentor.reviews.length > 0 ? (
              <div className="space-y-4" id="reviews-items-list">
                {mentor.reviews.map((review) => (
                  <div key={review.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200" id={`review-item-${review.id}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                          {review.studentName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 text-xs">{review.studentName}</h4>
                          <span className="text-[10px] text-slate-400">{review.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-bold text-slate-800">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4 font-medium">No reviews yet. Be the first to schedule a session and share feedback!</p>
            )}
          </div>

          {/* Related / Suggested Mentors Section */}
          <div className="space-y-4" id="profile-related-mentors-section">
            <h3 className="text-lg font-serif font-bold text-slate-950">Suggested Mentors Aligned to Your Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="related-mentors-list">
              {relatedMentors.map((rm) => (
                <div 
                  key={rm.id}
                  onClick={() => {
                    setSelectedSlot(null);
                    onSelectMentor(rm.id);
                  }}
                  className="bg-white border border-slate-200 hover:border-amber-500 p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all group text-center"
                  id={`related-mentor-${rm.id}`}
                >
                  <img 
                    src={rm.imageUrl} 
                    alt={rm.name} 
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 mx-auto group-hover:border-amber-500 transition-colors mb-2"
                  />
                  <h4 className="font-serif font-bold text-slate-900 text-xs group-hover:text-amber-600 transition-colors truncate">{rm.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{rm.role} at {rm.company}</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                    {rm.domain}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>      {/* Booking Form Overlay Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto" id="booking-modal-backdrop">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden"
              id="booking-modal-box"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between" id="booking-modal-header">
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">Request Mentorship Session</h3>
                  <p className="text-xs text-slate-400">Book dynamic 1:1 sessions with verified alumni</p>
                </div>
                <button 
                  onClick={handleCloseBookingModal}
                  className="text-slate-400 hover:text-slate-600 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200"
                  id="close-booking-modal-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success / Confirmation State overlay */}
              {isSuccessState ? (
                <div className="p-8 text-center space-y-5" id="booking-success-state">
                  <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-200 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-955">Request Sent Successfully!</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                      Your booking request for <strong>{sessionTopic}</strong> has been forwarded to <strong>{mentor.name}</strong>. They will review and notify you about scheduling details.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 max-w-sm mx-auto text-xs text-slate-600 text-left">
                    <p className="font-bold text-slate-800 mb-1">Session Summary:</p>
                    <p>• Mentor: {mentor.name}</p>
                    <p>• Format: <span className="capitalize">{sessionTopic}</span></p>
                    <p>• Preferred Schedule: {bookingDate} at {bookingTime}</p>
                  </div>
                  <button 
                    onClick={handleCloseBookingModal}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold px-6 py-2.5 rounded-lg transition-colors shadow-md shadow-amber-500/10 cursor-pointer uppercase tracking-wider"
                    id="success-close-booking-modal"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* Interactive Form State */
                <form onSubmit={handleBookingSubmit} className="p-5 space-y-4" id="booking-form">
                  {/* Mentor mini summary */}
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <img 
                      src={mentor.imageUrl} 
                      alt={mentor.name} 
                      className="w-10 h-10 rounded-md object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-slate-850 text-xs">{mentor.name}</h4>
                      <p className="text-[11px] text-slate-500 leading-none mt-0.5">{mentor.role} at {mentor.company}</p>
                    </div>
                    {selectedSlot && (
                      <span className="ml-auto bg-amber-50 text-amber-700 font-bold border border-amber-200 rounded text-[10px] px-2.5 py-1.5 uppercase">
                        {selectedSlot}
                      </span>
                    )}
                  </div>

                  {/* Format Dropdown */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Select Session Format</label>
                    <select
                      value={sessionTopic}
                      onChange={(e) => setSessionTopic(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 capitalize cursor-pointer"
                      id="booking-session-topic-select"
                    >
                      {mentor.sessionFormats.map((format, idx) => (
                        <option key={idx} value={format}>{format}</option>
                      ))}
                    </select>
                  </div>

                  {/* Schedule Date & Time Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Date</label>
                      <input 
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                        id="booking-date-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Time</label>
                      <input 
                        type="text"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        placeholder="e.g. 4:00 PM"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                        id="booking-time-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Message box */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700 block">Guidance Message</label>
                      <span className="text-[10px] text-slate-400 font-bold">{bookingMessage.length}/500 chars</span>
                    </div>
                    <textarea
                      value={bookingMessage}
                      onChange={(e) => setBookingMessage(e.target.value.slice(0, 500))}
                      placeholder="Tell the mentor what you would like guidance on (e.g., preparing for specific companies, review structure, thesis help...)"
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                      id="booking-message-input"
                      required
                    ></textarea>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-200 justify-end">
                    <button 
                      type="button"
                      onClick={handleCloseBookingModal}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                      id="cancel-booking-form-btn"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold py-2.5 px-5 rounded-lg transition-colors shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                      id="submit-booking-form-btn"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Request</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
