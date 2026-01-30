// SAHAYOG - Mental Wellbeing Support Module
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Heart,
  Phone,
  MessageCircle,
  Users,
  Music,
  BookOpen,
  Sun,
  Moon,
  Activity,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Clock
} from 'lucide-react';

// Mental wellbeing resources
const wellbeingResources = [
  {
    id: 'resource001',
    type: 'breathing',
    title: 'श्वास व्यायाम',
    description: '4-7-8 तकनीक - तनाव कम करें',
    duration: 5,
    icon: Activity,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'resource002',
    type: 'meditation',
    title: 'ध्यान',
    description: '10 मिनट शांति ध्यान',
    duration: 10,
    icon: Sun,
    color: 'bg-amber-100 text-amber-600',
  },
  {
    id: 'resource003',
    type: 'music',
    title: 'शांत संगीत',
    description: 'मानसिक शांति के लिए',
    duration: 15,
    icon: Music,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'resource004',
    type: 'story',
    title: 'प्रेरक कहानी',
    description: 'हिम्मत न हारें',
    duration: 8,
    icon: BookOpen,
    color: 'bg-green-100 text-green-600',
  },
];

// Emergency contacts
const emergencyContacts = [
  { name: 'महिला हेल्पलाइन', number: '181', available: '24/7', type: 'women' },
  { name: 'मानसिक स्वास्थ्य हेल्पलाइन', number: '1800-599-0019', available: '24/7', type: 'mental' },
  { name: 'सहयोग सहायता', number: '1800-XXX-XXXX', available: '8AM-8PM', type: 'sahayog' },
];

// Stress assessment questions
const stressQuestions = [
  {
    id: 1,
    question: 'क्या आपको अक्सर चिंता होती है?',
    options: ['कभी नहीं', 'कभी-कभी', 'अक्सर', 'हमेशा'],
  },
  {
    id: 2,
    question: 'क्या आप रात को अच्छी नींद ले पाते हैं?',
    options: ['हां, अच्छी नींद', 'कभी-कभी', 'कम नींद', 'बहुत कम'],
  },
  {
    id: 3,
    question: 'क्या आपको अपने काम से तनाव है?',
    options: ['बिल्कुल नहीं', 'थोड़ा', 'काफी', 'बहुत ज्यादा'],
  },
  {
    id: 4,
    question: 'क्या आप परिवार के साथ समय बिता पाते हैं?',
    options: ['हां, बहुत', 'कभी-कभी', 'कम', 'बिल्कुल नहीं'],
  },
];

