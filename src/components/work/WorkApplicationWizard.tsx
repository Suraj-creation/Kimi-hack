import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  IndianRupee,
  Users,
  CheckCircle2,
  ArrowRight,
  Home,
  Briefcase,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

interface WorkOpportunity {
  id: string;
  title: string;
  location: string;
  distance: number;
  startDate: string;
  endDate: string;
  wagePerDay: number;
  maxWorkers: number;
  availableSlots: number;
  category: string;
  description?: string;
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  isApplicant: boolean;
}

interface WorkApplicationWizardProps {
  work: WorkOpportunity;
  onClose: () => void;
  onSuccess?: (applicationNumber: string) => void;
}

export default function WorkApplicationWizard({
  work,
  onClose,
  onSuccess,
}: WorkApplicationWizardProps) {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([user?._id || '']);
  const [applicationNumber, setApplicationNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock family members from job card
  const familyMembers: FamilyMember[] = [
    {
      id: user?._id || '1',
      name: user?.fullName || 'रामलाल',
      relation: 'स्वयं',
      age: user?.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : 45,
      isApplicant: true,
    },
    {
      id: '2',
      name: 'सुनीता',
      relation: 'पत्नी',
      age: 42,
      isApplicant: false,
    },
    {
      id: '3',
      name: 'राजेश',
      relation: 'बेटा',
      age: 22,
      isApplicant: false,
    },
  ];

  const content = {
    hi: {
      step1: {
        title: 'क्या आप इस काम के लिए आवेदन करना चाहते हैं?',
        workLabel: 'काम',
        locationLabel: 'जगह',
        durationLabel: 'अवधि',
        wageLabel: 'मजदूरी',
        confirmButton: '✅ हाँ, आवेदन करें',
        cancelButton: '❌ रद्द करें',
        to: 'से',
        perDay: '/दिन',
        km: 'किमी',
      },
      step2: {
        title: 'कौन-कौन काम करेंगे?',
        subtitle: 'अपने परिवार के सदस्यों को चुनें',
        self: 'स्वयं',
        wife: 'पत्नी',
        son: 'बेटा',
        daughter: 'बेटी',
        nextButton: 'आगे बढ़ें',
        backButton: 'पीछे जाएं',
        selectAtLeast: 'कम से कम एक सदस्य चुनें',
        totalSelected: 'चयनित',
        members: 'सदस्य',
      },
      step3: {
        title: '✅ आवेदन सफल!',
        appNumber: 'आपका आवेदन नंबर',
        nextSteps: 'अगला कदम',
        smsNotification: '2 दिन में आपको SMS आएगा',
        reminder: 'काम शुरू होने से पहले फिर से याद दिलाएंगे',
        workStartDate: 'काम शुरू होने की तारीख',
        selectedMembers: 'चयनित सदस्य',
        homeButton: '🏠 होम जाएं',
        viewMoreButton: '📋 और काम देखें',
        success: 'बधाई हो!',
        successMessage: 'आपका आवेदन सफलतापूर्वक जमा हो गया है।',
      },
    },
    en: {
      step1: {
        title: 'Do you want to apply for this work?',
        workLabel: 'Work',
        locationLabel: 'Location',
        durationLabel: 'Duration',
        wageLabel: 'Wage',
        confirmButton: '✅ Yes, Apply',
        cancelButton: '❌ Cancel',
        to: 'to',
        perDay: '/day',
        km: 'km',
      },
      step2: {
        title: 'Who will work?',
        subtitle: 'Select your family members',
        self: 'Self',
        wife: 'Wife',
        son: 'Son',
        daughter: 'Daughter',
        nextButton: 'Next',
        backButton: 'Back',
        selectAtLeast: 'Select at least one member',
        totalSelected: 'Selected',
        members: 'members',
      },
      step3: {
        title: '✅ Application Successful!',
        appNumber: 'Your Application Number',
        nextSteps: 'Next Steps',
        smsNotification: 'You will receive SMS in 2 days',
        reminder: 'We will remind you before work starts',
        workStartDate: 'Work Start Date',
        selectedMembers: 'Selected Members',
        homeButton: '🏠 Go Home',
        viewMoreButton: '📋 View More Work',
        success: 'Congratulations!',
        successMessage: 'Your application has been submitted successfully.',
      },
    },
  };

  const t = content[currentLanguage.code as keyof typeof content] || content.hi;

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate application number
    const appNum = `APP-2026-${Math.random().toString().slice(2, 8)}`;
    setApplicationNumber(appNum);
    setStep(3);
    setIsSubmitting(false);

    // Call success callback
    if (onSuccess) {
      onSuccess(appNum);
    }
  };

  const renderStep1 = () => (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="text-xl text-center">{t.step1.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Work Details */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <Briefcase className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <div className="text-sm text-gray-600">{t.step1.workLabel}</div>
                <div className="text-lg font-semibold text-gray-900">{work.title}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">
                  {work.location} ({work.distance} {t.step1.km})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">
                  {work.startDate} {t.step1.to} {work.endDate}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">
                  ₹{work.wagePerDay}{t.step1.perDay}
                </span>
              </div>
            </div>
          </div>

          {/* Available Slots */}
          {work.availableSlots < 5 && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="ml-2 text-amber-800">
                केवल {work.availableSlots} जगह बाकी हैं। जल्दी आवेदन करें!
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setStep(2)}
            className="flex-1 bg-green-600 hover:bg-green-700 py-6 text-lg"
          >
            {t.step1.confirmButton}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 py-6 text-lg"
          >
            {t.step1.cancelButton}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="text-xl text-center">{t.step2.title}</CardTitle>
        <p className="text-sm text-gray-600 text-center mt-2">{t.step2.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Family Members Selection */}
        <div className="space-y-3">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedMembers.includes(member.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleMember(member.id)}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedMembers.includes(member.id)}
                  onCheckedChange={() => toggleMember(member.id)}
                />
                <Users className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{member.name}</div>
                  <div className="text-sm text-gray-600">
                    {member.relation} • {member.age} वर्ष
                  </div>
                </div>
                {member.isApplicant && (
                  <Badge variant="secondary" className="text-xs">
                    {t.step2.self}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">
              {t.step2.totalSelected}: {selectedMembers.length} {t.step2.members}
            </span>
            <span className="font-semibold text-blue-600">
              ₹{work.wagePerDay * selectedMembers.length}/दिन कुल
            </span>
          </div>
        </div>

        {/* Validation Alert */}
        {selectedMembers.length === 0 && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="ml-2 text-amber-800">
              {t.step2.selectAtLeast}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setStep(1)}
            variant="outline"
            className="flex-1 py-6"
          >
            {t.step2.backButton}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedMembers.length === 0 || isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-6"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                जमा हो रहा है...
              </>
            ) : (
              <>
                {t.step2.nextButton}
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => {
    const selectedMembersList = familyMembers.filter((m) =>
      selectedMembers.includes(m.id)
    );

    return (
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">
              {t.step3.title}
            </CardTitle>
            <p className="text-gray-600 mt-2">{t.step3.successMessage}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Application Number */}
          <div className="p-6 bg-white rounded-lg border-2 border-green-200 text-center">
            <div className="text-sm text-gray-600 mb-2">{t.step3.appNumber}</div>
            <div className="text-3xl font-bold text-blue-600 tracking-wider">
              {applicationNumber}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              इस नंबर को सुरक्षित रखें
            </p>
          </div>

          {/* Work Details Summary */}
          <div className="p-4 bg-white rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">काम</span>
              <span className="font-semibold">{work.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t.step3.workStartDate}</span>
              <span className="font-semibold">{work.startDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">स्थान</span>
              <span className="font-semibold">{work.location}</span>
            </div>
          </div>

          {/* Selected Members */}
          <div className="p-4 bg-white rounded-lg">
            <div className="text-sm text-gray-600 mb-3">{t.step3.selectedMembers}:</div>
            <div className="space-y-2">
              {selectedMembersList.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-gray-900">
                    {member.name} ({member.relation})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <Alert className="bg-blue-50 border-blue-200">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <div className="ml-3">
              <div className="font-semibold text-blue-900 mb-2">
                {t.step3.nextSteps}:
              </div>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• {t.step3.smsNotification}</li>
                <li>• {t.step3.reminder}</li>
                <li>• काम की तारीख: {work.startDate}</li>
              </ul>
            </div>
          </Alert>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="py-6"
            >
              <Home className="h-5 w-5 mr-2" />
              {t.step3.homeButton}
            </Button>
            <Button
              onClick={() => navigate('/mgnrega/work')}
              className="bg-blue-600 hover:bg-blue-700 py-6"
            >
              <Briefcase className="h-5 w-5 mr-2" />
              {t.step3.viewMoreButton}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Step Indicator */}
        <div className="mb-4 flex justify-center">
          <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step > 1 ? '✓' : '1'}
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= 2
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step > 2 ? '✓' : '2'}
            </div>
            <div className={`w-12 h-1 ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= 3
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step > 3 ? '✓' : '3'}
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
}
