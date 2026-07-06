import React from 'react';
import { NotificationItem } from '../types';
import { Bell, Check, Trash2, Calendar, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotification: (id: string) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotification,
  addToast
}) => {
  const handleMarkAll = () => {
    onMarkAllAsRead();
    addToast('All notifications have been marked as read.', 'success');
  };

  const handleClear = (id: string) => {
    onClearNotification(id);
    addToast('Notification cleared.', 'info');
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'request':
        return (
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-150 p-2.5 rounded-xl shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        );
      case 'forum':
        return (
          <div className="bg-amber-50 text-amber-700 border border-amber-150 p-2.5 rounded-xl shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="bg-amber-50 text-amber-700 border border-amber-150 p-2.5 rounded-xl shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        );
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="notifications-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5" id="notifications-header">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">System Alerts</h1>
          <p className="text-sm text-slate-500 mt-1">
            Stay up to date with booking status, meeting approvals, and comments on your published discussions.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-250 py-2 px-4 rounded-lg transition-all self-start sm:self-auto cursor-pointer"
            id="mark-all-read-btn"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Main List */}
      <div className="space-y-4 max-w-3xl" id="notifications-items-list">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => onMarkAsRead(n.id)}
              className={`bg-white rounded-xl border p-5 shadow-sm transition-all flex gap-4 items-start relative hover:border-slate-350 cursor-pointer ${
                !n.read ? 'border-l-4 border-l-amber-500 border-slate-200 bg-slate-50/20' : 'border-slate-200'
              }`}
              id={`notification-item-${n.id}`}
            >
              {getIcon(n.type)}

              <div className="flex-1 pr-6">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm ${!n.read ? 'font-serif font-bold text-slate-900' : 'font-serif font-semibold text-slate-800'}`}>
                    {n.title}
                  </h3>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 block mt-2 font-medium">
                  {new Date(n.timestamp).toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>

              {/* Clear button absolute */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear(n.id);
                }}
                className="absolute top-4 right-4 text-slate-300 hover:text-rose-600 p-1 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                title="Dismiss Alert"
                id={`clear-notif-${n.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          /* Empty state */
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-sm mx-auto shadow-sm" id="notifications-empty-state">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-base font-serif font-bold text-slate-800">Your Inbox is Clear</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              There are no pending alerts in your notifications inbox.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
