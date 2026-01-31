// SAHAYOG - Geography & Living Shelf of Works Type Definitions
// Dynamic, Geography-Driven Planning System for MGNREGA

// ========================================
// PART 1: GEOGRAPHY PROFILING
// ========================================

export interface VillageGeographyProfile {
  _id: string;
  villageLGDCode: string;
  villageName: string;
  block: string;
  district: string;
  state: string;
  
  // Geography Attributes
  geographyDNA: GeographyDNA;
  
  // External Data Sources
  dataSources: DataSources;
  
  // Generated Asset Recommendations
  recommendedAssets: AssetRecommendation[];
  
  // Living Shelf of Works
  livingShelf: LivingShelfOfWorks;
  
  // AI Predictions
  demandForecasts: DemandForecast[];
  
  lastUpdated: Date;
  profileVersion: string;
}

export interface GeographyDNA {
  // Terrain & Topology
  terrain: {
    type: 'hilly' | 'plain' | 'plateau' | 'forest_fringe' | 'coastal' | 'riverine';
    slope: 'steep' | 'moderate' | 'gentle' | 'flat';
    elevation: {
      min: number;
      max: number;
      avg: number;
      unit: 'meters';
    };
    landform: string; // 'valley', 'ridge', 'escarpment', etc.
  };
  
  // Soil Properties
  soil: {
    type: 'laterite' | 'alluvial' | 'black' | 'red' | 'sandy' | 'clayey';
    texture: 'coarse' | 'medium' | 'fine';
    depth: 'shallow' | 'medium' | 'deep';
    drainage: 'poor' | 'moderate' | 'good' | 'excessive';
    fertility: 'low' | 'medium' | 'high';
    erosionProne: boolean;
    waterHoldingCapacity: 'low' | 'medium' | 'high';
    pH: number;
    source: 'NBSS&LUP' | 'survey';
  };
  
  // Water & Hydrology
  water: {
    rainfallZone: 'high' | 'medium' | 'low' | 'scanty';
    annualRainfall: {
      mm: number;
      variability: 'stable' | 'erratic' | 'highly_variable';
    };
    waterStress: 'none' | 'seasonal' | 'perennial' | 'acute';
    waterBodies: {
      ponds: number;
      tanks: number;
      rivers: number;
      canals: number;
    };
    drainagePattern: 'dendritic' | 'parallel' | 'radial' | 'poor';
    floodProne: boolean;
    groundwaterLevel: 'shallow' | 'medium' | 'deep' | 'critical';
    irrigationStatus: 'none' | 'partial' | 'full';
  };
  
  // Land Use & Cover
  landUse: {
    agricultural: number; // percentage
    forest: number;
    barren: number;
    wasteland: number;
    builtUp: number;
    waterbodies: number;
    source: 'satellite' | 'survey';
    degradedLand: number;
    fallowLand: number;
  };
  
  // Climate & Seasonal Patterns
  climate: {
    zone: 'tropical' | 'subtropical' | 'temperate' | 'arid' | 'semi_arid';
    temperatureRange: {
      min: number;
      max: number;
      unit: 'celsius';
    };
    seasonalPattern: {
      monsoon: { start: string; end: string; intensity: string; };
      winter: { start: string; end: string; };
      summer: { start: string; end: string; };
    };
    droughtProne: boolean;
    heatwaveProne: boolean;
    cycloneProne: boolean;
  };
  
  // Forest & Ecology
  forest: {
    coverPercentage: number;
    forestType: 'dense' | 'open' | 'scrub' | 'none';
    forestFringe: boolean;
    biodiversityZone: boolean;
    scheduledArea: boolean;
    forestRights: boolean;
  };
  
  // Socio-Economic Context
  socioEconomic: {
    totalPopulation: number;
    totalHouseholds: number;
    scPopulation: number;
    stPopulation: number;
    mgnregaJobCards: number;
    averageEmploymentDemand: number; // days per year
    migrationLevel: 'high' | 'medium' | 'low';
    literacyRate: number;
    connectivityScore: number; // 0-100
  };
}

