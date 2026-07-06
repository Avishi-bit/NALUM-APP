import React, { useState } from 'react';
import { 
  GraduationCap, 
  Mail, 
  MapPin, 
  Award, 
  BookOpen, 
  Settings, 
  Sparkles, 
  ShieldCheck, 
  Edit3, 
  Check, 
  Bookmark, 
  MessageSquare, 
  Video 
} from 'lucide-react';

interface ProfileViewProps {
  savedMentorIdsCount: number;
  requestsCount: number;
  forumPostsCount: number;
  addToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  savedMentorIdsCount,
  requestsCount,
  forumPostsCount,
  addToast
}) => {
  const [bio, setBio] = useState('Computer Science junior passionate about cloud systems, AI products, and developer relations. Currently preparing for APM/PM internship applications for Fall 2027. Keen on exploring product strategy frameworks and scalable backend architecture.');
  const [isEditing, setIsEditing] = useState(false);
  const [tempBio, setTempBio] = useState(bio);
  
  // Settings preferences toggle
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSaveBio = () => {
    setBio(tempBio);
    setIsEditing(false);
    addToast('Your professional biography has been updated.', 'success');
  };

  const handleTogglePreference = (preference: string, value: boolean, setter: (v: boolean) => void) => {
    setter(!value);
    addToast(`${preference} preferences updated.`, 'success');
  };

  const studentSkills = ['React', 'TypeScript', 'Node.js', 'SQL', 'Product Spec Design', 'Data Analysis'];
  const careerInterests = ['Product Management', 'Software Engineering', 'Strategy Consulting', 'SaaS startups'];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="profile-view-container">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight" id="profile-view-title">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your academic bio, career preferences, and system alerts.</p>
      </div>

      {/* Profile grid column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="profile-page-grid">
        {/* Left column: Student Avatar and Core Badges */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center relative" id="student-profile-card">
            <div className="absolute top-4 right-4 bg-amber-50 text-amber-700 border border-amber-150 p-2.5 rounded-xl shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>

            {/* Profile image */}
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150" 
              alt="Avishi Khanna"
              className="w-28 h-28 rounded-xl object-cover border-4 border-slate-100 shadow-md mb-4"
            />

            <h2 className="text-lg font-serif font-bold text-slate-900">Avishi Khanna</h2>
            <p className="text-xs text-slate-500 font-semibold">Undergraduate Student</p>
            <p className="text-xs text-amber-700 font-bold mb-4">Class of 2027</p>

            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-4">
              Computer Science & Engineering
            </span>

            {/* Education Info list */}
            <div className="w-full space-y-2.5 border-t border-slate-200 pt-4 mt-2 text-xs text-slate-600 text-left">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Delhi Technological University</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>khannaavishi@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-slate-400 shrink-0" />
                <span>CGPA Score: <strong className="text-slate-900">9.38 / 10.00</strong></span>
              </div>
            </div>
          </div>

          {/* Student Stats Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4" id="student-stats-panel">
            <h3 className="font-serif font-bold text-slate-900 text-xs border-b border-slate-200 pb-2 uppercase tracking-wider">Academic Activity</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <Bookmark className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="text-sm font-bold text-slate-900 block">{savedMentorIdsCount}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Saved</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <Video className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-sm font-bold text-slate-900 block">{requestsCount}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Booked</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <MessageSquare className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="text-sm font-bold text-slate-900 block">{forumPostsCount}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Threads</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Bio, Skills/Interests tags, Preferences settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Bio */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4" id="student-bio-card">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-lg font-serif font-bold text-slate-950">About Me</h3>
              {!isEditing ? (
                <button
                  onClick={() => {
                    setTempBio(bio);
                    setIsEditing(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-bold hover:underline hover:text-amber-800 cursor-pointer"
                  id="edit-bio-btn"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Biography</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBio}
                    className="inline-flex items-center gap-1 bg-amber-500 text-slate-900 text-xs font-bold py-1 px-3 rounded-lg hover:bg-amber-400 cursor-pointer"
                    id="save-bio-btn"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>

            {!isEditing ? (
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line italic">"{bio}"</p>
            ) : (
              <textarea
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm p-3.5 rounded-lg focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                id="edit-bio-textarea"
                required
              ></textarea>
            )}
          </div>

          {/* Core Skills & Career Tracks */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5" id="student-tags-card">
            <h3 className="text-lg font-serif font-bold text-slate-950 border-b border-slate-200 pb-2">Interests & Core Capabilities</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-2.5">Current Stack & Skills</span>
                <div className="flex flex-wrap gap-2">
                  {studentSkills.map((sk) => (
                    <span key={sk} className="bg-slate-50 text-slate-700 border border-slate-200 text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{sk}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-2.5">Target Industries & Career Tracks</span>
                <div className="flex flex-wrap gap-2">
                  {careerInterests.map((track) => (
                    <span key={track} className="bg-amber-50 text-amber-800 border border-amber-200 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{track}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Account System Settings */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4" id="student-tags-card">
            <h3 className="text-lg font-serif font-bold text-slate-950 border-b border-slate-200 pb-2">Notification Settings</h3>
            
            <div className="space-y-3" id="preferences-toggles">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-serif font-bold text-slate-800 text-xs">Email Alerts on Approvals</h4>
                  <p className="text-[10px] text-slate-500">Receive instant booking emails when alumni accept requests.</p>
                </div>
                <button
                  onClick={() => handleTogglePreference('Email Alerts', emailAlerts, setEmailAlerts)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none cursor-pointer ${
                    emailAlerts ? 'bg-amber-500' : 'bg-slate-200'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    emailAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-serif font-bold text-slate-800 text-xs">In-App Chat Reminders</h4>
                  <p className="text-[10px] text-slate-500">Receive system reminder notification alerts 1 hour before slots start.</p>
                </div>
                <button
                  onClick={() => handleTogglePreference('Chat Reminders', sessionReminders, setSessionReminders)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none cursor-pointer ${
                    sessionReminders ? 'bg-amber-500' : 'bg-slate-200'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    sessionReminders ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-serif font-bold text-slate-800 text-xs">Weekly Career Digest</h4>
                  <p className="text-[10px] text-slate-500">Subscribe to recommended alumni and hot topics on the community board.</p>
                </div>
                <button
                  onClick={() => handleTogglePreference('Weekly Digest', weeklyDigest, setWeeklyDigest)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none cursor-pointer ${
                    weeklyDigest ? 'bg-amber-500' : 'bg-slate-200'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    weeklyDigest ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