export default function MentalWellbeing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  const handleStartSession = (resourceId: string) => {
    setActiveSession(resourceId);
    setSessionProgress(0);
    setIsPlaying(true);
    toast.success('सत्र शुरू हो गया है');
  };

  const handleStopSession = () => {
    setActiveSession(null);
    setIsPlaying(false);
    setSessionProgress(0);
  };

  const handleAnswerQuestion = (score: number) => {
    setAssessmentScore(prev => prev + score);
    if (currentQuestion < stressQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setAssessmentComplete(true);
    }
  };

  const getWellbeingScore = () => {
    const maxScore = stressQuestions.length * 3;
    const percentage = ((maxScore - assessmentScore) / maxScore) * 100;
    return Math.round(percentage);
  };

  const getWellbeingStatus = () => {
    const score = getWellbeingScore();
    if (score >= 80) return { label: 'उत्कृष्ट', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { label: 'अच्छा', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { label: 'ठीक', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { label: 'ध्यान दें', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  if (showAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <header className="bg-white border-b border-orange-100 px-4 py-4 sticky top-0 z-40">
          <div className="max-w-lg mx-auto flex items-center">
            <button 
              onClick={() => setShowAssessment(false)}
              className="p-2 hover:bg-orange-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-4">तनाव मूल्यांकन</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6">
          {!assessmentComplete ? (
            <Card className="p-6">
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>प्रश्न {currentQuestion + 1} / {stressQuestions.length}</span>
                  <span>{Math.round(((currentQuestion + 1) / stressQuestions.length) * 100)}%</span>
                </div>
                <Progress value={((currentQuestion + 1) / stressQuestions.length) * 100} className="h-2" />
              </div>

              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {stressQuestions[currentQuestion].question}
              </h2>

              <div className="space-y-3">
                {stressQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerQuestion(index)}
                    className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500">
                <Heart className="w-12 h-12 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">मूल्यांकन पूरा!</h2>
              
              <div className="my-6">
                <p className="text-gray-600 mb-2">आपका मानसिक स्वास्थ्य स्कोर</p>
                <p className="text-5xl font-bold text-orange-600">{getWellbeingScore()}%</p>
                <Badge className={`mt-3 ${getWellbeingStatus().bgColor} ${getWellbeingStatus().color}`}>
                  {getWellbeingStatus().label}
                </Badge>
              </div>

              <div className="text-left p-4 bg-orange-50 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">सुझाव:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {getWellbeingScore() < 60 && (
                    <>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                        रोजाना 15 मिनट ध्यान करें
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                        पर्याप्त नींद लें (7-8 घंटे)
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                        परिवार/दोस्तों से बात करें
                      </li>
                    </>
                  )}
                  {getWellbeingScore() >= 60 && (
                    <>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        आपका मानसिक स्वास्थ्य अच्छा है!
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        नियमित व्यायाम जारी रखें
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <Button 
                onClick={() => {
                  setShowAssessment(false);
                  setAssessmentComplete(false);
                  setCurrentQuestion(0);
                  setAssessmentScore(0);
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600"
              >
                वापस जाएं
              </Button>
            </Card>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold ml-4">मानसिक स्वास्थ्य</h1>
          </div>
          <p className="text-pink-100">आपकी भावनाएं मायने रखती हैं</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Wellbeing Score Card */}
        <Card className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">आज का मूड</h2>
              <p className="text-sm text-gray-500">कैसा महसूस कर रहे हैं?</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <Button 
            onClick={() => setShowAssessment(true)}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500"
          >
            <Activity className="w-4 h-4 mr-2" />
            तनाव मूल्यांकन करें
          </Button>
        </Card>

        {/* Active Session */}
        {activeSession && (
          <Card className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  {isPlaying ? <Activity className="w-5 h-5 animate-pulse" /> : <Pause className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium">
                    {wellbeingResources.find(r => r.id === activeSession)?.title}
                  </p>
                  <p className="text-sm text-blue-100">सत्र जारी...</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
            </div>
            <Progress value={sessionProgress} className="h-2 bg-white/20" />
            <div className="flex justify-between mt-2 text-sm text-blue-100">
              <span>{Math.round(sessionProgress)}%</span>
              <button onClick={handleStopSession} className="hover:underline">
                रोकें
              </button>
            </div>
          </Card>
        )}

        {/* Wellbeing Resources */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">शांति अभ्यास</h2>
          <div className="grid grid-cols-2 gap-3">
            {wellbeingResources.map((resource) => (
              <Card 
                key={resource.id} 
                onClick={() => handleStartSession(resource.id)}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${resource.color} flex items-center justify-center mb-3`}>
                  <resource.icon className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-gray-900 text-sm">{resource.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{resource.description}</p>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {resource.duration} मिनट
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">आपातकालीन संपर्क</h2>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      contact.type === 'women' ? 'bg-pink-100 text-pink-600' :
                      contact.type === 'mental' ? 'bg-blue-100 text-blue-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{contact.name}</h3>
                      <p className="text-xs text-gray-500">{contact.available}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleCall(contact.number)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {contact.number}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Groups */}
        <Card className="p-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">सहायता समूह</h3>
              <p className="text-sm text-purple-100">एक-दूसरे की मदद करें</p>
            </div>
          </div>
          <p className="text-sm text-purple-100 mb-4">
            अपने अनुभव साझा करें और दूसरों से सीखें। आप अकेले नहीं हैं।
          </p>
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => toast.info('सहायता समूह जल्द ही उपलब्ध होगा')}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            समूह से जुड़ें
          </Button>
        </Card>

        {/* Daily Tips */}
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">आज का सुझाव</h3>
              <p className="text-sm text-green-700 mt-1">
                हर दिन कम से कम 10 मिनट खुद के लिए निकालें। चाहे ध्यान करें, टहलने जाएं, 
                या बस शांति से बैठें। आपकी मानसिक स्वास्थ्य उतनी ही जरूरी है जितनी शारीरिक स्वास्थ्य।
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