export interface DataSources {
  // Government Data Sources (Integration Points)
  nbssLup: { // National Bureau of Soil Survey & Land Use Planning
    integrated: boolean;
    lastSync: Date;
    url?: string;
  };
  isro: { // Indian Space Research Organisation
    demData: boolean; // Digital Elevation Model
    satelliteImagery: boolean;
    lastSync: Date;
  };
  imd: { // India Meteorological Department
    rainfallData: boolean;
    lastSync: Date;
  };
  fsi: { // Forest Survey of India
    forestCoverData: boolean;
    lastSync: Date;
  };
  watershedAtlas: {
    integrated: boolean;
    watershedCode?: string;
    microWatershedCode?: string;
  };
  nrsc: { // National Remote Sensing Centre
    wastelandAtlas: boolean;
    lastSync: Date;
  };
  // MGNREGA MIS Data
  mgnregaMIS: {
    historicalWorkData: boolean;
    demandData: boolean;
    lastSync: Date;
  };
}

// ========================================
// PART 2: ASSET SUGGESTION ENGINE
// ========================================

export interface AssetRecommendation {
  assetId: string;
  assetCode: string;
  assetType: MGNREGAAssetType;
  assetName: LocalizedString;
  category: AssetCategory;
  
  // Recommendation Scoring
  recommendation: {
    score: number; // 0-100
    rank: number;
    confidence: 'high' | 'medium' | 'low';
    reasoning: string; // AI-generated explanation
    geographyMatch: GeographyMatchScore;
  };
  
  // Asset Specifications
  specifications: AssetSpecification;
  
  // Labour & Economics
  labourDetails: LabourRequirements;
  
  // Feasibility
  feasibility: FeasibilityAnalysis;
  
  // Micro-Tasks (For Parallel Employment)
  microTasks: MicroTask[];
  
  // DPR Status
  dprStatus: {
    status: 'not_started' | 'draft' | 'auto_generated' | 'engineer_reviewed' | 'approved';
    autoGenerated: boolean;
    dprId?: string;
  };
  
  generatedAt: Date;
  validUntil: Date;
}

export interface GeographyMatchScore {
  terrainMatch: number; // 0-100
  soilMatch: number;
  waterMatch: number;
  seasonalMatch: number;
  overallMatch: number;
  matchCriteria: string[];
}

export type MGNREGAAssetType = 
  // Water Conservation
  | 'farm_pond'
  | 'check_dam'
  | 'percolation_tank'
  | 'water_harvesting_structure'
  | 'drainage_channel'
  | 'contour_bund'
  | 'gabion_structure'
  | 'tank_desilting'
  
  // Land Development
  | 'land_leveling'
  | 'bunding'
  | 'terracing'
  | 'gully_plugging'
  | 'wasteland_development'
  | 'soil_conservation'
  
  // Rural Infrastructure
  | 'rural_road'
  | 'rural_drain'
  | 'community_pond'
  | 'playground'
  | 'cremation_ground'
  
  // Plantation & Forestry
  | 'plantation'
  | 'horticulture_development'
  | 'pasture_development'
  | 'agroforestry'
  
  // Agriculture Support
  | 'irrigation_channel'
  | 'field_channel'
  | 'vermicompost_unit'
  | 'seed_storage'
  
  // Livelihood Assets
  | 'livestock_shed'
  | 'poultry_unit'
  | 'fishery'
  | 'sericulture';

export type AssetCategory = 
  | 'water_conservation'
  | 'land_development'
  | 'rural_connectivity'
  | 'agriculture'
  | 'livelihood'
  | 'forestry'
  | 'infrastructure';

export interface AssetSpecification {
  estimatedCost: number;
  materialLabourRatio: number; // percentage material
  estimatedDuration: number; // days
  totalLabourDays: number;
  skillLevel: 'unskilled' | 'semi_skilled' | 'skilled';
  technicalSupervision: boolean;
  materialsRequired: Material[];
  toolsRequired: string[];
  safetyMeasures: string[];
}

export interface Material {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
}

export interface LabourRequirements {
  minWorkers: number;
  maxWorkers: number;
  optimalWorkers: number;
  totalManDays: number;
  wageRate: number;
  totalWageComponent: number;
  
  // Gender & Category Distribution
  preferredDistribution: {
    women: number; // percentage
    scSt: number;
    pwd: number;
  };
  
  // Work Type Distribution
  workTypes: {
    heavyWork: number; // percentage
    moderateWork: number;
    lightWork: number;
  };
}

