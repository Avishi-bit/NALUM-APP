import React, { useState, useMemo } from 'react';
import { ForumPost, ForumReply, ViewType } from '../types';
import { 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  Search, 
  Plus, 
  ArrowLeft, 
  Send, 
  Check, 
  HelpCircle,
  Pin,
  ChevronRight,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ForumViewProps {
  forumPosts: ForumPost[];
  currentForumPostId: string | null;
  onSelectForumPost: (postId: string | null) => void;
  onCreatePost: (postData: Omit<ForumPost, 'id' | 'likes' | 'commentsCount' | 'views' | 'timestamp' | 'replies'>) => void;
  onAddReply: (postId: string, replyContent: string) => void;
  onToggleLikePost: (postId: string) => void;
  onToggleSavePost: (postId: string) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  isCreateModalOpenPreset?: boolean;
}

export const ForumView: React.FC<ForumViewProps> = ({
  forumPosts,
  currentForumPostId,
  onSelectForumPost,
  onCreatePost,
  onAddReply,
  onToggleLikePost,
  onToggleSavePost,
  addToast,
  isCreateModalOpenPreset = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(isCreateModalOpenPreset);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Career Advice');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  
  // Thread reply composer state
  const [replyText, setReplyText] = useState('');

  const categories = [
    'All',
    'Career Advice',
    'Internships',
    'Placements',
    'Higher Studies',
    'Startups',
    'Tech',
    'Finance',
    'Resume Reviews',
    'Campus Life'
  ];

  const handleSharePost = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    addToast(`Link to "${title}" copied to clipboard!`, 'success');
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim().length < 5) {
      addToast('Please write a descriptive title (at least 5 characters).', 'warning');
      return;
    }
    if (newContent.trim().length < 15) {
      addToast('Please add some details to your post (at least 15 characters).', 'warning');
      return;
    }

    onCreatePost({
      authorName: 'Avishi Khanna',
      authorRole: 'CS Junior',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100',
      category: newCategory,
      title: newTitle,
      content: newContent
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    addToast('Your discussion topic has been published successfully.', 'success');
  };

  const handleReplySubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (replyText.trim().length < 5) {
      addToast('Reply message is too short (minimum 5 characters).', 'warning');
      return;
    }
    onAddReply(postId, replyText);
    setReplyText('');
    addToast('Your reply has been added.', 'success');
  };

  // Filter lists
  const filteredPosts = useMemo(() => {
    return forumPosts.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [forumPosts, searchTerm, selectedCategory]);

  // Find currently active post
  const activePost = useMemo(() => {
    return forumPosts.find(p => p.id === currentForumPostId) || null;
  }, [forumPosts, currentForumPostId]);

  // Sidebar suggested discussions for thread view
  const sidebarDiscussions = useMemo(() => {
    if (!activePost) return [];
    return forumPosts
      .filter(p => p.id !== activePost.id && p.category === activePost.category)
      .slice(0, 3);
  }, [forumPosts, activePost]);

  // If we are in Thread View
  if (activePost) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12" id="forum-thread-container">
        {/* Left main thread column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Back link */}
          <button
            onClick={() => onSelectForumPost(null)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 font-semibold text-xs py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 bg-white shadow-xs"
            id="thread-back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discussions</span>
          </button>

          {/* Original Post Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4" id={`thread-main-post-${activePost.id}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={activePost.authorAvatar} 
                  alt={activePost.authorName} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-xs">{activePost.authorName}</h3>
                  <p className="text-[10px] text-slate-500">{activePost.authorRole}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">
                {new Date(activePost.timestamp).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>

            <div className="space-y-2">
              <span className="inline-flex px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-150">
                {activePost.category}
              </span>
              <h2 className="text-xl font-serif font-bold text-slate-900 leading-snug">{activePost.title}</h2>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed pt-2">{activePost.content}</p>
            </div>

            {/* Engagement Controls */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onToggleLikePost(activePost.id)}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer ${
                    activePost.likedByUser ? 'text-amber-800 bg-amber-50 font-bold' : 'hover:text-slate-700'
                  }`}
                  id={`thread-like-btn-${activePost.id}`}
                >
                  <ThumbsUp className={`w-4 h-4 ${activePost.likedByUser ? 'fill-amber-500 text-amber-600' : ''}`} />
                  <span>{activePost.likes} Likes</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>{activePost.commentsCount} Comments</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>{activePost.views} Views</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onToggleSavePost(activePost.id)}
                  className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-amber-600 cursor-pointer"
                  title="Save Post"
                  id={`thread-save-btn-${activePost.id}`}
                >
                  {activePost.savedByUser ? (
                    <BookmarkCheck className="w-4.5 h-4.5 text-amber-600 fill-amber-500" />
                  ) : (
                    <Bookmark className="w-4.5 h-4.5" />
                  )}
                </button>
                <button 
                  onClick={(e) => handleSharePost(e, activePost.title)}
                  className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"
                  title="Share Link"
                >
                  <Share2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Replies Thread */}
          <div className="space-y-4" id="thread-replies-list">
            <h3 className="text-sm font-serif font-bold text-slate-800 border-b border-slate-200 pb-2">Replies ({activePost.replies.length})</h3>
            
            {activePost.replies.length > 0 ? (
              activePost.replies.map((reply) => (
                <div 
                  key={reply.id} 
                  className={`bg-white rounded-xl border p-5 shadow-sm space-y-3 relative ${
                    reply.isPinnedAnswer 
                      ? 'border-amber-200 shadow-md ring-1 ring-amber-400/20' 
                      : 'border-slate-200'
                  }`}
                  id={`reply-card-${reply.id}`}
                >
                  {/* Pinned/Verified banner tag */}
                  {reply.isPinnedAnswer && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-500/10 text-amber-600 border border-amber-500/25 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase">
                      <Pin className="w-3 h-3 fill-amber-600 rotate-45" />
                      <span>Alumni Pinned Advice</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <img 
                      src={reply.authorAvatar} 
                      alt={reply.authorName} 
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        {reply.authorName}
                        {reply.authorRole.includes('Alumni') && (
                          <span className="bg-amber-50 text-amber-700 border border-amber-100 px-1 rounded text-[8px] font-bold uppercase tracking-wider">Alumni</span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400">{reply.authorRole}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pl-1">{reply.content}</p>

                  <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-2.5 border-t border-slate-150 pl-1">
                    <span>{new Date(reply.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <button className="flex items-center gap-1 hover:text-amber-600 cursor-pointer font-bold">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{reply.likes} Likes</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center" id="empty-replies">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-700">No Replies Yet</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Be the first to share your experience or request further details.</p>
              </div>
            )}
          </div>

          {/* Reply Composer Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm" id="reply-composer-card">
            <h4 className="text-xs font-bold text-slate-800 block mb-2.5">Post a Reply</h4>
            <form onSubmit={(e) => handleReplySubmit(e, activePost.id)} className="space-y-3" id="reply-composer-form">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Share your experience, suggest a resources link, or add comments..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs p-3.5 rounded-lg focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                id="reply-text-textarea"
                required
              ></textarea>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold py-2.5 px-4 rounded-lg transition-all shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  id="submit-reply-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Thread View sidebar suggested posts */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4" id="thread-sidebar-card">
            <h3 className="font-serif font-bold text-slate-900 text-xs border-b border-slate-200 pb-2">Related Discussions</h3>
            
            {sidebarDiscussions.length > 0 ? (
              <div className="space-y-3" id="sidebar-discussions-list">
                {sidebarDiscussions.map((sd) => (
                  <div 
                    key={sd.id}
                    onClick={() => onSelectForumPost(sd.id)}
                    className="p-3 border border-slate-100 rounded-xl hover:border-amber-500 hover:bg-amber-50/10 cursor-pointer group transition-all"
                    id={`sidebar-suggested-item-${sd.id}`}
                  >
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                      {sd.category}
                    </span>
                    <h4 className="font-serif font-bold text-slate-800 group-hover:text-amber-600 transition-colors text-xs line-clamp-2 mt-1.5 leading-relaxed">
                      {sd.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-2">{sd.commentsCount} comments • {sd.views} views</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">No other discussions found under this topic yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  };
   // Else, Forum List View
  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="forum-list-container">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="forum-title-header">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">Community Discussions</h1>
          <p className="text-sm text-slate-500 mt-1">
            Ask questions, share experiences, and learn from the university alumni community.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold py-2.5 px-4 rounded-lg shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 uppercase tracking-wider"
          id="trigger-create-discussion-btn"
        >
          <Plus className="w-4 h-4" />
          <span>Start a Discussion</span>
        </button>
      </div>

      {/* Forum Search / Quick Topic Filter bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4" id="forum-filter-card">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search discussion titles, post content, or answers..."
            className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm pl-11 pr-4 py-3 rounded-lg border border-slate-200 focus:border-amber-500 transition-all outline-none"
            id="forum-search-input"
          />
        </div>

        {/* Categories Horizontal Scroll slider */}
        <div className="pt-2 flex flex-wrap gap-2" id="forum-topic-chips-container">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-350'
                }`}
                id={`topic-chip-${cat.replace(/\s+/g, '-')}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Discussions Post Cards List */}
      <div className="space-y-4" id="forum-posts-cards-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div 
              key={post.id}
              onClick={() => onSelectForumPost(post.id)}
              className="bg-white border border-slate-200 hover:border-amber-500 p-5 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between space-y-4 animate-fadeIn"
              id={`forum-post-card-${post.id}`}
            >
              <div>
                {/* Author row info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.authorName} 
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        {post.authorName}
                        {post.authorRole.includes('Alumni') && (
                          <span className="bg-amber-50 text-amber-700 border border-amber-100 px-1 rounded text-[8px] font-bold uppercase tracking-wider">Alumni</span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400">{post.authorRole}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(post.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Content text snippet */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                      {post.category}
                    </span>
                    {post.replies.some(r => r.isPinnedAnswer) && (
                      <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150 items-center gap-0.5">
                        <Pin className="w-2.5 h-2.5 rotate-45" /> Verified Advice
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-serif font-bold text-slate-900 hover:text-amber-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                    {post.content}
                  </p>
                </div>
              </div>

              {/* Engagement icons bar */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-[11px] text-slate-400" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onToggleLikePost(post.id)}
                    className={`flex items-center gap-1 hover:text-amber-600 cursor-pointer ${
                      post.likedByUser ? 'text-amber-700 font-bold' : ''
                    }`}
                    id={`post-like-btn-${post.id}`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${post.likedByUser ? 'fill-amber-500 text-amber-600' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <button 
                    onClick={() => onSelectForumPost(post.id)}
                    className="flex items-center gap-1 hover:text-slate-600 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span>{post.commentsCount} comments</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span>{post.views} views</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onToggleSavePost(post.id)}
                    className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-amber-600 cursor-pointer"
                    title="Save Post"
                    id={`post-save-btn-${post.id}`}
                  >
                    {post.savedByUser ? (
                      <BookmarkCheck className="w-4.5 h-4.5 text-amber-600 fill-amber-500" />
                    ) : (
                      <Bookmark className="w-4.5 h-4.5" />
                    )}
                  </button>
                  <button 
                    onClick={(e) => handleSharePost(e, post.title)}
                    className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"
                    title="Share Post"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Empty State forums */
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto shadow-sm" id="forum-empty-state">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-serif font-bold text-slate-800">No Discussions Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              We couldn't find any forum post matching the filter <strong>{selectedCategory}</strong> or search keyword. Try creating a new discussion topic!
            </p>
          </div>
        )}
      </div>

      {/* Start a Discussion modal Form popup */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="create-post-modal-backdrop">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden"
              id="create-post-modal-box"
            >
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">Start a Community Discussion</h3>
                  <p className="text-[10px] text-slate-400">Post a question to obtain advice from alumni experts</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreatePostSubmit} className="p-5 space-y-4" id="create-post-form">
                {/* Category Selection dropdown */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Select Discussion Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
                    id="create-post-category-select"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Discussion Topic Title</label>
                  <input 
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. How to structure cold outreach emails to senior bankers?"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                    id="create-post-title-input"
                    required
                  />
                </div>

                {/* Body Content */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Query Description</label>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Provide details about your query. Include your current year, background, and specific areas where alumni guidance is required..."
                    rows={5}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs p-3.5 rounded-lg focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                    id="create-post-content-textarea"
                    required
                  ></textarea>
                </div>

                {/* Optional tags */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tags (Optional)</label>
                  <input 
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. consulting, mbb, banking (separated by comma)"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                    id="create-post-tags-input"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                  <button 
                    type="button" 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-lg border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold py-2.5 px-5 rounded-lg transition-all shadow-lg shadow-amber-500/10 cursor-pointer uppercase tracking-wider"
                    id="publish-discussion-btn"
                  >
                    Post Discussion
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
