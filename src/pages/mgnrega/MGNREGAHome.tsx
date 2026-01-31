// SAHAYOG - MGNREGA Home Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  IndianRupee, 
  AlertCircle, 
  Users, 
  FileText,
  Phone,
  ChevronRight,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function MGNREGAHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  const daysWorked = user.mgnregaInfo?.totalDaysWorkedThisYear || 0;
  const daysRemaining = 100 - daysWorked;
  const progressPercentage = (daysWorked / 100) * 100;

  const menuItems = [
    {
      icon: Sparkles,
      title: 'Living Shelf of Works',
      description: 'AI-संचालित योजना प्रणाली',
      path: '/mgnrega/living-shelf',
      color: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600',
      badge: 'NEW',
    },
    {
      icon: Briefcase,
      title: 'उपलब्ध काम',
      description: '3 नए काम उपलब्ध',
      path: '/mgnrega/work',
      color: 'bg-orange-100 text-orange-600',
      badge: '3 नए',
    },
    {
      icon: Calendar,
      title: 'उपस्थिति',
      description: `${daysWorked} दिन काम किया`,
      path: '/mgnrega/attendance',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: IndianRupee,
      title: 'भुगतान',
      description: '₹2,400 बाकी',
      path: '/mgnrega/payments',
      color: 'bg-green-100 text-green-600',
      badge: 'बाकी',
    },
    {
      icon: AlertCircle,
      title: 'शिकायत',
      description: 'शिकायत दर्ज करें',
      path: '/mgnrega/grievance',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: FileText,
      title: 'मेरी शिकायतें',
      description: 'शिकायतों की स्थिति',
      path: '/mgnrega/grievances',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Phone,
      title: 'संपर्क',
      description: 'स्थानीय अधिकारी',
      path: '/mgnrega/contacts',
      color: 'bg-cyan-100 text-cyan-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold ml-4">MGNREGA</h1>
          </div>
          
          {/* Job Card Info */}
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">जॉब कार्ड नंबर</p>
                <p className="text-lg font-semibold">{user.mgnregaInfo?.jobCardNumber}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Days Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">इस साल का प्रगति</h2>
            <Badge variant="outline" className="border-orange-300 text-orange-600">
              <Clock className="w-3 h-3 mr-1" />
              FY 2025-26
            </Badge>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">काम के दिन</span>
              <span className="font-semibold text-gray-900">{daysWorked} / 100</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-orange-600">{daysWorked}</p>
              <p className="text-xs text-gray-600">काम के दिन</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-600">{daysRemaining}</p>
              <p className="text-xs text-gray-600">बाकी दिन</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-600">₹18,400</p>
              <p className="text-xs text-gray-600">कुल कमाई</p>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <p className="text-green-100 text-xs">बाकी पैसे</p>
                <p className="text-xl font-bold">₹2,400</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-blue-100 text-xs">पास के काम</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Menu Grid */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">MGNREGA सेवाएं</h2>
          <div className="grid grid-cols-1 gap-3">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all text-left"
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    {item.badge && (
                      <Badge className="bg-orange-100 text-orange-600 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Rights Info */}
        <Card className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 border-orange-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">आपके अधिकार</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 100 दिन काम की गारंटी</li>
                <li>• 15 दिन में मजदूरी का भुगतान</li>
                <li>• काम न मिलने पर बेरोजगारी भत्ता</li>
                <li>• 5 km दूरी तक काम</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
