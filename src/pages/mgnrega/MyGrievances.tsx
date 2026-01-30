// SAHAYOG - My Grievances Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronRight,
  Phone,
  MessageSquare
} from 'lucide-react';

// Mock grievances data
const mockGrievances = [
  {
    id: 'GRV-2026-001234',
    category: 'payment_delay',
    categoryLabel: 'पैसा नहीं आया',
    description: 'जनवरी महीने का पैसा अभी तक नहीं आया है। कृपया जांच करें।',
    filedDate: '20 जनवरी 2026',
    status: 'in_progress',
    slaDeadline: '25 जनवरी 2026',
    daysRemaining: 3,
    assignedTo: 'श्री रामप्रसाद (BDO)',
    updates: [
      { date: '20 जनवरी', message: 'शिकायत दर्ज की गई' },
      { date: '21 जनवरी', message: 'BDO को सौंपी गई' },
    ],
  },
  {
    id: 'GRV-2026-001198',
    category: 'no_work',
    categoryLabel: 'काम नहीं मिला',
    description: '30 दिनों से काम नहीं मिला है। कृपया काम उपलब्ध कराएं।',
    filedDate: '15 जनवरी 2026',
    status: 'resolved',
    resolvedDate: '18 जनवरी 2026',
    assignedTo: 'श्री मोहनलाल (PO)',
    resolution: 'नया काम आवंटित: तालाब खुदाई - 20 जनवरी से',
    updates: [
      { date: '15 जनवरी', message: 'शिकायत दर्ज की गई' },
      { date: '16 जनवरी', message: 'PO को सौंपी गई' },
      { date: '18 जनवरी', message: 'समाधान: नया काम आवंटित' },
    ],
  },
  {
    id: 'GRV-2025-008765',
    category: 'job_card',
    categoryLabel: 'जॉब कार्ड समस्या',
    description: 'जॉब कार्ड में पत्नी का नाम जोड़ना है।',
    filedDate: '10 दिसंबर 2025',
    status: 'closed',
    closedDate: '15 दिसंबर 2025',
    assignedTo: 'श्री राजेश कुमार (GRS)',
    resolution: 'पत्नी का नाम जोड़ दिया गया है',
    updates: [
      { date: '10 दिसंबर', message: 'शिकायत दर्ज की गई' },
      { date: '12 दिसंबर', message: 'GRS को सौंपी गई' },
      { date: '15 दिसंबर', message: 'समाधान: नाम जोड़ा गया' },
    ],
  },
];

export default function MyGrievances() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 text-blue-700"><Clock className="w-3 h-3 mr-1" />खुली</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-100 text-amber-700"><Clock className="w-3 h-3 mr-1" />प्रगति में</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />हल हो गई</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-700"><XCircle className="w-3 h-3 mr-1" />बंद</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredGrievances = activeTab === 'all' 
    ? mockGrievances 
    : mockGrievances.filter(g => {
        if (activeTab === 'open') return g.status === 'open' || g.status === 'in_progress';
        if (activeTab === 'resolved') return g.status === 'resolved' || g.status === 'closed';
        return true;
      });

  const handleCallOfficer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/mgnrega')}
              className="p-2 hover:bg-orange-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-4">मेरी शिकायतें</h1>
          </div>
          <button
            onClick={() => navigate('/mgnrega/grievance')}
            className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{mockGrievances.length}</p>
            <p className="text-xs text-gray-600">कुल शिकायतें</p>
          </Card>
          <Card className="p-4 text-center border-amber-200">
            <p className="text-2xl font-bold text-amber-600">
              {mockGrievances.filter(g => g.status === 'open' || g.status === 'in_progress').length}
            </p>
            <p className="text-xs text-gray-600">खुली</p>
          </Card>
          <Card className="p-4 text-center border-green-200">
            <p className="text-2xl font-bold text-green-600">
              {mockGrievances.filter(g => g.status === 'resolved' || g.status === 'closed').length}
            </p>
            <p className="text-xs text-gray-600">हल हो गई</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">सभी</TabsTrigger>
            <TabsTrigger value="open">खुली/प्रगति में</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {filteredGrievances.length > 0 ? (
              filteredGrievances.map((grievance) => (
                <Card key={grievance.id} className="overflow-hidden border-orange-100">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm text-gray-500">{grievance.id}</p>
                        <h3 className="font-semibold text-gray-900">{grievance.categoryLabel}</h3>
                      </div>
                      {getStatusBadge(grievance.status)}
                    </div>
                    <p className="text-sm text-gray-600">{grievance.description}</p>
                  </div>

                  {/* Details */}
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-500">दर्ज की गई:</span>
                      <span className="text-gray-700">{grievance.filedDate}</span>
                    </div>
                    
                    {grievance.status === 'in_progress' && (
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-gray-500">समय सीमा:</span>
                        <span className="text-amber-600 font-medium">
                          {grievance.daysRemaining} दिन बाकी
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-gray-500">अधिकारी:</span>
                      <span className="text-gray-700">{grievance.assignedTo}</span>
                    </div>

                    {/* Updates */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">अपडेट्स:</p>
                      <div className="space-y-2">
                        {grievance.updates.slice(-2).map((update, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5" />
                            <div>
                              <span className="text-gray-500">{update.date}:</span>
                              <span className="text-gray-700 ml-1">{update.message}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resolution */}
                    {grievance.resolution && (
                      <div className="mt-3 p-3 bg-green-100 rounded-lg">
                        <p className="text-sm font-medium text-green-800">समाधान:</p>
                        <p className="text-sm text-green-700">{grievance.resolution}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCallOfficer('1800-XXX-XXXX')}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        कॉल करें
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        मैसेज
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600">कोई शिकायत नहीं</p>
                <p className="text-sm text-gray-500">आपकी सभी शिकायतें हल हो गई हैं</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* New Grievance Button */}
        <Button
          onClick={() => navigate('/mgnrega/grievance')}
          className="w-full h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-lg font-semibold rounded-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          नई शिकायत दर्ज करें
        </Button>
      </main>
    </div>
  );
}
