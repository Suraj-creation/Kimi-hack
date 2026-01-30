// SAHAYOG - Skill Development Module
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Play,
  Pause,
  CheckCircle,
  Award,
  Clock,
  BookOpen,
  TrendingUp,
  Star,
  Download,
  Share2,
  Users,
  Video,
  FileText,
  ChevronRight,
  Lock,
  Unlock
} from 'lucide-react';

// Mock skill courses
const mockCourses = [
  {
    id: 'course001',
    code: 'CONSTRUCTION-BASIC',
    name: { hi: 'निर्माण मिस्त्री - बेसिक', en: 'Construction Mason - Basic' },
    category: 'construction',
    skillLevel: 'beginner',
    thumbnail: 'construction',
    totalDuration: 12, // hours
    totalVideos: 24,
    enrolled: 1245,
    rating: 4.8,
    modules: [
      { id: 'm1', title: 'निर्माण सामग्री का परिचय', duration: 30, completed: true },
      { id: 'm2', title: 'ईंट बिछाना', duration: 45, completed: true },
      { id: 'm3', title: 'सीमेंट मिलाना', duration: 30, completed: false },
      { id: 'm4', title: 'दीवार बनाना', duration: 60, completed: false },
    ],
    expectedOutcome: {
      skills: ['ईंट बिछाना', 'सीमेंट मिलाना', 'दीवार निर्माण'],
      certificationName: 'बेसिक मिस्त्री प्रमाण पत्र',
      potentialEarnings: { min: 350, max: 500, unit: 'per_day' },
    },
    isEnrolled: true,
    progress: 45,
  },
  {
    id: 'course002',
    code: 'AGRICULTURE-ADVANCED',
    name: { hi: 'आधुनिक खेती तकनीक', en: 'Modern Farming Techniques' },
    category: 'agriculture',
    skillLevel: 'intermediate',
    thumbnail: 'agriculture',
    totalDuration: 18,
    totalVideos: 36,
    enrolled: 892,
    rating: 4.6,
    modules: [
      { id: 'm1', title: 'जैविक खेती', duration: 45, completed: false },
      { id: 'm2', title: 'सिंचाई प्रबंधन', duration: 40, completed: false },
      { id: 'm3', title: 'फसल रोग नियंत्रण', duration: 50, completed: false },
    ],
    expectedOutcome: {
      skills: ['जैविक खेती', 'सिंचाई प्रबंधन', 'रोग नियंत्रण'],
      certificationName: 'आधुनिक कृषि प्रमाण पत्र',
      potentialEarnings: { min: 20000, max: 50000, unit: 'per_month' },
    },
    isEnrolled: false,
    progress: 0,
  },
  {
    id: 'course003',
    code: 'DIGITAL-LITERACY',
    name: { hi: 'डिजिटल साक्षरता', en: 'Digital Literacy' },
    category: 'digital',
    skillLevel: 'beginner',
    thumbnail: 'digital',
    totalDuration: 8,
    totalVideos: 16,
    enrolled: 2156,
    rating: 4.9,
    modules: [
      { id: 'm1', title: 'स्मार्टफोन का उपयोग', duration: 30, completed: false },
      { id: 'm2', title: 'इंटरनेट और ऐप्स', duration: 35, completed: false },
      { id: 'm3', title: 'ऑनलाइन भुगतान', duration: 25, completed: false },
    ],
    expectedOutcome: {
      skills: ['स्मार्टफोन', 'इंटरनेट', 'ऑनलाइन लेनदेन'],
      certificationName: 'डिजिटल साक्षरता प्रमाण पत्र',
      potentialEarnings: { min: 0, max: 0, unit: 'per_day' },
    },
    isEnrolled: false,
    progress: 0,
  },
  {
    id: 'course004',
    code: 'PLUMBING-BASIC',
    name: { hi: 'प्लंबिंग - बेसिक', en: 'Plumbing - Basic' },
    category: 'construction',
    skillLevel: 'beginner',
    thumbnail: 'plumbing',
    totalDuration: 15,
    totalVideos: 30,
    enrolled: 678,
    rating: 4.7,
    modules: [
      { id: 'm1', title: 'पाइप और फिटिंग्स', duration: 40, completed: false },
      { id: 'm2', title: 'नल और शॉवर लगाना', duration: 35, completed: false },
    ],
    expectedOutcome: {
      skills: ['पाइप फिटिंग', 'नल लगाना', 'लीक ठीक करना'],
      certificationName: 'बेसिक प्लंबर प्रमाण पत्र',
      potentialEarnings: { min: 400, max: 600, unit: 'per_day' },
    },
    isEnrolled: false,
    progress: 0,
  },
];

