import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Users, 
  Heart, 
  IndianRupee, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  FileText, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useState } from 'react';

export default function WidowPensionPage() {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const [applicationStep, setApplicationStep] = useState(0);

  // Check eligibility
  const isWidow = user?.familyDetails?.maritalStatus === 'widowed';
  const age = user?.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : 0;
  const isEligible = isWidow && age >= 18 && age <= 60;

  const content = {
    hi: {
      title: 'इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना',
      subtitle: 'विधवा महिलाओं के लिए वित्तीय सहायता',
      benefit: '₹300-₹500 प्रति माह',
      description: 'यह योजना विधवा महिलाओं को वित्तीय सुरक्षा प्रदान करती है जिससे वे सम्मान से जीवन यापन कर सकें।',
      eligibilityTitle: 'पात्रता मानदंड',
      eligibility: [
        'विधवा महिला होनी चाहिए',
        'आयु 40-59 वर्ष के बीच',
        'BPL परिवार से संबंधित',
        'कोई अन्य पेंशन प्राप्त नहीं होनी चाहिए',
      ],
      benefits: [
        '₹300 प्रति माह (40-59 वर्ष)',
        '₹500 प्रति माह (60+ वर्ष के बाद)',
        'सीधे बैंक खाते में',
        'हर महीने नियमित भुगतान',
      ],
      documents: [
        'विधवा प्रमाण पत्र',
        'आयु प्रमाण पत्र',
        'BPL राशन कार्ड',
        'बैंक खाता विवरण',
        'आधार कार्ड',
        'पासपोर्ट फोटो',
      ],
      applyNow: 'अभी आवेदन करें',
      checkStatus: 'स्थिति जांचें',
      helpline: 'हेल्पलाइन: 1800-XXX-XXXX',
      enrollmentProcess: 'नामांकन प्रक्रिया',
      yourStatus: 'आपकी स्थिति',
      eligible: 'पात्र',
      notEligible: 'अपात्र',
      enrolled: 'नामांकित',
      pending: 'लंबित',
      reasonNotEligible: 'आप इस योजना के लिए पात्र नहीं हैं क्योंकि:',
      reasons: {
        notWidow: 'आप विधवा महिला नहीं हैं',
        ageIssue: 'आपकी आयु पात्रता सीमा के बाहर है',
      },
      howToApply: 'कैसे आवेदन करें',
      steps: [
        'नजदीकी आंगनवाड़ी या ब्लॉक कार्यालय जाएं',
        'आवेदन फॉर्म भरें',
        'आवश्यक दस्तावेज जमा करें',
        '15-30 दिनों में सत्यापन',
        'स्वीकृति के बाद पेंशन शुरू',
      ],
      monthlyAmount: 'मासिक राशि',
      totalAnnual: 'वार्षिक कुल',
    },
    en: {
      title: 'Indira Gandhi National Widow Pension Scheme',
      subtitle: 'Financial Support for Widows',
      benefit: '₹300-₹500 per month',
      description: 'This scheme provides financial security to widows, enabling them to live with dignity.',
      eligibilityTitle: 'Eligibility Criteria',
      eligibility: [
        'Must be a widow',
        'Age between 40-59 years',
        'Belonging to BPL family',
        'Not receiving any other pension',
      ],
      benefits: [
        '₹300 per month (40-59 years)',
        '₹500 per month (60+ years)',
        'Direct to bank account',
        'Regular monthly payment',
      ],
      documents: [
        'Widow Certificate',
        'Age Proof',
        'BPL Ration Card',
        'Bank Account Details',
        'Aadhaar Card',
        'Passport Photos',
      ],
      applyNow: 'Apply Now',
      checkStatus: 'Check Status',
      helpline: 'Helpline: 1800-XXX-XXXX',
      enrollmentProcess: 'Enrollment Process',
      yourStatus: 'Your Status',
      eligible: 'Eligible',
      notEligible: 'Not Eligible',
      enrolled: 'Enrolled',
      pending: 'Pending',
      reasonNotEligible: 'You are not eligible because:',
      reasons: {
        notWidow: 'You are not a widow',
        ageIssue: 'Your age is outside the eligibility range',
      },
      howToApply: 'How to Apply',
      steps: [
        'Visit nearest Anganwadi or Block Office',
        'Fill application form',
        'Submit required documents',
        'Verification in 15-30 days',
        'Pension starts after approval',
      ],
      monthlyAmount: 'Monthly Amount',
      totalAnnual: 'Annual Total',
    },
  };

  const t = content[currentLanguage.code as keyof typeof content] || content.hi;

  // Calculate pension amount based on age
  const calculatePensionAmount = () => {
    if (age >= 60) return 500;
    if (age >= 40) return 300;
    return 0;
  };

  const monthlyPension = calculatePensionAmount();
  const annualPension = monthlyPension * 12;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-pink-100 rounded-full">
            <Heart className="h-8 w-8 text-pink-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-600 mt-1">{t.subtitle}</p>
          </div>
        </div>

        <Badge variant="secondary" className="text-lg py-2 px-4">
          <IndianRupee className="h-5 w-5 mr-2" />
          {t.benefit}
        </Badge>
      </div>

      {/* Eligibility Status Alert */}
      {user && (
        <Alert className={isEligible ? 'bg-green-50 border-green-200 mb-6' : 'bg-amber-50 border-amber-200 mb-6'}>
          <AlertCircle className={isEligible ? 'h-5 w-5 text-green-600' : 'h-5 w-5 text-amber-600'} />
          <AlertDescription className="ml-2">
            <strong>{t.yourStatus}: </strong>
            {isEligible ? (
              <span className="text-green-700 font-semibold">{t.eligible} ✓</span>
            ) : (
              <div className="text-amber-700">
                <span className="font-semibold">{t.notEligible}</span>
                <ul className="mt-2 space-y-1 text-sm">
                  {!isWidow && <li>• {t.reasons.notWidow}</li>}
                  {(age < 18 || age > 60) && <li>• {t.reasons.ageIssue}</li>}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                {t.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{t.description}</p>
            </CardContent>
          </Card>

          {/* Pension Calculator */}
          {isEligible && (
            <Card className="border-pink-200 bg-pink-50">
              <CardHeader>
                <CardTitle className="text-pink-900">पेंशन कैलकुलेटर</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">{t.monthlyAmount}</div>
                    <div className="text-3xl font-bold text-pink-600">₹{monthlyPension}</div>
                    <div className="text-sm text-gray-500 mt-2">आपकी आयु: {age} वर्ष</div>
                  </div>

                  <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">{t.totalAnnual}</div>
                    <div className="text-3xl font-bold text-pink-600">₹{annualPension}</div>
                    <div className="text-sm text-gray-500 mt-2">12 महीने का कुल</div>
                  </div>
                </div>

                <Alert className="mt-6 bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="ml-2 text-sm text-blue-800">
                    60 वर्ष की आयु के बाद पेंशन राशि ₹500 प्रति माह हो जाएगी
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Eligibility Criteria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                {t.eligibilityTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {t.eligibility.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                लाभ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {t.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <ArrowRight className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How to Apply */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t.howToApply}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {t.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="pt-1">
                      <p className="text-gray-700">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">त्वरित कार्रवाई</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isEligible && (
                <Button className="w-full bg-pink-600 hover:bg-pink-700" size="lg">
                  <FileText className="h-5 w-5 mr-2" />
                  {t.applyNow}
                </Button>
              )}

              <Button variant="outline" className="w-full" size="lg">
                <Calendar className="h-5 w-5 mr-2" />
                {t.checkStatus}
              </Button>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Phone className="h-4 w-4" />
                  {t.helpline}
                </div>
                <p className="text-xs text-gray-500">सोमवार-शुक्रवार, 9 AM - 6 PM</p>
              </div>
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                आवश्यक दस्तावेज
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {t.documents.map((doc, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{doc}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-pink-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">मदद चाहिए?</h3>
              <p className="text-sm text-gray-600 mb-4">
                हमारी AI सहायक से बात करें या हेल्पलाइन पर कॉल करें
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                संपर्क करें
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
