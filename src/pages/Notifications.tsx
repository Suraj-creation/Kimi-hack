// SAHAYOG - Notifications Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Bell, 
  CheckCircle, 
  IndianRupee,
  Briefcase,
  AlertCircle,
  Info,
  Trash2,
  CheckCheck
} from 'lucide-react';

// Mock notifications
const mockNotifications = [
  {
    id: 'notif001',
    type: 'payment',
    title: 'भुगतान प्राप्त',
    message: '₹2,400 का भुगतान आपके खाते में आ गया है।',
    timestamp: '2 घंटे पहले',
    isRead: false,
    priority: 'high',
    actionUrl: '/mgnrega/payments',
  },
  {
    id: 'notif002',
    type: 'work',
    title: 'नया काम उपलब्ध',
    message: 'आपके पास 3 किमी दूर तालाब खुदाई का काम उपलब्ध है।',
    timestamp: '5 घंटे पहले',
    isRead: false,
    priority: 'medium',
    actionUrl: '/mgnrega/work',
  },
  {
    id: 'notif003',
    type: 'grievance',
    title: 'शिकायत का समाधान',
    message: 'आपकी शिकायत GRV-2026-001198 का समाधान हो गया है।',
    timestamp: '1 दिन पहले',
    isRead: true,
    priority: 'high',
    actionUrl: '/mgnrega/grievances',
  },
  {
    id: 'notif004',
    type: 'scheme',
    title: 'PM-KISAN किस्त',
    message: 'PM-KISAN की ₹2,000 की किस्त जल्द आएगी।',
    timestamp: '2 दिन पहले',
    isRead: true,
    priority: 'medium',
    actionUrl: '/schemes/pm-kisan',
  },
  {
    id: 'notif005',
    type: 'alert',
    title: 'डेटा अपडेट',
    message: 'कृपया अपना बैंक खाता विवरण सत्यापित करें।',
    timestamp: '3 दिन पहले',
    isRead: true,
    priority: 'low',
    actionUrl: '/profile',
  },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment': return IndianRupee;
      case 'work': return Briefcase;
      case 'grievance': return AlertCircle;
      case 'scheme': return CheckCircle;
      default: return Info;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-green-100 text-green-600';
      case 'work': return 'bg-orange-100 text-orange-600';
      case 'grievance': return 'bg-red-100 text-red-600';
      case 'scheme': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('सभी सूचनाएं पढ़ी गई');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('सभी सूचनाएं हटा दी गईं');
  };

  const handleNotificationClick = (notification: typeof mockNotifications[0]) => {
    markAsRead(notification.id);
    navigate(notification.actionUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-orange-50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 ml-4">सूचनाएं</h1>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount} नई
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="flex-1"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                सभी पढ़ें
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                सभी हटाएं
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            return (
              <Card 
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  !notification.isRead ? 'bg-orange-50 border-orange-200' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${getIconColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-orange-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                        {notification.priority === 'high' ? 'जरूरी' :
                         notification.priority === 'medium' ? 'मध्यम' : 'सामान्य'}
                      </Badge>
                      <span className="text-xs text-gray-400">{notification.timestamp}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600">कोई सूचना नहीं</p>
            <p className="text-sm text-gray-500">आपकी सभी सूचनाएं यहां दिखेंगी</p>
          </div>
        )}
      </main>
    </div>
  );
}
