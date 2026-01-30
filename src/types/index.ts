// SAHAYOG - Type Definitions
// Core types for the Rural Employment Platform

// User Profile Types
export interface User {
  _id: string;
  aadhaarNumber: string;
  aadhaarVerified: boolean;
  fullName: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  photoUrl?: string;
  phoneNumber: string;
  alternatePhone?: string;
  email?: string;
  address: Address;
  category: 'SC' | 'ST' | 'OBC' | 'General';
  religion?: string;
  isMinority?: boolean;
  isDisabled: boolean;
  disabilityType?: string;
  disabilityPercentage?: number;
  familyDetails: FamilyDetails;
  economicInfo: EconomicInfo;
  mgnregaInfo: MgnregaInfo;
  education: Education;
  skills: Skill[];
  healthInfo?: HealthInfo;
  painPoints: PainPoint[];
  enrolledSchemes: EnrolledScheme[];
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  loginCount: number;
  dataCompleteness: number;
}

export interface Address {
  houseNumber?: string;
  street?: string;
  village: string;
  villageLGDCode?: string;
  gramPanchayat?: string;
  gpLGDCode?: string;
  block: string;
  blockLGDCode?: string;
  district: string;
  districtLGDCode?: string;
  state: string;
  stateLGDCode?: string;
  pincode: string;
  geoLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface FamilyDetails {
  maritalStatus: 'married' | 'unmarried' | 'widowed' | 'divorced';
  spouseName?: string;
  numberOfChildren: number;
  children?: Child[];
  numberOfDependents: number;
  elderlyInFamily: boolean;
  householdHead: boolean;
  familyType?: 'nuclear' | 'joint';
}

export interface Child {
  name: string;
  age: number;
  gender: string;
  education?: string;
  occupation?: string;
}

export interface EconomicInfo {
  incomeLevel?: 'BPL' | 'APL';
  annualIncome?: number;
  incomeSource?: string[];
  rationCardType?: 'AAY' | 'PHH' | 'APL';
  rationCardNumber?: string;
  landOwnership?: LandOwnership;
  bankDetails?: BankDetails;
  hasDebt: boolean;
  debtAmount?: number;
  debtSource?: string;
}

export interface LandOwnership {
  ownsLand: boolean;
  landArea?: number;
  landType?: 'irrigated' | 'rainfed' | 'barren';
  cropsGrown?: string[];
}

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  branchName?: string;
  ifscCode: string;
  isJanDhanAccount?: boolean;
}

export interface MgnregaInfo {
  hasJobCard: boolean;
  jobCardNumber?: string;
  jobCardIssuedDate?: Date;
  registeredFamilyMembers?: FamilyMember[];
  totalDaysWorkedThisYear: number;
  totalDaysWorkedLifetime: number;
  lastWorkDate?: Date;
  preferredWorkTypes?: string[];
  maxTravelDistance?: number;
}

export interface FamilyMember {
  name: string;
  aadhaarNumber?: string;
  relation: string;
  age: number;
  isActive: boolean;
}

export interface Education {
  highestQualification: 'illiterate' | 'primary' | 'secondary' | 'graduate';
  yearsOfEducation?: number;
  canRead: boolean;
  canWrite: boolean;
  languages?: LanguageProficiency[];
}

export interface LanguageProficiency {
  language: string;
  proficiency: 'native' | 'fluent' | 'basic';
}

export interface Skill {
  skillName: string;
  skillCategory: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'expert';
  yearsOfExperience?: number;
  isCertified: boolean;
  certificateId?: string;
}

export interface HealthInfo {
  consentGiven: boolean;
  chronicConditions?: string[];
  requiresAccommodation?: boolean;
  accommodationType?: string;
  lastHealthCheckup?: Date;
  mentalWellbeingScore?: number;
  stressIndicators?: StressIndicator[];
}

export interface StressIndicator {
  date: Date;
  level: 'low' | 'medium' | 'high';
  source: string;
}

export interface PainPoint {
  category: 'payment_delay' | 'no_work' | 'harassment' | 'health' | 'other';
  description: string;
  detectedDate: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  conversationId?: string;
}

export interface EnrolledScheme {
  schemeId: string;
  schemeName: string;
  enrollmentDate: Date;
  status: 'active' | 'pending' | 'expired' | 'rejected';
  benefitReceived?: Benefit[];
}

export interface Benefit {
  date: Date;
  amount: number;
  type: string;
}

