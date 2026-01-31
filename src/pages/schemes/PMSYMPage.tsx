// PM-SYM Pension Scheme Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Phone, 
  FileText, 
  AlertCircle,
  Volume2,
  IndianRupee,
  Clock,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

export default function PMSYMPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check eligibility
  const age = user?.dateOfBirth 
    ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()
    : 0;
  const isEligible = age >= 18 && age <= 40 && !user?.mgnregaInfo?.hasJobCard;
  const enrollmentStatus = user?.enrolledSchemes?.find(s => s.schemeName === 'PM-SYM');

  // Calculate monthly contribution based on age
  const monthlyContribution = age <= 18 ? 55 : 
                              age <= 25 ? 76 :
                              age <= 30 ? 100 :
                              age <= 35 ? 140 :
                              age <= 40 ? 200 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/schemes')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            योजनाओं पर वापस जाएं
          </Button>
          <Button variant="ghost" size="sm">
            <Volume2 className="h-4 w-4 mr-2" />
            सुनें
          </Button>
        </div>

        {/* Scheme Header Card */}
        <Card className="p-6 mb-6 border-2 border-blue-200 bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">👴</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  प्रधानमंत्री श्रम योगी मान-धन
                </h1>
                <p className="text-sm text-gray-600 mt-1">PM-SYM (Pension Scheme for Workers)</p>
              </div>
            </div>
            <Badge 
              className={`${isEligible ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}
            >
              {isEligible ? '✅ पात्र हैं' : '❌ पात्र नहीं'}
            </Badge>
          </div>
        </Card>

        {/* What is this scheme */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            क्या है यह योजना?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            असंगठित क्षेत्र के कामगारों के लिए पेंशन योजना। 60 साल की उम्र के बाद हर महीने{' '}
            <span className="font-bold text-blue-600">₹3,000</span> पेंशन मिलती है।
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>खास बात:</strong> आप जितना योगदान करेंगे, सरकार उतना ही योगदान देगी!
            </p>
          </div>
        </Card>

        {/* Benefits */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-blue-600" />
            आपको क्या मिलता है?
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900">60 साल के बाद मासिक पेंशन</p>
                <Badge variant="outline" className="bg-blue-100">गारंटीड</Badge>
              </div>
              <p className="text-3xl font-bold text-blue-600">₹3,000/माह</p>
              <p className="text-sm text-gray-600 mt-2">आजीवन पेंशन (जीवन भर)</p>
            </div>

            <div className="p-4 border-2 border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900">आपका मासिक योगदान</p>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{monthlyContribution}/माह</p>
              <p className="text-sm text-gray-600 mt-2">
                आपकी उम्र: {age} साल • सरकार का योगदान: ₹{monthlyContribution}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-medium text-gray-900 mb-2">अतिरिक्त लाभ</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  अगर पेंशनधारक की मृत्यु हो जाए, तो परिवार को 50% पेंशन
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  विकलांगता की स्थिति में विशेष सुविधा
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Your Status */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            आपकी स्थिति
          </h2>
          
          {enrollmentStatus ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">नामांकित</p>
                  <p className="text-sm text-gray-600">
                    पंजीकरण: {new Date(enrollmentStatus.enrollmentDate).toLocaleDateString('hi-IN')}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="font-medium text-gray-900 mb-2">योगदान की स्थिति</p>
                <p className="text-sm text-gray-600">कुल योगदान: ₹2,400 (12 महीने)</p>
                <p className="text-sm text-gray-600">अगली किस्त: ₹{monthlyContribution} (फरवरी 2026)</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="font-semibold text-gray-900">आवेदन नहीं किया गया</p>
                  <p className="text-sm text-gray-600">जल्दी करें - योजना का लाभ न चूकें!</p>
                </div>
              </div>

              {isEligible ? (
                <>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900 mb-3">
                      <strong>आपके लिए योजना:</strong> आप अभी {age} साल के हैं। 
                      केवल ₹{monthlyContribution}/माह का योगदान करें और 60 साल में ₹3,000/माह पेंशन पाएं।
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white p-2 rounded">
                        <p className="text-gray-600">कुल निवेश (60 तक)</p>
                        <p className="font-bold text-blue-600">
                          ₹{(monthlyContribution * 12 * (60 - age)).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <p className="text-gray-600">वार्षिक पेंशन</p>
                        <p className="font-bold text-green-600">₹36,000</p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    अभी आवेदन करें
                  </Button>
                </>
              ) : (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">
                    {age > 40 
                      ? 'आपकी उम्र 40 साल से अधिक है। इस योजना के लिए 18-40 साल के लोग पात्र हैं।'
                      : 'आप इस योजना के लिए पात्र नहीं हैं।'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Eligibility */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            पात्रता मानदंड
          </h2>
          <div className="space-y-3">
            {[
              { criteria: 'उम्र 18-40 वर्ष', met: age >= 18 && age <= 40 },
              { criteria: 'असंगठित क्षेत्र का कामगार', met: true },
              { criteria: 'मासिक आय ₹15,000 से कम', met: true },
              { criteria: 'EPFO/ESIC/NPS में पंजीकृत नहीं', met: !user?.mgnregaInfo?.hasJobCard }
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <span className="text-gray-700">{item.criteria}</span>
                {item.met ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* How to Apply */}
        {!enrollmentStatus && isEligible && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              आवेदन कैसे करें?
            </h2>
            <ol className="space-y-3">
              {[
                'नजदीकी CSC (कॉमन सर्विस सेंटर) पर जाएं',
                'आधार कार्ड और बैंक पासबुक साथ लेकर जाएं',
                'रजिस्ट्रेशन फॉर्म भरें',
                'पहली किश्त जमा करें (₹' + monthlyContribution + ')',
                'श्रमयोगी कार्ड प्राप्त करें'
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 font-semibold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </Card>
        )}

        {/* Helpline */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5 text-blue-600" />
            हेल्पलाइन
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">टोल-फ्री नंबर</p>
                <p className="text-sm text-gray-600">24/7 उपलब्ध</p>
              </div>
              <a 
                href="tel:1800-267-6888" 
                className="text-xl font-bold text-blue-600"
              >
                1800-267-6888
              </a>
            </div>
            <Button className="w-full" variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              अभी कॉल करें
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
