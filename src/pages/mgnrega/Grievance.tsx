// SAHAYOG - Grievance Filing Page
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Mic, 
  StopCircle,
  IndianRupee,
  Briefcase,
  AlertTriangle,
  CreditCard,
  MoreHorizontal,
  Upload,
  Send,
  Clock,
  CheckCircle,
  Volume2,
  Bot
} from 'lucide-react';
import { grievanceOperations } from '@/lib/mongodb';

// Grievance Categories
const categories = [
  {
    id: 'payment_delay',
    icon: IndianRupee,
    title: 'पैसा नहीं आया',
    description: 'मजदूरी का भुगतान नहीं हुआ',
    color: 'bg-red-100 text-red-600',
  },
  {
    id: 'no_work',
    icon: Briefcase,
    title: 'काम नहीं मिला',
    description: 'काम मांगा लेकिन नहीं मिला',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: 'harassment',
    icon: AlertTriangle,
    title: 'परेशानी',
    description: 'किसी ने परेशान किया',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'job_card',
    icon: CreditCard,
    title: 'जॉब कार्ड समस्या',
    description: 'जॉब कार्ड से संबंधित',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'other',
    icon: MoreHorizontal,
    title: 'अन्य',
    description: 'कोई और समस्या',
    color: 'bg-gray-100 text-gray-600',
  },
];

export default function Grievance() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiPreFilled, setAiPreFilled] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check if AI assistant pre-filled the grievance
  useEffect(() => {
    if (location.state) {
      const { prefilledText, category } = location.state as { prefilledText?: string; category?: string };
      if (prefilledText) {
        setDescription(prefilledText);
        setAiPreFilled(true);
        toast.success('AI साथी ने शिकायत तैयार कर दी है', {
          description: 'कृपया जांच लें और सबमिट करें',
          icon: <Bot className="h-5 w-5" />,
        });
      }
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [location.state]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      toast.error('माइक्रोफोन एक्सेस नहीं मिला');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      toast.error('कृपया शिकायत की श्रेणी चुनें');
      return;
    }

    if (!description.trim() && !audioBlob) {
      toast.error('कृपया शिकायत का विवरण दें');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const grievanceNumber = `GRV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      toast.success('शिकायत सफलतापूर्वक दर्ज हो गई!', {
        description: `शिकायत नंबर: ${grievanceNumber}`,
      });

      navigate('/mgnrega/grievances');
    } catch (error) {
      toast.error('शिकायत दर्ज करने में त्रुटि');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSpeakInstructions = () => {
    const text = 'शिकायत दर्ज करने के लिए, पहले श्रेणी चुनें। फिर अपनी शिकायत लिखें या माइक्रोफोन बटन दबाकर बोलें।';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center">
          <button 
            onClick={() => navigate('/mgnrega')}
            className="p-2 hover:bg-orange-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-4">शिकायत दर्ज करें</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Instructions Audio */}
        <button
          onClick={handleSpeakInstructions}
          className="flex items-center gap-2 text-orange-600 text-sm hover:underline"
        >
          <Volume2 className="w-4 h-4" />
          निर्देश सुनें
        </button>

        {/* Category Selection */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">शिकायत की श्रेणी</h2>
          <div className="grid grid-cols-1 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  selectedCategory === category.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
                {selectedCategory === category.id && (
                  <CheckCircle className="w-6 h-6 text-orange-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Recording */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">आवाज से बताएं</h2>
          <Card className="p-6 border-orange-100">
            {!isRecording && !audioBlob && (
              <div className="text-center">
                <button
                  onClick={startRecording}
                  className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform"
                >
                  <Mic className="w-8 h-8 text-white" />
                </button>
                <p className="text-gray-600">माइक्रोफोन बटन दबाकर बोलें</p>
                <p className="text-sm text-gray-500">अपनी शिकायत आवाज में रिकॉर्ड करें</p>
              </div>
            )}

            {isRecording && (
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{formatDuration(recordingDuration)}</span>
                  </div>
                </div>
                <p className="text-red-600 font-medium">रिकॉर्डिंग...</p>
                <button
                  onClick={stopRecording}
                  className="mt-4 px-6 py-2 bg-red-100 text-red-600 rounded-full font-medium hover:bg-red-200 transition-colors"
                >
                  <StopCircle className="w-4 h-4 inline mr-2" />
                  रोकें
                </button>
              </div>
            )}

            {audioBlob && !isRecording && (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <p className="text-green-600 font-medium">रिकॉर्डिंग सेव हो गई!</p>
                <p className="text-sm text-gray-500">{formatDuration(recordingDuration)} की रिकॉर्डिंग</p>
                <button
                  onClick={() => {
                    setAudioBlob(null);
                    setRecordingDuration(0);
                  }}
                  className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                >
                  फिर से रिकॉर्ड करें
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Text Description */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">या लिखकर बताएं</h2>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="अपनी शिकायत यहां लिखें..."
            className="min-h-[120px] border-orange-200 focus:border-orange-400"
          />
        </div>

        {/* SLA Info */}
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">5-दिन समाधान वादा</h3>
              <p className="text-sm text-green-700">
                आपकी शिकायत 5 दिनों के अंदर निपटा दी जाएगी। आपको SMS और कॉल के माध्यम से अपडेट मिलता रहेगा।
              </p>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || (!selectedCategory) || (!description.trim() && !audioBlob)}
          className="w-full h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-lg font-semibold rounded-xl disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              भेजा जा रहा है...
            </span>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              शिकायत दर्ज करें
            </>
          )}
        </Button>
      </main>
    </div>
  );
}
