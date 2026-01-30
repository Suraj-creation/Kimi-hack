// SAHAYOG - Scheme Detail Page
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, ExternalLink, ChevronRight } from 'lucide-react';

export default function SchemeDetail() {
  const navigate = useNavigate();
  const { schemeId } = useParams();

  const handleApply = () => {
    toast.success('आवेदन पृष्ठ पर रीडायरेक्ट हो रहे हैं...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <header className="bg-white border-b border-orange-100 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center">
          <button 
            onClick={() => navigate('/schemes')}
            className="p-2 hover:bg-orange-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-4">योजना विवरण</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <Card className="p-6">
          <p className="text-gray-500 text-center">योजना ID: {schemeId}</p>
          <p className="text-gray-600 text-center mt-4">विवरण जल्द ही उपलब्ध होगा</p>
          <div className="flex gap-2 mt-6">
            <Button onClick={handleApply} className="flex-1 bg-orange-500">
              आवेदन करें
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" onClick={() => window.open(`https://www.google.com/search?q=${schemeId}+scheme`, '_blank')}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
