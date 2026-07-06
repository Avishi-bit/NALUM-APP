import React from 'react';
import { ViewType } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  CalendarRange, 
  MessageSquare, 
  Bell, 
  User, 
  ShieldCheck, 
  GraduationCap,
  Sparkles,
  Search
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  unreadNotificationsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  isAdmin, 
  setIsAdmin,
  unreadNotificationsCount
}) => {
  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mentors' as ViewType, label: 'Find Mentors', icon: Users },
    { id: 'requests' as ViewType, label: 'My Requests', icon: CalendarRange },
    { id: 'forum' as ViewType, label: 'Discussion Forum', icon: MessageSquare },
    { id: 'notifications' as ViewType, label: 'Notifications', icon: Bell, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined },
    { id: 'profile' as ViewType, label: 'Profile', icon: User }
  ];

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      onViewChange('dashboard');
    } else {
      setIsAdmin(true);
      onViewChange('admin');
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 border-r border-slate-800 z-30"
        id="desktop-sidebar"
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800" id="sidebar-brand-header">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 font-bold shrink-0">
            <GraduationCap className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight leading-none text-white">AlumniLink</h1>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Mentorships</span>
          </div>
        </div>

        {/* User Mini Profile (Student default) */}
        <div className="px-5 py-4 border-b border-slate-800/60 bg-slate-950/40" id="sidebar-user-card">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" 
                alt="Avishi Khanna"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/50"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div>
              <p className="text-xs text-slate-400">Logged in as</p>
              <h2 className="font-semibold text-sm text-slate-200">Avishi Khanna</h2>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5">
                Class of 2027
              </span>
            </div>
          </div>
        </div>

        {/* Student View Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto" id="sidebar-student-nav">
          {!isAdmin ? (
            <>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Student Portal</div>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id || (item.id === 'mentors' && currentView === 'mentor-profile') || (item.id === 'forum' && currentView === 'forum-post');
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-all group ${
                      isActive 
                        ? 'bg-slate-800 text-white border-l-4 border-amber-500' 
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    }`}
                    id={`nav-item-${item.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? 'text-amber-500' : 'text-slate-400 group-hover:text-slate-300'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-[10px] font-bold leading-none text-slate-900 bg-amber-500 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </>
          ) : (
            <>
              <div className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider px-3 mb-2">Administration</div>
              <button
                onClick={() => onViewChange('admin')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'admin' 
                    ? 'bg-slate-800 text-white border-l-4 border-amber-500' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
                id="nav-item-admin"
              >
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span>Admin Console</span>
              </button>
              
              <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl mt-6 text-xs text-slate-400">
                <span className="font-semibold text-slate-300 block mb-1">Admin Mode Active</span>
                Manage mentor listings, accept scheduling requests, and moderate forum discussions.
              </div>
            </>
          )}
        </nav>

        {/* Bottom Role Switcher & Branding */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20" id="sidebar-footer">
          <button
            onClick={handleAdminToggle}
            className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
              isAdmin 
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:opacity-90 border-transparent shadow-lg shadow-amber-500/5'
            }`}
            id="role-toggle-button"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{isAdmin ? 'Back to Student View' : 'Switch to Admin View'}</span>
          </button>
          
          <div className="text-center text-[10px] text-slate-500 mt-3 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400/60" />
            <span>Campus Edition 2026</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 text-white z-40 px-2 pb-safe shadow-2xl"
        id="mobile-bottom-nav"
      >
        <div className="flex items-center justify-around py-2">
          {/* Dashboard */}
          <button
            onClick={() => {
              setIsAdmin(false);
              onViewChange('dashboard');
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors ${
              currentView === 'dashboard' && !isAdmin ? 'text-indigo-400' : 'text-slate-400'
            }`}
            id="mobile-nav-dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Home</span>
          </button>

          {/* Mentors */}
          <button
            onClick={() => {
              setIsAdmin(false);
              onViewChange('mentors');
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors ${
              (currentView === 'mentors' || currentView === 'mentor-profile') && !isAdmin ? 'text-indigo-400' : 'text-slate-400'
            }`}
            id="mobile-nav-mentors"
          >
            <Users className="w-5 h-5" />
            <span>Mentors</span>
          </button>

          {/* Requests */}
          <button
            onClick={() => {
              setIsAdmin(false);
              onViewChange('requests');
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors ${
              currentView === 'requests' && !isAdmin ? 'text-indigo-400' : 'text-slate-400'
            }`}
            id="mobile-nav-requests"
          >
            <CalendarRange className="w-5 h-5" />
            <span>Requests</span>
          </button>

          {/* Forum */}
          <button
            onClick={() => {
              setIsAdmin(false);
              onViewChange('forum');
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors ${
              (currentView === 'forum' || currentView === 'forum-post') && !isAdmin ? 'text-indigo-400' : 'text-slate-400'
            }`}
            id="mobile-nav-forum"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Forum</span>
          </button>

          {/* Role Switcher or Notifications */}
          <button
            onClick={handleAdminToggle}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors ${
              isAdmin ? 'text-amber-400' : 'text-slate-400'
            }`}
            id="mobile-nav-role"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{isAdmin ? 'Admin' : 'Go Admin'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
