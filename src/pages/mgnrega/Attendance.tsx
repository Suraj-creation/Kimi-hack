// SAHAYOG - Attendance Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Clock,
  Download,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Mock attendance data
const mockAttendance = {
  '2026-01': [
    { date: '2026-01-01', status: 'present', work: 'तालाब खुदाई' },
    { date: '2026-01-02', status: 'present', work: 'तालाब खुदाई' },
    { date: '2026-01-03', status: 'absent', work: '-' },
    { date: '2026-01-06', status: 'present', work: 'तालाब खुदाई' },
    { date: '2026-01-07', status: 'half_day', work: 'तालाब खुदाई' },
    { date: '2026-01-08', status: 'present', work: 'सड़क निर्माण' },
    { date: '2026-01-09', status: 'present', work: 'सड़क निर्माण' },
    { date: '2026-01-10', status: 'present', work: 'सड़क निर्माण' },
    { date: '2026-01-13', status: 'present', work: 'सड़क निर्माण' },
    { date: '2026-01-14', status: 'present', work: 'सड़क निर्माण' },
    { date: '2026-01-15', status: 'holiday', work: '-' },
    { date: '2026-01-16', status: 'holiday', work: '-' },
    { date: '2026-01-17', status: 'absent', work: '-' },
    { date: '2026-01-20', status: 'present', work: 'पौधारोपण' },
    { date: '2026-01-21', status: 'present', work: 'पौधारोपण' },
    { date: '2026-01-22', status: 'present', work: 'पौधारोपण' },
    { date: '2026-01-23', status: 'present', work: 'पौधारोपण' },
    { date: '2026-01-24', status: 'present', work: 'पौधारोपण' },
  ],
};

// Family members attendance
const familyAttendance = [
  { name: 'सुनीता देवी', relation: 'पत्नी', daysWorked: 28, totalDays: 46 },
  { name: 'राजेश', relation: 'बेटा', daysWorked: 15, totalDays: 20 },
];

export default function Attendance() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
  const [activeTab, setActiveTab] = useState('personal');

  const daysWorked = mockAttendance['2026-01'].filter(a => a.status === 'present').length;
  const halfDays = mockAttendance['2026-01'].filter(a => a.status === 'half_day').length;
  const totalDaysWorked = daysWorked + (halfDays * 0.5);
  const daysRemaining = 100 - (user?.mgnregaInfo?.totalDaysWorkedThisYear || 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'half_day': return 'bg-yellow-500';
      case 'absent': return 'bg-red-500';
      case 'holiday': return 'bg-gray-300';
      default: return 'bg-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'उपस्थित';
      case 'half_day': return 'आधा दिन';
      case 'absent': return 'अनुपस्थित';
      case 'holiday': return 'छुट्टी';
      default: return '-';
    }
  };

  const handleDownloadCertificate = () => {
    toast.success('उपस्थिति प्रमाण पत्र डाउनलोड हो रहा है...');
  };

  const monthNames = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
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
          <h1 className="text-xl font-bold text-gray-900 ml-4">उपस्थिति</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center border-green-200">
            <p className="text-2xl font-bold text-green-600">{totalDaysWorked}</p>
            <p className="text-xs text-gray-600">इस महीने</p>
          </Card>
          <Card className="p-4 text-center border-orange-200">
            <p className="text-2xl font-bold text-orange-600">{user?.mgnregaInfo?.totalDaysWorkedThisYear || 0}</p>
            <p className="text-xs text-gray-600">इस साल</p>
          </Card>
          <Card className="p-4 text-center border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{daysRemaining}</p>
            <p className="text-xs text-gray-600">बाकी दिन</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">मेरी उपस्थिति</TabsTrigger>
            <TabsTrigger value="family">परिवार का दृश्य</TabsTrigger>
          </TabsList>

          {/* Personal Attendance */}
          <TabsContent value="personal" className="space-y-4">
            {/* Month Navigator */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-orange-50 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-semibold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button 
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-orange-50 rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <Card className="p-4">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'].map(day => (
                  <div key={day} className="text-xs font-medium text-gray-500 py-1">{day}</div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for previous month */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                
                {/* Days */}
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `2026-01-${day.toString().padStart(2, '0')}`;
                  const attendance = mockAttendance['2026-01'].find(a => a.date === dateStr);
                  
                  return (
                    <div
                      key={day}
                      className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm ${
                        attendance 
                          ? getStatusColor(attendance.status) + ' text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <span className="font-medium">{day}</span>
                      {attendance && attendance.status !== 'holiday' && (
                        <span className="text-[8px]">{getStatusLabel(attendance.status).slice(0, 3)}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { color: 'bg-green-500', label: 'उपस्थित' },
                { color: 'bg-yellow-500', label: 'आधा दिन' },
                { color: 'bg-red-500', label: 'अनुपस्थित' },
                { color: 'bg-gray-300', label: 'छुट्टी' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded ${item.color}`} />
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Attendance List */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">इस महीने का विवरण</h3>
              <div className="space-y-2">
                {mockAttendance['2026-01']
                  .filter(a => a.status !== 'holiday')
                  .slice(-5)
                  .reverse()
                  .map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(record.status)}`} />
                        <div>
                          <p className="text-sm font-medium">{new Date(record.date).getDate()} जनवरी</p>
                          <p className="text-xs text-gray-500">{record.work}</p>
                        </div>
                      </div>
                      <Badge className={
                        record.status === 'present' ? 'bg-green-100 text-green-700' :
                        record.status === 'half_day' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {getStatusLabel(record.status)}
                      </Badge>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>

          {/* Family Attendance */}
          <TabsContent value="family" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">परिवार सदस्य</h3>
              <div className="space-y-4">
                {familyAttendance.map((member, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.relation}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        {member.daysWorked} दिन
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(member.daysWorked / 100) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {member.daysWorked} / 100 दिन
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Family Total */}
            <Card className="p-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">परिवार कुल</p>
                  <p className="text-2xl font-bold">89 दिन</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Download Certificate */}
        <Button
          onClick={handleDownloadCertificate}
          variant="outline"
          className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
        >
          <Download className="w-4 h-4 mr-2" />
          उपस्थिति प्रमाण पत्र डाउनलोड करें
        </Button>
      </main>
    </div>
  );
}
