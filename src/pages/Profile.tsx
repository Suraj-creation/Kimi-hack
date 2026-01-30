// SAHAYOG - Profile Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Users, 
  IndianRupee,
  GraduationCap,
  Heart,
  Edit,
  LogOut,
  Bell,
  Volume2,
  Moon,
  Sun,
  ChevronRight
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('सफलतापूर्वक लॉग आउट');
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-orange-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-4">मेरी प्रोफाइल</h1>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-orange-200">
            <AvatarImage src={user.photoUrl} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
          <p className="text-gray-500">{user.address?.village}, {user.address?.district}</p>
          
          {user.mgnregaInfo?.hasJobCard && (
            <Badge className="mt-2 bg-green-100 text-green-700">
              जॉब कार्ड: {user.mgnregaInfo.jobCardNumber}
            </Badge>
          )}

          <div className="flex justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-xl font-bold text-orange-600">{user.mgnregaInfo?.totalDaysWorkedThisYear || 0}</p>
              <p className="text-xs text-gray-500">काम के दिन</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">{user.enrolledSchemes?.length || 0}</p>
              <p className="text-xs text-gray-500">योजनाएं</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">{user.dataCompleteness || 0}%</p>
              <p className="text-xs text-gray-500">प्रोफाइल पूर्ण</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">व्यक्तिगत</TabsTrigger>
            <TabsTrigger value="family">परिवार</TabsTrigger>
            <TabsTrigger value="settings">सेटिंग्स</TabsTrigger>
          </TabsList>

          {/* Personal Info */}
          <TabsContent value="personal" className="space-y-4 mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  व्यक्तिगत जानकारी
                </h3>
                <button className="text-orange-600 text-sm flex items-center gap-1">
                  <Edit className="w-4 h-4" />
                  संपादित करें
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">पूरा नाम</span>
                  <span className="font-medium">{user.fullName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">पिता/पति का नाम</span>
                  <span className="font-medium">{user.fatherName || '-'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">जन्म तिथि</span>
                  <span className="font-medium">
                    {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('hi-IN') : '-'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">लिंग</span>
                  <span className="font-medium">
                    {user.gender === 'male' ? 'पुरुष' : user.gender === 'female' ? 'महिला' : 'अन्य'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">वर्ग</span>
                  <span className="font-medium">{user.category}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">मोबाइल</span>
                  <span className="font-medium">{user.phoneNumber}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                पता
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>{user.address?.village}</p>
                <p>{user.address?.block}, {user.address?.district}</p>
                <p>{user.address?.state} - {user.address?.pincode}</p>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-green-500" />
                बैंक विवरण
              </h3>
              {user.economicInfo?.bankDetails ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">बैंक</span>
                    <span className="font-medium">{user.economicInfo.bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">खाता संख्या</span>
                    <span className="font-medium">{user.economicInfo.bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">IFSC</span>
                    <span className="font-medium">{user.economicInfo.bankDetails.ifscCode}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">कोई बैंक विवरण नहीं</p>
              )}
            </Card>
          </TabsContent>

          {/* Family Info */}
          <TabsContent value="family" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                परिवार की जानकारी
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">वैवाहिक स्थिति</span>
                  <span className="font-medium">
                    {user.familyDetails?.maritalStatus === 'married' ? 'विवाहित' :
                     user.familyDetails?.maritalStatus === 'widowed' ? 'विधवा/विधुर' :
                     user.familyDetails?.maritalStatus === 'divorced' ? 'तलाकशुदा' : 'अविवाहित'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">बच्चों की संख्या</span>
                  <span className="font-medium">{user.familyDetails?.numberOfChildren || 0}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">निर्भर सदस्य</span>
                  <span className="font-medium">{user.familyDetails?.numberOfDependents || 0}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">परिवार का प्रकार</span>
                  <span className="font-medium">
                    {user.familyDetails?.familyType === 'nuclear' ? 'केंद्रीय' :
                     user.familyDetails?.familyType === 'joint' ? 'संयुक्त' : '-'}
                  </span>
                </div>
              </div>
            </Card>

            {user.familyDetails?.children && user.familyDetails.children.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">बच्चे</h3>
                <div className="space-y-3">
                  {user.familyDetails.children.map((child, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">{child.name}</span>
                        <span className="text-sm text-gray-500">{child.age} वर्ष</span>
                      </div>
                      <p className="text-sm text-gray-500">{child.education}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-500" />
                शिक्षा और कौशल
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">शिक्षा</span>
                  <span className="font-medium">
                    {user.education?.highestQualification === 'illiterate' ? 'अशिक्षित' :
                     user.education?.highestQualification === 'primary' ? 'प्राथमिक' :
                     user.education?.highestQualification === 'secondary' ? 'माध्यमिक' :
                     user.education?.highestQualification === 'graduate' ? 'स्नातक' : '-'}
                  </span>
                </div>
                {user.skills && user.skills.length > 0 && (
                  <div>
                    <span className="text-gray-500">कौशल:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill.skillName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">सूचना प्राथमिकताएं</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">पुश नोटिफिकेशन</p>
                      <p className="text-sm text-gray-500">ऐप में सूचनाएं</p>
                    </div>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-colors ${user.preferences?.notificationPreferences?.appPush ? 'bg-orange-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${user.preferences?.notificationPreferences?.appPush ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">SMS सूचनाएं</p>
                      <p className="text-sm text-gray-500">टेक्स्ट मैसेज</p>
                    </div>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-colors ${user.preferences?.notificationPreferences?.sms ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${user.preferences?.notificationPreferences?.sms ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">ऐप सेटिंग्स</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">आवाज सहायक</p>
                      <p className="text-sm text-gray-500">बोलकर ऐप का उपयोग</p>
                    </div>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-colors ${user.preferences?.voiceAssistantEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${user.preferences?.voiceAssistantEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                <button 
                  onClick={() => navigate('/auth/language')}
                  className="w-full flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-amber-600" />
                    <div>
                      <p className="font-medium">भाषा</p>
                      <p className="text-sm text-gray-500">हिंदी</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </Card>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full h-14 border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-2" />
              लॉग आउट
            </Button>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
