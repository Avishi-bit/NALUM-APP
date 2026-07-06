import { useState, useEffect } from 'react';
import { ViewType, Mentor, BookingRequest, ForumPost, ForumReply, NotificationItem, ToastMessage } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_MENTORS, INITIAL_REQUESTS, INITIAL_FORUM_POSTS, INITIAL_NOTIFICATIONS } from './data';
import { ToastContainer } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { FindMentorsView } from './components/FindMentorsView';
import { MentorProfileView } from './components/MentorProfileView';
import { MyRequestsView } from './components/MyRequestsView';
import { ForumView } from './components/ForumView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';

import { 
  Bell, 
  Search, 
  User, 
  ShieldCheck, 
  Settings, 
  ChevronDown, 
  LogOut, 
  Calendar, 
  MessageSquare,
  Sparkles,
  HelpCircle,
  Menu,
  GraduationCap
} from 'lucide-react';

export default function App() {
  // Navigation states
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [selectedForumPostId, setSelectedForumPostId] = useState<string | null>(null);
  const [isForumCreateModalOpenPreset, setIsForumCreateModalOpenPreset] = useState(false);

  // Platform role states
  const [isAdmin, setIsAdmin] = useState(false);

  // Global database states with initial mock data
  const [mentors, setMentors] = useState<Mentor[]>(() => {
    const saved = localStorage.getItem('alumnilink_mentors');
    return saved ? JSON.parse(saved) : INITIAL_MENTORS;
  });

  const [requests, setRequests] = useState<BookingRequest[]>(() => {
    const saved = localStorage.getItem('alumnilink_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem('alumnilink_forumposts');
    return saved ? JSON.parse(saved) : INITIAL_FORUM_POSTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('alumnilink_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [savedMentorIds, setSavedMentorIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('alumnilink_saved_mentor_ids');
    return saved ? JSON.parse(saved) : ['m1', 'm4']; // pre-save 2 mentors
  });

  // Top Bar user profile dropdown state
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Toast Alerts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent local synchronization
  useEffect(() => {
    localStorage.setItem('alumnilink_mentors', JSON.stringify(mentors));
  }, [mentors]);

  useEffect(() => {
    localStorage.setItem('alumnilink_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('alumnilink_forumposts', JSON.stringify(forumPosts));
  }, [forumPosts]);

  useEffect(() => {
    localStorage.setItem('alumnilink_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('alumnilink_saved_mentor_ids', JSON.stringify(savedMentorIds));
  }, [savedMentorIds]);

  // Toast triggers
  const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Saved/Bookmarked Mentor Toggles
  const handleToggleSaveMentor = (mentorId: string) => {
    const isCurrentlySaved = savedMentorIds.includes(mentorId);
    const mentor = mentors.find(m => m.id === mentorId);
    
    if (isCurrentlySaved) {
      setSavedMentorIds((prev) => prev.filter((id) => id !== mentorId));
      addToast(`${mentor?.name} has been removed from saved list.`, 'info');
    } else {
      setSavedMentorIds((prev) => [...prev, mentorId]);
      addToast(`${mentor?.name} has been added to your favorites list.`, 'success');
    }
  };

  // Booking Mentorship Request Submit
  const handleBookingSubmit = (requestData: Omit<BookingRequest, 'id' | 'dateRequested' | 'timeline'>) => {
    const newId = `req_${Date.now()}`;
    const dateStr = new Date().toISOString().split('T')[0];
    
    const newRequest: BookingRequest = {
      ...requestData,
      id: newId,
      dateRequested: dateStr,
      timeline: [
        { status: 'Pending', date: dateStr, comment: 'Request sent by Avishi' }
      ]
    };

    setRequests((prev) => [newRequest, ...prev]);

    // Add alert notification
    const newNotification: NotificationItem = {
      id: `n_${Date.now()}`,
      title: 'Request Dispatched',
      message: `Your booking request for "${requestData.sessionTopic}" was forwarded to ${requestData.mentorName}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'request'
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Audit / Change Booking Status from Admin console
  const handleUpdateRequestStatus = (requestId: string, newStatus: BookingRequest['status']) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const dateStr = new Date().toISOString().split('T')[0];
          
          // Generate automated notification
          const newNotification: NotificationItem = {
            id: `n_${Date.now()}`,
            title: newStatus === 'Accepted' ? 'Booking Accepted!' : 'Booking Denied',
            message: newStatus === 'Accepted' 
              ? `${req.mentorName} accepted your booking for ${req.sessionTopic}. Meet link scheduled.`
              : `${req.mentorName} declined your booking for ${req.sessionTopic} due to time conflicts.`,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'request'
          };
          setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);

          return {
            ...req,
            status: newStatus,
            timeline: [
              ...req.timeline,
              { status: newStatus, date: dateStr, comment: `Audited status change to ${newStatus}` }
            ]
          };
        }
        return req;
      })
    );
  };

  // Student cancels request
  const handleCancelRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const dateStr = new Date().toISOString().split('T')[0];
          return {
            ...req,
            status: 'Cancelled',
            timeline: [
              ...req.timeline,
              { status: 'Cancelled', date: dateStr, comment: 'Cancelled by student' }
            ]
          };
        }
        return req;
      })
    );
  };

  // Forum: Start a Discussion
  const handleCreatePost = (postData: Omit<ForumPost, 'id' | 'likes' | 'commentsCount' | 'views' | 'timestamp' | 'replies'>) => {
    const newPost: ForumPost = {
      ...postData,
      id: `p_${Date.now()}`,
      likes: 0,
      commentsCount: 0,
      views: 1,
      timestamp: new Date().toISOString(),
      replies: []
    };

    setForumPosts((prev) => [newPost, ...prev]);

    // Create system alert
    const newNotification: NotificationItem = {
      id: `n_${Date.now()}`,
      title: 'Topic Published',
      message: `Your discussion topic "${postData.title.slice(0, 25)}..." is now live on the board.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'forum'
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Forum: Like Post
  const handleToggleLikePost = (postId: string) => {
    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isCurrentlyLiked = post.likedByUser;
          return {
            ...post,
            likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1,
            likedByUser: !isCurrentlyLiked
          };
        }
        return post;
      })
    );
  };

  // Forum: Bookmark/Save Post
  const handleToggleSavePost = (postId: string) => {
    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isCurrentlySaved = post.savedByUser;
          addToast(
            isCurrentlySaved 
              ? 'Removed discussion from saved bookmarks.' 
              : 'Saved discussion to bookmarks.', 
            'success'
          );
          return {
            ...post,
            savedByUser: !isCurrentlySaved
          };
        }
        return post;
      })
    );
  };

  // Forum: Add Reply Comment
  const handleAddReply = (postId: string, replyContent: string) => {
    const newReply: ForumReply = {
      id: `rep_${Date.now()}`,
      authorName: 'Avishi Khanna',
      authorRole: 'CS Junior (Student)',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100',
      content: replyContent,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            replies: [...post.replies, newReply]
          };
        }
        return post;
      })
    );
  };

  // Admin deletes forum post (moderation)
  const handleDeleteForumPost = (postId: string) => {
    setForumPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Admin toggles mentor verified check
  const handleToggleVerifyMentor = (mentorId: string) => {
    setMentors((prev) =>
      prev.map((m) => {
        if (m.id === mentorId) {
          return {
            ...m,
            isVerified: !m.isVerified
          };
        }
        return m;
      })
    );
  };

  // Notifications alerts helpers
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Simple global routing helper
  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    setSelectedMentorId(null);
    setSelectedForumPostId(null);
    setIsForumCreateModalOpenPreset(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMentor = (mentorId: string) => {
    setSelectedMentorId(mentorId);
    setCurrentView('mentor-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectForumPost = (postId: string | null) => {
    setSelectedForumPostId(postId);
    setCurrentView(postId ? 'forum-post' : 'forum');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerAskQuestion = () => {
    setIsForumCreateModalOpenPreset(true);
    setCurrentView('forum');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800" id="platform-root">
      {/* Toast Alert popups */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Navigation Layout Sidebars */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={handleNavigate}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Main Container Wrapper */}
      <div className="md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0" id="main-content-layout">
        
        {/* Core Top Bar Utility Menu */}
        <header className="bg-white border-b border-slate-100 h-16 shrink-0 sticky top-0 z-20 px-6 sm:px-8 flex items-center justify-between" id="platform-topbar">
          
          {/* Quick Search trigger or brand display */}
          <div className="flex items-center gap-3" id="topbar-left-block">
            {/* Mobile menu logo indicator */}
            <div className="md:hidden bg-amber-500/10 p-1.5 rounded-lg text-amber-500" id="mobile-topbar-logo">
              <GraduationCap className="w-5 h-5" />
            </div>
            
            <div className="relative hidden sm:block w-72" id="topbar-search-bar">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search mentors or forum..."
                onClick={() => {
                  if (currentView !== 'forum' && currentView !== 'forum-post') {
                    handleNavigate('mentors');
                  }
                }}
                className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-slate-800 text-xs pl-9 pr-4 py-2 rounded-xl outline-none border border-transparent focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* User actions / Alert triggers */}
          <div className="flex items-center gap-4" id="topbar-right-block">
            {/* Bell icon trigger */}
            <button
              onClick={() => handleNavigate('notifications')}
              className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              title="Notifications"
              id="topbar-notifications-bell"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 border-2 border-white text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Admin toggle badge indicator */}
            {isAdmin && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </span>
            )}

            <div className="border-l border-slate-100 h-6"></div>

            {/* Profile Avatar Trigger dropdown */}
            <div className="relative" id="topbar-profile-container">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 text-left focus:outline-none cursor-pointer group"
                id="topbar-profile-button"
              >
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" 
                  alt="Avishi Khanna"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-500/50 transition-all"
                />
                <span className="text-xs font-bold text-slate-700 hidden sm:inline group-hover:text-indigo-600 transition-colors">Avishi Khanna</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Simple Absolute Dropdown menu list */}
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsProfileDropdownOpen(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-40 py-1"
                      id="profile-dropdown-menu"
                    >
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleNavigate('profile');
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleNavigate('notifications');
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Bell className="w-4 h-4 text-slate-400" />
                        <span>Notifications</span>
                      </button>

                      <div className="border-t border-slate-50 my-1"></div>

                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setIsAdmin(!isAdmin);
                          handleNavigate(isAdmin ? 'dashboard' : 'admin');
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-xs text-indigo-600 hover:bg-indigo-50/50 font-bold transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-500" />
                        <span>{isAdmin ? 'Exit Admin Mode' : 'Enter Admin Mode'}</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* Dynamic View Panel Router Layout */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto" id="platform-router-outlet">
          {(() => {
            if (isAdmin) {
              return (
                <AdminDashboardView 
                  mentors={mentors}
                  requests={requests}
                  forumPosts={forumPosts}
                  onUpdateRequestStatus={handleUpdateRequestStatus}
                  onDeleteForumPost={handleDeleteForumPost}
                  onToggleVerifyMentor={handleToggleVerifyMentor}
                  addToast={addToast}
                />
              );
            }

            switch (currentView) {
              case 'dashboard':
                return (
                  <DashboardView 
                    mentors={mentors}
                    requests={requests}
                    forumPosts={forumPosts}
                    onViewChange={handleNavigate}
                    onSelectMentor={handleSelectMentor}
                    onSelectForumPost={handleSelectForumPost}
                    onTriggerAskQuestion={handleTriggerAskQuestion}
                    addToast={addToast}
                  />
                );
              case 'mentors':
                return (
                  <FindMentorsView 
                    mentors={mentors}
                    savedMentorIds={savedMentorIds}
                    onToggleSaveMentor={handleToggleSaveMentor}
                    onSelectMentor={handleSelectMentor}
                    onRequestSession={handleSelectMentor} // redirects to profile
                    addToast={addToast}
                  />
                );
              case 'mentor-profile':
                if (selectedMentorId) {
                  const targetMentor = mentors.find(m => m.id === selectedMentorId);
                  if (targetMentor) {
                    return (
                      <MentorProfileView 
                        mentor={targetMentor}
                        allMentors={mentors}
                        savedMentorIds={savedMentorIds}
                        onToggleSaveMentor={handleToggleSaveMentor}
                        onBack={() => handleNavigate('mentors')}
                        onSelectMentor={handleSelectMentor}
                        onBookingSubmit={handleBookingSubmit}
                        addToast={addToast}
                      />
                    );
                  }
                }
                return <div className="text-sm text-slate-500">Error loading alumni profile. Please re-visit directory.</div>;
              case 'requests':
                return (
                  <MyRequestsView 
                    requests={requests}
                    onCancelRequest={handleCancelRequest}
                    onSelectMentor={handleSelectMentor}
                    addToast={addToast}
                  />
                );
              case 'forum':
              case 'forum-post':
                return (
                  <ForumView 
                    forumPosts={forumPosts}
                    currentForumPostId={selectedForumPostId}
                    onSelectForumPost={handleSelectForumPost}
                    onCreatePost={handleCreatePost}
                    onAddReply={handleAddReply}
                    onToggleLikePost={handleToggleLikePost}
                    onToggleSavePost={handleToggleSavePost}
                    addToast={addToast}
                    isCreateModalOpenPreset={isForumCreateModalOpenPreset}
                  />
                );
              case 'notifications':
                return (
                  <NotificationsView 
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onClearNotification={handleClearNotification}
                    addToast={addToast}
                  />
                );
              case 'profile':
                return (
                  <ProfileView 
                    savedMentorIdsCount={savedMentorIds.length}
                    requestsCount={requests.length}
                    forumPostsCount={forumPosts.filter(p => p.authorName === 'Avishi Khanna').length}
                    addToast={addToast}
                  />
                );
              default:
                return <div className="text-sm">Page not found. Click sidebar items.</div>;
            }
          })()}
        </main>
      </div>
    </div>
  );
}
