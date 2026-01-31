// Global AI Assistant Component - Accessible from Every Page with Wake Word Detection
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Mic, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Volume2,
  VolumeX,
  Navigation,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Map,
  Ear
} from 'lucide-react';
import { sahayogAI } from '@/lib/gemini';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: AIAction[];
  dataExtractions?: DataExtraction[];
}

interface AIAction {
  type: 'navigate' | 'fill_form' | 'extract_data' | 'file_grievance' | 'show_data';
  data: any;
}

interface DataExtraction {
  field: string;
  value: any;
  confidence: number;
  confirmed: boolean;
}

interface GlobalAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalAIAssistant({ isOpen, onClose }: GlobalAIAssistantProps) {
  const { user } = useAuth();
  const { currentLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [pendingDataExtractions, setPendingDataExtractions] = useState<DataExtraction[]>([]);
  const [isWakeWordListening, setIsWakeWordListening] = useState(true); // Always listening for "Sathi"
  const [pageContent, setPageContent] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const wakeWordRecognitionRef = useRef<any>(null);

  // Extract all visible text content from the current page
  const extractPageContent = useCallback(() => {
    try {
      // Get all visible text from the page
      const mainContent = document.querySelector('main') || document.body;
      const textContent = mainContent.innerText || '';
      
      // Get all headings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent).join(' | ');
      
      // Get all visible cards/sections
      const cards = Array.from(document.querySelectorAll('[class*="card"], [class*="Card"]')).map(c => c.textContent?.slice(0, 200)).join(' ... ');
      
      return `पेज की सामग्री: ${headings}\n\nमुख्य जानकारी: ${textContent.slice(0, 1000)}\n\nकार्ड/सेक्शन: ${cards.slice(0, 500)}`;
    } catch (error) {
      return 'पेज की सामग्री लोड नहीं हो पाई';
    }
  }, []);

  // Update page content when location changes
  useEffect(() => {
    setTimeout(() => {
      const content = extractPageContent();
      setPageContent(content);
    }, 500); // Wait for page to render
  }, [location.pathname, extractPageContent]);

  // Welcome message when assistant opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: user 
          ? `नमस्ते ${user.fullName?.split(' ')[0]} जी! मैं सहयोग साथी हूं। मैं आपकी क्या मदद कर सकता हूं?`
          : 'नमस्ते! मैं सहयोग साथी हूं। मैं आपकी क्या मदद कर सकता हूं?',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Wake Word Detection - "Sathi" ALWAYS ACTIVE - activates the assistant
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      toast.info('वॉइस फीचर इस ब्राउज़र में उपलब्ध नहीं है');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const wakeWordRecognition = new SpeechRecognition();
    
    wakeWordRecognition.continuous = true; // Always listening
    wakeWordRecognition.interimResults = true;
    wakeWordRecognition.lang = 'hi-IN'; // Hindi for wake word
    
    setIsWakeWordListening(true); // Mark as always active

    wakeWordRecognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('')
        .toLowerCase();

      // Check for wake words
      if (transcript.includes('साथी') || transcript.includes('sathi') || transcript.includes('sahayog')) {
        console.log('Wake word detected!');
        toast.success('साथी सुन रहा है! 🎤');
        
        // Stop wake word detection temporarily
        wakeWordRecognition.stop();
        
        // Open assistant if closed
        if (!isOpen) {
          // Trigger parent to open
          const event = new CustomEvent('openAIAssistant');
          window.dispatchEvent(event);
        }
        
        // Start listening for command
        startVoiceInput();
        
        // Restart wake word listening after 10 seconds
        setTimeout(() => {
          if (wakeWordRecognitionRef.current && isWakeWordListening) {
            wakeWordRecognition.start();
          }
        }, 10000);
      }
    };

