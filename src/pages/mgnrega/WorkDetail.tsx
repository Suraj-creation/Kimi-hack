// SAHAYOG - Work Detail Page
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, Calendar, Users, IndianRupee, ChevronRight, Briefcase, Clock, AlertCircle, Info } from 'lucide-react';
import WorkApplicationWizard from '@/components/work/WorkApplicationWizard';

export default function WorkDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showWizard, setShowWizard] = useState(false);

  // Mock work data - in real app, fetch from API/MongoDB
  const workData = {
    id: id || '1',
    title: 'तालाब खुदाई और सफाई',
    location: 'मोहनपुर गांव',
    distance: 2,
    startDate: '1 फरवरी',
    endDate: '20 फरवरी',
    wagePerDay: 250,
    maxWorkers: 30,
    availableSlots: 8,
    category: 'जल संरक्षण',
    description: 'गांव के मुख्य तालाब की खुदाई और सफाई का काम। बरसात के पानी को इकट्ठा करने के लिए तालाब को गहरा और चौड़ा किया जाएगा।',
    requirements: [
      'कोई भी उम्र 18-60 वर्ष',
      'MGNREGA जॉब कार्ड जरूरी',
      'मेडिकल फिटनेस आवश्यक',
    ],
    facilities: [
      'पीने का पानी',
      'शेड (छाया)',
      'प्राथमिक चिकित्सा',
      'औजार उपलब्ध',
    ],
  };

  const handleApplicationSuccess = (applicationNumber: string) => {
    toast.success(`आवेदन सफल! नंबर: ${applicationNumber}`);
    setShowWizard(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <header className="bg-white border-b border-orange-100 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center">
            <button 
              onClick={() => navigate('/mgnrega/work')}
              className="p-2 hover:bg-orange-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-4">काम का विवरण</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {/* Main Work Info Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {workData.title}
                  </h2>
                  <Badge className="bg-blue-100 text-blue-800">
                    {workData.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    ₹{workData.wagePerDay}
                  </div>
                  <div className="text-sm text-gray-600">प्रति दिन</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="text-sm text-gray-600">स्थान</div>
                    <div className="font-semibold">{workData.location} ({workData.distance} किमी)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">अवधि</div>
                    <div className="font-semibold">{workData.startDate} से {workData.endDate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-600">कुल जगह</div>
                    <div className="font-semibold">{workData.maxWorkers} मजदूर</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">बाकी जगह</div>
                    <div className="font-semibold text-orange-600">{workData.availableSlots} जगह</div>
                  </div>
                </div>
              </div>

              {/* Urgency Alert */}
              {workData.availableSlots < 10 && (
                <Alert className="mt-4 bg-amber-50 border-amber-200">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <AlertDescription className="ml-2 text-amber-800">
                    <strong>सीमित जगह!</strong> केवल {workData.availableSlots} जगह बाकी हैं। जल्दी आवेदन करें।
                  </AlertDescription>
                </Alert>
              )}
            </Card>

            {/* Description Card */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-gray-700" />
                <h3 className="text-lg font-semibold">काम का विवरण</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{workData.description}</p>
            </Card>

            {/* Requirements & Facilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">आवश्यकताएं</h3>
                <ul className="space-y-2">
                  {workData.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">सुविधाएं</h3>
                <ul className="space-y-2">
                  {workData.facilities.map((facility, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ChevronRight className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{facility}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Info Alert */}
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertDescription className="ml-2 text-blue-800">
                आवेदन करने के बाद 2 दिन में आपको SMS से पुष्टि होगी। काम शुरू होने से पहले फिर से याद दिलाया जाएगा।
              </AlertDescription>
            </Alert>

            {/* Apply Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4">
              <div className="max-w-4xl mx-auto">
                <Button 
                  onClick={() => setShowWizard(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 py-6 text-lg font-semibold"
                  size="lg"
                >
                  आवेदन करें
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Application Wizard Modal */}
      {showWizard && (
        <WorkApplicationWizard
          work={workData}
          onClose={() => setShowWizard(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </>
  );
}
