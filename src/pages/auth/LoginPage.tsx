// SAHAYOG - Aadhaar Login Page
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Mic, 
  HelpCircle, 
  CreditCard, 
  Shield, 
  Eye, 
  EyeOff,
  Volume2
} from 'lucide-react';

// Virtual Numpad Component
function VirtualNumpad({ onDigitClick, onBackspace }: { onDigitClick: (digit: string) => void; onBackspace: () => void }) {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {digits.map((digit, index) => (
        <button
          key={index}
          onClick={() => {
            if (digit === '⌫') onBackspace();
            else if (digit) onDigitClick(digit);
          }}
          disabled={!digit}
          className={`h-14 rounded-xl text-xl font-semibold transition-all ${
            digit === '⌫' 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : digit 
                ? 'bg-orange-50 text-gray-700 hover:bg-orange-100 active:scale-95'
                : 'invisible'
          }`}
        >
          {digit}
        </button>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [consent, setConsent] = useState(false);
  const [showVirtualNumpad, setShowVirtualNumpad] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Format Aadhaar number with spaces
  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaarNumber(formatted);
  };

  const handleDigitClick = (digit: string) => {
    const current = aadhaarNumber.replace(/\s/g, '');
    if (current.length < 12) {
      setAadhaarNumber(formatAadhaar(current + digit));
    }
  };

  const handleBackspace = () => {
    const current = aadhaarNumber.replace(/\s/g, '');
    setAadhaarNumber(formatAadhaar(current.slice(0, -1)));
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      toast.info('आवाज पहचान सुविधा जल्द ही उपलब्ध होगी');
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
    
    if (cleanAadhaar.length !== 12) {
      toast.error('कृपया सही 12 अंकों का आधार नंबर दर्ज करें');
      return;
    }
    
    if (!consent) {
      toast.error('कृपया सहमति दें');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(cleanAadhaar);
      navigate('/auth/verify');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'लॉगिन में त्रुटि');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakInstructions = () => {
    const text = 'आधार नंबर दर्ज करने के लिए, बारह अंकों का नंबर टाइप करें या वर्चुअल कीपैड का उपयोग करें। फिर सहमति दें और ओटीपी प्राप्त करें पर क्लिक करें।';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-orange-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-4">{t('auth.login.title')}</h1>
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
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('auth.login.title')}
            </h2>
            <p className="text-gray-600">
              {t('auth.login.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Aadhaar Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.login.aadhaar.label')}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={aadhaarNumber}
                  onChange={handleAadhaarChange}
                  placeholder={t('auth.login.aadhaar.placeholder')}
                  className="text-2xl tracking-wider pr-24 h-14 border-orange-200 focus:border-orange-400"
                  maxLength={14}
                  disabled={isLoading}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 hover:bg-orange-50 rounded-full transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`p-2 rounded-full transition-colors ${
                      isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-orange-50'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Virtual Numpad Toggle */}
              <button
                type="button"
                onClick={() => setShowVirtualNumpad(!showVirtualNumpad)}
                className="text-sm text-orange-600 mt-2 hover:underline"
              >
                {showVirtualNumpad ? 'वर्चुअल कीपैड छुपाएं' : 'वर्चुअल कीपैड दिखाएं'}
              </button>

              {/* Virtual Numpad */}
              {showVirtualNumpad && (
                <VirtualNumpad onDigitClick={handleDigitClick} onBackspace={handleBackspace} />
              )}
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked as boolean)}
                className="mt-1 border-orange-300 data-[state=checked]:bg-orange-500"
              />
              <label htmlFor="consent" className="text-sm text-gray-600">
                {t('auth.login.consent')}
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || aadhaarNumber.replace(/\s/g, '').length !== 12 || !consent}
              className="w-full h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-lg font-semibold rounded-xl disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  प्रोसेसिंग...
                </span>
              ) : (
                t('auth.login.submit')
              )}
            </Button>

            {/* Alternative Login */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-orange-600 hover:underline flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                {t('auth.login.jobcard')}
              </button>
            </div>

            {/* Help Link */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-orange-600 flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                {t('auth.login.help')}
              </button>
            </div>
          </form>

          {/* Demo Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              <strong>डेमो के लिए:</strong> आधार नंबर <code className="bg-blue-100 px-2 py-1 rounded">123456789012</code> या <code className="bg-blue-100 px-2 py-1 rounded">987654321098</code> का उपयोग करें और OTP <code className="bg-blue-100 px-2 py-1 rounded">123456</code> दर्ज करें।
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
