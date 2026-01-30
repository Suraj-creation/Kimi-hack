// SAHAYOG - Admin Dashboard for Officials
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  LayoutDashboard,
  Users,
  Briefcase,
  AlertCircle,
  IndianRupee,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Phone,
  MessageSquare,
  FileText,
  Shield,
  AlertTriangle
} from 'lucide-react';

// Mock admin data
const mockStats = {
  totalWorkers: 5240,
  activeWorkers: 3892,
  pendingGrievances: 47,
  atRiskGrievances: 12,
  pendingPayments: 234,
  workSites: 28,
  womenPercentage: 38,
  scStPercentage: 42,
  avgDaysWorked: 46,
  fraudAlerts: 3,
  fairnessScore: 94,
};

// Mock grievances for officials
const mockGrievances = [
  {
    id: 'GRV-2026-001234',
    userName: 'रामलाल प्रसाद',
    village: 'रामपुर',
    category: 'payment_delay',
    categoryLabel: 'पैसा नहीं आया',
    description: '15 दिनों से पैसा नहीं आया',
    filedDate: '20 जनवरी 2026',
    slaDeadline: '25 जनवरी 2026',
    daysRemaining: 2,
    status: 'in_progress',
    assignedTo: 'श्री रामप्रसाद',
    priority: 'high',
    phone: '9876543210',
  },
  {
    id: 'GRV-2026-001235',
    userName: 'सुनीता देवी',
    village: 'मोहनपुर',
    category: 'harassment',
    categoryLabel: 'परेशानी',
    description: 'कार्यस्थल पर अनुचित व्यवहार',
    filedDate: '21 जनवरी 2026',
    slaDeadline: '26 जनवरी 2026',
    daysRemaining: 3,
    status: 'open',
    assignedTo: null,
    priority: 'critical',
    phone: '8765432109',
  },
  {
    id: 'GRV-2026-001198',
    userName: 'मोहन सिंह',
    village: 'गोपालपुर',
    category: 'no_work',
    categoryLabel: 'काम नहीं मिला',
    description: '30 दिनों से काम नहीं मिला',
    filedDate: '15 जनवरी 2026',
    slaDeadline: '20 जनवरी 2026',
    daysRemaining: -2,
    status: 'in_progress',
    assignedTo: 'श्री मोहनलाल',
    priority: 'high',
    phone: '7654321098',
  },
];

// Mock work allocation data
const mockWorkAllocations = [
  {
    workId: 'WORK-001',
    workName: 'तालाब खुदाई',
    village: 'रामपुर',
    totalSlots: 50,
    allocated: 42,
    womenAllocated: 18,
    scStAllocated: 22,
    pendingApplications: 15,
    startDate: '1 फरवरी 2026',
    status: 'upcoming',
  },
  {
    workId: 'WORK-002',
    workName: 'सड़क निर्माण',
    village: 'मोहनपुर',
    totalSlots: 80,
    allocated: 65,
    womenAllocated: 24,
    scStAllocated: 32,
    pendingApplications: 23,
    startDate: '5 फरवरी 2026',
    status: 'upcoming',
  },
];

