// SAHAYOG - Help & Support Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Search, 
  Phone, 
  MessageCircle,
  Video,
  FileText,
  ChevronRight,
  Play,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

// FAQ Data
const faqData = [
  {
    question: 'MGNREGA में काम कैसे मांगें?',
    answer: 'आप सहयोग ऐप में "उपलब्ध काम" सेक्शन में जाकर काम के लिए आवेदन कर सकते हैं। या अपने ग्राम रोजगार सेवक (GRS) से संपर्क करें।',
  },
  {
    question: 'पैसा नहीं आया तो क्या करें?',
    answer: 'सबसे पहले अपने बैंक खाते की जांच करें। अगर पैसा नहीं आया है तो "शिकायत" सेक्शन में जाकर शिकायत दर्ज करें। 5 दिनों में समाधान होगा।',
  },
  {
    question: 'जॉब कार्ड कैसे बनवाएं?',
    answer: 'अपने ग्राम पंचायत कार्यालय में जाएं और आवेदन फॉर्म भरें। आधार कार्ड, राशन कार्ड और पासपोर्ट साइज फोटो ले जाएं।',
  },
  {
    question: 'उपस्थिति कैसे दर्ज होती है?',
    answer: 'कार्यस्थल पर मौजूद मेट (MATE) आपकी उपस्थिति दर्ज करता है। आप सहयोग ऐप में अपनी उपस्थिति देख सकते हैं।',
  },
  {
    question: 'कौन सी योजनाओं के लिए पात्र हूं?',
    answer: 'सहयोग ऐप में "योजनाएं" सेक्शन में जाएं। आपकी प्रोफाइल के आधार पर पात्र योजनाएं दिखाई देंगी।',
  },
  {
    question: 'आवाज से ऐप कैसे चलाएं?',
    answer: 'किसी भी पेज पर माइक्रोफोन बटन दबाएं और बोलें। AI सहायक आपकी मदद करेगा।',
  },
];

// Emergency Contacts
const emergencyContacts = [
  { name: 'महिला हेल्पलाइन', number: '181', description: '24/7 महिला सहायता' },
  { name: 'पुलिस', number: '100', description: 'आपातकालीन सेवा' },
  { name: 'एम्बुलेंस', number: '108', description: 'चिकित्सा आपातकाल' },
  { name: 'MGNREGA हेल्पलाइन', number: '1800-XXX-XXXX', description: 'रोजगार संबंधी शिकायत' },
];

// Video Tutorials
const videoTutorials = [
  { title: 'सहयोग ऐप का परिचय', duration: '3:45', thumbnail: 'intro' },
  { title: 'काम के लिए आवेदन कैसे करें', duration: '2:30', thumbnail: 'apply' },
  { title: 'शिकायत दर्ज करना', duration: '4:15', thumbnail: 'grievance' },
  { title: 'भुगतान ट्रैक करना', duration: '2:50', thumbnail: 'payment' },
];

export default function Help() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('faq');

  const filteredFaqs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
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
            <h1 className="text-xl font-bold text-gray-900 ml-4">मदद और सहायता</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="सवाल खोजें..."
              className="pl-10 border-orange-200 focus:border-orange-400"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setActiveTab('faq')}
            className={`p-4 rounded-xl text-center transition-colors ${
              activeTab === 'faq' ? 'bg-orange-500 text-white' : 'bg-white border border-orange-100'
            }`}
          >
            <FileText className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">FAQ</span>
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`p-4 rounded-xl text-center transition-colors ${
              activeTab === 'videos' ? 'bg-orange-500 text-white' : 'bg-white border border-orange-100'
            }`}
          >
            <Video className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">वीडियो</span>
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`p-4 rounded-xl text-center transition-colors ${
              activeTab === 'emergency' ? 'bg-orange-500 text-white' : 'bg-white border border-orange-100'
            }`}
          >
            <Phone className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">संपर्क</span>
          </button>
        </div>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">अक्सर पूछे जाने वाले प्रश्न</h2>
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-2">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-xl border border-orange-100 px-4">
                    <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">कोई परिणाम नहीं मिला</p>
              </div>
            )}
          </div>
        )}

        {/* Videos Section */}
        {activeTab === 'videos' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">वीडियो ट्यूटोरियल</h2>
            <div className="space-y-4">
              {videoTutorials.map((video, index) => (
                <Card key={index} className="overflow-hidden border-orange-100">
                  <div className="aspect-video bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center relative">
                    <button 
                      onClick={() => toast.info('वीडियो जल्द ही उपलब्ध होगा')}
                      className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Play className="w-8 h-8 text-orange-600 ml-1" />
                    </button>
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{video.title}</h3>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Contacts */}
        {activeTab === 'emergency' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">आपातकालीन संपर्क</h2>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="p-4 border-red-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <Phone className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-500">{contact.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCall(contact.number)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {contact.number}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Important Notice */}
            <Card className="p-4 bg-amber-50 border-amber-200 mt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800">महत्वपूर्ण सूचना</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    आपातकालीन स्थिति में तुरंत 100 (पुलिस) या 108 (एम्बुलेंस) पर कॉल करें। 
                    सहयोग ऐप केवल रोजगार और कल्याण योजनाओं की जानकारी के लिए है।
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Contact Support */}
        <Card className="p-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">AI सहायक से बात करें</h3>
              <p className="text-sm text-orange-100">24/7 उपलब्ध</p>
            </div>
            <Button 
              variant="secondary"
              onClick={() => navigate('/dashboard')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              शुरू करें
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