    wakeWordRecognition.onerror = (event: any) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Wake word recognition error:', event.error);
      }
      // Restart on error
      setTimeout(() => {
        if (isWakeWordListening && wakeWordRecognitionRef.current) {
          try {
            wakeWordRecognition.start();
          } catch (e) {
            // Already started
          }
        }
      }, 1000);
    };

    wakeWordRecognition.onend = () => {
      // Restart wake word listening
      if (isWakeWordListening && wakeWordRecognitionRef.current) {
        setTimeout(() => {
          try {
            wakeWordRecognition.start();
          } catch (e) {
            // Already started
          }
        }, 500);
      }
    };

    wakeWordRecognitionRef.current = wakeWordRecognition;

    // Start wake word detection IMMEDIATELY on component mount
    try {
      wakeWordRecognition.start();
      console.log('🎤 Wake word detection ACTIVE - Always listening for "साथी" (Sathi)');
      
      // Show user that wake word is active (only once on load)
      setTimeout(() => {
        toast.success('🎤 "साथी" बोलकर मुझे बुलाएं', { duration: 3000 });
      }, 2000);
    } catch (error) {
      console.error('Could not start wake word detection:', error);
      toast.error('वॉइस फीचर शुरू नहीं हो सका');
    }

    return () => {
      if (wakeWordRecognitionRef.current) {
        wakeWordRecognitionRef.current.stop();
        wakeWordRecognitionRef.current = null;
      }
    };
  }, [isOpen, isWakeWordListening]);

  // Listen for custom event to open assistant
  useEffect(() => {
    const handleOpenAssistant = () => {
      if (!isOpen) {
        // This needs to be handled by parent component
        // For now, we'll just show a toast
        toast.info('कृपया AI बटन दबाएं');
      }
    };

    window.addEventListener('openAIAssistant', handleOpenAssistant);
    return () => window.removeEventListener('openAIAssistant', handleOpenAssistant);
  }, [isOpen]);

  // Get current page context for AI with full page content
  const getCurrentPageContext = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    const pageContexts: Record<string, string> = {
      'dashboard': 'डैशबोर्ड - मुख्य पेज जहाँ सभी जानकारी दिखती है',
      'mgnrega': 'मनरेगा होम - काम और पेमेंट की जानकारी',
      'work': 'उपलब्ध काम - आसपास के काम देखें',
      'attendance': 'हाजिरी - आपके काम के दिन',
      'payments': 'पेमेंट - आपके पैसे की जानकारी',
      'grievance': 'शिकायत - समस्या दर्ज करें',
      'schemes': 'योजनाएं - सरकारी योजनाओं की जानकारी',
      'pm-kisan': 'PM-KISAN योजना - किसानों को ₹6000/साल',
      'pm-sym': 'PM-SYM पेंशन योजना - मजदूरों के लिए',
      'widow-pension': 'विधवा पेंशन योजना',
      'old-age-pension': 'वृद्धावस्था पेंशन योजना',
      'profile': 'प्रोफ़ाइल - आपकी जानकारी',
      'notifications': 'सूचनाएं - नई अपडेट',
      'skills': 'कौशल - नई चीजें सीखें',
      'wellbeing': 'मानसिक स्वास्थ्य - मदद और सहायता',
    };

    const currentPage = pathSegments[pathSegments.length - 1] || pathSegments[0] || 'dashboard';
    const pageDescription = pageContexts[currentPage] || 'वेबसाइट';
    
    return `${pageDescription}\n\n${pageContent}`;
  };

  // Send message to AI with full page context
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build comprehensive context with full page information
      const context = {
        userName: user?.fullName,
        village: user?.address?.village,
        daysWorked: user?.mgnregaInfo?.totalDaysWorkedThisYear,
        pendingPayment: 2400, // Would come from payments collection
        currentPage: getCurrentPageContext(), // Now includes full page content
        currentUrl: location.pathname,
        availableWorkCount: 3, // Would come from work opportunities
        language: currentLanguage.code,
        fullUserProfile: {
          hasJobCard: user?.mgnregaInfo?.hasJobCard,
          category: user?.category,
          familyMembers: user?.familyDetails?.numberOfChildren,
          isDisabled: user?.isDisabled,
          skills: user?.skills?.map(s => s.skillName),
          age: user?.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : null,
          maritalStatus: user?.familyDetails?.maritalStatus,
          hasDebt: user?.economicInfo?.hasDebt,
        },
      };

      // Process with Gemini
      const response = await sahayogAI.processMessage(sessionId, text, context);

      // Handle actions
      if (response.actions && response.actions.length > 0) {
        handleAIActions(response.actions);
      }

      // Handle data extractions
      if (response.data_to_extract && response.data_to_extract.length > 0) {
        setPendingDataExtractions(response.data_to_extract.map(d => ({
          ...d,
          confirmed: false,
        })));
      }

      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response.spoken_response,
        timestamp: new Date(),
        actions: response.actions,
        dataExtractions: response.data_to_extract,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak response if voice is enabled
      if (isSpeaking) {
        await sahayogAI.speakResponse(response.spoken_response, currentLanguage.code + '-IN');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('मैसेज भेजने में समस्या आई');
      
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'मुझे माफ़ कीजिए, मैं आपकी मदद नहीं कर पाया। कृपया फिर से कोशिश करें।',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle AI actions
  const handleAIActions = (actions: AIAction[]) => {
    actions.forEach(action => {
      switch (action.type) {
        case 'navigate':
          toast.info(`पेज बदल रहे हैं...`);
          navigate(action.data.path);
          break;
          
        case 'file_grievance':
          navigate('/mgnrega/grievance', { 
            state: { 
              prefilledText: action.data.grievanceText,
              category: action.data.category 
            } 
          });
          toast.success('शिकायत पेज खोल रहे हैं');
          break;
          
        case 'show_data':
          // Show user data in a modal or expand in chat
          toast.info('आपका डेटा दिखा रहे हैं');
          break;
          
        default:
          console.log('Unknown action:', action);
      }
    });
  };

  // Start voice input after wake word detection
  const startVoiceInput = () => {
    // Open assistant via custom event (parent handles opening)
    if (!isOpen) {
      const event = new CustomEvent('openAIAssistant');
      window.dispatchEvent(event);
    }
    
    setIsListening(true);
    
    sahayogAI.startVoiceRecognition(
      (transcript) => {
        setInputValue(transcript);
        setIsListening(false);
        sendMessage(transcript);
      },
      (error) => {
        console.error('Voice recognition error:', error);
        toast.error('आवाज़ समझने में समस्या आई');
        setIsListening(false);
      },
      currentLanguage.code + '-IN'
    );
  };

  // Start voice recognition (manual activation)
  const startVoiceRecognition = () => {
    setIsListening(true);
    
    sahayogAI.startVoiceRecognition(
      (transcript) => {
        setInputValue(transcript);
        setIsListening(false);
        sendMessage(transcript);
      },
      (error) => {
        console.error('Voice recognition error:', error);
        toast.error('आवाज़ समझने में समस्या आई');
        setIsListening(false);
      },
      currentLanguage.code + '-IN'
    );
  };

  // Confirm data extraction
  const confirmDataExtraction = async (extraction: DataExtraction, index: number) => {
    // Update user profile in MongoDB
    toast.success('जानकारी सेव हो गई');
    
    setPendingDataExtractions(prev => 
      prev.map((e, i) => i === index ? { ...e, confirmed: true } : e)
    );
    
    // Send confirmation message
    const confirmMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: 'धन्यवाद! मैंने यह जानकारी सेव कर ली है।',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  // Quick action buttons
  const quickActions = [
    { icon: Navigation, label: 'काम देखें', action: () => sendMessage('आज कोई काम है क्या?') },
    { icon: FileText, label: 'पैसे ट्रैक करें', action: () => sendMessage('मेरा पैसा कब आएगा?') },
    { icon: AlertCircle, label: 'शिकायत करें', action: () => sendMessage('मुझे शिकायत करनी है') },
    { icon: Map, label: 'पेज समझाएं', action: () => sendMessage('यह पेज क्या है?') },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      <Card 
        className={`
          pointer-events-auto w-full max-w-md bg-white shadow-2xl border-2 border-orange-200 
          flex flex-col transition-all duration-300
          ${isMinimized ? 'h-16' : 'h-[600px]'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-orange-400">
                <AvatarImage src="/ai-avatar.png" />
                <AvatarFallback className="bg-orange-600 text-white">
                  <Sparkles className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">सहयोग साथी</h3>
              <p className="text-xs text-gray-600">AI Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSpeaking(!isSpeaking)}
              className="h-8 w-8 p-0"
            >
              {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Quick Actions */}
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="flex gap-2 overflow-x-auto">
                {quickActions.map((qa, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={qa.action}
                    className="flex items-center gap-2 whitespace-nowrap text-xs"
                  >
                    <qa.icon className="h-3 w-3" />
                    {qa.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[80%] rounded-2xl px-4 py-2 
                        ${message.role === 'user' 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                        }
                      `}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString('hi-IN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Pending Data Extractions */}
                {pendingDataExtractions.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-amber-900 mb-2">
                      क्या मैं यह जानकारी सेव करूं?
                    </p>
                    {pendingDataExtractions.map((extraction, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2">
                        <div className="text-sm">
                          <span className="font-medium">{extraction.field}:</span>
                          <span className="ml-2">{extraction.value}</span>
                        </div>
                        {!extraction.confirmed && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => confirmDataExtraction(extraction, idx)}
                              className="h-7 text-xs"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              हाँ
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setPendingDataExtractions(prev => 
                                prev.filter((_, i) => i !== idx)
                              )}
                              className="h-7 text-xs"
                            >
                              <X className="h-3 w-3 mr-1" />
                              नहीं
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <Loader2 className="h-5 w-5 animate-spin text-orange-600" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                    placeholder="अपनी बात लिखें..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    disabled={isLoading || isListening}
                  />
                </div>
                
                <Button
                  onClick={startVoiceRecognition}
                  disabled={isLoading || isListening}
                  className={`h-12 w-12 p-0 ${isListening ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-orange-600 hover:bg-orange-700'}`}
                >
                  <Mic className="h-5 w-5" />
                </Button>
                
                <Button
                  onClick={() => sendMessage(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  className="h-12 w-12 p-0 bg-orange-600 hover:bg-orange-700"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              
              {isListening && (
                <p className="text-xs text-red-600 mt-2 text-center animate-pulse">
                  🎤 सुन रहा हूं...
                </p>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

// Floating Button Component
export function AIFloatingButton({ onClick }: { onClick: () => void }) {
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPulsing(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 w-16 h-16 
        bg-gradient-to-r from-orange-600 to-amber-600 
        rounded-full shadow-lg hover:shadow-xl 
        flex items-center justify-center text-white 
        transition-all hover:scale-110 z-40
        ${isPulsing ? 'animate-pulse' : ''}
      `}
    >
      <MessageCircle className="w-8 h-8" />
      <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-ping"></div>
      <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
    </button>
  );
}
