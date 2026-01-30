// SAHAYOG - Profile Confirmation Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Calendar, 
  Users, 
  CreditCard,
  CheckCircle,
  XCircle,
  Volume2
} from 'lucide-react';

export default function ProfileConfirmPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const handleConfirm = () => {
    toast.success('प्रोफाइल सत्यापित!');
    navigate('/auth/language');
  };

  const handleEdit = () => {
    toast.info('प्रोफाइल संपादन जल्द ही उपलब्ध होगा');
  };

  const handleSpeakProfile = () => {
    const text = `नाम: ${user.fullName}। पिता का नाम: ${user.fatherName}। गांव: ${user.address.village}। जिला: ${user.address.district}। जॉब कार्ड: ${user.mgnregaInfo?.jobCardNumber || 'नहीं है'}।`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center">
          <button 
            onClick={() => navigate('/auth/verify')}
            className="p-2 hover:bg-orange-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-4">{t('auth.profile.title')}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 sm:p-8 border-orange-100 shadow-xl">
          {/* Instructions Audio */}
          <button
            onClick={handleSpeakProfile}
            className="flex items-center gap-2 text-orange-600 text-sm mb-6 hover:underline"
          >
            <Volume2 className="w-4 h-4" />
            प्रोफाइल सुनें
          </button>

          <div className="text-center mb-8">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-orange-200">
              <AvatarImage src={user.photoUrl} alt={user.fullName} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
            {user.mgnregaInfo?.hasJobCard && (
              <Badge className="mt-2 bg-green-100 text-green-700 border-green-200">
                <CreditCard className="w-3 h-3 mr-1" />
                जॉब कार्ड: {user.mgnregaInfo.jobCardNumber}
              </Badge>
            )}
          </div>

          {/* Profile Details */}
          <div className="space-y-4 mb-8">
            {/* Personal Info */}
            <div className="bg-orange-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-orange-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                व्यक्तिगत जानकारी
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">पिता/पति का नाम</span>
                  <span className="font-medium text-gray-900">{user.fatherName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">जन्म तिथि</span>
                  <span className="font-medium text-gray-900">
                    {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('hi-IN') : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">लिंग</span>
                  <span className="font-medium text-gray-900">
                    {user.gender === 'male' ? 'पुरुष' : user.gender === 'female' ? 'महिला' : 'अन्य'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">वर्ग</span>
                  <span className="font-medium text-gray-900">{user.category}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                पता
              </h3>
              <div className="text-sm text-gray-700">
                <p className="font-medium">{user.address.village}</p>
                <p>{user.address.block}, {user.address.district}</p>
                <p>{user.address.state} - {user.address.pincode}</p>
              </div>
            </div>

            {/* Family Info */}
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                परिवार की जानकारी
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">वैवाहिक स्थिति</span>
                  <span className="font-medium text-gray-900">
                    {user.familyDetails?.maritalStatus === 'married' ? 'विवाहित' :
                     user.familyDetails?.maritalStatus === 'widowed' ? 'विधवा/विधुर' :
                     user.familyDetails?.maritalStatus === 'divorced' ? 'तलाकशुदा' : 'अविवाहित'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">बच्चों की संख्या</span>
                  <span className="font-medium text-gray-900">{user.familyDetails?.numberOfChildren || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">निर्भर सदस्य</span>
                  <span className="font-medium text-gray-900">{user.familyDetails?.numberOfDependents || 0}</span>
                </div>
              </div>
            </div>

            {/* MGNREGA Stats */}
            {user.mgnregaInfo?.hasJobCard && (
              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-purple-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  MGNREGA विवरण
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">इस साल काम के दिन</span>
                    <span className="font-medium text-gray-900">{user.mgnregaInfo.totalDaysWorkedThisYear} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">बाकी दिन</span>
                    <span className="font-medium text-gray-900">{100 - (user.mgnregaInfo.totalDaysWorkedThisYear || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">आखिरी काम</span>
                    <span className="font-medium text-gray-900">
                      {user.mgnregaInfo.lastWorkDate 
                        ? new Date(user.mgnregaInfo.lastWorkDate).toLocaleDateString('hi-IN')
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleConfirm}
              className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg font-semibold rounded-xl"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {t('auth.profile.confirm')}
            </Button>
            
            <Button
              onClick={handleEdit}
              variant="outline"
              className="w-full h-14 border-2 border-red-300 text-red-600 hover:bg-red-50 text-lg font-semibold rounded-xl"
            >
              <XCircle className="w-5 h-5 mr-2" />
              {t('auth.profile.edit')}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
