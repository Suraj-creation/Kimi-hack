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

export default function OldAgePensionPage() {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();

  // Check eligibility
  const age = user?.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : 0;
  const isEligible = age >= 60;

  const content = {
    hi: {
      title: 'इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना',
      subtitle: 'वरिष्ठ नागरिकों के लिए वित्तीय सहायता',
      benefit: '₹200-₹500 प्रति माह',
      description: 'यह योजना 60 वर्ष से अधिक आयु के BPL परिवारों के वरिष्ठ नागरिकों को मासिक पेंशन प्रदान करती है।',
      eligibilityTitle: 'पात्रता मानदंड',
      eligibility: [
        '60 वर्ष या उससे अधिक आयु',
        'BPL परिवार से संबंधित',
        'कोई नियमित आय स्रोत नहीं',
        'भारतीय नागरिक होना चाहिए',
      ],
      benefits: [
        '₹200 प्रति माह (60-79 वर्ष)',
        '₹500 प्रति माह (80+ वर्ष)',
        'सीधे बैंक खाते में भुगतान',
        'हर महीने नियमित भुगतान',
        'कोई जटिल प्रक्रिया नहीं',
      ],
      documents: [
        'आयु प्रमाण पत्र (जन्म प्रमाण पत्र)',
        'BPL राशन कार्ड',
        'बैंक खाता विवरण',
        'आधार कार्ड',
        'पासपोर्ट फोटो',
        'निवास प्रमाण पत्र',
      ],
      applyNow: 'अभी आवेदन करें',
      checkStatus: 'स्थिति जांचें',
      helpline: 'हेल्पलाइन: 1800-XXX-XXXX',
      yourStatus: 'आपकी स्थिति',
      eligible: 'पात्र',
      notEligible: 'अपात्र',
      reasonNotEligible: 'आप इस योजना के लिए पात्र नहीं हैं क्योंकि आपकी आयु 60 वर्ष से कम है।',
      howToApply: 'कैसे आवेदन करें',
      steps: [
        'नजदीकी ब्लॉक कार्यालय या ग्राम पंचायत जाएं',
        'पेंशन आवेदन फॉर्म प्राप्त करें और भरें',
        'सभी आवश्यक दस्तावेज संलग्न करें',
        'आवेदन जमा करें और रसीद लें',
        '15-30 दिनों में सत्यापन',
        'स्वीकृति के बाद पेंशन शुरू होगी',
      ],
      pensionCategories: 'पेंशन श्रेणियां',
      category1: '60-79 वर्ष',
      category2: '80+ वर्ष',
      monthlyAmount: 'मासिक राशि',
      annualTotal: 'वार्षिक कुल',
      coverageInfo: 'कवरेज सूचना',
      coverageText: 'यह योजना पूरे भारत में लागू है और सभी राज्य इसमें भाग लेते हैं। कुछ राज्य अतिरिक्त राशि भी देते हैं।',
    },
    en: {
      title: 'Indira Gandhi National Old Age Pension Scheme',
      subtitle: 'Financial Support for Senior Citizens',
      benefit: '₹200-₹500 per month',
      description: 'This scheme provides monthly pension to senior citizens aged 60 years and above from BPL families.',
      eligibilityTitle: 'Eligibility Criteria',
      eligibility: [
        'Age 60 years or above',
        'Belonging to BPL family',
        'No regular income source',
        'Must be Indian citizen',
      ],
      benefits: [
        '₹200 per month (60-79 years)',
        '₹500 per month (80+ years)',
        'Direct bank transfer',
        'Regular monthly payment',
        'No complex procedures',
      ],
      documents: [
        'Age Proof (Birth Certificate)',
        'BPL Ration Card',
        'Bank Account Details',
        'Aadhaar Card',
        'Passport Photos',
        'Residence Proof',
      ],
      applyNow: 'Apply Now',
      checkStatus: 'Check Status',
      helpline: 'Helpline: 1800-XXX-XXXX',
      yourStatus: 'Your Status',
      eligible: 'Eligible',
      notEligible: 'Not Eligible',
      reasonNotEligible: 'You are not eligible because you are below 60 years of age.',
      howToApply: 'How to Apply',
      steps: [
        'Visit nearest Block Office or Gram Panchayat',
        'Get and fill pension application form',
        'Attach all required documents',
        'Submit application and get receipt',
        'Verification in 15-30 days',
        'Pension starts after approval',
      ],
      pensionCategories: 'Pension Categories',
      category1: '60-79 years',
      category2: '80+ years',
      monthlyAmount: 'Monthly Amount',
      annualTotal: 'Annual Total',
      coverageInfo: 'Coverage Information',
      coverageText: 'This scheme is applicable across India and all states participate. Some states provide additional amount.',
    },
  };

  const t = content[currentLanguage.code as keyof typeof content] || content.hi;

  // Calculate pension based on age
  const calculatePension = () => {
    if (age >= 80) return { monthly: 500, annual: 6000 };
    if (age >= 60) return { monthly: 200, annual: 2400 };
    return { monthly: 0, annual: 0 };
  };

  const pension = calculatePension();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-orange-100 rounded-full">
            <Users className="h-8 w-8 text-orange-600" />
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
              <span className="text-green-700 font-semibold">
                {t.eligible} ✓ (आपकी आयु: {age} वर्ष)
              </span>
            ) : (
              <span className="text-amber-700">{t.reasonNotEligible} (वर्तमान आयु: {age} वर्ष)</span>
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
                योजना विवरण
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{t.description}</p>
              
              <Alert className="mt-4 bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="ml-2 text-sm text-blue-800">
                  <strong>{t.coverageInfo}:</strong> {t.coverageText}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Pension Calculator */}
          {isEligible && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-900">{t.pensionCategories}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-lg shadow-sm ${age >= 60 && age < 80 ? 'bg-orange-100 border-2 border-orange-400' : 'bg-white'}`}>
                    <div className="text-sm text-gray-600 mb-1">{t.category1}</div>
                    <div className="text-3xl font-bold text-orange-600">₹200</div>
                    <div className="text-sm text-gray-500 mt-2">{t.monthlyAmount}</div>
                    <div className="text-lg font-semibold text-gray-700 mt-3">₹2,400 / वर्ष</div>
                    {age >= 60 && age < 80 && (
                      <Badge className="mt-3 bg-orange-600">आपकी वर्तमान श्रेणी</Badge>
                    )}
                  </div>

                  <div className={`p-6 rounded-lg shadow-sm ${age >= 80 ? 'bg-orange-100 border-2 border-orange-400' : 'bg-white'}`}>
                    <div className="text-sm text-gray-600 mb-1">{t.category2}</div>
                    <div className="text-3xl font-bold text-orange-600">₹500</div>
                    <div className="text-sm text-gray-500 mt-2">{t.monthlyAmount}</div>
                    <div className="text-lg font-semibold text-gray-700 mt-3">₹6,000 / वर्ष</div>
                    {age >= 80 && (
                      <Badge className="mt-3 bg-orange-600">आपकी वर्तमान श्रेणी</Badge>
                    )}
                  </div>
                </div>

                {age >= 60 && age < 80 && (
                  <Alert className="mt-6 bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="ml-2 text-sm text-blue-800">
                      80 वर्ष की आयु के बाद आपकी पेंशन राशि ₹500 प्रति माह हो जाएगी
                    </AlertDescription>
                  </Alert>
                )}
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
                    <ArrowRight className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
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
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
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
                <Button className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
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
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <CardContent className="pt-6">
              <Heart className="h-12 w-12 text-orange-600 mb-4" />
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