// Mock fraud alerts
const mockFraudAlerts = [
  {
    id: 'FRAUD-001',
    userName: 'अजय कुमार',
    aadhaar: 'XXXX-XXXX-9012',
    riskLevel: 'HIGH',
    signals: ['Ghost Worker Pattern', 'Shared Phone'],
    probability: 0.85,
    detectedAt: '22 जनवरी 2026',
  },
  {
    id: 'FRAUD-002',
    userName: 'प्रिया शर्मा',
    aadhaar: 'XXXX-XXXX-3456',
    riskLevel: 'MEDIUM',
    signals: ['Location Fraud'],
    probability: 0.62,
    detectedAt: '21 जनवरी 2026',
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAssignGrievance = (grievanceId: string) => {
    toast.success(`शिकायत ${grievanceId} को सौंपा गया`);
  };

  const handleResolveGrievance = (grievanceId: string) => {
    toast.success(`शिकायत ${grievanceId} हल हो गई`);
  };

  const handleCallUser = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-600 text-white"><AlertTriangle className="w-3 h-3 mr-1" />क्रिटिकल</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 text-white">उच्च</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 text-white">मध्यम</Badge>;
      default:
        return <Badge className="bg-blue-500 text-white">सामान्य</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 text-blue-700"><Clock className="w-3 h-3 mr-1" />खुली</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-100 text-amber-700"><Clock className="w-3 h-3 mr-1" />प्रगति में</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />हल</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">सहयोग - अधिकारी डैशबोर्ड</h1>
              <p className="text-sm text-orange-100">ब्लॉक वाराणसी, उत्तर प्रदेश</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/20 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">5</span>
            </button>
            <button className="p-2 hover:bg-white/20 rounded-full">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/20 rounded-full"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">अवलोकन</TabsTrigger>
            <TabsTrigger value="grievances">शिकायतें</TabsTrigger>
            <TabsTrigger value="allocations">आवंटन</TabsTrigger>
            <TabsTrigger value="fraud">धोखाधड़ी</TabsTrigger>
            <TabsTrigger value="analytics">विश्लेषण</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">कुल श्रमिक</p>
                    <p className="text-2xl font-bold">{mockStats.totalWorkers.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-white/50" />
                </div>
                <p className="text-sm text-blue-100 mt-2">{mockStats.activeWorkers.toLocaleString()} सक्रिय</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-red-500 to-rose-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">खुली शिकायतें</p>
                    <p className="text-2xl font-bold">{mockStats.pendingGrievances}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-white/50" />
                </div>
                <p className="text-sm text-red-100 mt-2">{mockStats.atRiskGrievances} जोखिम में</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">बाकी भुगतान</p>
                    <p className="text-2xl font-bold">{mockStats.pendingPayments}</p>
                  </div>
                  <IndianRupee className="w-8 h-8 text-white/50" />
                </div>
                <p className="text-sm text-green-100 mt-2">₹12.5 लाख</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">काम के स्थल</p>
                    <p className="text-2xl font-bold">{mockStats.workSites}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-white/50" />
                </div>
                <p className="text-sm text-purple-100 mt-2">12 नए इस सप्ताह</p>
              </Card>
            </div>

            {/* Fairness & Fraud Stats */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    निष्पक्षता स्कोर
                  </h3>
                  <Badge className="bg-green-100 text-green-700">{mockStats.fairnessScore}%</Badge>
                </div>
                <Progress value={mockStats.fairnessScore} className="h-3 mb-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">महिलाएं</p>
                    <p className="font-semibold">{mockStats.womenPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">SC/ST</p>
                    <p className="font-semibold">{mockStats.scStPercentage}%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    धोखाधड़ी अलर्ट
                  </h3>
                  <Badge className="bg-red-100 text-red-700">{mockStats.fraudAlerts} नए</Badge>
                </div>
                <div className="space-y-2">
                  {mockFraudAlerts.slice(0, 2).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${alert.riskLevel === 'HIGH' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                        <span className="text-sm font-medium">{alert.userName}</span>
                      </div>
                      <Badge className={alert.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}>
                        {alert.riskLevel}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">हाल की गतिविधि</h3>
              <div className="space-y-3">
                {[
                  { action: 'नया काम आवंटित', detail: 'तालाब खुदाई - 15 श्रमिक', time: '10 मिनट पहले', type: 'work' },
                  { action: 'शिकायत हल हुई', detail: 'GRV-2026-001198 - भुगतान', time: '30 मिनट पहले', type: 'grievance' },
                  { action: 'धोखाधड़ी अलर्ट', detail: 'अजय कुमार - HIGH रिस्क', time: '1 घंटा पहले', type: 'fraud' },
                  { action: 'भुगतान प्रक्रिया', detail: '₹2.4 लाख - 234 श्रमिक', time: '2 घंटे पहले', type: 'payment' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.type === 'work' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'grievance' ? 'bg-green-100 text-green-600' :
                        activity.type === 'fraud' ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {activity.type === 'work' ? <Briefcase className="w-4 h-4" /> :
                         activity.type === 'grievance' ? <CheckCircle className="w-4 h-4" /> :
                         activity.type === 'fraud' ? <AlertTriangle className="w-4 h-4" /> :
                         <IndianRupee className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.detail}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Grievances Tab */}
          <TabsContent value="grievances" className="space-y-4">
            {/* Filters */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="शिकायत खोजें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                फिल्टर
              </Button>
            </div>

            {/* Grievance Cards */}
            {mockGrievances.map((grievance) => (
              <Card key={grievance.id} className={`p-4 ${grievance.daysRemaining < 0 ? 'border-red-300 bg-red-50' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{grievance.userName}</h3>
                      {getPriorityBadge(grievance.priority)}
                    </div>
                    <p className="text-sm text-gray-500">{grievance.village} | {grievance.id}</p>
                  </div>
                  {getStatusBadge(grievance.status)}
                </div>

                <div className="mb-4">
                  <p className="font-medium text-gray-900">{grievance.categoryLabel}</p>
                  <p className="text-sm text-gray-600">{grievance.description}</p>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">दर्ज: {grievance.filedDate}</span>
                    <span className={`${grievance.daysRemaining < 0 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                      SLA: {grievance.daysRemaining < 0 ? `${Math.abs(grievance.daysRemaining)} दिन विलंब` : `${grievance.daysRemaining} दिन बाकी`}
                    </span>
                  </div>
                  {grievance.assignedTo && (
                    <span className="text-gray-500">सौंपा: {grievance.assignedTo}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {!grievance.assignedTo && (
                    <Button 
                      size="sm" 
                      onClick={() => handleAssignGrievance(grievance.id)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      सौंपें
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    onClick={() => handleResolveGrievance(grievance.id)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    हल करें
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCallUser(grievance.phone)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    कॉल
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    विवरण
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Allocations Tab */}
          <TabsContent value="allocations" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {mockWorkAllocations.map((work) => (
                <Card key={work.workId} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{work.workName}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {work.village}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">{work.status === 'upcoming' ? 'आगामी' : 'जारी'}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold">{work.allocated}/{work.totalSlots}</p>
                      <p className="text-xs text-gray-500">आवंटित</p>
                    </div>
                    <div className="text-center p-2 bg-pink-50 rounded-lg">
                      <p className="text-lg font-bold text-pink-600">{work.womenAllocated}</p>
                      <p className="text-xs text-gray-500">महिलाएं</p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{work.scStAllocated}</p>
                      <p className="text-xs text-gray-500">SC/ST</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-500">शुरू: {work.startDate}</span>
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      {work.pendingApplications} आवेदन बाकी
                    </Badge>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-600">
                    आवंटन देखें
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Fraud Tab */}
          <TabsContent value="fraud" className="space-y-4">
            <Card className="p-6 bg-red-50 border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">धोखाधड़ी का पता लगाना</h3>
                  <p className="text-sm text-red-600">AI-आधारित 5-सिग्नल डिटेक्शन सिस्टम</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {['घोस्ट वर्कर', 'वेज थेफ्ट', 'लोकेशन फ्रॉड', 'कॉल्यूजन', 'एनोमली'].map((signal, i) => (
                  <div key={i} className="p-3 bg-white rounded-lg text-center">
                    <p className="text-sm font-medium text-gray-700">{signal}</p>
                    <p className="text-xs text-gray-500">{[3, 2, 1, 0, 1][i]} अलर्ट</p>
                  </div>
                ))}
              </div>
            </Card>

            {mockFraudAlerts.map((alert) => (
              <Card key={alert.id} className="p-4 border-red-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      alert.riskLevel === 'HIGH' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <AlertTriangle className={`w-6 h-6 ${alert.riskLevel === 'HIGH' ? 'text-red-600' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{alert.userName}</h3>
                      <p className="text-sm text-gray-500">{alert.aadhaar}</p>
                    </div>
                  </div>
                  <Badge className={alert.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}>
                    {alert.riskLevel}
                  </Badge>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">संकेत:</p>
                  <div className="flex flex-wrap gap-2">
                    {alert.signals.map((signal, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{signal}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">धोखाधड़ी संभावना</p>
                    <div className="flex items-center gap-2">
                      <Progress value={alert.probability * 100} className="w-32 h-2" />
                      <span className="text-sm font-semibold">{(alert.probability * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{alert.detectedAt}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                    <XCircle className="w-4 h-4 mr-2" />
                    ब्लॉक करें
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    जांच करें
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">मासिक प्रगति</h3>
                <div className="space-y-4">
                  {[
                    { month: 'जनवरी 2026', days: 18, target: 20 },
                    { month: 'दिसंबर 2025', days: 15, target: 20 },
                    { month: 'नवंबर 2025', days: 12, target: 20 },
                  ].map((m, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{m.month}</span>
                        <span>{m.days}/{m.target} दिन</span>
                      </div>
                      <Progress value={(m.days / m.target) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">वर्गीकरण विश्लेषण</h3>
                <div className="space-y-3">
                  {[
                    { label: 'महिलाएं', value: 38, target: 33, color: 'bg-pink-500' },
                    { label: 'SC/ST', value: 42, target: 40, color: 'bg-purple-500' },
                    { label: 'OBC', value: 35, target: 27, color: 'bg-blue-500' },
                    { label: 'सामान्य', value: 28, target: 30, color: 'bg-green-500' },
                  ].map((cat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm">{cat.label}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${cat.color}`} style={{ width: `${(cat.value / cat.target) * 100}%` }} />
                        </div>
                        <span className="text-sm font-semibold w-12 text-right">{cat.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">भुगतान विश्लेषण</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">₹45.2L</p>
                  <p className="text-sm text-gray-600">कुल भुगतान</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">3.2 दिन</p>
                  <p className="text-sm text-gray-600">औसत समय</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">94%</p>
                  <p className="text-sm text-gray-600">समय पर</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">6%</p>
                  <p className="text-sm text-gray-600">देरी</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