// Mock certificates
const mockCertificates = [
  {
    id: 'CERT-001',
    courseName: 'बेसिक कृषि मजदूर',
    issueDate: '15 दिसंबर 2025',
    expiryDate: '15 दिसंबर 2028',
    verified: true,
    skills: ['बीज बोना', 'निराई-गुड़ाई', 'फसल कटाई'],
  },
];

export default function SkillsModule() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState<typeof mockCourses[0] | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const enrolledCourses = mockCourses.filter(c => c.isEnrolled);
  const availableCourses = mockCourses.filter(c => !c.isEnrolled);

  const handleEnroll = (courseId: string) => {
    toast.success('पाठ्यक्रम में नामांकन सफल!');
  };

  const handleDownloadCertificate = (certId: string) => {
    toast.success('प्रमाण पत्र डाउनलोड हो रहा है...');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'construction': return '🏗️';
      case 'agriculture': return '🌾';
      case 'digital': return '💻';
      default: return '📚';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'construction': return 'bg-orange-100 text-orange-600';
      case 'agriculture': return 'bg-green-100 text-green-600';
      case 'digital': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Course Detail View */}
        <header className="bg-white border-b border-orange-100 px-4 py-4 sticky top-0 z-40">
          <div className="max-w-lg mx-auto flex items-center">
            <button 
              onClick={() => setSelectedCourse(null)}
              className="p-2 hover:bg-orange-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 ml-4 line-clamp-1">{selectedCourse.name.hi}</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {/* Course Header */}
          <div className="aspect-video bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center relative">
            <div className="text-center text-white">
              <span className="text-6xl">{getCategoryIcon(selectedCourse.category)}</span>
              <p className="mt-2 font-medium">{selectedCourse.name.hi}</p>
            </div>
            {selectedCourse.isEnrolled && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  नामांकित
                </Badge>
              </div>
            )}
          </div>

          {/* Course Info */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Badge className={getCategoryColor(selectedCourse.category)}>
                {selectedCourse.category === 'construction' ? 'निर्माण' :
                 selectedCourse.category === 'agriculture' ? 'कृषि' :
                 selectedCourse.category === 'digital' ? 'डिजिटल' : 'अन्य'}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{selectedCourse.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                <p className="text-sm font-medium">{selectedCourse.totalDuration} घंटे</p>
              </div>
              <div className="text-center">
                <Video className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                <p className="text-sm font-medium">{selectedCourse.totalVideos} वीडियो</p>
              </div>
              <div className="text-center">
                <Users className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                <p className="text-sm font-medium">{selectedCourse.enrolled.toLocaleString()}</p>
              </div>
            </div>

            {selectedCourse.isEnrolled && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>प्रगति</span>
                  <span>{selectedCourse.progress}%</span>
                </div>
                <Progress value={selectedCourse.progress} className="h-2" />
              </div>
            )}

            {/* Expected Outcome */}
            <div className="p-4 bg-green-50 rounded-lg mb-4">
              <h4 className="font-semibold text-green-800 mb-2">पूर्ण होने पर</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCourse.expectedOutcome.skills.map((skill, i) => (
                  <Badge key={i} variant="outline" className="bg-white text-green-700 border-green-300">
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-green-700">
                कमाई: ₹{selectedCourse.expectedOutcome.potentialEarnings.min}-{selectedCourse.expectedOutcome.potentialEarnings.max}/{selectedCourse.expectedOutcome.potentialEarnings.unit === 'per_day' ? 'दिन' : 'माह'}
              </p>
            </div>

            {!selectedCourse.isEnrolled ? (
              <Button 
                onClick={() => handleEnroll(selectedCourse.id)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600"
              >
                नामांकन करें
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600">
                <Play className="w-4 h-4 mr-2" />
                जारी रखें
              </Button>
            )}
          </Card>

          {/* Modules */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">पाठ्यक्रम मॉड्यूल</h3>
            <div className="space-y-3">
              {selectedCourse.modules.map((module, index) => (
                <Card key={module.id} className={`p-4 ${module.completed ? 'border-green-200 bg-green-50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      module.completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {module.completed ? <CheckCircle className="w-5 h-5" /> : <span>{index + 1}</span>}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${module.completed ? 'text-green-800' : 'text-gray-900'}`}>
                        {module.title}
                      </p>
                      <p className="text-sm text-gray-500">{module.duration} मिनट</p>
                    </div>
                    <button 
                      onClick={() => setPlayingVideo(module.id)}
                      className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            <h1 className="text-xl font-bold text-gray-900 ml-4">कौशल विकास</h1>
          </div>
          <p className="text-sm text-gray-600">नए कौशल सीखें, बेहतर कमाई करें</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center border-orange-200">
            <p className="text-2xl font-bold text-orange-600">{enrolledCourses.length}</p>
            <p className="text-xs text-gray-600">नामांकित</p>
          </Card>
          <Card className="p-4 text-center border-green-200">
            <p className="text-2xl font-bold text-green-600">{mockCertificates.length}</p>
            <p className="text-xs text-gray-600">प्रमाण पत्र</p>
          </Card>
          <Card className="p-4 text-center border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{availableCourses.length}</p>
            <p className="text-xs text-gray-600">उपलब्ध</p>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">पाठ्यक्रम</TabsTrigger>
            <TabsTrigger value="my-learning">मेरी पढ़ाई</TabsTrigger>
            <TabsTrigger value="certificates">प्रमाण पत्र</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4 mt-4">
            {mockCourses.map((course) => (
              <Card 
                key={course.id} 
                onClick={() => setSelectedCourse(course)}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                    {getCategoryIcon(course.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.name.hi}</h3>
                        <p className="text-xs text-gray-500">{course.name.en}</p>
                      </div>
                      <Badge className={getCategoryColor(course.category)}>
                        {course.skillLevel === 'beginner' ? 'बेसिक' : 
                         course.skillLevel === 'intermediate' ? 'मध्यम' : 'उन्नत'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.totalDuration} घंटे
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {course.totalVideos} वीडियो
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {course.rating}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-green-600 font-medium">
                        ₹{course.expectedOutcome.potentialEarnings.min}-{course.expectedOutcome.potentialEarnings.max}/{course.expectedOutcome.potentialEarnings.unit === 'per_day' ? 'दिन' : 'माह'}
                      </p>
                      {course.isEnrolled ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          नामांकित
                        </Badge>
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* My Learning Tab */}
          <TabsContent value="my-learning" className="space-y-4 mt-4">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <Card key={course.id} className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-2xl">
                      {getCategoryIcon(course.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{course.name.hi}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={course.progress} className="w-24 h-2" />
                        <span className="text-sm text-gray-600">{course.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setSelectedCourse(course)}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      जारी रखें
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">अभी तक कोई पाठ्यक्रम नामांकित नहीं</p>
                <Button 
                  onClick={() => setActiveTab('courses')}
                  className="mt-4 bg-orange-500"
                >
                  पाठ्यक्रम देखें
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-4 mt-4">
            {mockCertificates.length > 0 ? (
              mockCertificates.map((cert) => (
                <Card key={cert.id} className="p-4 border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{cert.courseName}</h3>
                        {cert.verified && (
                          <Badge className="bg-blue-100 text-blue-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            सत्यापित
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">जारी: {cert.issueDate}</p>
                      <p className="text-sm text-gray-500">वैध till: {cert.expiryDate}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {cert.skills.map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDownloadCertificate(cert.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      डाउनलोड
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      साझा करें
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">अभी तक कोई प्रमाण पत्र नहीं</p>
                <p className="text-sm text-gray-500">पाठ्यक्रम पूरा करने पर प्रमाण पत्र मिलेगा</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
