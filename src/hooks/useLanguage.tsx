// Language Context and Hook for SAHAYOG
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'hi', name: 'हिंदी', nativeName: 'हिंदी', isRTL: false },
  { code: 'en', name: 'English', nativeName: 'English', isRTL: false },
  { code: 'bn', name: 'বাংলা', nativeName: 'বাংলা', isRTL: false },
  { code: 'te', name: 'తెలుగు', nativeName: 'తెలుగు', isRTL: false },
  { code: 'mr', name: 'मराठी', nativeName: 'मराठी', isRTL: false },
  { code: 'ta', name: 'தமிழ்', nativeName: 'தமிழ்', isRTL: false },
  { code: 'ur', name: 'اردو', nativeName: 'اردو', isRTL: true },
  { code: 'gu', name: 'ગુજરાતી', nativeName: 'ગુજરાતી', isRTL: false },
  { code: 'kn', name: 'ಕನ್ನಡ', nativeName: 'ಕನ್ನಡ', isRTL: false },
  { code: 'ml', name: 'മലയാളം', nativeName: 'മലയാളം', isRTL: false },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', nativeName: 'ਪੰਜਾਬੀ', isRTL: false },
  { code: 'or', name: 'ଓଡ଼ିଆ', nativeName: 'ଓଡ଼ିଆ', isRTL: false },
  { code: 'as', name: 'অসমীয়া', nativeName: 'অসমীয়া', isRTL: false },
  { code: 'bh', name: 'भोजपुरी', nativeName: 'भोजपुरी', isRTL: false },
  { code: 'aw', name: 'अवधी', nativeName: 'अवधी', isRTL: false },
  { code: 'rj', name: 'राजस्थानी', nativeName: 'राजस्थानी', isRTL: false },
  { code: 'hr', name: 'हरियाणवी', nativeName: 'हरियाणवी', isRTL: false },
  { code: 'ch', name: 'छत्तीसगढ़ी', nativeName: 'छत्तीसगढ़ी', isRTL: false },
  { code: 'ma', name: 'मगही', nativeName: 'मगही', isRTL: false },
  { code: 'ne', name: 'नेपाली', nativeName: 'नेपाली', isRTL: false },
  { code: 'sd', name: 'सिंधी', nativeName: 'सिंधी', isRTL: false },
  { code: 'sa', name: 'संस्कृत', nativeName: 'संस्कृत', isRTL: false },
];