export interface UserPreferences {
  preferredLanguage: string;
  preferredDialect?: string;
  uiMode: 'voice-picture' | 'simple-text' | 'full-feature';
  notificationPreferences: {
    sms: boolean;
    voiceCall: boolean;
    appPush: boolean;
    whatsapp: boolean;
  };
  voiceAssistantEnabled: boolean;
  textSize: 'normal' | 'large' | 'extra-large';
}

// Work Opportunity Types
export interface WorkOpportunity {
  _id: string;
  workId: string;
  workType: string;
  workCategory: string;
  workTitle: LocalizedString;
  description: LocalizedString;
  location: WorkLocation;
  workDetails: WorkDetails;
  requirements: WorkRequirements;
  allocation: WorkAllocation;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdBy?: string;
  supervisorId?: string;
  mateId?: string;
  images?: WorkImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalizedString {
  en: string;
  hi: string;
  regional?: string;
}

export interface WorkLocation {
  village: string;
  villageLGDCode?: string;
  gramPanchayat?: string;
  gpLGDCode?: string;
  block: string;
  district: string;
  state: string;
  geoLocation: {
    type: 'Point';
    coordinates: [number, number];
  };
  workSiteAddress: string;
  landmarkNearby?: string;
}

export interface WorkDetails {
  estimatedDays: number;
  totalSlotsAvailable: number;
  slotsRemaining: number;
  startDate: Date;
  expectedEndDate: Date;
  wageRatePerDay: number;
  workingHours: {
    start: string;
    end: string;
  };
  facilitiesAvailable: {
    drinkingWater: boolean;
    shade: boolean;
    creche: boolean;
    firstAid: boolean;
  };
  toolsProvided: boolean;
  toolsList?: string[];
}

export interface WorkRequirements {
  minimumAge: number;
  maximumAge: number;
  skillsRequired: string[];
  physicalRequirements: 'light' | 'moderate' | 'heavy';
  genderRestriction: 'any' | 'women_only' | 'men_only';
  documentsRequired: string[];
}

export interface WorkAllocation {
  scStQuota: number;
  womenQuota: number;
  pwdQuota: number;
  allocatedWorkers: AllocatedWorker[];
  waitlistWorkers: WaitlistWorker[];
}

export interface AllocatedWorker {
  userId: string;
  name: string;
  allocatedDate: Date;
  status: 'confirmed' | 'completed' | 'dropped';
}

export interface WaitlistWorker {
  userId: string;
  position: number;
  addedDate: Date;
}

export interface WorkImage {
  url: string;
  caption?: string;
  uploadedAt: Date;
}

// Attendance Types
export interface Attendance {
  _id: string;
  userId: string;
  workOpportunityId: string;
  jobCardNumber: string;
  date: Date;
  presentStatus: 'present' | 'absent' | 'half_day';
  checkInTime?: Date;
  checkOutTime?: Date;
  hoursWorked?: number;
  workMeasurement?: WorkMeasurement;
  verification: AttendanceVerification;
  wageCalculation?: WageCalculation;
  paymentStatus: 'pending' | 'processed' | 'paid' | 'disputed';
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkMeasurement {
  measurementType: 'task_based' | 'time_based';
  quantityCompleted?: number;
  unit?: string;
  qualityRating?: 'satisfactory' | 'good' | 'excellent';
}

export interface AttendanceVerification {
  geoTaggedCheckIn?: {
    type: 'Point';
    coordinates: [number, number];
  };
  selfieUrl?: string;
  verifiedByMate: boolean;
  mateId?: string;
  verifiedAt?: Date;
}

export interface WageCalculation {
  dailyRate: number;
  amountEarned: number;
  deductions: number;
  netAmount: number;
}

// Payment Types
export interface Payment {
  _id: string;
  userId: string;
  paymentId: string;
  scheme: string;
  paymentType: 'wage' | 'benefit' | 'subsidy';
  grossAmount: number;
  deductions: Deduction[];
  netAmount: number;
  currency: string;
  paymentPeriod: {
    startDate: Date;
    endDate: Date;
    daysCount: number;
  };
  bankDetails: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountHolderName: string;
  };
  status: 'initiated' | 'processing' | 'completed' | 'failed' | 'reversed';
  statusHistory: StatusHistory[];
  ftoNumber?: string;
  transactionId?: string;
  utrNumber?: string;
  initiatedDate: Date;
  expectedDate?: Date;
  completedDate?: Date;
  hasGrievance: boolean;
  grievanceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deduction {
  type: string;
  amount: number;
  reason: string;
}

export interface StatusHistory {
  status: string;
  timestamp: Date;
  remarks?: string;
}

// Grievance Types
export interface Grievance {
  _id: string;
  grievanceNumber: string;
  userId: string;
  filingMethod: 'voice' | 'text' | 'agent' | 'ivr';
  filedAt: Date;
  category: 'payment_delay' | 'no_work' | 'harassment' | 'job_card' | 'other';
  subCategory?: string;
  description: {
    text: string;
    audioUrl?: string;
    audioDuration?: number;
  };
  relatedScheme: string;
  relatedWorkId?: string;
  relatedPaymentId?: string;
  attachments?: GrievanceAttachment[];
  aiAnalysis?: AIAnalysis;
  assignedTo?: AssignedOfficer;
  escalationHistory?: Escalation[];
  slaDetails: SLADetails;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'reopened';
  resolution?: Resolution;
  userFeedback?: UserFeedback;
  relatedConversationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrievanceAttachment {
  type: 'image' | 'document' | 'audio';
  url: string;
  description?: string;
  uploadedAt: Date;
}

export interface AIAnalysis {
  detectedCategory: string;
  confidence: number;
  suggestedPriority: string;
  similarGrievancesCount: number;
  recommendedAction: string;
}

export interface AssignedOfficer {
  officerId: string;
  officerName: string;
  designation: string;
  assignedAt: Date;
}

export interface Escalation {
  fromLevel: string;
  toLevel: string;
  reason: string;
  escalatedAt: Date;
}

export interface SLADetails {
  slaDeadline: Date;
  daysRemaining: number;
  isAtRisk: boolean;
  isBreached: boolean;
  breachDate?: Date;
}

export interface Resolution {
  resolvedAt: Date;
  resolvedBy: string;
  resolutionSummary: string;
  actionTaken: string;
  userNotified: boolean;
  notificationMethod?: string;
}

export interface UserFeedback {
  satisfied: boolean;
  rating: number;
  comments?: string;
  feedbackDate: Date;
}

// Scheme Types
export interface Scheme {
  _id: string;
  schemeCode: string;
  schemeName: {
    en: string;
    hi: string;
    regional?: Record<string, string>;
  };
  shortName: string;
  ministry: string;
  department: string;
  launchYear: number;
  description: {
    short: { en: string; hi: string };
    detailed: { en: string; hi: string };
  };
  benefits: SchemeBenefit[];
  eligibility: SchemeEligibility;
  applicationProcess: ApplicationProcess;
  isActive: boolean;
  applicableStates: string[];
  helplineNumber?: string;
  websiteUrl?: string;
  isPrimaryFocus: boolean;
  hasFullModule: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SchemeBenefit {
  type: 'cash' | 'subsidy' | 'insurance' | 'pension';
  amount: number;
  frequency: 'daily' | 'monthly' | 'annual' | 'one_time';
  description: string;
}

export interface SchemeEligibility {
  ageMin?: number;
  ageMax?: number;
  gender?: string[];
  categories?: string[];
  incomeLimit?: number;
  landOwnershipRequired?: boolean;
  landLimitMax?: number;
  ruralOnly?: boolean;
  stateSpecific?: string[];
  otherCriteria?: string[];
}

export interface ApplicationProcess {
  online: boolean;
  offline: boolean;
  documentsRequired: string[];
  applicationSteps: ApplicationStep[];
}

export interface ApplicationStep {
  step: number;
  description: { en: string; hi: string };
}

// Conversation Types
export interface Conversation {
  _id: string;
  userId: string;
  sessionId: string;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  channel: 'app' | 'ivr' | 'whatsapp' | 'web';
  language: string;
  dialect?: string;
  messages: Message[];
  summary: ConversationSummary;
  contextForNextSession?: NextSessionContext;
  userFeedback?: ConversationFeedback;
  geminiModelVersion?: string;
  totalTokensUsed?: number;
  responseLatencyAvg?: number;
}

export interface Message {
  messageId: string;
  timestamp: Date;
  role: 'user' | 'assistant' | 'system';
  content: string;
  audioUrl?: string;
  audioDuration?: number;
  intent?: string;
  entities?: Entity[];
  sentiment?: 'positive' | 'neutral' | 'negative' | 'distressed';
  sentimentScore?: number;
  extractedData?: ExtractedData;
}

export interface Entity {
  entityType: string;
  value: string;
  confidence: number;
}

export interface ExtractedData {
  field: string;
  value: unknown;
  confidence: number;
  requiresConfirmation: boolean;
}

export interface ConversationSummary {
  mainTopics: string[];
  userRequests: string[];
  actionsCompleted: string[];
  pendingActions: string[];
  dataFieldsUpdated: string[];
  issuesIdentified: Issue[];
}

export interface Issue {
  issue: string;
  severity: string;
  followUpRequired: boolean;
}

export interface NextSessionContext {
  lastTopic: string;
  unfinishedTasks: string[];
  userMood: string;
  importantMentions: string[];
}

export interface ConversationFeedback {
  rating: number;
  helpful: boolean;
  comments?: string;
}

// ML Model Types
export interface PriorityScore {
  userId: string;
  priorityScore: number;
  priorityRank: number;
  urgencyScore: number;
  vulnerabilityScore: number;
  entitlementScore: number;
  suitabilityScore: number;
  breakdown: ScoreBreakdown;
  modelBreakdown: ModelBreakdown;
  explanation: Explanation;
  calculatedAt: Date;
}

export interface ScoreBreakdown {
  urgency: { raw: number; weight: number; contribution: number };
  vulnerability: { raw: number; weight: number; contribution: number };
  poverty: { raw: number; weight: number; contribution: number };
  social_category: { raw: number; weight: number; contribution: number };
  gender: { raw: number; weight: number; contribution: number };
  disability: { raw: number; weight: number; contribution: number };
  rotation: { raw: number; weight: number; contribution: number };
}

export interface ModelBreakdown {
  rule_based: number;
  gradient_boosting: number;
  deep_learning: number;
}

export interface Explanation {
  top_factors: TopFactor[];
  score: number;
}

export interface TopFactor {
  feature: string;
  value: number | string;
  contribution: number;
  impact: 'increases' | 'decreases';
}

// Fraud Detection Types
export interface FraudDetection {
  userId: string;
  fraudProbability: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  signals: FraudSignals;
  recommendedAction: string;
  detectedAt: Date;
}

export interface FraudSignals {
  anomaly_score: number;
  ghost_probability: number;
  wage_theft_indicator: number;
  collusion_risk: number;
  location_fraud_score: number;
}

// Fairness Audit Types
export interface FairnessAudit {
  auditDate: Date;
  allocationResults: AllocationResult[];
  auditReport: AuditReport;
  violations: string[];
  isFair: boolean;
  recommendedActions: string[];
}

export interface AllocationResult {
  userId: string;
  allocated: boolean;
  caste_category: string;
  gender: string;
  disability_status: boolean;
  village_code: string;
  priority_score: number;
}

export interface AuditReport {
  demographic_parity: number;
  women_percentage: number;
  geographic_fairness: number;
  calibration_error: number;
  individual_fairness: number;
}

// Notification Types
export interface Notification {
  _id: string;
  userId: string;
  type: 'payment' | 'work' | 'grievance' | 'scheme' | 'alert';
  title: { en: string; hi: string };
  message: { en: string; hi: string };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: NotificationChannels;
  relatedEntity?: {
    type: string;
    entityId: string;
  };
  actionRequired: boolean;
  actionUrl?: string;
  expiresAt?: Date;
  createdAt: Date;
}

export interface NotificationChannels {
  app: { sent: boolean; sentAt?: Date; read: boolean; readAt?: Date };
  sms: { sent: boolean; sentAt?: Date };
  voiceCall: { sent: boolean; sentAt?: Date; answered?: boolean };
  whatsapp: { sent: boolean; sentAt?: Date; delivered?: boolean };
}

// Skill Course Types
export interface SkillCourse {
  _id: string;
  courseCode: string;
  courseName: {
    en: string;
    hi: string;
    regional?: Record<string, string>;
  };
  category: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  modules: CourseModule[];
  totalDuration: number;
  totalVideos: number;
  expectedOutcome: CourseOutcome;
  prerequisites: string[];
  targetAudience: string;
  isActive: boolean;
  isOfflineAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseModule {
  moduleNumber: number;
  title: { en: string; hi: string };
  videos: Video[];
  quizId?: string;
}

export interface Video {
  videoId: string;
  title: string;
  duration: number;
  videoUrl: string;
  thumbnailUrl?: string;
  languages: string[];
}

export interface CourseOutcome {
  skills: string[];
  certificationName?: string;
  potentialEarnings?: {
    min: number;
    max: number;
    unit: 'per_day' | 'per_month';
  };
}

// Auth Context Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (aadhaarNumber: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Language Types
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
}

// Dashboard Stats Types
export interface DashboardStats {
  daysWorked: number;
  daysRemaining: number;
  pendingPayments: number;
  pendingAmount: number;
  availableWorkCount: number;
  activeSchemes: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'work' | 'payment' | 'grievance' | 'scheme';
  description: string;
  date: Date;
  status?: string;
}
