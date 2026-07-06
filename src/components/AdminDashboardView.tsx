import React, { useState } from 'react';
import { Mentor, BookingRequest, ForumPost } from '../types';
import { 
  Users, 
  Clock, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Sliders, 
  Search, 
  ShieldAlert, 
  ChevronRight, 
  Bookmark,
  Pin,
  Trash2,
  Lock,
  ThumbsUp,
  AlertTriangle,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardViewProps {
  mentors: Mentor[];
  requests: BookingRequest[];
  forumPosts: ForumPost[];
  onUpdateRequestStatus: (requestId: string, newStatus: BookingRequest['status']) => void;
  onDeleteForumPost: (postId: string) => void;
  onToggleVerifyMentor: (mentorId: string) => void;
  onTogglePinReply?: (postId: string, replyId: string) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  mentors,
  requests,
  forumPosts,
  onUpdateRequestStatus,
  onDeleteForumPost,
  onToggleVerifyMentor,
  onTogglePinReply,
  addToast
}) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'overview' | 'mentors' | 'requests' | 'discussions'>('overview');
  const [mentorSearch, setMentorSearch] = useState('');
  const [requestSearch, setRequestSearch] = useState('');
  const [forumSearch, setForumSearch] = useState('');

  // Stats Counters
  const totalMentorsCount = mentors.length;
  const activeStudentsCount = 142; // Dynamic representation
  const pendingBookingsCount = requests.filter(r => r.status === 'Pending').length;
  const discussionsThisWeek = forumPosts.length;
  const sessionCompletionRate = '94.2%';

  // Filter lists based on admin searches
  const filteredAdminMentors = mentors.filter(m => 
    m.name.toLowerCase().includes(mentorSearch.toLowerCase()) || 
    m.company.toLowerCase().includes(mentorSearch.toLowerCase()) ||
    m.domain.toLowerCase().includes(mentorSearch.toLowerCase())
  );

  const filteredAdminRequests = requests.filter(r => 
    r.mentorName.toLowerCase().includes(requestSearch.toLowerCase()) || 
    r.sessionTopic.toLowerCase().includes(requestSearch.toLowerCase()) ||
    r.status.toLowerCase().includes(requestSearch.toLowerCase())
  );

  const filteredAdminDiscussions = forumPosts.filter(f => 
    f.title.toLowerCase().includes(forumSearch.toLowerCase()) || 
    f.authorName.toLowerCase().includes(forumSearch.toLowerCase()) ||
    f.category.toLowerCase().includes(forumSearch.toLowerCase())
  );

  // Administrative Actions
  const handleApproveRequest = (id: string, mentorName: string) => {
    onUpdateRequestStatus(id, 'Accepted');
    addToast(`Approved booking request with ${mentorName}. Link generated.`, 'success');
  };

  const handleRejectRequest = (id: string, mentorName: string) => {
    onUpdateRequestStatus(id, 'Declined');
    addToast(`Rejected booking request with ${mentorName}.`, 'warning');
  };

  const handleToggleMentorVerification = (id: string, name: string) => {
    onToggleVerifyMentor(id);
    const mentor = mentors.find(m => m.id === id);
    if (mentor?.isVerified) {
      addToast(`Revoked verified status for ${name}.`, 'info');
    } else {
      addToast(`Alumni profile for ${name} has been verified successfully.`, 'success');
    }
  };

  const handleDeletePost = (id: string, title: string) => {
    onDeleteForumPost(id);
    addToast(`Discussion post "${title.slice(0, 20)}..." has been deleted by moderation.`, 'error');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="admin-dashboard-container">
      {/* Header and description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5" id="admin-header">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Administration Mode</span>
            <span className="text-xs text-slate-400">| System Active</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">Platform Operations Manager</h1>
          <p className="text-sm text-slate-500 mt-0.5">Control mentor verifications, moderate discussions, and audit booking logs.</p>
        </div>

        {/* Local sub-nav tabs within Admin Console */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border self-start sm:self-auto shrink-0" id="admin-sub-tabs">
          <button
            onClick={() => setActiveAdminSubTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeAdminSubTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
            id="admin-tab-overview"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveAdminSubTab('mentors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeAdminSubTab === 'mentors' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
            id="admin-tab-mentors"
          >
            Mentors ({mentors.length})
          </button>
          <button
            onClick={() => setActiveAdminSubTab('requests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeAdminSubTab === 'requests' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
            id="admin-tab-requests"
          >
            Bookings ({requests.length})
          </button>
          <button
            onClick={() => setActiveAdminSubTab('discussions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeAdminSubTab === 'discussions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
            id="admin-tab-discussions"
          >
            Discussions ({forumPosts.length})
          </button>
        </div>
      </div>

      {/* Conditionally render sections */}
      <AnimatePresence mode="wait">
        {activeAdminSubTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
            id="admin-panel-overview"
          >
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4" id="admin-metrics-grid">
              <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Mentors</span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{totalMentorsCount}</p>
                <span className="text-[9px] text-emerald-600 font-medium block mt-1">↑ 4 added this week</span>
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Students</span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{activeStudentsCount}</p>
                <span className="text-[9px] text-emerald-600 font-medium block mt-1">↑ 12% growth monthly</span>
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Bookings</span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{pendingBookingsCount}</p>
                <span className="text-[9px] text-amber-600 font-medium block mt-1">Action required</span>
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Forums Active</span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{discussionsThisWeek}</p>
                <span className="text-[9px] text-indigo-600 font-medium block mt-1">112 total comments</span>
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs col-span-2 lg:col-span-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completion Rate</span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{sessionCompletionRate}</p>
                <span className="text-[9px] text-emerald-600 font-medium block mt-1">★ Highly efficient</span>
              </div>
            </div>

            {/* Custom Interactive SVG Growth Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="admin-charts-row">
              {/* Chart 1: Signup & Active Students growth curve */}
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">User Activity Trends (Weekly)</h4>
                    <p className="text-[10px] text-slate-500">Student activity vs. Mentor registrations</p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-semibold">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-indigo-500 rounded"></span> Students</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-amber-500 rounded"></span> Mentors</span>
                  </div>
                </div>

                {/* SVG Graph block */}
                <div className="relative h-44 w-full bg-slate-50 rounded-xl border border-slate-100 flex items-end px-4 pb-2 pt-6">
                  {/* Grid lines */}
                  <div className="absolute inset-x-0 top-1/4 border-t border-slate-200/40"></div>
                  <div className="absolute inset-x-0 top-2/4 border-t border-slate-200/40"></div>
                  <div className="absolute inset-x-0 top-3/4 border-t border-slate-200/40"></div>
                  
                  {/* SVG line paths */}
                  <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Student line (Indigo) */}
                    <path 
                      d="M 40 120 Q 120 70 200 80 T 360 40 T 520 20" 
                      fill="none" 
                      stroke="#4f46e5" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                    />
                    {/* Mentor line (Amber) */}
                    <path 
                      d="M 40 150 Q 120 140 200 130 T 360 110 T 520 85" 
                      fill="none" 
                      stroke="#f59e0b" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                      strokeDasharray="4"
                    />
                  </svg>

                  {/* X axis tags */}
                  <div className="w-full flex justify-between text-[9px] text-slate-400 font-bold px-2 relative z-10">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                    <span>Week 5</span>
                  </div>
                </div>
              </div>

              {/* Chart 2: Booking completions */}
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Mentorship Booking Conversions</h4>
                    <p className="text-[10px] text-slate-500">Total sessions successfully completed monthly</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> ↑ 18% over last month
                  </span>
                </div>

                {/* SVG Bar chart block */}
                <div className="relative h-44 w-full bg-slate-50 rounded-xl border border-slate-100 flex items-end justify-around px-8 pb-3 pt-6" id="completions-bar-chart">
                  {/* Bar data */}
                  <div className="flex flex-col items-center gap-1.5 w-8">
                    <span className="text-[9px] text-slate-500 font-semibold">18</span>
                    <div className="bg-indigo-600/40 hover:bg-indigo-600 w-full h-12 rounded-t transition-all"></div>
                    <span className="text-[9px] text-slate-400 font-bold">Mar</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 w-8">
                    <span className="text-[9px] text-slate-500 font-semibold">24</span>
                    <div className="bg-indigo-600/60 hover:bg-indigo-600 w-full h-18 rounded-t transition-all"></div>
                    <span className="text-[9px] text-slate-400 font-bold">Apr</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 w-8">
                    <span className="text-[9px] text-slate-500 font-semibold">31</span>
                    <div className="bg-indigo-600/80 hover:bg-indigo-600 w-full h-24 rounded-t transition-all"></div>
                    <span className="text-[9px] text-slate-400 font-bold">May</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 w-8">
                    <span className="text-[9px] text-slate-500 font-semibold">48</span>
                    <div className="bg-indigo-600 w-full h-32 rounded-t transition-all shadow-md shadow-indigo-600/10"></div>
                    <span className="text-[9px] text-indigo-600 font-extrabold">Jun</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Audit / Pending Approval Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="admin-overview-panels">
              {/* Left panel: Booking requests pending */}
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-3">
                <h4 className="font-bold text-slate-900 text-xs border-b border-slate-50 pb-2 flex items-center justify-between">
                  <span>Booking Approvals Required</span>
                  <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {pendingBookingsCount} Pending
                  </span>
                </h4>

                {requests.filter(r => r.status === 'Pending').length > 0 ? (
                  <div className="divide-y divide-slate-100 space-y-3" id="admin-pending-bookings-quick-list">
                    {requests.filter(r => r.status === 'Pending').map((req) => (
                      <div key={req.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                        <div className="flex gap-2.5 items-start">
                          <img 
                            src={req.mentorImageUrl} 
                            alt={req.mentorName} 
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">Student Request for {req.mentorName}</p>
                            <span className="text-[10px] text-slate-500 capitalize">{req.sessionTopic} • {req.date} at {req.time}</span>
                            <p className="text-[11px] text-slate-400 line-clamp-1 italic">"{req.message}"</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button 
                            onClick={() => handleApproveRequest(req.id, req.mentorName)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded-lg transition-colors cursor-pointer"
                            title="Approve Session"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleRejectRequest(req.id, req.mentorName)}
                            className="bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                            title="Reject Session"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 text-center py-6">All bookings have been successfully audited and processed!</p>
                )}
              </div>

              {/* Right panel: Flagged / Moderation checks */}
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-3">
                <h4 className="font-bold text-slate-900 text-xs border-b border-slate-50 pb-2">Recent Community Dispatches</h4>
                
                <div className="divide-y divide-slate-100 space-y-3" id="admin-recent-moderations-quick-list">
                  {forumPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">{post.category}</span>
                        <h5 className="text-xs font-bold text-slate-900 mt-1 leading-snug">{post.title}</h5>
                        <p className="text-[10px] text-slate-400">By {post.authorName} • {post.commentsCount} replies • {post.views} views</p>
                      </div>

                      <button 
                        onClick={() => handleDeletePost(post.id, post.title)}
                        className="bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 p-1.5 rounded-lg border border-slate-100 hover:border-rose-100 transition-colors shrink-0 cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mentors Management sub-tab table */}
        {activeAdminSubTab === 'mentors' && (
          <motion.div
            key="mentors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-slate-100 rounded-2xl shadow-xs p-5 space-y-4"
            id="admin-panel-mentors"
          >
            {/* Search filter table input */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                value={mentorSearch}
                onChange={(e) => setMentorSearch(e.target.value)}
                placeholder="Search mentors by name or company..."
                className="w-full bg-slate-50 text-slate-900 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            {/* Core Table */}
            <div className="overflow-x-auto" id="admin-mentors-table-container">
              <table className="w-full text-left border-collapse" id="admin-mentors-table">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-extrabold bg-slate-50/50">
                    <th className="py-3 px-4">Alumni Profile</th>
                    <th className="py-3 px-4">Specialization Domain</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Weekly Status</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4 text-right">Moderator Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {filteredAdminMentors.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/40" id={`admin-mentor-row-${m.id}`}>
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img 
                          src={m.imageUrl} 
                          alt={m.name} 
                          className="w-9 h-9 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{m.name}</p>
                          <span className="text-[10px] text-slate-400">{m.role} at {m.company}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                          {m.domain}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-semibold">{m.experience} Years</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-slate-700">{m.availability}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          m.isVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-400'
                        }`}>
                          {m.isVerified ? '✓ Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleMentorVerification(m.id, m.name)}
                          className={`text-[10px] font-bold py-1.5 px-2.5 rounded-lg border transition-colors cursor-pointer ${
                            m.isVerified 
                              ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' 
                              : 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700'
                          }`}
                        >
                          {m.isVerified ? 'Revoke Badge' : 'Verify Mentor'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Requests Management sub-tab table */}
        {activeAdminSubTab === 'requests' && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-slate-100 rounded-2xl shadow-xs p-5 space-y-4"
            id="admin-panel-requests"
          >
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
                placeholder="Search requests by topic or status..."
                className="w-full bg-slate-50 text-slate-900 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            <div className="overflow-x-auto" id="admin-requests-table-container">
              <table className="w-full text-left border-collapse" id="admin-requests-table">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-extrabold bg-slate-50/50">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Target Mentor</th>
                    <th className="py-3 px-4">Session Topic</th>
                    <th className="py-3 px-4">Proposed Schedule</th>
                    <th className="py-3 px-4">Booking Status</th>
                    <th className="py-3 px-4 text-right">Audit Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {filteredAdminRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/40" id={`admin-request-row-${r.id}`}>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        Avishi Khanna
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{r.mentorName}</p>
                        <span className="text-[10px] text-slate-400">{r.mentorRole}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-50 border px-2 py-0.5 rounded capitalize font-medium text-slate-700">
                          {r.sessionTopic}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {r.date} at {r.time}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' :
                          r.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {r.status === 'Pending' ? (
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => handleApproveRequest(r.id, r.mentorName)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRequest(r.id, r.mentorName)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold py-1 px-2.5 rounded-lg transition-colors border border-rose-100 cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold italic">Audit Complete</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Discussions Moderation sub-tab table */}
        {activeAdminSubTab === 'discussions' && (
          <motion.div
            key="discussions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-slate-100 rounded-2xl shadow-xs p-5 space-y-4"
            id="admin-panel-discussions"
          >
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                value={forumSearch}
                onChange={(e) => setForumSearch(e.target.value)}
                placeholder="Search discussions by title or author..."
                className="w-full bg-slate-50 text-slate-900 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            <div className="overflow-x-auto" id="admin-forum-table-container">
              <table className="w-full text-left border-collapse" id="admin-forum-table">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-extrabold bg-slate-50/50">
                    <th className="py-3 px-4">Author Profile</th>
                    <th className="py-3 px-4">Discussions Category</th>
                    <th className="py-3 px-4">Discussion Title</th>
                    <th className="py-3 px-4">Audience Engagement</th>
                    <th className="py-3 px-4 text-right">Moderator Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {filteredAdminDiscussions.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/40" id={`admin-forum-row-${post.id}`}>
                      <td className="py-3.5 px-4 flex items-center gap-2.5">
                        <img 
                          src={post.authorAvatar} 
                          alt={post.authorName} 
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{post.authorName}</p>
                          <span className="text-[10px] text-slate-400">{post.authorRole}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          {post.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-sm truncate font-medium text-slate-800">
                        {post.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-semibold">
                        {post.likes} Likes • {post.commentsCount} Comments • {post.views} Views
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeletePost(post.id, post.title)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold py-1.5 px-3 rounded-lg border border-rose-150 flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Moderate Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
