// SAHAYOG - OTP Verification Page
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Shield, Volume2, Timer } from 'lucide-react';

export default function OTPPage() {
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();
  const { t } = useLanguage();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (index === 5 && value) {
      const fullOtp = [...newOtp.slice(0, 5), value].join('');
      if (fullOtp.length === 6) {
        handleSubmit(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);
    
    // Focus the next empty input or last input
    const nextEmptyIndex = newOtp.findIndex(d => !d);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }

    // Auto-submit if complete
    if (pastedData.length === 6) {
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (fullOtp: string) => {
    setIsLoading(true);
    
    try {
      await verifyOTP(fullOtp);
      toast.success('सत्यापन सफल!');
      navigate('/auth/confirm-profile');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'OTP सत्यापन में त्रुटि');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    
    setTimer(30);
    setCanResend(false);
    toast.success('OTP फिर से भेज दिया गया है');
  };

  const handleSpeakInstructions = () => {
    const text = 'आपके मोबाइल नंबर पर छह अंकों का ओटीपी भेजा गया है। कृपया उसे यहां दर्ज करें।';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const maskedPhone = '******1234'; // This would come from actual API

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center">
          <button 
            onClick={() => navigate('/auth/login')}
            className="p-2 hover:bg-orange-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-4">{t('auth.otp.title')}</h1>
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
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('auth.otp.title')}
            </h2>
            <p className="text-gray-600">
              {t('auth.otp.subtitle')}
            </p>
            <p className="text-orange-600 font-medium mt-2">
              OTP भेजा गया: {maskedPhone}
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              {t('auth.otp.label')}
            </label>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isLoading}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                />
              ))}
            </div>
          </div>

          {/* Resend Timer */}
          <div className="text-center mb-6">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-orange-600 font-medium hover:underline"
              >
                {t('auth.otp.resend')}
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Timer className="w-4 h-4" />
                <span>{t('auth.otp.timer')}: {timer}s</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={() => handleSubmit(otp.join(''))}
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-lg font-semibold rounded-xl disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                सत्यापित कर रहा है...
              </span>
            ) : (
              t('auth.otp.submit')
            )}
          </Button>

          {/* Demo Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              <strong>डेमो के लिए:</strong> OTP <code className="bg-blue-100 px-2 py-1 rounded">123456</code> दर्ज करें
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