// Translation dictionary
const TRANSLATIONS: Record<string, Record<string, string>> = {
  hi: {
    // Common
    'app.name': 'सहयोग',
    'app.tagline': 'ग्रामीण रोजगार का साथी',
    'loading': 'लोड हो रहा है...',
    'error': 'त्रुटि',
    'success': 'सफल',
    'cancel': 'रद्द करें',
    'confirm': 'पुष्टि करें',
    'save': 'सेव करें',
    'next': 'आगे',
    'back': 'पीछे',
    'close': 'बंद करें',
    'search': 'खोजें',
    'filter': 'फ़िल्टर',
    'sort': 'क्रमबद्ध करें',
    
    // Auth
    'auth.login.title': 'आधार से लॉगिन करें',
    'auth.login.subtitle': 'अपना 12 अंकों का आधार नंबर दर्ज करें',
    'auth.login.aadhaar.label': 'आधार नंबर',
    'auth.login.aadhaar.placeholder': '1234 5678 9012',
    'auth.login.consent': 'मैं अपना आधार डेटा साझा करने की सहमति देता/देती हूं',
    'auth.login.submit': 'OTP प्राप्त करें',
    'auth.login.jobcard': 'जॉब कार्ड से लॉगिन करें',
    'auth.login.help': 'आधार नंबर कैसे पता करें?',
    
    'auth.otp.title': 'OTP सत्यापन',
    'auth.otp.subtitle': 'आपके आधार से जुड़े मोबाइल नंबर पर OTP भेजा गया है',
    'auth.otp.label': 'OTP दर्ज करें',
    'auth.otp.resend': 'OTP फिर से भेजें',
    'auth.otp.timer': 'सेकंड में OTP फिर से भेजें',
    'auth.otp.submit': 'सत्यापित करें',
    
    'auth.profile.title': 'क्या यह जानकारी सही है?',
    'auth.profile.confirm': 'हाँ, सही है',
    'auth.profile.edit': 'कुछ गलत है',
    
    'auth.language.title': 'भाषा चुनें',
    'auth.language.subtitle': 'आप किस भाषा में बात करना चाहते हैं?',
    'auth.language.voice': 'क्या आप आवाज़ से बात करना पसंद करते हैं?',
    
    // Dashboard
    'dashboard.welcome': 'नमस्ते {name} जी!',
    'dashboard.stats.days_worked': 'काम के दिन',
    'dashboard.stats.days_remaining': 'बाकी दिन',
    'dashboard.stats.pending_payments': 'बाकी पैसे',
    'dashboard.stats.available_work': 'उपलब्ध काम',
    'dashboard.mgnrega.title': 'मनरेगा',
    'dashboard.mgnrega.subtitle': 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम',
    'dashboard.mgnrega.days': '{worked} / {total} दिन',
    'dashboard.quick_actions': 'त्वरित कार्य',
    'dashboard.view_work': 'काम देखें',
    'dashboard.track_payment': 'पैसे ट्रैक करें',
    'dashboard.file_complaint': 'शिकायत दर्ज करें',
    'dashboard.my_schemes': 'मेरी योजनाएं',
    'dashboard.suggested_schemes': 'सुझाई गई योजनाएं',
    'dashboard.recent_activity': 'हाल की गतिविधि',
    'dashboard.view_all': 'सभी देखें',
    
    // MGNREGA
    'mgnrega.title': 'मनरेगा',
    'mgnrega.job_card': 'जॉब कार्ड',
    'mgnrega.job_card_number': 'जॉब कार्ड नंबर',
    'mgnrega.days_worked': 'काम के दिन',
    'mgnrega.days_remaining': 'बाकी दिन',
    'mgnrega.pending_payments': 'बाकी पैसे',
    'mgnrega.available_work': 'उपलब्ध काम',
    'mgnrega.work_history': 'काम का इतिहास',
    'mgnrega.attendance': 'उपस्थिति',
    'mgnrega.payments': 'भुगतान',
    'mgnrega.grievance': 'शिकायत',
    'mgnrega.rights': 'अधिकार',
    'mgnrega.contacts': 'संपर्क',
    
    // Work
    'work.title': 'उपलब्ध काम',
    'work.nearby': 'आपके पास के काम',
    'work.distance': '{distance} किमी दूर',
    'work.wage': '₹{amount}/दिन',
    'work.days': '{days} दिन',
    'work.slots': '{remaining} / {total} जगह बाकी',
    'work.facilities': 'सुविधाएं',
    'work.facilities.water': 'पानी',
    'work.facilities.shade': 'छाया',
    'work.facilities.creche': 'शिशु गृह',
    'work.facilities.firstaid': 'प्राथमिक चिकित्सा',
    'work.apply': 'आवेदन करें',
    'work.applied': 'आवेदन हो गया',
    'work.filter.distance': 'दूरी',
    'work.filter.type': 'काम का प्रकार',
    'work.view_map': 'मानचित्र देखें',
    
    // Attendance
    'attendance.title': 'उपस्थिति',
    'attendance.this_year': 'इस साल',
    'attendance.days_worked': '{days} दिन काम किया',
    'attendance.days_remaining': '{days} दिन बाकी',
    'attendance.calendar.present': 'उपस्थित',
    'attendance.calendar.absent': 'अनुपस्थित',
    'attendance.calendar.half': 'आधा दिन',
    'attendance.calendar.holiday': 'छुट्टी',
    'attendance.monthly': 'मासिक दृश्य',
    'attendance.family': 'परिवार का दृश्य',
    'attendance.export': 'सर्टिफिकेट डाउनलोड करें',
    
    // Payments
    'payments.title': 'भुगतान',
    'payments.pending': 'बाकी पैसे',
    'payments.pending_amount': '₹{amount}',
    'payments.expected_date': 'अनुमानित तारीख: {date}',
    'payments.history': 'भुगतान इतिहास',
    'payments.received': '₹{amount} | {date} | {work}',
    'payments.total_this_year': 'इस साल कुल: ₹{amount}',
    'payments.raise_issue': 'समस्या बताएं',
    'payments.status.pending': 'प्रोसेसिंग में',
    'payments.status.paid': 'भुगतान हो गया',
    'payments.status.failed': 'विफल',
    
    // Grievance
    'grievance.title': 'शिकायत',
    'grievance.file_new': 'नई शिकायत दर्ज करें',
    'grievance.my_complaints': 'मेरी शिकायतें',
    'grievance.voice_title': 'अपनी शिकायत बोलकर बताएं',
    'grievance.voice_subtitle': 'माइक्रोफोन बटन दबाकर बोलें',
    'grievance.categories': 'शिकायत की श्रेणी',
    'grievance.category.payment_delay': 'पैसा नहीं आया',
    'grievance.category.no_work': 'काम नहीं मिला',
    'grievance.category.harassment': 'परेशानी',
    'grievance.category.job_card': 'जॉब कार्ड समस्या',
    'grievance.category.other': 'अन्य',
    'grievance.submit': 'शिकायत दर्ज करें',
    'grievance.success': 'शिकायत सफलतापूर्वक दर्ज हो गई',
    'grievance.number': 'शिकायत नंबर: {number}',
    'grievance.sla': '5 दिनों में समाधान का वादा',
    'grievance.status.open': 'खुली',
    'grievance.status.in_progress': 'प्रगति में',
    'grievance.status.resolved': 'हल हो गई',
    'grievance.status.closed': 'बंद',
    
    // AI Assistant
    'ai.title': 'सहयोग साथी',
    'ai.subtitle': 'AI सहायक',
    'ai.placeholder': 'कुछ भी पूछें...',
    'ai.voice_hint': 'माइक्रोफोन दबाकर बोलें',
    'ai.examples': 'उदाहरण प्रश्न:',
    'ai.example1': 'मुझे काम चाहिए',
    'ai.example2': 'मेरा पैसा कब आएगा?',
    'ai.example3': 'मैंने कितने दिन काम किया?',
    'ai.example4': 'शिकायत करनी है',
    'ai.listening': 'सुन रहा हूं...',
    'ai.thinking': 'सोच रहा हूं...',
    'ai.speaking': 'बोल रहा हूं...',
    
    // Schemes
    'schemes.title': 'सरकारी योजनाएं',
    'schemes.eligible': 'आपके लिए पात्र योजनाएं',
    'schemes.enrolled': 'आपकी योजनाएं',
    'schemes.pm_kisan': 'PM-KISAN',
    'schemes.pm_sym': 'PM-SYM पेंशन',
    'schemes.nrlm': 'DAY-NRLM',
    'schemes.pmkvy': 'PMKVY कौशल विकास',
    'schemes.widow_pension': 'विधवा पेंशन',
    'schemes.old_age_pension': 'वृद्धावस्था पेंशन',
    
    // Notifications
    'notifications.title': 'सूचनाएं',
    'notifications.empty': 'कोई नई सूचना नहीं',
    'notifications.mark_all_read': 'सभी पढ़ा हुआ मार्क करें',
    'notifications.priority.high': 'जरूरी',
    'notifications.priority.medium': 'मध्यम',
    'notifications.priority.low': 'सामान्य',
    
    // Profile
    'profile.title': 'मेरी प्रोफाइल',
    'profile.personal': 'व्यक्तिगत जानकारी',
    'profile.family': 'परिवार की जानकारी',
    'profile.economic': 'आर्थिक जानकारी',
    'profile.documents': 'दस्तावेज',
    'profile.settings': 'सेटिंग्स',
    'profile.edit': 'संपादित करें',
    'profile.logout': 'लॉग आउट',
    
    // Help
    'help.title': 'मदद',
    'help.faq': 'अक्सर पूछे जाने वाले प्रश्न',
    'help.contact': 'संपर्क करें',
    'help.emergency': 'आपातकालीन संपर्क',
    'help.video_tutorials': 'वीडियो ट्यूटोरियल',
    
    // Footer
    'footer.about': 'सहयोग के बारे में',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'नियम और शर्तें',
    'footer.contact': 'संपर्क करें',
    'footer.copyright': '© 2026 SAHAYOG. सर्वाधिकार सुरक्षित।',
  },
  en: {
    // Common
    'app.name': 'SAHAYOG',
    'app.tagline': 'Rural Employment Companion',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'cancel': 'Cancel',
    'confirm': 'Confirm',
    'save': 'Save',
    'next': 'Next',
    'back': 'Back',
    'close': 'Close',
    'search': 'Search',
    'filter': 'Filter',
    'sort': 'Sort',
    
    // Auth
    'auth.login.title': 'Login with Aadhaar',
    'auth.login.subtitle': 'Enter your 12-digit Aadhaar number',
    'auth.login.aadhaar.label': 'Aadhaar Number',
    'auth.login.aadhaar.placeholder': '1234 5678 9012',
    'auth.login.consent': 'I consent to share my Aadhaar data',
    'auth.login.submit': 'Get OTP',
    'auth.login.jobcard': 'Login with Job Card',
    'auth.login.help': 'How to find Aadhaar number?',
    
    'auth.otp.title': 'OTP Verification',
    'auth.otp.subtitle': 'OTP sent to mobile linked with your Aadhaar',
    'auth.otp.label': 'Enter OTP',
    'auth.otp.resend': 'Resend OTP',
    'auth.otp.timer': 'Resend OTP in seconds',
    'auth.otp.submit': 'Verify',
    
    'auth.profile.title': 'Is this information correct?',
    'auth.profile.confirm': 'Yes, correct',
    'auth.profile.edit': 'Something is wrong',
    
    'auth.language.title': 'Select Language',
    'auth.language.subtitle': 'Which language do you prefer?',
    'auth.language.voice': 'Do you prefer voice interaction?',
    
    // Dashboard
    'dashboard.welcome': 'Welcome {name}!',
    'dashboard.stats.days_worked': 'Days Worked',
    'dashboard.stats.days_remaining': 'Days Remaining',
    'dashboard.stats.pending_payments': 'Pending Payments',
    'dashboard.stats.available_work': 'Available Work',
    'dashboard.mgnrega.title': 'MGNREGA',
    'dashboard.mgnrega.subtitle': 'Mahatma Gandhi National Rural Employment Guarantee',
    'dashboard.mgnrega.days': '{worked} / {total} days',
    'dashboard.quick_actions': 'Quick Actions',
    'dashboard.view_work': 'View Work',
    'dashboard.track_payment': 'Track Payment',
    'dashboard.file_complaint': 'File Complaint',
    'dashboard.my_schemes': 'My Schemes',
    'dashboard.suggested_schemes': 'Suggested Schemes',
    'dashboard.recent_activity': 'Recent Activity',
    'dashboard.view_all': 'View All',
    
    // MGNREGA
    'mgnrega.title': 'MGNREGA',
    'mgnrega.job_card': 'Job Card',
    'mgnrega.job_card_number': 'Job Card Number',
    'mgnrega.days_worked': 'Days Worked',
    'mgnrega.days_remaining': 'Days Remaining',
    'mgnrega.pending_payments': 'Pending Payments',
    'mgnrega.available_work': 'Available Work',
    'mgnrega.work_history': 'Work History',
    'mgnrega.attendance': 'Attendance',
    'mgnrega.payments': 'Payments',
    'mgnrega.grievance': 'Grievance',
    'mgnrega.rights': 'Rights',
    'mgnrega.contacts': 'Contacts',
    
    // Work
    'work.title': 'Available Work',
    'work.nearby': 'Work Near You',
    'work.distance': '{distance} km away',
    'work.wage': '₹{amount}/day',
    'work.days': '{days} days',
    'work.slots': '{remaining} / {total} slots left',
    'work.facilities': 'Facilities',
    'work.facilities.water': 'Water',
    'work.facilities.shade': 'Shade',
    'work.facilities.creche': 'Creche',
    'work.facilities.firstaid': 'First Aid',
    'work.apply': 'Apply',
    'work.applied': 'Applied',
    'work.filter.distance': 'Distance',
    'work.filter.type': 'Work Type',
    'work.view_map': 'View Map',
    
    // Attendance
    'attendance.title': 'Attendance',
    'attendance.this_year': 'This Year',
    'attendance.days_worked': 'Worked {days} days',
    'attendance.days_remaining': '{days} days remaining',
    'attendance.calendar.present': 'Present',
    'attendance.calendar.absent': 'Absent',
    'attendance.calendar.half': 'Half Day',
    'attendance.calendar.holiday': 'Holiday',
    'attendance.monthly': 'Monthly View',
    'attendance.family': 'Family View',
    'attendance.export': 'Download Certificate',
    
    // Payments
    'payments.title': 'Payments',
    'payments.pending': 'Pending Amount',
    'payments.pending_amount': '₹{amount}',
    'payments.expected_date': 'Expected by: {date}',
    'payments.history': 'Payment History',
    'payments.received': '₹{amount} | {date} | {work}',
    'payments.total_this_year': 'Total this year: ₹{amount}',
    'payments.raise_issue': 'Report Issue',
    'payments.status.pending': 'Processing',
    'payments.status.paid': 'Paid',
    'payments.status.failed': 'Failed',
    
    // Grievance
    'grievance.title': 'Grievance',
    'grievance.file_new': 'File New Complaint',
    'grievance.my_complaints': 'My Complaints',
    'grievance.voice_title': 'Speak Your Complaint',
    'grievance.voice_subtitle': 'Press microphone button and speak',
    'grievance.categories': 'Complaint Category',
    'grievance.category.payment_delay': 'Payment Not Received',
    'grievance.category.no_work': 'No Work Available',
    'grievance.category.harassment': 'Harassment',
    'grievance.category.job_card': 'Job Card Issue',
    'grievance.category.other': 'Other',
    'grievance.submit': 'Submit Complaint',
    'grievance.success': 'Complaint submitted successfully',
    'grievance.number': 'Complaint Number: {number}',
    'grievance.sla': 'Resolution promised in 5 days',
    'grievance.status.open': 'Open',
    'grievance.status.in_progress': 'In Progress',
    'grievance.status.resolved': 'Resolved',
    'grievance.status.closed': 'Closed',
    
    // AI Assistant
    'ai.title': 'SAHAYOG Saathi',
    'ai.subtitle': 'AI Assistant',
    'ai.placeholder': 'Ask anything...',
    'ai.voice_hint': 'Press microphone to speak',
    'ai.examples': 'Example questions:',
    'ai.example1': 'I need work',
    'ai.example2': 'When will I get paid?',
    'ai.example3': 'How many days have I worked?',
    'ai.example4': 'I want to file a complaint',
    'ai.listening': 'Listening...',
    'ai.thinking': 'Thinking...',
    'ai.speaking': 'Speaking...',
    
    // Schemes
    'schemes.title': 'Government Schemes',
    'schemes.eligible': 'Schemes You Qualify For',
    'schemes.enrolled': 'Your Schemes',
    'schemes.pm_kisan': 'PM-KISAN',
    'schemes.pm_sym': 'PM-SYM Pension',
    'schemes.nrlm': 'DAY-NRLM',
    'schemes.pmkvy': 'PMKVY Skill Development',
    'schemes.widow_pension': 'Widow Pension',
    'schemes.old_age_pension': 'Old Age Pension',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.empty': 'No new notifications',
    'notifications.mark_all_read': 'Mark all as read',
    'notifications.priority.high': 'High',
    'notifications.priority.medium': 'Medium',
    'notifications.priority.low': 'Low',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.personal': 'Personal Information',
    'profile.family': 'Family Information',
    'profile.economic': 'Economic Information',
    'profile.documents': 'Documents',
    'profile.settings': 'Settings',
    'profile.edit': 'Edit',
    'profile.logout': 'Logout',
    
    // Help
    'help.title': 'Help',
    'help.faq': 'Frequently Asked Questions',
    'help.contact': 'Contact Us',
    'help.emergency': 'Emergency Contacts',
    'help.video_tutorials': 'Video Tutorials',
    
    // Footer
    'footer.about': 'About SAHAYOG',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.contact': 'Contact Us',
    'footer.copyright': '© 2026 SAHAYOG. All rights reserved.',
  },
};

// Language Context Type
interface LanguageContextType {
  currentLanguage: typeof SUPPORTED_LANGUAGES[0];
  setLanguage: (code: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

// Create Language Context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language Provider Component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState(SUPPORTED_LANGUAGES[0]);

  const setLanguage = useCallback((code: string) => {
    const language = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (language) {
      setCurrentLanguage(language);
      // Store preference
      localStorage.setItem('sahayog_language', code);
    }
  }, []);

  // Load saved language preference
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('sahayog_language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, [setLanguage]);

  // Translation function
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const translations = TRANSLATIONS[currentLanguage.code] || TRANSLATIONS['en'];
    let text = translations[key] || key;
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, String(value));
      });
    }
    
    return text;
  }, [currentLanguage]);

  const contextValue: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language context
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default useLanguage;
