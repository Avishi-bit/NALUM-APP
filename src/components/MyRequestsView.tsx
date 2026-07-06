import React, { useState } from 'react';
import { BookingRequest, ViewType } from '../types';
import { 
  Calendar, 
  Clock, 
  Video, 
  MoreVertical, 
  ChevronRight, 
  X, 
  CheckCircle, 
  AlertCircle,
  XCircle,
  HelpCircle,
  Star,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MyRequestsViewProps {
  requests: BookingRequest[];
  onCancelRequest: (requestId: string) => void;
  onSelectMentor: (mentorId: string) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export const MyRequestsView: React.FC<MyRequestsViewProps> = ({
  requests,
  onCancelRequest,
  onSelectMentor,
  addToast
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Accepted' | 'Completed' | 'Declined'>('All');
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const tabs = ['All', 'Pending', 'Accepted', 'Completed', 'Declined'] as const;

  const filteredRequests = requests.filter((req) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Declined') {
      return req.status === 'Declined' || req.status === 'Cancelled';
    }
    return req.status === activeTab;
  });

  const handleOpenDetails = (req: BookingRequest) => {
    setSelectedRequest(req);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRequest(null);
  };

  const handleCancel = (e: React.MouseEvent, reqId: string, mentorName: string) => {
    e.stopPropagation();
    onCancelRequest(reqId);
    addToast(`Mentorship session with ${mentorName} has been cancelled.`, 'info');
    if (selectedRequest && selectedRequest.id === reqId) {
      setSelectedRequest({
        ...selectedRequest,
        status: 'Cancelled',
        timeline: [
          ...selectedRequest.timeline,
          { status: 'Cancelled', date: 'Today', comment: 'Cancelled by student' }
        ]
      });
    }
  };

  const handleJoin = (e: React.MouseEvent, mentorName: string) => {
    e.stopPropagation();
    addToast(`Launching video call with ${mentorName}...`, 'success');
  };

  const handleReschedule = (e: React.MouseEvent, mentorName: string) => {
    e.stopPropagation();
    addToast(`Reschedule request initiated for ${mentorName}. Check notifications for scheduling links.`, 'info');
  };

  const handleOpenReview = (e: React.MouseEvent, req: BookingRequest) => {
    e.stopPropagation();
    setSelectedRequest(req);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(`Thank you! Your feedback for ${selectedRequest?.mentorName} has been submitted.`, 'success');
    setIsReviewModalOpen(false);
    setReviewComment('');
  };

  const getStatusBadge = (status: BookingRequest['status']) => {
    const configs = {
      Pending: 'bg-amber-50 text-amber-700 border-amber-200',
      Accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Completed: 'bg-blue-50 text-blue-700 border-blue-200',
      Declined: 'bg-rose-50 text-rose-700 border-rose-200',
      Cancelled: 'bg-slate-100 text-slate-500 border-slate-200'
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${configs[status]}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="my-requests-container">
      {/* Header text */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight" id="my-requests-title">Mentorship Bookings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor response status, join active video lobbies, and submit experience reviews for your completed mentorship sessions.
        </p>
      </div>

      {/* Tabs navigation panel */}
      <div className="border-b border-slate-200 flex gap-4 overflow-x-auto pb-px" id="my-requests-tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const count = tab === 'All' 
            ? requests.length 
            : tab === 'Declined'
              ? requests.filter(r => r.status === 'Declined' || r.status === 'Cancelled').length
              : requests.filter(r => r.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold transition-all relative border-b-2 shrink-0 cursor-pointer ${
                isActive 
                  ? 'text-slate-900 border-slate-900' 
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
              id={`tab-btn-${tab}`}
            >
              <div className="flex items-center gap-2 px-1">
                <span>{tab} Requests</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                  isActive ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Requests Listings Container */}
      <div className="space-y-4" id="requests-listings-list">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => handleOpenDetails(req)}
              className="bg-white border border-slate-200 hover:border-amber-500 p-5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
              id={`request-item-card-${req.id}`}
            >
              {/* Mentor profile snippet */}
              <div className="flex items-start gap-4">
                <img 
                  src={req.mentorImageUrl} 
                  alt={req.mentorName} 
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200 hover:opacity-90 transition-opacity shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMentor(req.mentorId);
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 
                      className="font-serif font-bold text-slate-900 hover:text-amber-600 transition-colors text-sm shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMentor(req.mentorId);
                      }}
                    >
                      {req.mentorName}
                    </h3>
                    <span className="text-xs text-slate-400 hidden sm:inline">• {req.mentorRole} at {req.mentorCompany}</span>
                  </div>
                  
                  <h4 className="text-xs font-bold text-slate-700 capitalize mt-1">Topic: {req.sessionTopic}</h4>
                  
                  {/* Message brief */}
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1 max-w-xl">
                    "{req.message}"
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-bold text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" /> {req.date} at {req.time}
                    </span>
                    <span>•</span>
                    <span>Requested: {req.dateRequested}</span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-between md:justify-center gap-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                <div>
                  {getStatusBadge(req.status)}
                </div>

                {/* Conditional Actions based on status */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDetails(req)}
                    className="flex-1 sm:flex-none bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2 px-3 rounded-lg border border-slate-200 cursor-pointer"
                    id={`action-details-${req.id}`}
                  >
                    View Details
                  </button>

                  {req.status === 'Pending' && (
                    <button
                      onClick={(e) => handleCancel(e, req.id, req.mentorName)}
                      className="flex-1 sm:flex-none bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold py-2 px-3 rounded-lg border border-rose-200 cursor-pointer"
                      id={`action-cancel-${req.id}`}
                    >
                      Cancel
                    </button>
                  )}

                  {req.status === 'Accepted' && (
                    <>
                      <button
                        onClick={(e) => handleReschedule(e, req.mentorName)}
                        className="flex-1 sm:flex-none bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold py-2 px-3 rounded-lg border border-amber-200 cursor-pointer"
                        id={`action-reschedule-${req.id}`}
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={(e) => handleJoin(e, req.mentorName)}
                        className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold py-2 px-3.5 rounded-lg flex items-center justify-center gap-1 shadow-md shadow-amber-500/10 cursor-pointer uppercase tracking-wider"
                        id={`action-join-${req.id}`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join</span>
                      </button>
                    </>
                  )}

                  {req.status === 'Completed' && (
                    <button
                      onClick={(e) => handleOpenReview(e, req)}
                      className="flex-1 sm:flex-none bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold py-2 px-3 rounded-lg border border-amber-200 flex items-center justify-center gap-1 cursor-pointer"
                      id={`action-review-${req.id}`}
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Review</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Empty state */
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto shadow-sm" id="bookings-empty-state">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-serif font-bold text-slate-800">No {activeTab !== 'All' ? activeTab : ''} Requests Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              You do not have any requests categorized under the <strong>{activeTab}</strong> tab. Browse the directory to connect with mentors.
            </p>
          </div>
        )}
      </div>

      {/* Details Slide-out Drawer Modal */}
      <AnimatePresence>
        {isDrawerOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="details-drawer-backdrop">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={handleCloseDrawer}></div>
            
            <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white border-l border-slate-200 shadow-2xl flex flex-col z-50">
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between" id="drawer-header">
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">Booking Details</h3>
                  <p className="text-[10px] text-slate-400">Request reference ID: {selectedRequest.id}</p>
                </div>
                <button 
                  onClick={handleCloseDrawer}
                  className="text-slate-400 hover:text-slate-600 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                  id="drawer-close-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6" id="drawer-scroll-content">
                {/* Mentor Block */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center gap-3">
                  <img 
                    src={selectedRequest.mentorImageUrl} 
                    alt={selectedRequest.mentorName} 
                    className="w-11 h-11 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 text-xs">{selectedRequest.mentorName}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{selectedRequest.mentorRole} at {selectedRequest.mentorCompany}</p>
                    <button 
                      onClick={() => {
                        handleCloseDrawer();
                        onSelectMentor(selectedRequest.mentorId);
                      }}
                      className="text-[10px] text-amber-700 font-bold hover:text-amber-600 hover:underline mt-1 block cursor-pointer"
                    >
                      View Full Profile →
                    </button>
                  </div>
                </div>

                {/* Session Config details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Session Configuration</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs bg-white border border-slate-200 p-4 rounded-lg">
                    <div>
                      <p className="text-slate-400">Topic format</p>
                      <p className="font-bold text-slate-800 capitalize mt-0.5">{selectedRequest.sessionTopic}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Meeting mode</p>
                      <p className="font-bold text-slate-850 flex items-center gap-1 mt-0.5 text-emerald-600">
                        <Video className="w-3.5 h-3.5" /> Virtual
                      </p>
                    </div>
                    <div className="col-span-2 border-t border-slate-200 pt-3 mt-1">
                      <p className="text-slate-400">Scheduled slot</p>
                      <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" /> {selectedRequest.date} at {selectedRequest.time}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User message */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Your Message to Mentor</h4>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed italic">
                    "{selectedRequest.message}"
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Activity Log Timeline</h4>
                  <div className="relative border-l border-slate-200 ml-3 pl-5 space-y-4" id="drawer-timeline">
                    {selectedRequest.timeline.map((event, idx) => (
                      <div key={idx} className="relative" id={`drawer-timeline-item-${idx}`}>
                        <span className={`absolute -left-7 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center shrink-0 ${
                          event.status === 'Accepted' || event.status === 'Completed' ? 'border-emerald-500 text-emerald-500' : 'border-slate-300'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-none">{event.status}</p>
                          <span className="text-[10px] text-slate-400 block mt-1">{event.date}</span>
                          <p className="text-[11px] text-slate-500 mt-1">{event.comment}</p>
                        </div>
                      </div>
                    ))}
                    {selectedRequest.status === 'Pending' && (
                      <div className="relative">
                        <span className="absolute -left-7 top-0.5 w-4 h-4 rounded-full border-2 border-dashed border-amber-400 bg-white flex items-center justify-center animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        </span>
                        <div>
                          <p className="text-xs font-bold text-amber-600 leading-none">Awaiting Review</p>
                          <p className="text-[11px] text-slate-500 mt-1">Mentor is reviewing your schedule slot suggestions.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-slate-200 flex gap-3 justify-end bg-slate-50" id="drawer-footer">
                {selectedRequest.status === 'Pending' && (
                  <button
                    onClick={(e) => handleCancel(e, selectedRequest.id, selectedRequest.mentorName)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold py-2.5 px-4 rounded-lg border border-rose-200 cursor-pointer"
                  >
                    Cancel Session
                  </button>
                )}
                {selectedRequest.status === 'Accepted' && (
                  <button
                    onClick={(e) => handleJoin(e, selectedRequest.mentorName)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-1 cursor-pointer uppercase tracking-wider shadow-md shadow-amber-500/10"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Session Video</span>
                  </button>
                )}
                <button
                  onClick={handleCloseDrawer}
                  className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Close Panel
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Experience Feedback Review Modal popup */}
      <AnimatePresence>
        {isReviewModalOpen && selectedRequest && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="review-modal-backdrop">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden"
              id="review-modal-box"
            >
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-slate-900">Leave Alumni Feedback</h3>
                <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleReviewSubmit} className="p-5 space-y-4" id="review-form">
                <div className="text-center space-y-2 mb-4">
                  <p className="text-xs text-slate-500">How was your session with <strong>{selectedRequest.mentorName}</strong>?</p>
                  
                  {/* Rating stars selector */}
                  <div className="flex items-center justify-center gap-1.5" id="stars-selector-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="text-slate-200 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                      >
                        <Star className={`w-8 h-8 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Review</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience to help other college students prepare..."
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs p-3 rounded-lg focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                    id="review-comment-textarea"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsReviewModalOpen(false)}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-lg border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold py-2.5 px-4 rounded-lg transition-all shadow-md shadow-amber-500/10 cursor-pointer uppercase tracking-wider"
                    id="submit-review-btn"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