export interface FeasibilityAnalysis {
  technical: {
    feasible: boolean;
    constraints: string[];
    preconditions: string[];
  };
  
  seasonal: {
    bestMonths: string[];
    avoidMonths: string[];
    weatherDependent: boolean;
  };
  
  social: {
    communityConsent: 'required' | 'not_required' | 'obtained';
    landAvailability: 'available' | 'to_be_acquired' | 'disputed';
    beneficiaries: number;
  };
  
  economic: {
    benefitCostRatio: number;
    impactScore: number; // 0-100
    sustainability: 'high' | 'medium' | 'low';
  };
  
  environmental: {
    environmentalClearance: boolean;
    ecologicalImpact: 'positive' | 'neutral' | 'negative';
    climateResilience: number; // 0-100
  };
}

// ========================================
// PART 3: MICRO-TASK SYSTEM
// ========================================

export interface MicroTask {
  taskId: string;
  taskName: LocalizedString;
  taskSequence: number;
  
  // Task Properties
  taskType: 'survey' | 'excavation' | 'construction' | 'plantation' | 'maintenance';
  workIntensity: 'light' | 'moderate' | 'heavy';
  skillRequired: 'unskilled' | 'semi_skilled' | 'skilled';
  
  // Labour Allocation
  workersNeeded: number;
  estimatedDays: number;
  totalManDays: number;
  
  // Gender Suitability
  suitableFor: {
    women: boolean;
    men: boolean;
    elderly: boolean;
    pwd: boolean;
  };
  
  // Dependencies
  dependencies: string[]; // taskIds that must complete first
  canRunParallel: boolean;
  parallelWith: string[]; // taskIds that can run simultaneously
  
  // Economics
  wagePerDay: number;
  totalWageCost: number;
  materialCost: number;
  
  // Tools & Materials
  toolsNeeded: string[];
  materialsNeeded: Material[];
  
  // Timing
  estimatedStart?: Date;
  estimatedEnd?: Date;
  seasonalConstraint?: string;
  weatherDependent: boolean;
  
  // Quality Metrics
  measurementUnit?: string;
  qualityCheckpoints: string[];
}

// ========================================
// PART 4: LIVING SHELF OF WORKS
// ========================================

export interface LivingShelfOfWorks {
  shelfId: string;
  villageLGDCode: string;
  fiscalYear: string;
  lastUpdated: Date;
  
  // Three-State Classification
  readyWorks: ReadyWork[];
  standbyWorks: StandbyWork[];
  emergencyWorks: EmergencyWork[];
  
  // Overall Metrics
  metrics: ShelfMetrics;
  
  // Auto-Update Rules
  autoUpdateRules: {
    enabled: boolean;
    updateFrequency: 'daily' | 'weekly' | 'monthly';
    lastAutoUpdate: Date;
    nextScheduledUpdate: Date;
  };
}

export interface ReadyWork {
  workId: string;
  assetType: MGNREGAAssetType;
  workTitle: LocalizedString;
  
  // Status: READY TO START IMMEDIATELY
  status: 'ready';
  readyState: {
    dprPrepared: boolean;
    dprApprovedDate: Date;
    dprApprovedBy: string;
    technicalSanction: boolean;
    sanctionNumber: string;
    sanctionDate: Date;
    budgetAllocated: boolean;
    allocationAmount: number;
    siteIdentified: boolean;
    siteDetails: string;
  };
  
  // Labour Plan
  labourAllocation: {
    totalSlots: number;
    allocatedSlots: number;
    remainingSlots: number;
    targetCategories: {
      scSt: number;
      women: number;
      pwd: number;
    };
  };
  
  // Timeline
  timeline: {
    canStartFrom: Date;
    estimatedDuration: number;
    deadline?: Date;
  };
  
  // Micro-Tasks
  microTasks: MicroTask[];
  
  // Asset Details
  assetDetails: AssetRecommendation;
  
  createdDate: Date;
  priority: number; // 1-10
}

export interface StandbyWork {
  workId: string;
  assetType: MGNREGAAssetType;
  workTitle: LocalizedString;
  
