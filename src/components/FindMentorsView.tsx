import React, { useState, useMemo } from 'react';
import { Mentor, ViewType } from '../types';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Star, 
  Briefcase, 
  Clock, 
  Bookmark, 
  BookmarkCheck,
  ChevronDown,
  X,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FindMentorsViewProps {
  mentors: Mentor[];
  savedMentorIds: string[];
  onToggleSaveMentor: (mentorId: string) => void;
  onSelectMentor: (mentorId: string) => void;
  onRequestSession: (mentorId: string) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export const FindMentorsView: React.FC<FindMentorsViewProps> = ({
  mentors,
  savedMentorIds,
  onToggleSaveMentor,
  onSelectMentor,
  onRequestSession,
  addToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced Filter states
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedExp, setSelectedExp] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedSessionType, setSelectedSessionType] = useState('All');
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Domains list
  const domains = [
    'All',
    'Software Engineering',
    'Product Management',
    'Finance',
    'Consulting',
    'Design',
    'Research',
    'Entrepreneurship',
    'Higher Studies'
  ];

  // Locations list
  const locations = ['All', 'San Francisco', 'New York', 'Seattle', 'Bengaluru', 'Boston', 'Remote Friendly'];

  // Handle saving
  const handleSaveToggle = (e: React.MouseEvent, mentorId: string, mentorName: string) => {
    e.stopPropagation();
    onToggleSaveMentor(mentorId);
  };

  // Filter & Search Logic
  const filteredMentors = useMemo(() => {
    return mentors
      .filter((mentor) => {
        // Search term match
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
          mentor.name.toLowerCase().includes(term) ||
          mentor.company.toLowerCase().includes(term) ||
          mentor.role.toLowerCase().includes(term) ||
          mentor.domain.toLowerCase().includes(term) ||
          mentor.bio.toLowerCase().includes(term) ||
          mentor.expertise.some(exp => exp.toLowerCase().includes(term));

        // Domain filter
        const matchesDomain = selectedDomain === 'All' || mentor.domain === selectedDomain;

        // Experience filter
        let matchesExp = true;
        if (selectedExp === '< 5 Years') {
          matchesExp = mentor.experience < 5;
        } else if (selectedExp === '5-9 Years') {
          matchesExp = mentor.experience >= 5 && mentor.experience <= 9;
        } else if (selectedExp === '10+ Years') {
          matchesExp = mentor.experience >= 10;
        }

        // Availability filter
        const matchesAvailability = selectedAvailability === 'All' || mentor.availability === selectedAvailability;

        // Location filter
        let matchesLocation = true;
        if (selectedLocation !== 'All') {
          matchesLocation = mentor.location.toLowerCase().includes(selectedLocation.toLowerCase()) || 
                            (selectedLocation === 'Remote Friendly' && mentor.location.toLowerCase().includes('remote'));
        }

        // Session type filter
        let matchesSessionType = true;
        if (selectedSessionType !== 'All') {
          matchesSessionType = mentor.sessionFormats.some(format => 
            format.toLowerCase().includes(selectedSessionType.toLowerCase())
          );
        }

        // Saved filter
        const matchesSaved = !showSavedOnly || savedMentorIds.includes(mentor.id);

        return matchesSearch && matchesDomain && matchesExp && matchesAvailability && matchesLocation && matchesSessionType && matchesSaved;
      })
      .sort((a, b) => {
        if (sortBy === 'Most Experienced') {
          return b.experience - a.experience;
        }
        if (sortBy === 'Recently Active') {
          // Sort by sessions count as proxy for activity
          return b.sessionsCount - a.sessionsCount;
        }
        if (sortBy === 'Available This Week') {
          const availabilityPriority = {
            'Available this week': 4,
            'Booking fast': 3,
            'Next week': 2,
            'Away': 1
          };
          return (availabilityPriority[b.availability] || 0) - (availabilityPriority[a.availability] || 0);
        }
        // 'Most Relevant' -> Rating
        return b.rating - a.rating;
      });
  }, [mentors, searchTerm, selectedDomain, selectedExp, selectedAvailability, selectedLocation, selectedSessionType, sortBy, showSavedOnly, savedMentorIds]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDomain('All');
    setSelectedExp('All');
    setSelectedAvailability('All');
    setSelectedLocation('All');
    setSelectedSessionType('All');
    setSortBy('Most Relevant');
    setShowSavedOnly(false);
    addToast('All filters have been reset.', 'info');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="find-mentors-container">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight" id="find-mentors-title">Find Your Mentor</h1>
        <p className="text-sm text-slate-500 mt-1">
          Connect with alumni who can guide you through careers, higher education, entrepreneurship, and more.
        </p>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4" id="directory-filter-card">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, company, role, or specific expertise..."
              className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm pl-11 pr-4 py-3 rounded-lg border border-slate-200 focus:border-amber-500 transition-all outline-none"
              id="mentor-search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters / Sorters */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            {/* Saved Filter toggle */}
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                showSavedOnly 
                  ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              id="toggle-saved-mentors-btn"
            >
              <Bookmark className={`w-4 h-4 ${showSavedOnly ? 'fill-amber-500 text-amber-600' : 'text-slate-500'}`} />
              <span>Saved Mentors ({savedMentorIds.length})</span>
            </button>

            {/* Sorter */}
            <div className="relative flex-1 sm:flex-none">
              <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold pl-10 pr-8 py-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-amber-500"
                id="mentor-sort-select"
              >
                <option>Most Relevant</option>
                <option>Most Experienced</option>
                <option>Recently Active</option>
                <option>Available This Week</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-3 items-center text-xs" id="dropdown-filters-grid">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter by:</span>
          </div>

          {/* Domain Dropdown */}
          <div className="relative shrink-0">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className={`bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 pr-7 rounded-lg border appearance-none cursor-pointer focus:outline-none ${
                selectedDomain !== 'All' ? 'border-amber-300 bg-amber-50/50 text-amber-800 font-semibold' : 'border-slate-200'
              }`}
              id="filter-domain-select"
            >
              <option value="All">All Domains</option>
              {domains.slice(1).map(dom => (
                <option key={dom} value={dom}>{dom}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
          </div>

          {/* Years of Experience Filter */}
          <div className="relative shrink-0">
            <select
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              className={`bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 pr-7 rounded-lg border appearance-none cursor-pointer focus:outline-none ${
                selectedExp !== 'All' ? 'border-amber-300 bg-amber-50/50 text-amber-800 font-semibold' : 'border-slate-200'
              }`}
              id="filter-exp-select"
            >
              <option value="All">Experience: All</option>
              <option value="< 5 Years">&lt; 5 Years</option>
              <option value="5-9 Years">5 - 9 Years</option>
              <option value="10+ Years">10+ Years</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
          </div>

          {/* Availability Filter */}
          <div className="relative shrink-0">
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className={`bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 pr-7 rounded-lg border appearance-none cursor-pointer focus:outline-none ${
                selectedAvailability !== 'All' ? 'border-amber-300 bg-amber-50/50 text-amber-800 font-semibold' : 'border-slate-200'
              }`}
              id="filter-avail-select"
            >
              <option value="All">Availability: All</option>
              <option value="Available this week">Available this week</option>
              <option value="Booking fast">Booking fast</option>
              <option value="Next week">Next week</option>
              <option value="Away">Away</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
          </div>

          {/* Location Filter */}
          <div className="relative shrink-0">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className={`bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 pr-7 rounded-lg border appearance-none cursor-pointer focus:outline-none ${
                selectedLocation !== 'All' ? 'border-amber-300 bg-amber-50/50 text-amber-800 font-semibold' : 'border-slate-200'
              }`}
              id="filter-loc-select"
            >
              <option value="All">Location: All</option>
              {locations.slice(1).map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
          </div>

          {/* Session Format Filter */}
          <div className="relative shrink-0">
            <select
              value={selectedSessionType}
              onChange={(e) => setSelectedSessionType(e.target.value)}
              className={`bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 pr-7 rounded-lg border appearance-none cursor-pointer focus:outline-none ${
                selectedSessionType !== 'All' ? 'border-amber-300 bg-amber-50/50 text-amber-800 font-semibold' : 'border-slate-200'
              }`}
              id="filter-session-select"
            >
              <option value="All">Format: All</option>
              <option value="1:1 career guidance">1:1 Career Guidance</option>
              <option value="resume review">Resume Review</option>
              <option value="mock interview">Mock Interview</option>
              <option value="higher studies guidance">Higher Studies guidance</option>
              <option value="portfolio review">Portfolio Review</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
          </div>

          {/* Clear Button */}
          {(searchTerm || selectedDomain !== 'All' || selectedExp !== 'All' || selectedAvailability !== 'All' || selectedLocation !== 'All' || selectedSessionType !== 'All' || showSavedOnly) && (
            <button 
              onClick={handleResetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline underline-offset-4 cursor-pointer ml-auto"
              id="clear-all-filters-btn"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>Showing {filteredMentors.length} of {mentors.length} alumni mentors</span>
        {showSavedOnly && <span className="text-amber-600 font-bold">Filtering saved alumni</span>}
      </div>

      {/* Responsive Mentor Cards Grid */}
      <AnimatePresence mode="popLayout">
        {filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="mentor-cards-grid">
            {filteredMentors.map((mentor) => {
              const isSaved = savedMentorIds.includes(mentor.id);
              const availabilityColors = {
                'Available this week': 'bg-emerald-50 text-emerald-700 border-emerald-100 text-emerald-800',
                'Booking fast': 'bg-amber-50 text-amber-700 border-amber-100 text-amber-800',
                'Next week': 'bg-blue-50 text-blue-700 border-blue-100 text-blue-800',
                'Away': 'bg-slate-50 text-slate-500 border-slate-100'
              };

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={mentor.id}
                  onClick={() => onSelectMentor(mentor.id)}
                  className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative group flex flex-col justify-between"
                  id={`mentor-card-${mentor.id}`}
                >
                  {/* Save/Favorite Absolute Button */}
                  <button
                    onClick={(e) => handleSaveToggle(e, mentor.id, mentor.name)}
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white border border-slate-200 text-slate-400 hover:text-amber-600 p-2 rounded-lg transition-all shadow-sm z-10 cursor-pointer"
                    title={isSaved ? 'Saved to Favorites' : 'Save Mentor'}
                    id={`save-mentor-btn-${mentor.id}`}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-500" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  <div>
                    {/* Portrait & Core Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <img 
                        src={mentor.imageUrl} 
                        alt={mentor.name} 
                        className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200 group-hover:border-amber-500 transition-colors"
                      />
                      <div className="pr-6">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-serif font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-base truncate">{mentor.name}</h3>
                          {mentor.isVerified && (
                            <span className="bg-amber-500/15 text-amber-700 px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wider" title="Verified Alumni">✓</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-tight mt-0.5">{mentor.role}</p>
                        <p className="text-xs text-slate-500 font-semibold">{mentor.company}</p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[130px]">{mentor.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        {mentor.domain}
                      </span>
                      <span className="inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {mentor.experience} Years Exp
                      </span>
                      <span className="inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        Class of \'{mentor.gradYear % 100}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">{mentor.bio}</p>

                    {/* Session Type Formats Offered */}
                    <div className="mb-4">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Formats Offered</span>
                      <div className="flex flex-wrap gap-1">
                        {mentor.sessionFormats.map((format, idx) => (
                          <span key={idx} className="bg-slate-50 text-slate-500 border border-slate-100 text-[10px] px-1.5 py-0.5 rounded capitalize font-medium">
                            {format}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rating / Availability & Actions block */}
                  <div className="border-t border-slate-200 pt-4 mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      {/* Rating block */}
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-800">{mentor.rating}</span>
                        <span className="text-[10px] text-slate-400 font-medium">({mentor.sessionsCount} sessions)</span>
                      </div>

                      {/* Availability badge */}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${availabilityColors[mentor.availability]}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        <span>{mentor.availability}</span>
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectMentor(mentor.id)}
                        className="w-full bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                        id={`btn-view-profile-${mentor.id}`}
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => onRequestSession(mentor.id)}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold py-2.5 px-3 rounded-lg transition-colors shadow-lg shadow-amber-500/10 cursor-pointer"
                        id={`btn-request-session-${mentor.id}`}
                      >
                        Request Session
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto"
            id="mentors-empty-state"
          >
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-800">No Alumni Mentors Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              We couldn\'t find any mentor matching your current filters. Try relaxing filters, modifying search keywords, or selecting another domain.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-amber-500/10 cursor-pointer uppercase tracking-wider"
              id="empty-state-reset-btn"
            >
              Reset Filters and Search
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
