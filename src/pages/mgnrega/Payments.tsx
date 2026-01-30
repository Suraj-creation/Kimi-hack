// SAHAYOG - Payments Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  IndianRupee, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  TrendingUp,
  Calendar,
  ChevronRight
} from 'lucide-react';

// Mock payment data
const mockPayments = {
  pending: [
    {
      id: 'pay001',
      amount: 2400,
      workType: 'तालाब खुदाई',
      days: 10,
      period: '10-20 जनवरी 2026',
      status: 'processing',
      expectedDate: '25 जनवरी 2026',
      ftoNumber: 'FTO-2026-001234',
    },
  ],
  history: [
    {
      id: 'pay002',
      amount: 1848,
      workType: 'सड़क निर्माण',
      days: 8,
      period: '1-10 जनवरी 2026',
      status: 'paid',
      paidDate: '15 जनवरी 2026',
      utrNumber: 'SBIN1234567890',
    },
    {
      id: 'pay003',
      amount: 2310,
      workType: 'पौधारोपण',
      days: 10,
      period: '15-25 दिसंबर 2025',
      status: 'paid',
      paidDate: '30 दिसंबर 2025',
      utrNumber: 'SBIN0987654321',
    },
    {
      id: 'pay004',
      amount: 1155,
      workType: 'तालाब खुदाई',
      days: 5,
      period: '5-10 दिसंबर 2025',
      status: 'paid',
      paidDate: '15 दिसंबर 2025',
      utrNumber: 'SBIN1122334455',
    },
  ],
};

export default function Payments() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const totalPending = mockPayments.pending.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = mockPayments.history.reduce((sum, p) => sum + p.amount, 0);
  const totalEarned = totalPending + totalPaid;

  const handleDownloadReceipt = (paymentId: string) => {
    toast.success('रसीद डाउनलोड हो रही है...');
  };

  const handleRaiseIssue = () => {
    navigate('/mgnrega/grievance');
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
          <h1 className="text-xl font-bold text-gray-900 ml-4">भुगतान</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Total Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <p className="text-green-100 text-xs">कुल कमाई</p>
                <p className="text-2xl font-bold">₹{totalEarned.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-orange-100 text-xs">बाकी पैसे</p>
                <p className="text-2xl font-bold">₹{totalPending.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Pending Payments */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">बाकी भुगतान</h2>
          {mockPayments.pending.length > 0 ? (
            <div className="space-y-4">
              {mockPayments.pending.map((payment) => (
                <Card key={payment.id} className="p-4 border-amber-200 bg-amber-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{payment.workType}</h3>
                      <p className="text-sm text-gray-600">{payment.period}</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700">
                      <Clock className="w-3 h-3 mr-1" />
                      प्रोसेसिंग
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900">₹{payment.amount}</p>
                      <p className="text-xs text-gray-500">राशि</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900">{payment.days}</p>
                      <p className="text-xs text-gray-500">दिन</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900">{payment.expectedDate}</p>
                      <p className="text-xs text-gray-500">अनुमानित तारीख</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg mb-3">
                    <div>
                      <p className="text-xs text-gray-500">FTO नंबर</p>
                      <p className="font-mono text-sm">{payment.ftoNumber}</p>
                    </div>
                    <Progress value={60} className="w-24 h-2" />
                  </div>

                  <Button
                    onClick={handleRaiseIssue}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    समस्या बताएं
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center border-green-200 bg-green-50">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-700">कोई बाकी भुगतान नहीं</p>
              <p className="text-sm text-gray-500">सभी भुगतान समय पर हो रहे हैं</p>
            </Card>
          )}
        </div>

        {/* Payment History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">भुगतान इतिहास</h2>
            <Badge variant="outline" className="text-gray-600">
              FY 2025-26
            </Badge>
          </div>
          
          <div className="space-y-3">
            {mockPayments.history.map((payment) => (
              <Card key={payment.id} className="p-4 border-green-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{payment.workType}</h3>
                      <p className="text-sm text-gray-500">{payment.period}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        UTR: {payment.utrNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">₹{payment.amount}</p>
                    <p className="text-xs text-gray-500">{payment.paidDate}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReceipt(payment.id)}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    रसीद
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Monthly Summary */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">मासिक सारांश</h3>
          <div className="space-y-3">
            {[
              { month: 'जनवरी 2026', earned: 4248, days: 18 },
              { month: 'दिसंबर 2025', earned: 3465, days: 15 },
              { month: 'नवंबर 2025', earned: 2772, days: 12 },
            ].map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{month.month}</p>
                  <p className="text-sm text-gray-500">{month.days} दिन काम</p>
                </div>
                <p className="font-bold text-green-600">₹{month.earned.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
