// SAHAYOG - About Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Heart, 
  Shield, 
  Users, 
  Globe,
  Cpu,
  CheckCircle,
  Target,
  Sparkles
} from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'पारदर्शिता',
      description: 'AI-आधारित निष्पक्ष काम आवंटन। कोई भेदभाव नहीं।',
    },
    {
      icon: Cpu,
      title: 'AI-संचालित',
      description: 'Gemini AI से बात करें। 22 भाषाओं में समर्थन।',
    },
    {
      icon: Users,
      title: 'समुदाय केंद्रित',
      description: 'ग्रामीण भारत की जरूरतों के लिए डिज़ाइन किया गया।',
    },
    {
      icon: Globe,
      title: 'बहुभाषी',
      description: 'हिंदी, भोजपुरी, अवधी और 19 अन्य भाषाएं।',
    },
  ];

  const stats = [
    { value: '5M+', label: 'उपयोगकर्ता' },
    { value: '22', label: 'भाषाएं' },
    { value: '5 दिन', label: 'शिकायत निपटान' },
    { value: '100%', label: 'पारदर्शिता' },
  ];

  const techStack = [
    'Gemini AI (Google)',
    'MongoDB Atlas',
    'React + TypeScript',
    'Tailwind CSS',
    'Node.js',
    'Express.js',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-orange-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-4">सहयोग के बारे में</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Hero */}
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">सहयोग</h2>
          <p className="text-lg text-gray-600">ग्रामीण रोजगार का साथी</p>
          <Badge className="mt-4 bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            भारत सरकार द्वारा स्वीकृत
          </Badge>
        </div>

        {/* Mission */}
        <Card className="p-6 bg-gradient-to-r from-orange-500 to-amber-600 text-white border-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">हमारा मिशन</h3>
              <p className="text-orange-100">
                प्रत्येक ग्रामीण श्रमिक तक सरकारी रोजगार और कल्याण योजनाओं की पहुंच सुनिश्चित करना। 
                तकनीक का उपयोग करके, हम भेदभाव मुक्त, पारदर्शी और कुशल सेवा प्रदान करते हैं।
              </p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 text-center border-orange-100">
              <p className="text-2xl font-bold text-orange-600">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">विशेषताएं</h3>
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 border-orange-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ML Features */}
        <Card className="p-6 border-purple-100 bg-purple-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI/ML क्षमताएं</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  प्राथमिकता स्कोरिंग मॉडल
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  धोखाधड़ी का पता लगाना
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  निष्पक्षता निगरानी
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  व्याख्यात्मक AI
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Tech Stack */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">तकनीकी ढांचा</h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Contact */}
        <Card className="p-6 border-orange-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">संपर्क करें</h3>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <span className="text-gray-500">हेल्पलाइन:</span>
              <span className="font-medium">1800-XXX-XXXX</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-gray-500">ईमेल:</span>
              <span className="font-medium">help@sahayog.gov.in</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-gray-500">वेबसाइट:</span>
              <span className="font-medium">www.sahayog.gov.in</span>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          <p>© 2026 SAHAYOG. सर्वाधिकार सुरक्षित।</p>
          <p className="mt-1">भारत सरकार द्वारा स्वीकृत</p>
        </div>
      </main>
    </div>
  );
}
