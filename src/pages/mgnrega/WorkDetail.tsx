// SAHAYOG - Work Detail Page
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, Calendar, Users, IndianRupee, ChevronRight } from 'lucide-react';

export default function WorkDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleApply = () => {
    toast.success('आवेदन सफल!');
    navigate('/mgnrega/work');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <header className="bg-white border-b border-orange-100 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center">
          <button 
            onClick={() => navigate('/mgnrega/work')}
            className="p-2 hover:bg-orange-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-4">काम का विवरण</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <Card className="p-6">
          <p className="text-gray-500 text-center">काम ID: {id}</p>
          <p className="text-gray-600 text-center mt-4">विवरण जल्द ही उपलब्ध होगा</p>
          <Button onClick={handleApply} className="w-full mt-6 bg-orange-500">
            आवेदन करें
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </main>
    </div>
  );
}
