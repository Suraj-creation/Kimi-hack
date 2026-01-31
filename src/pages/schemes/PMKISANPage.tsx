// PM-KISAN Scheme Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Phone, 
  FileText, 
  AlertCircle,
  Volume2,
  IndianRupee,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

export default function PMKISANPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Check eligibility
  const isEligible = user?.economicInfo?.landOwnership?.ownsLand;
  const enrollmentStatus = user?.enrolledSchemes?.find(s => s.schemeName === 'PM-KISAN');

  const benefitAmount = 6000;
  const installmentAmount = 2000;
  const frequency = 'हर 4 महीने में';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
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
        <Card className="p-6 mb-6 border-2 border-green-200 bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🌾</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  प्रधानमंत्री किसान सम्मान निधि
                </h1>
                <p className="text-sm text-gray-600 mt-1">PM-KISAN (Farmer Income Support)</p>
              </div>
            </div>
            <Badge 
              className={`${isEligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {isEligible ? '✅ पात्र हैं' : '❌ पात्र नहीं'}
            </Badge>
          </div>
        </Card>

        {/* What is this scheme */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            क्या है यह योजना?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            किसानों को हर साल <span className="font-bold text-green-600">₹6,000</span> सीधे बैंक खाते में मिलते हैं। 
            यह राशि तीन बराबर किश्तों में दी जाती है - ₹2,000 हर 4 महीने में।
          </p>
          <Button variant="outline" size="sm" className="mt-4">
            <Volume2 className="h-4 w-4 mr-2" />
            विस्तार से सुनें
          </Button>
        </Card>

        {/* Benefits */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-green-600" />
            आपको क्या मिलता है?
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">सालाना लाभ</p>
                <p className="text-sm text-gray-600">{frequency}</p>
              </div>
              <p className="text-2xl font-bold text-green-600">₹{benefitAmount.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">प्रति किश्त</p>
                <p className="text-sm text-gray-600">साल में 3 बार</p>
              </div>
              <p className="text-2xl font-bold text-green-600">₹{installmentAmount.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Your Status */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            आपकी स्थिति
          </h2>
          
          {enrollmentStatus ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">नामांकित</p>
                  <p className="text-sm text-gray-600">
                    पंजीकरण तिथि: {new Date(enrollmentStatus.enrollmentDate).toLocaleDateString('hi-IN')}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">अगली किश्त</p>
                  <Badge variant="outline">जल्द आने वाली</Badge>
                </div>
                <p className="text-sm text-gray-600">अनुमानित तिथि: फरवरी 2026</p>
                <p className="text-lg font-bold text-blue-600 mt-2">₹2,000</p>
              </div>

              <Button className="w-full" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                भुगतान इतिहास देखें
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="font-semibold text-gray-900">आवेदन नहीं किया गया</p>
                  <p className="text-sm text-gray-600">अभी आवेदन करें और लाभ प्राप्त करें</p>
                </div>
              </div>

              {isEligible ? (
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  अभी आवेदन करें
                </Button>
              ) : (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">
                    आप इस योजना के लिए पात्र नहीं हैं क्योंकि आपके पास कृषि भूमि नहीं है।
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* How to Apply */}
        {!enrollmentStatus && isEligible && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              आवेदन कैसे करें?
            </h2>
            <ol className="space-y-3">
              {[
                'अपने गाँव के लेखपाल या कृषि विभाग से संपर्क करें',
                'आधार कार्ड और बैंक खाता विवरण साथ लेकर जाएं',
                'भूमि के कागजात (खसरा/खतौनी) दिखाएं',
                'आवेदन फॉर्म भरें और जमा करें',
                '2-3 सप्ताह में आपका नाम सूची में आ जाएगा'
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-semibold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 pt-1">{step}</p>
                </li>
              ))}
            </ol>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => toast.info('AI असिस्टेंट खुल रहा है...')}
            >
              🤖 आवेदन में मदद चाहिए?
            </Button>
          </Card>
        )}

        {/* Required Documents */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            जरूरी दस्तावेज
          </h2>
          <div className="space-y-3">
            {[
              { name: 'आधार कार्ड', has: true },
              { name: 'बैंक खाता पासबुक', has: user?.economicInfo?.bankDetails?.accountNumber },
              { name: 'भूमि के कागजात (खसरा/खतौनी)', has: user?.economicInfo?.landOwnership?.ownsLand },
              { name: 'पासपोर्ट साइज फोटो', has: user?.photoUrl }
            ].map((doc, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <span className="text-gray-700">{doc.name}</span>
                {doc.has ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Helpline */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5 text-green-600" />
            हेल्पलाइन
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">टोल-फ्री नंबर</p>
                <p className="text-sm text-gray-600">सुबह 10 बजे से शाम 5 बजे तक</p>
              </div>
              <a 
                href="tel:155261" 
                className="text-2xl font-bold text-green-600"
              >
                155261
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
