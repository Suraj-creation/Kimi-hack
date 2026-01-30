// SAHAYOG - Landing Page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  Users, 
  Shield, 
  Clock, 
  ChevronRight, 
  Globe, 
  Phone, 
  MessageCircle,
  CheckCircle,
  TrendingUp,
  Heart
} from 'lucide-react';
import { sahayogAI } from '@/lib/gemini';

// Language Selector Component
function LanguageSelector() {
  const { supportedLanguages, currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-orange-200 hover:bg-white transition-all"
      >
        <Globe className="w-4 h-4 text-orange-600" />
        <span className="text-sm font-medium text-gray-700">{currentLanguage.nativeName}</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-orange-100 overflow-hidden z-50">
          {supportedLanguages.slice(0, 8).map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center justify-between ${
                currentLanguage.code === lang.code ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
              }`}
            >
              <span className="text-sm">{lang.nativeName}</span>
              {currentLanguage.code === lang.code && <CheckCircle className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Hero Section
function HeroSection({ onStartClick }: { onStartClick: () => void }) {
  const { t } = useLanguage();
  const [isListening, setIsListening] = useState(false);

  const handleVoiceClick = () => {
    setIsListening(true);
    sahayogAI.startVoiceRecognition(
      (transcript) => {
        setIsListening(false);
        console.log('Voice input:', transcript);
        // Handle voice command
      },
      (error) => {
        setIsListening(false);
        console.error('Voice error:', error);
      },
      'hi-IN'
    );
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-50/50 to-amber-50" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <Badge className="mb-6 px-4 py-2 bg-orange-100 text-orange-700 border-orange-200 text-sm">
          <Heart className="w-4 h-4 mr-2" />
          भारत सरकार द्वारा स्वीकृत
        </Badge>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-4">
          <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
            {t('app.name')}
          </span>
        </h1>
        
        <p className="text-2xl sm:text-3xl text-gray-700 mb-4 font-medium">
          {t('app.tagline')}
        </p>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          ग्रामीण रोजगार योजनाओं तक पहुंच बनाना सरल। MGNREGA, PM-KISAN और अन्य योजनाओं की जानकारी, आवेदन और ट्रैकिंग - एक ही जगह।
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={onStartClick}
            size="lg"
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {t('auth.login.submit')}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleVoiceClick}
            className={`border-2 border-orange-300 hover:bg-orange-50 px-8 py-6 text-lg rounded-full transition-all ${
              isListening ? 'bg-red-50 border-red-400 animate-pulse' : ''
            }`}
          >
            <Mic className={`mr-2 w-5 h-5 ${isListening ? 'text-red-500' : 'text-orange-600'}`} />
            {isListening ? 'सुन रहा हूं...' : 'आवाज से बात करें'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { value: '5M+', label: 'उपयोगकर्ता', icon: Users },
            { value: '100%', label: 'पारदर्शिता', icon: Shield },
            { value: '5 दिन', label: 'शिकायत निपटान', icon: Clock },
            { value: '22', label: 'भाषाएं', icon: Globe },
          ].map((stat, index) => (
            <Card key={index} className="p-4 bg-white/80 backdrop-blur-sm border-orange-100">
              <stat.icon className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Mic,
      title: 'आवाज से बात करें',
      description: '22 भाषाओं में बोलकर जानकारी प्राप्त करें। पढ़ना जरूरी नहीं।',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Shield,
      title: 'पारदर्शी आवंटन',
      description: 'AI-आधारित निष्पक्ष काम आवंटन। कोई भेदभाव नहीं।',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Clock,
      title: '5-दिन शिकायत निपटान',
      description: 'किसी भी समस्या का 5 दिनों में समाधान।',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: TrendingUp,
      title: 'कौशल विकास',
      description: 'नए कौशल सीखें और बेहतर रोजगार पाएं।',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: Phone,
      title: '24/7 सहायता',
      description: 'AI सहायक हमेशा उपलब्ध। कभी भी पूछें।',
      color: 'bg-rose-100 text-rose-600',
    },
    {
      icon: MessageCircle,
      title: 'बहुभाषी समर्थन',
      description: 'हिंदी, भोजपुरी, अवधी और 19 अन्य भाषाएं।',
      color: 'bg-cyan-100 text-cyan-600',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            क्यों चुनें <span className="text-orange-600">सहयोग</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            आधुनिक तकनीक और पारंपरिक मूल्यों का संगम - ग्रामीण भारत के लिए
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-orange-100">
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Schemes Preview Section
function SchemesPreview() {
  const schemes = [
    {
      name: 'MGNREGA',
      fullName: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम',
      benefit: '100 दिन काम की गारंटी',
      color: 'from-green-500 to-emerald-600',
    },
    {
      name: 'PM-KISAN',
      fullName: 'प्रधानमंत्री किसान सम्मान निधि',
      benefit: '₹6,000/साल',
      color: 'from-orange-500 to-amber-600',
    },
    {
      name: 'PM-SYM',
      fullName: 'प्रधानमंत्री श्रम योगी मान-धन',
      benefit: '₹3,000/महीना पेंशन',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'DAY-NRLM',
      fullName: 'दीनदयाल अंत्योदय योजना',
      benefit: 'स्वयं सहायता समूह',
      color: 'from-purple-500 to-violet-600',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            उपलब्ध योजनाएं
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            केंद्र और राज्य सरकार की विभिन्न कल्याणकारी योजनाओं की जानकारी
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {schemes.map((scheme, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className={`h-2 bg-gradient-to-r ${scheme.color}`} />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{scheme.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{scheme.fullName}</p>
                <div className="flex items-center text-green-600 font-semibold">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {scheme.benefit}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-orange-400 mb-4">{t('app.name')}</h3>
            <p className="text-gray-400 text-sm">
              ग्रामीण रोजगार और कल्याण योजनाओं तक पहुंच को सरल बनाना।
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">त्वरित लिंक</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/about" className="hover:text-white transition-colors">{t('footer.about')}</a></li>
              <li><a href="/help" className="hover:text-white transition-colors">{t('help.title')}</a></li>
              <li><a href="/schemes" className="hover:text-white transition-colors">{t('schemes.title')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">कानूनी</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">संपर्क</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                1800-XXX-XXXX (टोल-फ्री)
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                help@sahayog.gov.in
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page
export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                सहयोग
              </span>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <HeroSection onStartClick={handleStartClick} />
        <FeaturesSection />
        <SchemesPreview />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
