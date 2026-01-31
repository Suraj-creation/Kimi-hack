// SAHAYOG - Living Shelf Dashboard
// Geography-Driven Work Planning Dashboard

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  IndianRupee,
  Sparkles,
  Brain,
  Target,
  Layers,
  ChevronRight,
  Play,
  Calendar,
  Award,
  Droplets,
  Mountain,
  Sprout,
  Hammer,
} from 'lucide-react';
import { livingShelfService } from '@/lib/living-shelf-service';
import type {
  VillageGeographyProfile,
  LivingShelfOfWorks,
  ReadyWork,
  StandbyWork,
  EmergencyWork,
} from '@/types/geography';

export default function LivingShelfDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [villages, setVillages] = useState<VillageGeographyProfile[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<VillageGeographyProfile | null>(null);
  const [livingShelf, setLivingShelf] = useState<LivingShelfOfWorks | null>(null);
  const [activeTab, setActiveTab] = useState<'ready' | 'standby' | 'emergency'>('ready');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const allVillages = await livingShelfService.getAllVillages();
      setVillages(allVillages);
      
      if (allVillages.length > 0) {
        const firstVillage = allVillages[0];
        setSelectedVillage(firstVillage);
        
        // Generate living shelf for first village
        const shelf = await livingShelfService.generateLivingShelf(firstVillage.villageLGDCode);
        setLivingShelf(shelf);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('डेटा लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  }

  async function handleVillageChange(villageLGDCode: string) {
    const village = villages.find(v => v.villageLGDCode === villageLGDCode);
    if (!village) return;

    setLoading(true);
    setSelectedVillage(village);
    
    try {
      const shelf = await livingShelfService.generateLivingShelf(villageLGDCode);
      setLivingShelf(shelf);
      toast.success('Living Shelf तैयार!');
    } catch (error) {
      toast.error('त्रुटि');
    } finally {
      setLoading(false);
    }
  }

  async function handleActivateStandbyWork(workId: string) {
    if (!selectedVillage) return;

    const success = await livingShelfService.activateStandbyWork(selectedVillage.villageLGDCode, workId);
    if (success) {
      toast.success('काम READY स्थिति में स्थानांतरित!');
      // Refresh data
      const shelf = await livingShelfService.generateLivingShelf(selectedVillage.villageLGDCode);
      setLivingShelf(shelf);
    }
  }

  async function handleTriggerEmergency(workId: string) {
    if (!selectedVillage) return;

    const success = await livingShelfService.triggerEmergencyWork(selectedVillage.villageLGDCode, workId);
    if (success) {
      toast.success('आपातकालीन काम सक्रिय!');
      const shelf = await livingShelfService.generateLivingShelf(selectedVillage.villageLGDCode);
      setLivingShelf(shelf);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-purple-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">AI भूगोल विश्लेषण चल रहा है...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/mgnrega')}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="ml-4 flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Living Shelf of Works</h1>
                <p className="text-purple-100 text-sm">भूगोल-संचालित योजना प्रणाली</p>
              </div>
            </div>
          </div>

          {/* Village Selector */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <label className="text-purple-100 text-sm block mb-2">गांव चुनें:</label>
            <select
              value={selectedVillage?.villageLGDCode || ''}
              onChange={(e) => handleVillageChange(e.target.value)}
              className="w-full bg-white text-gray-900 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300"
            >
              {villages.map(village => (
                <option key={village.villageLGDCode} value={village.villageLGDCode}>
                  {village.villageName} - {village.block}, {village.district}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {selectedVillage && livingShelf && (
          <>
            {/* Geography DNA Card */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Geography DNA</h2>
                  <p className="text-sm text-gray-600">गांव की भौगोलिक विशेषताएं</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <Mountain className="w-5 h-5 text-brown-600 mb-2" />
                  <p className="text-xs text-gray-500">भू-आकृति</p>
                  <p className="font-semibold">{selectedVillage.geographyDNA.terrain.type}</p>
                  <p className="text-xs text-gray-600">ढलान: {selectedVillage.geographyDNA.terrain.slope}</p>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <Sprout className="w-5 h-5 text-yellow-700 mb-2" />
                  <p className="text-xs text-gray-500">मिट्टी</p>
                  <p className="font-semibold">{selectedVillage.geographyDNA.soil.type}</p>
                  <p className="text-xs text-gray-600">उर्वरता: {selectedVillage.geographyDNA.soil.fertility}</p>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <Droplets className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="text-xs text-gray-500">जल</p>
                  <p className="font-semibold">{selectedVillage.geographyDNA.water.rainfallZone} वर्षा</p>
                  <p className="text-xs text-gray-600">तनाव: {selectedVillage.geographyDNA.water.waterStress}</p>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <Users className="w-5 h-5 text-purple-600 mb-2" />
                  <p className="text-xs text-gray-500">रोजगार</p>
                  <p className="font-semibold">{selectedVillage.geographyDNA.socioEconomic.mgnregaJobCards} कार्ड</p>
                  <p className="text-xs text-gray-600">मांग: {selectedVillage.geographyDNA.socioEconomic.migrationLevel}</p>
                </div>
              </div>
            </Card>

            {/* Shelf Metrics Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-8 h-8" />
                  <div>
                    <p className="text-green-100 text-sm">READY</p>
                    <p className="text-3xl font-bold">{livingShelf.metrics.readyCount}</p>
                  </div>
                </div>
                <p className="text-sm text-green-100">तुरंत शुरू हो सकते हैं</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-8 h-8" />
                  <div>
                    <p className="text-yellow-100 text-sm">STANDBY</p>
                    <p className="text-3xl font-bold">{livingShelf.metrics.standbyCount}</p>
                  </div>
                </div>
                <p className="text-sm text-yellow-100">48 घंटे में सक्रिय</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-red-500 to-pink-600 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-8 h-8" />
                  <div>
                    <p className="text-red-100 text-sm">EMERGENCY</p>
                    <p className="text-3xl font-bold">{livingShelf.metrics.emergencyCount}</p>
                  </div>
                </div>
                <p className="text-sm text-red-100">संकट के लिए तैयार</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-8 h-8" />
                  <div>
                    <p className="text-blue-100 text-sm">कुल क्षमता</p>
                    <p className="text-3xl font-bold">{Math.floor(livingShelf.metrics.totalLabourPotential / 1000)}K</p>
                  </div>
                </div>
                <p className="text-sm text-blue-100">मानव-दिन उपलब्ध</p>
              </Card>
            </div>

            {/* AI Insights Card */}
            {selectedVillage.demandForecasts && selectedVillage.demandForecasts.length > 0 && (
              <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">AI Demand Forecast</h3>
                    <p className="text-sm text-gray-600">अगले 30 दिनों का पूर्वानुमान</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <Users className="w-5 h-5 text-purple-600 mb-2" />
                    <p className="text-xs text-gray-500">अपेक्षित मजदूर</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedVillage.demandForecasts[0].prediction.expectedWorkers}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <Calendar className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="text-xs text-gray-500">मानव-दिन</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedVillage.demandForecasts[0].prediction.expectedManDays}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mb-2" />
                    <p className="text-xs text-gray-500">पैटर्न</p>
                    <p className="text-sm font-semibold text-green-600">
                      {selectedVillage.demandForecasts[0].prediction.demandPattern}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <Award className="w-5 h-5 text-orange-600 mb-2" />
                    <p className="text-xs text-gray-500">विश्वास</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedVillage.demandForecasts[0].prediction.confidence}%
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Work Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ready" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  READY ({livingShelf.readyWorks.length})
                </TabsTrigger>
                <TabsTrigger value="standby" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  STANDBY ({livingShelf.standbyWorks.length})
                </TabsTrigger>
                <TabsTrigger value="emergency" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  EMERGENCY ({livingShelf.emergencyWorks.length})
                </TabsTrigger>
              </TabsList>

              {/* READY Works */}
              <TabsContent value="ready" className="space-y-4 mt-4">
                {livingShelf.readyWorks.map((work) => (
                  <ReadyWorkCard key={work.workId} work={work} />
                ))}
                {livingShelf.readyWorks.length === 0 && (
                  <Card className="p-8 text-center">
                    <p className="text-gray-500">कोई READY काम नहीं</p>
                  </Card>
                )}
              </TabsContent>

              {/* STANDBY Works */}
              <TabsContent value="standby" className="space-y-4 mt-4">
                {livingShelf.standbyWorks.map((work) => (
                  <StandbyWorkCard
                    key={work.workId}
                    work={work}
                    onActivate={() => handleActivateStandbyWork(work.workId)}
                  />
                ))}
              </TabsContent>

              {/* EMERGENCY Works */}
              <TabsContent value="emergency" className="space-y-4 mt-4">
                {livingShelf.emergencyWorks.map((work) => (
                  <EmergencyWorkCard
                    key={work.workId}
                    work={work}
                    onTrigger={() => handleTriggerEmergency(work.workId)}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}

// READY Work Card Component
function ReadyWorkCard({ work }: { work: ReadyWork }) {
  return (
    <Card className="p-6 border-l-4 border-green-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Hammer className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{work.workTitle.hi}</h3>
            <p className="text-sm text-gray-500">{work.assetType}</p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          READY
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">कुल स्लॉट</p>
          <p className="text-xl font-bold text-gray-900">{work.labourAllocation.totalSlots}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">अवधि</p>
          <p className="text-xl font-bold text-gray-900">{work.timeline.estimatedDuration} दिन</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">बजट</p>
          <p className="text-xl font-bold text-gray-900">₹{Math.floor(work.readyState.allocationAmount / 1000)}K</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">प्राथमिकता</p>
          <p className="text-xl font-bold text-gray-900">{work.priority}/10</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs text-gray-500 mb-2">Micro-Tasks ({work.microTasks.length})</p>
        <div className="flex flex-wrap gap-2">
          {work.microTasks.map((task, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {task.taskName.hi}
            </Badge>
          ))}
        </div>
      </div>

      <Button className="w-full bg-green-600 hover:bg-green-700">
        <Play className="w-4 h-4 mr-2" />
        काम शुरू करें
      </Button>
    </Card>
  );
}

// STANDBY Work Card Component
function StandbyWorkCard({ work, onActivate }: { work: StandbyWork; onActivate: () => void }) {
  return (
    <Card className="p-6 border-l-4 border-yellow-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Hammer className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{work.workTitle.hi}</h3>
            <p className="text-sm text-gray-500">{work.assetType}</p>
          </div>
        </div>
        <Badge className="bg-yellow-100 text-yellow-700">
          <Clock className="w-3 h-3 mr-1" />
          STANDBY
        </Badge>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <p className="text-sm font-medium text-yellow-900 mb-2">Quick Activation</p>
        <p className="text-xs text-yellow-700">
          ⚡ {work.quickActivation.canActivateIn} घंटे में सक्रिय हो सकता है
        </p>
        <p className="text-xs text-yellow-700 mt-1">
          ✅ {work.quickActivation.documentsReady.length} दस्तावेज़ तैयार
        </p>
        <p className="text-xs text-yellow-700">
          ⏳ {work.quickActivation.documentsPending.length} दस्तावेज़ बाकी
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">मजदूर</p>
          <p className="text-lg font-bold">{work.labourPotential.maxWorkers}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">मानव-दिन</p>
          <p className="text-lg font-bold">{work.labourPotential.estimatedManDays}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">समाप्ति</p>
          <p className="text-lg font-bold">{work.validityPeriod} दिन</p>
        </div>
      </div>

      <Button onClick={onActivate} className="w-full bg-yellow-600 hover:bg-yellow-700">
        <Zap className="w-4 h-4 mr-2" />
        READY में बदलें
      </Button>
    </Card>
  );
}

// EMERGENCY Work Card Component
function EmergencyWorkCard({ work, onTrigger }: { work: EmergencyWork; onTrigger: () => void }) {
  return (
    <Card className="p-6 border-l-4 border-red-500 bg-red-50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{work.workTitle.hi}</h3>
            <p className="text-sm text-red-600 font-medium">{work.emergencyType}</p>
          </div>
        </div>
        <Badge className="bg-red-100 text-red-700">
          <AlertTriangle className="w-3 h-3 mr-1" />
          EMERGENCY
        </Badge>
      </div>

      <div className="bg-white border-2 border-red-200 rounded-lg p-3 mb-4">
        <p className="text-sm font-medium text-red-900 mb-2">Rapid Deployment</p>
        <p className="text-xs text-red-700">
          ⚡ {work.rapidDeployment.activationTime} घंटे में शुरू
        </p>
        <p className="text-xs text-red-700">
          🚨 Urgency Score: {work.crisisContext.urgencyScore}/100
        </p>
        <p className="text-xs text-red-700">
          👥 {work.crisisContext.affectedPopulation} लोग प्रभावित
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">तत्काल स्लॉट</p>
          <p className="text-lg font-bold">{work.labourAbsorption.immediateSlots}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">अधिकतम क्षमता</p>
          <p className="text-lg font-bold">{work.labourAbsorption.maxScaleUp}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">राहत क्षमता</p>
          <p className="text-lg font-bold">{work.crisisContext.reliefPotential}</p>
        </div>
      </div>

      <Button onClick={onTrigger} className="w-full bg-red-600 hover:bg-red-700">
        <Zap className="w-4 h-4 mr-2" />
        आपातकाल सक्रिय करें
      </Button>
    </Card>
  );
}
