// SAHAYOG - Dashboard Page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Briefcase, 
  Calendar, 
  IndianRupee, 
  AlertCircle, 
  ChevronRight,
  Bell,
  User,
  MapPin,
  Mic,
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  X,
  GraduationCap,
  Heart,
  Shield
} from 'lucide-react';
import { sahayogAI } from '@/lib/gemini';
import { calculatePriorityScore } from '@/lib/ml-models';

// AI Assistant Floating Button
function AIFloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all hover:scale-110 z-50"
    >
      <MessageCircle className="w-8 h-8" />
    </button>
  );
}

// AI Chat Modal
function AIChatModal({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user: any }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: `नमस्ते ${user.fullName?.split(' ')[0]} जी! मैं सहयोग साथी हूं। मैं आपकी क्या मदद कर सकता हूं?` }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sahayogAI.processMessage(
        'session-' + Date.now(),
        userMessage,
        {
          userName: user.fullName?.split(' ')[0],
          village: user.address?.village,
          daysWorked: user.mgnregaInfo?.totalDaysWorkedThisYear,
          pendingPayment: 2400, // Mock
          currentPage: 'dashboard',
          language: 'hi',
        }
      );

      setMessages(prev => [...prev, { role: 'assistant', content: response.spoken_response }]);
      
      // Speak response if voice enabled
      if (user.preferences?.voiceAssistantEnabled) {
        sahayogAI.speakResponse(response.spoken_response, 'hi-IN');
      }
    } catch (error) {
      toast.error('AI से जवाब नहीं मिला');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoice = () => {
    setIsListening(true);
    sahayogAI.startVoiceRecognition(
      (transcript) => {
        setIsListening(false);
        setInput(transcript);
      },
      (error) => {
        setIsListening(false);
        toast.error('आवाज नहीं सुन पाया');
      },
      'hi-IN'
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <Card className="w-full max-w-md h-[80vh] sm:h-[600px] flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">सहयोग साथी</h3>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                ऑनलाइन
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-orange-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none">
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-orange-100">
          <div className="flex gap-2">
            <button
              onClick={handleVoice}
              className={`p-3 rounded-xl transition-colors ${
                isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-orange-100 text-orange-600'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="मैसेज लिखें..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-orange-500 text-white rounded-xl disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Quick Action Card
function QuickActionCard({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
  color = 'orange'
}: { 
  icon: any; 
  title: string; 
  description: string; 
  onClick: () => void;
  color?: string;
}) {
  const colorClasses: Record<string, string> = {
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all text-left w-full"
    >
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color] || colorClasses.orange} flex items-center justify-center`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [showAIChat, setShowAIChat] = useState(false);
  const [priorityScore, setPriorityScore] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      // Calculate priority score
      const score = calculatePriorityScore({ user });
      setPriorityScore(score.priorityScore);
    }
  }, [user]);

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const daysWorked = user.mgnregaInfo?.totalDaysWorkedThisYear || 0;
  const daysRemaining = 100 - daysWorked;
  const progressPercentage = (daysWorked / 100) * 100;

  const recentActivity = [
    { type: 'work', description: 'तालाब खुदाई - 5 दिन', date: '15 जनवरी', status: 'completed' },
    { type: 'payment', description: '₹1,200 प्राप्त', date: '20 जनवरी', status: 'paid' },
    { type: 'work', description: 'सड़क निर्माण - 7 दिन', date: '22 जनवरी', status: 'ongoing' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-orange-200">
              <AvatarImage src={user.photoUrl} />
              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-600 text-white text-sm">
                {user.fullName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-gray-500">नमस्ते</p>
              <p className="font-semibold text-gray-900">{user.fullName?.split(' ')[0]} जी</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/notifications')}
              className="p-2 hover:bg-orange-50 rounded-full relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-orange-50 rounded-full"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* MGNREGA Card */}
        <Card className="p-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white border-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">MGNREGA</h2>
              <p className="text-orange-100 text-sm">महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>इस साल के दिन</span>
              <span>{daysWorked} / 100</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-2xl font-bold">{daysWorked}</p>
              <p className="text-xs text-orange-100">काम के दिन</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-2xl font-bold">{daysRemaining}</p>
              <p className="text-xs text-orange-100">बाकी दिन</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <p className="text-2xl font-bold">₹2,400</p>
              <p className="text-xs text-orange-100">बाकी पैसे</p>
            </div>
          </div>

          {/* Priority Score */}
          {priorityScore !== null && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">प्राथमिकता स्कोर</span>
              </div>
              <Badge className="bg-white text-orange-600">
                {(priorityScore * 100).toFixed(0)}/100
              </Badge>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">त्वरित कार्य</h3>
          <div className="space-y-3">
            <QuickActionCard
              icon={Briefcase}
              title="उपलब्ध काम देखें"
              description="आपके पास 3 काम उपलब्ध हैं"
              onClick={() => navigate('/mgnrega/work')}
              color="orange"
            />
            <QuickActionCard
              icon={IndianRupee}
              title="भुगतान ट्रैक करें"
              description="₹2,400 प्रोसेसिंग में"
              onClick={() => navigate('/mgnrega/payments')}
              color="green"
            />
            <QuickActionCard
              icon={AlertCircle}
              title="शिकायत दर्ज करें"
              description="कोई समस्या है? बताएं"
              onClick={() => navigate('/mgnrega/grievance')}
              color="red"
            />
            <QuickActionCard
              icon={MapPin}
              title="संपर्क जानकारी"
              description="स्थानीय अधिकारी से संपर्क"
              onClick={() => navigate('/mgnrega/contacts')}
              color="blue"
            />
            <QuickActionCard
              icon={GraduationCap}
              title="कौशल विकास"
              description="नए कौशल सीखें"
              onClick={() => navigate('/skills')}
              color="purple"
            />
            <QuickActionCard
              icon={Heart}
              title="मानसिक स्वास्थ्य"
              description="मानसिक सहायता प्राप्त करें"
              onClick={() => navigate('/wellbeing')}
              color="pink"
            />
          </div>
        </div>

        {/* My Schemes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">मेरी योजनाएं</h3>
          <div className="grid grid-cols-2 gap-3">
            {user.enrolledSchemes?.map((scheme, index) => (
              <button
                key={index}
                onClick={() => navigate(`/schemes/${scheme.schemeId}`)}
                className="p-4 bg-white rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all text-left"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                </div>
                <p className="font-medium text-gray-900 text-sm">{scheme.schemeName}</p>
                <Badge className="mt-1 text-xs bg-green-100 text-green-700">
                  सक्रिय
                </Badge>
              </button>
            ))}
            <button
              onClick={() => navigate('/schemes')}
              className="p-4 bg-orange-50 rounded-xl border-2 border-dashed border-orange-200 hover:border-orange-400 transition-all text-center"
            >
              <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                <ChevronRight className="w-5 h-5 text-orange-600" />
              </div>
              <p className="font-medium text-orange-600 text-sm">और योजनाएं देखें</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">हाल की गतिविधि</h3>
            <button className="text-sm text-orange-600 hover:underline">
              सभी देखें
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-orange-100">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === 'work' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'payment' ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type === 'work' ? <Briefcase className="w-5 h-5" /> :
                   activity.type === 'payment' ? <IndianRupee className="w-5 h-5" /> :
                   <Clock className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
                <Badge className={
                  activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                  activity.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }>
                  {activity.status === 'completed' ? 'पूरा' :
                   activity.status === 'paid' ? 'भुगतान' :
                   'जारी'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* AI Floating Button */}
      <AIFloatingButton onClick={() => setShowAIChat(true)} />

      {/* AI Chat Modal */}
      <AIChatModal 
        isOpen={showAIChat} 
        onClose={() => setShowAIChat(false)} 
        user={user}
      />
    </div>
  );
}
