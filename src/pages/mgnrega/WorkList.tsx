// SAHAYOG - Work List Page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee,
  Droplets,
  Umbrella,
  Baby,
  Heart,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';

// Mock work opportunities data
const mockWorkOpportunities = [
  {
    _id: 'work001',
    workType: 'pond_excavation',
    workTitle: { hi: 'तालाब खुदाई और सुधार', en: 'Pond Excavation and Improvement' },
    description: { hi: 'गांव के तालाब की खुदाई और सीमेंटीकरण', en: 'Excavation and cementing of village pond' },
    location: {
      village: 'रामपुर',
      block: 'सदर',
      district: 'वाराणसी',
      geoLocation: { type: 'Point', coordinates: [83.0076, 25.3176] },
    },
    distance: 1.2,
    workDetails: {
      estimatedDays: 30,
      totalSlotsAvailable: 50,
      slotsRemaining: 23,
      startDate: '2026-02-01',
      wageRatePerDay: 231,
      workingHours: { start: '08:00', end: '16:00' },
      facilitiesAvailable: {
        drinkingWater: true,
        shade: true,
        creche: true,
        firstAid: true,
      },
    },
    requirements: {
      minimumAge: 18,
      maximumAge: 60,
      physicalRequirements: 'moderate',
      genderRestriction: 'any',
    },
  },
  {
    _id: 'work002',
    workType: 'road_construction',
    workTitle: { hi: 'ग्रामीण सड़क निर्माण', en: 'Rural Road Construction' },
    description: { hi: 'गांव से मुख्य सड़क तक पक्की सड़क बनाना', en: 'Building pakka road from village to main road' },
    location: {
      village: 'मोहनपुर',
      block: 'सदर',
      district: 'वाराणसी',
      geoLocation: { type: 'Point', coordinates: [83.0176, 25.3276] },
    },
    distance: 2.5,
    workDetails: {
      estimatedDays: 45,
      totalSlotsAvailable: 80,
      slotsRemaining: 45,
      startDate: '2026-02-05',
      wageRatePerDay: 231,
      workingHours: { start: '08:00', end: '16:00' },
      facilitiesAvailable: {
        drinkingWater: true,
        shade: true,
        creche: false,
        firstAid: true,
      },
    },
    requirements: {
      minimumAge: 18,
      maximumAge: 55,
      physicalRequirements: 'heavy',
      genderRestriction: 'any',
    },
  },
  {
    _id: 'work003',
    workType: 'plantation',
    workTitle: { hi: 'पौधारोपण और संरक्षण', en: 'Tree Plantation and Conservation' },
    description: { hi: 'सड़क के किनारे पौधे लगाना और उनकी देखभाल', en: 'Planting and maintaining trees along roads' },
    location: {
      village: 'रामपुर',
      block: 'सदर',
      district: 'वाराणसी',
      geoLocation: { type: 'Point', coordinates: [83.0056, 25.3156] },
    },
    distance: 0.8,
    workDetails: {
      estimatedDays: 20,
      totalSlotsAvailable: 30,
      slotsRemaining: 12,
      startDate: '2026-02-10',
      wageRatePerDay: 231,
      workingHours: { start: '07:00', end: '15:00' },
      facilitiesAvailable: {
        drinkingWater: true,
        shade: true,
        creche: true,
        firstAid: true,
      },
    },
    requirements: {
      minimumAge: 18,
      maximumAge: 65,
      physicalRequirements: 'light',
      genderRestriction: 'any',
    },
  },
];

// Work Type Filter Options
const workTypes = [
  { value: 'all', label: 'सभी प्रकार' },
  { value: 'pond_excavation', label: 'तालाब खुदाई' },
  { value: 'road_construction', label: 'सड़क निर्माण' },
  { value: 'plantation', label: 'पौधारोपण' },
  { value: 'irrigation', label: 'सिंचाई' },
  { value: 'sanitation', label: 'स्वच्छता' },
];

// Distance Filter Options
const distanceOptions = [
  { value: 'all', label: 'सभी दूरी' },
  { value: '1', label: '1 किमी के अंदर' },
  { value: '3', label: '3 किमी के अंदर' },
  { value: '5', label: '5 किमी के अंदर' },
  { value: '10', label: '10 किमी के अंदर' },
];

