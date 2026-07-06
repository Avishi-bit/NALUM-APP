export interface Education {
  degree: string;
  school: string;
  year: number;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Review {
  id: string;
  studentName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  domain: string; // e.g., 'Software Engineering', 'Product Management', 'Finance', 'Consulting', 'Design', 'Research', 'Entrepreneurship', 'Higher Studies'
  experience: number;
  bio: string;
  longBio: string;
  location: string;
  gradYear: number;
  availability: 'Available this week' | 'Booking fast' | 'Next week' | 'Away';
  rating: number;
  sessionsCount: number;
  imageUrl: string;
  expertise: string[];
  education: Education[];
  experienceTimeline: ExperienceItem[];
  sessionFormats: string[];
  availableSlots: string[];
  reviews: Review[];
  isVerified?: boolean;
}

export interface RequestTimelineEvent {
  status: 'Pending' | 'Accepted' | 'Completed' | 'Declined' | 'Cancelled';
  date: string;
  comment: string;
}

export interface BookingRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorRole: string;
  mentorCompany: string;
  mentorImageUrl: string;
  sessionTopic: string;
  date: string;
  time: string;
  status: 'Pending' | 'Accepted' | 'Completed' | 'Declined' | 'Cancelled';
  dateRequested: string;
  message: string;
  timeline: RequestTimelineEvent[];
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  isPinnedAnswer?: boolean;
  likes: number;
  likedByUser?: boolean;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  category: string;
  title: string;
  content: string;
  likes: number;
  commentsCount: number;
  views: number;
  timestamp: string;
  likedByUser?: boolean;
  savedByUser?: boolean;
  replies: ForumReply[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'request' | 'forum' | 'system';
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type ViewType = 'dashboard' | 'mentors' | 'requests' | 'forum' | 'notifications' | 'profile' | 'admin' | 'mentor-profile' | 'forum-post';
