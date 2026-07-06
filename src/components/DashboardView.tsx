import React from 'react';
import { Mentor, BookingRequest, ForumPost, ViewType } from '../types';
import { 
  Users, 
  Clock, 
  Calendar, 
  MessageCircle, 
  ArrowRight, 
  Video, 
  ExternalLink,
  Sparkles,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  mentors: Mentor[];
  requests: BookingRequest[];
  forumPosts: ForumPost[];
  onViewChange: (view: ViewType) => void;
  onSelectMentor: (mentorId: string) => void;
  onSelectForumPost: (postId: string) => void;
  onTriggerAskQuestion: () => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  mentors,
  requests,
  forumPosts,
  onViewChange,
  onSelectMentor,
  onSelectForumPost,
  onTriggerAskQuestion,
  addToast
}) => {
  // Determine dynamic greeting
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  if (hour >= 17) greeting = 'Good evening';

  // Stats calculation
  const availableMentorsCount = mentors.filter(m => m.availability === 'Available this week').length;
  const pendingRequestsCount = requests.filter(r => r.status === 'Pending').length;
  const upcomingSessions = requests.filter(r => r.status === 'Accepted');
  const forumContributionsCount = 3; // Mocked stat

  // Recommended mentors: grab first 3-4 mentors
  const recommendedMentors = mentors.slice(0, 3);

  // Recent forum posts
  const recentPosts = forumPosts.slice(0, 3);

  const handleJoinSession = (mentorName: string) => {
    addToast(`Connecting to secure video call with ${mentorName}...`, 'success');
  };

  // Date extraction helpers for upcoming sessions
  const getSessionMonthAbbr = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const monthNum = parseInt(parts[1], 10);
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        if (monthNum >= 1 && monthNum <= 12) {
          return months[monthNum - 1];
        }
      }
    } catch (e) {}
    return 'JUL';
  };

  const getSessionDay = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return parts[2];
      }
    } catch (e) {}
    return '14';
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn" id="dashboard-container">
      {/* Elegant Geometric Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-6" id="dashboard-header">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Campus Mentorship Active</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">{greeting}, Avishi</h1>
          <p className="text-slate-500 mt-1 max-w-xl">
            Continue building meaningful professional connections today. Discuss careers, prep for upcoming placements, and review profiles with verified campus alumni.
          </p>
        </div>
        <button 
          onClick={() => onViewChange('mentors')}
          className="bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-amber-500/10 hover:bg-amber-400 transition-all flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
          id="dashboard-find-mentor-btn"
        >
          <Users className="w-4 h-4" />
          <span>Find a Mentor</span>
        </button>
      </div>

      {/* Refined Geometric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-stats-grid">
        {/* Available Mentors */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group" id="stat-card-mentors">
          <div>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4 border border-amber-100 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900 font-serif leading-none">{availableMentorsCount}</p>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2">Available Mentors</p>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group" id="stat-card-pending">
          <div>
            <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center mb-4 border border-slate-200 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900 font-serif leading-none">{pendingRequestsCount}</p>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2">Pending Requests</p>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group" id="stat-card-upcoming">
          <div>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4 border border-amber-100 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900 font-serif leading-none">{upcomingSessions.length}</p>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2">Upcoming Sessions</p>
        </div>

        {/* Forum Contributions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group" id="stat-card-contributions">
          <div>
            <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center mb-4 border border-slate-200 group-hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900 font-serif leading-none">{forumContributionsCount}</p>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2">Forum Activity</p>
        </div>
      </div>

      {/* Main Core Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="dashboard-content-grid">
        {/* Left Column: Recommended Mentors & Upcoming Panel */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recommended Mentors */}
          <section id="recommended-mentors-section">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serif">Recommended for You</h2>
                <p className="text-xs text-slate-500">Handpicked alumni from Microsoft, Google, and top firms aligned with your interests.</p>
              </div>
              <button 
                onClick={() => onViewChange('mentors')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group uppercase tracking-wider cursor-pointer"
                id="view-all-mentors-link"
              >
                <span>View Directory</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="recommended-mentors-cards">
              {recommendedMentors.map((mentor) => (
                <div 
                  key={mentor.id}
                  onClick={() => onSelectMentor(mentor.id)}
                  className="bg-white rounded-xl p-4 border border-slate-200 flex gap-4 hover:shadow-md transition-all cursor-pointer group"
                  id={`rec-mentor-card-${mentor.id}`}
                >
                  <img 
                    src={mentor.imageUrl} 
                    alt={mentor.name} 
                    className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0 group-hover:border-amber-500 transition-colors"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-base truncate">{mentor.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{mentor.role} @ {mentor.company}</p>
                    
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md border border-amber-100">
                        {mentor.domain}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                        ★ {mentor.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Sessions */}
          <section id="upcoming-sessions-section">
            <h2 className="text-lg font-bold text-slate-900 font-serif mb-4">Upcoming Scheduled Sessions</h2>
            {upcomingSessions.length > 0 ? (
              <div className="space-y-3" id="upcoming-sessions-list">
                {upcomingSessions.map((session) => (
                  <div 
                    key={session.id}
                    className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    id={`upcoming-session-item-${session.id}`}
                  >
                    <div className="flex gap-4 items-center">
                      <div className="text-center bg-slate-800 rounded-xl px-4 py-3 border border-slate-700 min-w-[70px] flex-shrink-0">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">{getSessionMonthAbbr(session.date)}</p>
                        <p className="text-2xl font-bold text-amber-500 leading-none">{getSessionDay(session.date)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">{session.time} (Scheduled)</p>
                        <h3 className="text-base font-bold font-serif text-slate-100 mt-0.5">
                          {session.sessionTopic === 'mock interview' ? 'Mock Technical Interview' : session.sessionTopic === 'resume review' ? 'Resume Review & Feedback' : '1:1 Career Guidance'} with {session.mentorName}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">Video Conference • Campus WebRTC Video Lobby</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleJoinSession(session.mentorName)}
                      className="w-full sm:w-auto bg-white text-slate-900 text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-amber-400 hover:text-slate-950 transition-colors shrink-0 cursor-pointer text-center"
                      id={`join-session-btn-${session.id}`}
                    >
                      Join Session
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center" id="empty-upcoming-sessions">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-800">No Sessions Scheduled</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  You do not have any upcoming calls. Find an alumni mentor and submit a booking request.
                </p>
                <button 
                  onClick={() => onViewChange('mentors')}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wider"
                  id="dashboard-browse-alumni-btn"
                >
                  <span>Browse Alumni Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Quick Actions & Recent Discussion */}
        <div className="space-y-8">
          {/* Quick Actions Panel */}
          <section id="quick-actions-panel">
            <h2 className="text-lg font-bold text-slate-900 font-serif mb-4">Quick Actions</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3" id="quick-actions-list">
              <button 
                onClick={() => onViewChange('mentors')}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-slate-100 hover:border-amber-200 hover:bg-amber-50/10 text-left transition-all group cursor-pointer"
                id="quick-action-find"
              >
                <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Find a Mentor</h4>
                  <p className="text-[10px] text-slate-500">Explore and search the alumni directory</p>
                </div>
              </button>

              <button 
                onClick={() => onViewChange('mentors')}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-slate-100 hover:border-amber-200 hover:bg-amber-50/10 text-left transition-all group cursor-pointer"
                id="quick-action-request"
              >
                <div className="bg-slate-100 text-slate-600 p-2.5 rounded-lg group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Request a Session</h4>
                  <p className="text-[10px] text-slate-500">Schedule resume reviews or mock tests</p>
                </div>
              </button>

              <button 
                onClick={onTriggerAskQuestion}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-slate-100 hover:border-amber-200 hover:bg-amber-50/10 text-left transition-all group cursor-pointer"
                id="quick-action-ask"
              >
                <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg group-hover:scale-105 transition-transform">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Ask a Question</h4>
                  <p className="text-[10px] text-slate-500">Post a query on the open forum</p>
                </div>
              </button>

              <button 
                onClick={() => onViewChange('requests')}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-slate-100 hover:border-amber-200 hover:bg-amber-50/10 text-left transition-all group cursor-pointer"
                id="quick-action-view-reqs"
              >
                <div className="bg-slate-100 text-slate-600 p-2.5 rounded-lg group-hover:scale-105 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">View My Requests</h4>
                  <p className="text-[10px] text-slate-500">Check responses and schedule links</p>
                </div>
              </button>
            </div>
          </section>

          {/* Recent Discussion Activity */}
          <section id="recent-discussions-panel">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 font-serif">Recent Forums</h2>
              <button 
                onClick={() => onViewChange('forum')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wider cursor-pointer"
                id="forum-all-link"
              >
                See All
              </button>
            </div>

            <div className="space-y-3" id="recent-discussions-list">
              {recentPosts.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => onSelectForumPost(post.id)}
                  className="bg-white border border-slate-200 p-4 rounded-xl hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  id={`recent-discussion-item-${post.id}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold tracking-wider uppercase text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                        {post.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(post.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-4 pt-2.5 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-medium">
                      <MessageCircle className="w-3 h-3 text-slate-400" /> {post.commentsCount} comments
                    </span>
                    <span>•</span>
                    <span className="font-medium">{post.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