  // Status: STANDBY (Auto-generated, needs approval)
  status: 'standby';
  standbyState: {
    geographyValidated: boolean;
    demandValidated: boolean;
    autoDPRGenerated: boolean;
    dprGeneratedDate: Date;
    awaitingApproval: boolean;
    approvalLevel: 'gp' | 'block' | 'district';
    estimatedApprovalTime: number; // days
  };
  
  // Quick Activation
  quickActivation: {
    canActivateIn: number; // hours
    requiredSteps: string[];
    documentsReady: string[];
    documentsPending: string[];
  };
  
  // Labour Potential
  labourPotential: {
    minWorkers: number;
    maxWorkers: number;
    estimatedManDays: number;
  };
  
  // Asset Details
  assetDetails: AssetRecommendation;
  
  generatedDate: Date;
  validityPeriod: number; // days
  expiresOn: Date;
}

export interface EmergencyWork {
  workId: string;
  assetType: MGNREGAAssetType;
  workTitle: LocalizedString;
  
  // Status: EMERGENCY (Minimal paperwork, rapid activation)
  status: 'emergency';
  emergencyType: 'drought' | 'flood' | 'migration_spike' | 'seasonal_gap' | 'disaster';
  
  emergencyState: {
    triggerCondition: string;
    activationThreshold: string;
    fastTrackApproval: boolean;
    reducedDocumentation: boolean;
    canStartImmediately: boolean;
  };
  
  // Rapid Deployment
  rapidDeployment: {
    activationTime: number; // hours
    minimalPaperwork: string[];
    verbalApprovalAllowed: boolean;
    postFactoDocumentation: boolean;
  };
  
  // Crisis Context
  crisisContext: {
    affectedPopulation: number;
    urgencyScore: number; // 0-100
    reliefPotential: 'high' | 'medium' | 'low';
    communityConsent: boolean;
  };
  
  // Labour Absorption
  labourAbsorption: {
    canAbsorb: number; // workers
    immediateSlots: number;
    scalable: boolean;
    maxScaleUp: number;
  };
  
  // Asset Details (Simplified)
  assetDetails: AssetRecommendation;
  
  preApprovedDate: Date;
  validDuration: number; // days
}

export interface ShelfMetrics {
  totalWorks: number;
  readyCount: number;
  standbyCount: number;
  emergencyCount: number;
  
  totalLabourPotential: number; // total man-days available
  totalBudgetReserved: number;
  
  coverage: {
    waterConservation: number;
    landDevelopment: number;
    ruralConnectivity: number;
    agriculture: number;
    livelihood: number;
    forestry: number;
  };
  
  geographicDistribution: {
    northVillages: number;
    southVillages: number;
    eastVillages: number;
    westVillages: number;
  };
  
  seasonalReadiness: {
    monsoon: number;
    postMonsoon: number;
    winter: number;
    summer: number;
  };
}

// ========================================
// PART 5: AI/ML COMPONENTS
// ========================================

export interface DemandForecast {
  forecastId: string;
  villageLGDCode: string;
  forecastType: 'short_term' | 'medium_term' | 'long_term';
  
  // Prediction Window
  predictionWindow: {
    startDate: Date;
    endDate: Date;
    horizonDays: number;
  };
  
  // Demand Prediction
  prediction: {
    expectedWorkers: number;
    expectedManDays: number;
    peakDemandDate: Date;
    demandPattern: 'steady' | 'spike' | 'declining' | 'cyclical';
    confidence: number; // 0-100
  };
  
  // Trigger Factors
  triggerFactors: {
    seasonalPattern: number; // weight 0-1
    historicalTrend: number;
    cropCycle: number;
    weather: number;
    migration: number;
    festivals: number;
    other: number;
  };
  
  // Input Data Used
  inputData: {
    historicalDemand: number[];
    rainfallData: number[];
    temperatureData: number[];
    cropCalendar: string;
    migrationTrends: string;
    pastThreeYearsAvg: number;
  };
  
  // Recommendations
  recommendations: {
    recommendedAction: 'increase_capacity' | 'maintain' | 'reduce';
    suggestedWorks: string[]; // assetTypes
    prepareBy: Date;
    workersToAccommodate: number;
  };
  
  // Model Info
  modelInfo: {
    modelName: string;
    modelVersion: string;
    accuracy: number;
    lastTrained: Date;
  };
  
