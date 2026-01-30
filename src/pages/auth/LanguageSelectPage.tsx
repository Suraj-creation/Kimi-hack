// SAHAYOG - Language Selection Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Globe, 
  Mic, 
  CheckCircle,
  Volume2
} from 'lucide-react';

export default function LanguageSelectPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage.code);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    setLanguage(code);
  };

  const handleContinue = async () => {
    setIsLoading(true);
    
    try {
      // Update user preferences
      if (user) {
        updateUser({
          preferences: {
            ...user.preferences,
            preferredLanguage: selectedLanguage,
            voiceAssistantEnabled: voiceEnabled,
          },
        });
      }
      
      toast.success('भाषा सेटिंग सेव हो गई!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('सेटिंग सेव करने में त्रुटि');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakInstructions = () => {
    const text = 'अपनी पसंदीदा भाषा चुनें। आप हिंदी, भोजपुरी, अवधी या अन्य भाषाओं में से चुन सकते हैं।';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Popular languages first
  const popularLanguages = ['hi', 'en', 'bn', 'te', 'mr', 'ta'];
  const otherLanguages = SUPPORTED_LANGUAGES.filter(l => !popularLanguages.includes(l.code));
  const sortedLanguages = [
    ...SUPPORTED_LANGUAGES.filter(l => popularLanguages.includes(l.code)),
    ...otherLanguages
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center">
          <button 
            onClick={() => navigate('/auth/confirm-profile')}
            className="p-2 hover:bg-orange-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-4">{t('auth.language.title')}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 sm:p-8 border-orange-100 shadow-xl">
          {/* Instructions Audio */}
          <button
            onClick={handleSpeakInstructions}
            className="flex items-center gap-2 text-orange-600 text-sm mb-6 hover:underline"
          >
            <Volume2 className="w-4 h-4" />
            निर्देश सुनें
          </button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('auth.language.title')}
            </h2>
            <p className="text-gray-600">
              {t('auth.language.subtitle')}
            </p>
          </div>

          {/* Language Grid */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">लोकप्रिय भाषाएं</h3>
            <div className="grid grid-cols-2 gap-3">
              {sortedLanguages.slice(0, 6).map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    selectedLanguage === language.code
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{language.nativeName}</span>
                    {selectedLanguage === language.code && (
                      <CheckCircle className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{language.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* More Languages Dropdown */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">अन्य भाषाएं</h3>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageSelect(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            >
              {sortedLanguages.slice(6).map((language) => (
                <option key={language.code} value={language.code}>
                  {language.nativeName} ({language.name})
                </option>
              ))}
            </select>
          </div>

          {/* Voice Preference */}
          <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl mb-6">
            <Checkbox
              id="voice"
              checked={voiceEnabled}
              onCheckedChange={(checked) => setVoiceEnabled(checked as boolean)}
              className="mt-1 border-orange-300 data-[state=checked]:bg-orange-500"
            />
            <div className="flex-1">
              <label htmlFor="voice" className="flex items-center gap-2 font-medium text-gray-900 cursor-pointer">
                <Mic className="w-4 h-4 text-orange-500" />
                {t('auth.language.voice')}
              </label>
              <p className="text-sm text-gray-500 mt-1">
                आवाज से बात करके ऐप का उपयोग करें - पढ़ने की जरूरत नहीं
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-lg font-semibold rounded-xl disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                सेव हो रहा है...
              </span>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                जारी रखें
              </>
            )}
          </Button>
        </Card>
      </main>
    </div>
  );
}
