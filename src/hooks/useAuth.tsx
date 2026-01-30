// Authentication Context and Hook for SAHAYOG
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AuthState, AuthContextType, User } from '@/types';
import { userOperations } from '@/lib/mongodb';

// Initial auth state
const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo (since we don't have actual Aadhaar API)
const mockUsers: Record<string, Partial<User>> = {
  '123456789012': {
    _id: 'user001',
    aadhaarNumber: 'XXXX-XXXX-9012',
    aadhaarVerified: true,
    fullName: 'रामलाल प्रसाद',
    fatherName: 'श्यामलाल प्रसाद',
    dateOfBirth: new Date('1975-08-15'),
    gender: 'male',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ramlal',
    phoneNumber: '9876543210',
    address: {
      village: 'रामपुर',
      gramPanchayat: 'रामपुर ग्राम पंचायत',
      block: 'सदर',
      district: 'वाराणसी',
      state: 'उत्तर प्रदेश',
      pincode: '221001',
      geoLocation: {
        type: 'Point',
        coordinates: [83.0076, 25.3176],
      },
    },
    category: 'SC',
    isDisabled: false,
    familyDetails: {
      maritalStatus: 'married',
      spouseName: 'सुनीता देवी',
      numberOfChildren: 2,
      children: [
        { name: 'राजेश', age: 18, gender: 'male', education: '12th' },
        { name: 'सीमा', age: 15, gender: 'female', education: '10th' },
      ],
      numberOfDependents: 3,
      elderlyInFamily: false,
      householdHead: true,
      familyType: 'nuclear',
    },
    economicInfo: {
      incomeLevel: 'BPL',
      annualIncome: 45000,
      incomeSource: ['agriculture', 'labor'],
      rationCardType: 'AAY',
      rationCardNumber: 'UP-AAY-123456',
      landOwnership: {
        ownsLand: true,
        landArea: 0.5,
        landType: 'rainfed',
        cropsGrown: ['wheat', 'rice'],
      },
      bankDetails: {
        accountNumber: 'XXXXXXXX1234',
        bankName: 'State Bank of India',
        branchName: 'रामपुर शाखा',
        ifscCode: 'SBIN0001234',
        isJanDhanAccount: true,
      },
      hasDebt: true,
      debtAmount: 50000,
      debtSource: 'moneylender',
    },
    mgnregaInfo: {
      hasJobCard: true,
      jobCardNumber: 'UP-12-123-456789',
      jobCardIssuedDate: new Date('2018-03-15'),
      registeredFamilyMembers: [
        { name: 'रामलाल प्रसाद', relation: 'self', age: 48, isActive: true },
        { name: 'सुनीता देवी', relation: 'spouse', age: 42, isActive: true },
      ],
      totalDaysWorkedThisYear: 46,
      totalDaysWorkedLifetime: 420,
      lastWorkDate: new Date('2026-01-10'),
      preferredWorkTypes: ['pond_excavation', 'road_construction'],
      maxTravelDistance: 5,
    },
    education: {
      highestQualification: 'primary',
      yearsOfEducation: 5,
      canRead: true,
      canWrite: false,
      languages: [
        { language: 'Hindi', proficiency: 'native' },
        { language: 'Bhojpuri', proficiency: 'native' },
      ],
    },
    skills: [
      {
        skillName: 'मिस्त्री',
        skillCategory: 'construction',
        proficiencyLevel: 'intermediate',
        yearsOfExperience: 10,
        isCertified: false,
      },
      {
        skillName: 'कृषि मजदूर',
        skillCategory: 'agriculture',
        proficiencyLevel: 'expert',
        yearsOfExperience: 25,
        isCertified: false,
      },
    ],
    healthInfo: {
      consentGiven: true,
      chronicConditions: ['back_pain'],
      requiresAccommodation: false,
      mentalWellbeingScore: 0.7,
    },
    painPoints: [
      {
        category: 'payment_delay',
        description: 'पिछले काम का पैसा 15 दिन से नहीं आया',
        detectedDate: new Date('2026-01-20'),
        severity: 'high',
        resolved: false,
      },
    ],
    enrolledSchemes: [
      {
        schemeId: 'mgnrega',
        schemeName: 'MGNREGA',
        enrollmentDate: new Date('2018-03-15'),
        status: 'active',
      },
      {
        schemeId: 'pm-kisan',
        schemeName: 'PM-KISAN',
        enrollmentDate: new Date('2019-02-01'),
        status: 'active',
      },
    ],
    preferences: {
      preferredLanguage: 'hi',
      preferredDialect: 'bhojpuri',
      uiMode: 'voice-picture',
      notificationPreferences: {
        sms: true,
        voiceCall: true,
        appPush: false,
        whatsapp: false,
      },
      voiceAssistantEnabled: true,
      textSize: 'large',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2026-01-25'),
    lastLoginAt: new Date('2026-01-25'),
    loginCount: 45,
    dataCompleteness: 85,
  },
  '987654321098': {
    _id: 'user002',
    aadhaarNumber: 'XXXX-XXXX-1098',
    aadhaarVerified: true,
    fullName: 'सुनीता देवी',
    fatherName: 'रामप्रसाद',
    dateOfBirth: new Date('1982-04-20'),
    gender: 'female',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunita',
    phoneNumber: '8765432109',
    address: {
      village: 'मोहनपुर',
      gramPanchayat: 'मोहनपुर ग्राम पंचायत',
      block: 'सदर',
      district: 'वाराणसी',
      state: 'उत्तर प्रदेश',
      pincode: '221002',
      geoLocation: {
        type: 'Point',
        coordinates: [83.0176, 25.3276],
      },
    },
    category: 'OBC',
    isDisabled: false,
    familyDetails: {
      maritalStatus: 'widowed',
      numberOfChildren: 3,
      children: [
        { name: 'अंkit', age: 12, gender: 'male', education: '6th' },
        { name: 'प्रिया', age: 10, gender: 'female', education: '4th' },
        { name: 'रोहन', age: 8, gender: 'male', education: '2nd' },
      ],
      numberOfDependents: 3,
      elderlyInFamily: false,
      householdHead: true,
      familyType: 'nuclear',
    },
    economicInfo: {
      incomeLevel: 'BPL',
      annualIncome: 30000,
      incomeSource: ['labor'],
      rationCardType: 'AAY',
      bankDetails: {
        accountNumber: 'XXXXXXXX5678',
        bankName: 'Bank of Baroda',
        ifscCode: 'BARB0MOHANP',
        isJanDhanAccount: true,
      },
      hasDebt: true,
      debtAmount: 30000,
      debtSource: 'relatives',
    },
    mgnregaInfo: {
      hasJobCard: true,
      jobCardNumber: 'UP-12-456-789012',
      totalDaysWorkedThisYear: 32,
      totalDaysWorkedLifetime: 280,
      lastWorkDate: new Date('2025-12-20'),
      preferredWorkTypes: ['plantation', 'pond_excavation'],
      maxTravelDistance: 3,
    },
    education: {
      highestQualification: 'illiterate',
      canRead: false,
      canWrite: false,
      languages: [{ language: 'Hindi', proficiency: 'native' }],
    },
    skills: [
      {
        skillName: 'सफाई कर्मचारी',
        skillCategory: 'sanitation',
        proficiencyLevel: 'expert',
        yearsOfExperience: 15,
        isCertified: false,
      },
    ],
    healthInfo: {
      consentGiven: true,
      mentalWellbeingScore: 0.5,
    },
    painPoints: [
      {
        category: 'no_work',
        description: '35 दिनों से काम नहीं मिला',
        detectedDate: new Date('2026-01-20'),
        severity: 'critical',
        resolved: false,
      },
    ],
    enrolledSchemes: [
      {
        schemeId: 'mgnrega',
        schemeName: 'MGNREGA',
        enrollmentDate: new Date('2019-05-10'),
        status: 'active',
      },
      {
        schemeId: 'widow-pension',
        schemeName: 'विधवा पेंशन',
        enrollmentDate: new Date('2020-01-15'),
        status: 'active',
      },
    ],
    preferences: {
      preferredLanguage: 'hi',
      uiMode: 'voice-picture',
      notificationPreferences: {
        sms: true,
        voiceCall: true,
        appPush: false,
        whatsapp: false,
      },
      voiceAssistantEnabled: true,
      textSize: 'extra-large',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2026-01-25'),
    lastLoginAt: new Date('2026-01-25'),
    loginCount: 23,
    dataCompleteness: 75,
  },
};

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [tempAadhaar, setTempAadhaar] = useState<string>('');

  // Login with Aadhaar
  const login = useCallback(async (aadhaarNumber: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate Aadhaar format (12 digits)
      if (!/^\d{12}$/.test(aadhaarNumber)) {
        throw new Error('कृपया सही 12 अंकों का आधार नंबर दर्ज करें');
      }
      
      // Store for OTP verification
      setTempAadhaar(aadhaarNumber);
      
      setAuthState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'लॉगिन में त्रुटि',
      }));
      throw error;
    }
  }, []);

  // Verify OTP
  const verifyOTP = useCallback(async (otp: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate OTP (6 digits)
      if (!/^\d{6}$/.test(otp)) {
        throw new Error('कृपया सही 6 अंकों का OTP दर्ज करें');
      }
      
      // Mock OTP verification (in real app, call actual API)
      if (otp === '123456' || otp === '000000') {
        // Get user data
        const userData = mockUsers[tempAadhaar];
        
        if (!userData) {
          throw new Error('इस आधार नंबर से कोई खाता नहीं मिला');
        }
        
        setAuthState({
          isAuthenticated: true,
          user: userData as User,
          loading: false,
          error: null,
        });
      } else {
        throw new Error('गलत OTP। कृपया फिर से प्रयास करें।');
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'OTP सत्यापन में त्रुटि',
      }));
      throw error;
    }
  }, [tempAadhaar]);

  // Logout
  const logout = useCallback(() => {
    setAuthState(initialAuthState);
    setTempAadhaar('');
  }, []);

  // Update user data
  const updateUser = useCallback((userData: Partial<User>) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }));
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    verifyOTP,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