  generatedAt: Date;
  generatedBy: 'ai' | 'manual';
}

// ========================================
// PART 6: AUTO-DPR GENERATION
// ========================================

export interface AutoDPR {
  dprId: string;
  workId: string;
  assetType: MGNREGAAssetType;
  
  // DPR Status
  status: 'draft' | 'auto_generated' | 'engineer_reviewed' | 'approved' | 'rejected';
  generationType: 'fully_auto' | 'semi_auto' | 'manual';
  
  // Basic Details
  basicDetails: {
    workName: LocalizedString;
    workCategory: AssetCategory;
    location: WorkLocation;
    geoCoordinates: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  
  // Technical Details (Auto-filled)
  technicalDetails: {
    siteArea: number;
    siteAreaUnit: string;
    designDrawing?: string; // URL to auto-generated drawing
    technicalSpecifications: string;
    measurementBook: MeasurementEntry[];
  };
  
  // Cost Estimation (Auto-calculated)
  costEstimation: {
    labourCost: number;
    materialCost: number;
    contingency: number;
    totalCost: number;
    materialLabourRatio: number;
    perUnitCost?: number;
    scheduleOfRates: ScheduleOfRate[];
  };
  
  // Labour Plan (Auto-generated)
  labourPlan: {
    unskilledWorkers: number;
    semiSkilledWorkers: number;
    skilledWorkers: number;
    totalManDays: number;
    wageRateUnskilled: number;
    wageRateSemiSkilled: number;
    wageRateSkilled: number;
  };
  
  // Timeline (Auto-calculated)
  timeline: {
    estimatedStartDate: Date;
    estimatedCompletionDate: Date;
    totalDuration: number;
    phaseWisePlan: Phase[];
  };
  
  // AI Assistance
  aiAssistance: {
    autoFilledFields: string[];
    confidenceScore: number; // 0-100
    engineerReviewRequired: string[];
    suggestedModifications: string[];
  };
  
  // Approval Workflow
  approvalWorkflow: {
    createdBy: string;
    createdAt: Date;
    reviewedBy?: string;
    reviewedAt?: Date;
    approvedBy?: string;
    approvedAt?: Date;
    remarks?: string;
  };
  
  // Attachments
  attachments: {
    sitePhotos: string[];
    surveyReport?: string;
    soilTestReport?: string;
    autoGeneratedDrawing?: string;
  };
  
  generatedAt: Date;
  lastModified: Date;
  version: number;
}

export interface MeasurementEntry {
  item: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface ScheduleOfRate {
  srNo: string;
  itemDescription: string;
  unit: string;
  rate: number;
  quantity: number;
  amount: number;
}

export interface Phase {
  phaseNumber: number;
  phaseName: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  activities: string[];
  workers: number;
}

export interface WorkLocation {
  village: string;
  villageLGDCode: string;
  block: string;
  district: string;
  state: string;
  surveyNumber?: string;
  plotNumber?: string;
}

// ========================================
// PART 7: RULE ENGINE
// ========================================

export interface AssetSuggestionRule {
  ruleId: string;
  ruleName: string;
  priority: number;
  
  // Conditions (Geography-based)
  conditions: RuleCondition[];
  
  // Output (Suggested Asset)
  suggestedAsset: MGNREGAAssetType;
  
  // Scoring Weights
  weights: {
    terrainWeight: number;
    soilWeight: number;
    waterWeight: number;
    seasonalWeight: number;
    socialWeight: number;
  };
  
  // Logic
  logic: 'AND' | 'OR' | 'WEIGHTED';
  
  // Metadata
  createdBy: 'system' | 'expert';
  effectiveness: number; // 0-100, based on historical success
  lastUpdated: Date;
}

export interface RuleCondition {
  field: string; // e.g., 'terrain.type'
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'contains';
  value: any;
  weight?: number; // for weighted logic
}

// Helper type for localized strings
export interface LocalizedString {
  en: string;
  hi: string;
  mr?: string;
  regional?: string;
}

// ========================================
// EXPORTS
// ========================================

export type WorkState = 'ready' | 'standby' | 'emergency';
export type ApprovalLevel = 'gp' | 'block' | 'district' | 'state';
export type GenerationType = 'fully_auto' | 'semi_auto' | 'manual';