export default function WorkList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [works, setWorks] = useState(mockWorkOpportunities);
  const [filteredWorks, setFilteredWorks] = useState(mockWorkOpportunities);
  const [workTypeFilter, setWorkTypeFilter] = useState('all');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters
  useEffect(() => {
    let filtered = works;

    if (workTypeFilter !== 'all') {
      filtered = filtered.filter(w => w.workType === workTypeFilter);
    }

    if (distanceFilter !== 'all') {
      const maxDistance = parseInt(distanceFilter);
      filtered = filtered.filter(w => w.distance <= maxDistance);
    }

    setFilteredWorks(filtered);
  }, [works, workTypeFilter, distanceFilter]);

  const handleApply = (workId: string) => {
    toast.success('आवेदन सफल! आपकी प्राथमिकता स्कोर के आधार पर आवंटन होगा।');
  };

  const getFacilityIcon = (facility: string) => {
    switch (facility) {
      case 'drinkingWater': return Droplets;
      case 'shade': return Umbrella;
      case 'creche': return Baby;
      case 'firstAid': return Heart;
      default: return null;
    }
  };

  const getFacilityLabel = (facility: string) => {
    switch (facility) {
      case 'drinkingWater': return 'पानी';
      case 'shade': return 'छाया';
      case 'creche': return 'शिशु गृह';
      case 'firstAid': return 'प्राथमिक चिकित्सा';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/mgnrega')}
                className="p-2 hover:bg-orange-50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 ml-4">उपलब्ध काम</h1>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full transition-colors ${showFilters ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50 text-gray-600'}`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filters */}
          {showFilters && (
            <div className="flex gap-3">
              <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="काम का प्रकार" />
                </SelectTrigger>
                <SelectContent>
                  {workTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="दूरी" />
                </SelectTrigger>
                <SelectContent>
                  {distanceOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredWorks.length} काम उपलब्ध
          </p>
          <button 
            onClick={() => navigate('/mgnrega/work/map')}
            className="text-sm text-orange-600 flex items-center gap-1"
          >
            <MapPin className="w-4 h-4" />
            मानचित्र देखें
          </button>
        </div>

        {/* Work Cards */}
        {filteredWorks.map((work) => (
          <Card key={work._id} className="overflow-hidden border-orange-100">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{work.workTitle.hi}</h3>
                  <p className="text-sm text-gray-500 mt-1">{work.description.hi}</p>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <MapPin className="w-3 h-3 mr-1" />
                  {work.distance} किमी
                </Badge>
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{work.workDetails.estimatedDays}</p>
                  <p className="text-xs text-gray-500">दिन</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <IndianRupee className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">₹{work.workDetails.wageRatePerDay}</p>
                  <p className="text-xs text-gray-500">प्रति दिन</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{work.workDetails.slotsRemaining}</p>
                  <p className="text-xs text-gray-500">जगह बाकी</p>
                </div>
              </div>

              {/* Facilities */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(work.workDetails.facilitiesAvailable)
                  .filter(([_, available]) => available)
                  .map(([facility]) => {
                    const Icon = getFacilityIcon(facility);
                    return Icon ? (
                      <Badge key={facility} variant="outline" className="text-xs">
                        <Icon className="w-3 h-3 mr-1" />
                        {getFacilityLabel(facility)}
                      </Badge>
                    ) : null;
                  })}
              </div>

              {/* Location & Date */}
              <div className="text-sm text-gray-600 mb-4 space-y-1">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {work.location.village}, {work.location.district}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  शुरू: {new Date(work.workDetails.startDate).toLocaleDateString('hi-IN')}
                </p>
              </div>

              {/* Apply Button */}
              <Button
                onClick={() => handleApply(work._id)}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
              >
                आवेदन करें
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        ))}

        {/* No Results */}
        {filteredWorks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600">कोई काम नहीं मिला</p>
            <p className="text-sm text-gray-500">फिल्टर बदलकर फिर से कोशिश करें</p>
          </div>
        )}
      </main>
    </div>
  );
}
