// SAHAYOG - Government Schemes Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Search,
  CheckCircle,
  IndianRupee,
  Calendar,
  Users,
  Sprout,
  GraduationCap,
  Heart,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

// Schemes data
const schemesData = [
  {
    id: 'mgnrega',
    code: 'MGNREGA',
    name: { hi: 'मनरेगा', en: 'MGNREGA' },
    fullName: { hi: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम', en: 'Mahatma Gandhi National Rural Employment Guarantee Act' },
    ministry: 'ग्रामीण विकास मंत्रालय',
    description: '100 दिन काम की गारंटी हर वित्तीय वर्ष में',
    benefits: [
      { type: 'cash', amount: 231, frequency: 'daily', description: 'प्रति दिन मजदूरी' },
    ],
    eligibility: {
      ageMin: 18,
      ruralOnly: true,
    },
    isEnrolled: true,
    status: 'active',
    color: 'from-green-500 to-emerald-600',
    icon: Users,
  },
  {
    id: 'pm-kisan',
    code: 'PM-KISAN',
    name: { hi: 'PM-KISAN', en: 'PM-KISAN' },
    fullName: { hi: 'प्रधानमंत्री किसान सम्मान निधि', en: 'Pradhan Mantri Kisan Samman Nidhi' },
    ministry: 'कृषि मंत्रालय',
    description: 'किसानों को वार्षिक ₹6,000 की आर्थिक सहायता',
    benefits: [
      { type: 'cash', amount: 6000, frequency: 'annual', description: '₹2,000 हर 4 महीने में' },
    ],
    eligibility: {
      landOwnershipRequired: true,
      landLimitMax: 2,
      ruralOnly: true,
    },
    isEnrolled: true,
    status: 'active',
    color: 'from-orange-500 to-amber-600',
    icon: Sprout,
  },
  {
    id: 'pm-sym',
    code: 'PM-SYM',
    name: { hi: 'PM-SYM पेंशन', en: 'PM-SYM Pension' },
    fullName: { hi: 'प्रधानमंत्री श्रम योगी मान-धन', en: 'Pradhan Mantri Shram Yogi Maan-dhan' },
    ministry: 'श्रम मंत्रालय',
    description: 'असंगठित क्षेत्र के श्रमिकों को ₹3,000/माह पेंशन',
    benefits: [
      { type: 'pension', amount: 3000, frequency: 'monthly', description: '60 वर्ष की उम्र के बाद' },
    ],
    eligibility: {
      ageMin: 18,
      ageMax: 40,
      incomeLimit: 15000,
    },
    isEnrolled: false,
    status: 'eligible',
    color: 'from-blue-500 to-indigo-600',
    icon: Calendar,
  },
  {
    id: 'widow-pension',
    code: 'WIDOW-PENSION',
    name: { hi: 'विधवा पेंशन', en: 'Widow Pension' },
    fullName: { hi: 'इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना', en: 'Indira Gandhi National Widow Pension Scheme' },
    ministry: 'ग्रामीण विकास मंत्रालय',
    description: 'विधवा महिलाओं को मासिक पेंशन',
    benefits: [
      { type: 'pension', amount: 500, frequency: 'monthly', description: 'मासिक पेंशन' },
    ],
    eligibility: {
      gender: ['female'],
      incomeLimit: 100000,
    },
    isEnrolled: true,
    status: 'active',
    color: 'from-purple-500 to-violet-600',
    icon: Heart,
  },
  {
    id: 'nrlm',
    code: 'DAY-NRLM',
    name: { hi: 'DAY-NRLM', en: 'DAY-NRLM' },
    fullName: { hi: 'दीनदयाल अंत्योदय योजना - राष्ट्रीय ग्रामीण आजीविका मिशन', en: 'Deendayal Antyodaya Yojana - National Rural Livelihood Mission' },
    ministry: 'ग्रामीण विकास मंत्रालय',
    description: 'स्वयं सहायता समूहों के माध्यम से महिला सशक्तिकरण',
    benefits: [
      { type: 'subsidy', amount: 100000, frequency: 'one_time', description: 'ब्याज सब्सिडी' },
    ],
    eligibility: {
      gender: ['female'],
      ruralOnly: true,
    },
    isEnrolled: false,
    status: 'eligible',
    color: 'from-pink-500 to-rose-600',
    icon: Users,
  },
  {
    id: 'pmkvy',
    code: 'PMKVY',
    name: { hi: 'PMKVY', en: 'PMKVY' },
    fullName: { hi: 'प्रधानमंत्री कौशल विकास योजना', en: 'Pradhan Mantri Kaushal Vikas Yojana' },
    ministry: 'कौशल विकास मंत्रालय',
    description: 'नौजवानों को कौशल प्रशिक्षण और रोजगार',
    benefits: [
      { type: 'subsidy', amount: 0, frequency: 'one_time', description: 'मुफ्त प्रशिक्षण' },
    ],
    eligibility: {
      ageMin: 18,
      ageMax: 35,
    },
    isEnrolled: false,
    status: 'eligible',
    color: 'from-cyan-500 to-teal-600',
    icon: GraduationCap,
  },
  {
    id: 'old-age-pension',
    code: 'OLD-AGE-PENSION',
    name: { hi: 'वृद्धावस्था पेंशन', en: 'Old Age Pension' },
    fullName: { hi: 'इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना', en: 'Indira Gandhi National Old Age Pension Scheme' },
    ministry: 'ग्रामीण विकास मंत्रालय',
    description: '60 वर्ष से अधिक उम्र के वृद्धों को मासिक पेंशन',
    benefits: [
      { type: 'pension', amount: 200, frequency: 'monthly', description: '60-79 वर्ष: ₹200' },
      { type: 'pension', amount: 500, frequency: 'monthly', description: '80+ वर्ष: ₹500' },
    ],
    eligibility: {
      ageMin: 60,
      incomeLimit: 100000,
    },
    isEnrolled: false,
    status: 'not_eligible',
    color: 'from-gray-500 to-slate-600',
    icon: Calendar,
  },
];

export default function Schemes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const enrolledSchemes = schemesData.filter(s => s.isEnrolled);
  const eligibleSchemes = schemesData.filter(s => !s.isEnrolled && s.status === 'eligible');
  const notEligibleSchemes = schemesData.filter(s => s.status === 'not_eligible');

  const filteredSchemes = schemesData.filter(scheme => {
    const matchesSearch = 
      scheme.name.hi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.fullName.hi.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'enrolled') return matchesSearch && scheme.isEnrolled;
    if (activeTab === 'eligible') return matchesSearch && !scheme.isEnrolled && scheme.status === 'eligible';
    return matchesSearch;
  });

  const handleApply = (schemeId: string) => {
    toast.success('आवेदन पृष्ठ पर रीडायरेक्ट हो रहे हैं...');
    navigate(`/schemes/${schemeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-orange-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-4">सरकारी योजनाएं</h1>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="योजना खोजें..."
              className="pl-10 border-orange-200 focus:border-orange-400"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center border-green-200">
            <p className="text-2xl font-bold text-green-600">{enrolledSchemes.length}</p>
            <p className="text-xs text-gray-600">सक्रिय</p>
          </Card>
          <Card className="p-4 text-center border-orange-200">
            <p className="text-2xl font-bold text-orange-600">{eligibleSchemes.length}</p>
            <p className="text-xs text-gray-600">पात्र</p>
          </Card>
          <Card className="p-4 text-center border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{schemesData.length}</p>
            <p className="text-xs text-gray-600">कुल योजनाएं</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">सभी</TabsTrigger>
            <TabsTrigger value="enrolled">मेरी</TabsTrigger>
            <TabsTrigger value="eligible">पात्र</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {filteredSchemes.map((scheme) => (
              <Card key={scheme.id} className="overflow-hidden border-orange-100">
                {/* Header */}
                <div className={`h-2 bg-gradient-to-r ${scheme.color}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${scheme.color} flex items-center justify-center`}>
                        <scheme.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{scheme.name.hi}</h3>
                        <p className="text-xs text-gray-500">{scheme.ministry}</p>
                      </div>
                    </div>
                    {scheme.isEnrolled ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        सक्रिय
                      </Badge>
                    ) : scheme.status === 'eligible' ? (
                      <Badge className="bg-orange-100 text-orange-700">पात्र</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-700">अपात्र</Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{scheme.description}</p>

                  {/* Benefits */}
                  <div className="space-y-2 mb-4">
                    {scheme.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">
                          {benefit.type === 'cash' && benefit.frequency === 'daily' 
                            ? `₹${benefit.amount}/दिन`
                            : benefit.type === 'cash' && benefit.frequency === 'annual'
                            ? `₹${benefit.amount}/साल`
                            : benefit.type === 'pension'
                            ? `₹${benefit.amount}/माह पेंशन`
                            : benefit.description}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {scheme.isEnrolled ? (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/schemes/${scheme.id}`)}
                      >
                        विवरण देखें
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : scheme.status === 'eligible' ? (
                      <Button
                        onClick={() => handleApply(scheme.id)}
                        className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600"
                      >
                        आवेदन करें
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        disabled
                        className="flex-1"
                      >
                        अपात्र
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(`https://www.google.com/search?q=${scheme.code}+scheme`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {filteredSchemes.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600">कोई योजना नहीं मिली</p>
                <p className="text-sm text-gray-500">खोज बदलकर फिर से कोशिश करें</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
