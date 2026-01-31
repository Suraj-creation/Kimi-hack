// ML/DL Models for SAHAYOG Platform
// Priority Scoring, Fraud Detection, and Fairness Monitoring

import type { 
  PriorityScore, 
  FraudDetection, 
  FairnessAudit, 
  AllocationResult,
  User,
  WorkOpportunity,
  Attendance,
  ScoreBreakdown
} from '@/types';

// ============================================
// PRIORITY SCORING MODEL
// ============================================

export interface PriorityInput {
  user: User;
  workOpportunity?: WorkOpportunity;
  attendanceHistory?: Attendance[];
}

// Default weights for priority calculation (from unified_solution.md)
const DEFAULT_WEIGHTS = {
  vulnerability: 0.30,    // Highest weight - critical life situations
  unemployment: 0.20,     // Days without work
  poverty: 0.15,          // Economic status
  social_category: 0.10,  // SC/ST/OBC
  gender: 0.10,           // Women priority
  disability: 0.10,       // Disability status
  rotation: 0.05,         // Fair distribution
};

// Calculate vulnerability score based on multiple factors
function calculateVulnerabilityScore(user: User): number {
  let score = 0.0;
  
  // Social vulnerability (max 0.42)
  if (user.familyDetails?.maritalStatus === 'widowed') score += 0.15;
  if (user.familyDetails?.numberOfChildren > 0 && user.familyDetails?.numberOfDependents === 1) score += 0.15; // Single parent
  if (user.familyDetails?.maritalStatus === 'divorced') score += 0.12;
  
  // Economic shocks (max 0.28)
  // Recent death in family - would need to track this separately
  // Recent illness major - from health info
  if (user.healthInfo?.chronicConditions && user.healthInfo.chronicConditions.length > 0) score += 0.10;
  // Recent crop failure - would need agricultural data
  
  // Life transitions (max 0.08)
  // Migration returnee - would need to track
  
  // Structural vulnerability (max 0.27)
  if (user.category === 'SC' || user.category === 'ST') score += 0.07;
  if (user.isDisabled) score += 0.10 * (user.disabilityPercentage || 100) / 100;
  // Child out of school - would need education tracking
  
  // Mental health
  if (user.healthInfo?.mentalWellbeingScore && user.healthInfo.mentalWellbeingScore < 0.5) {
    score += 0.05;
  }
  
  // Debt burden - NEW from unified solution
  if (user.economicInfo?.hasDebt) {
    const debtRatio = (user.economicInfo?.debtAmount || 0) / (user.economicInfo?.annualIncome || 1);
    if (debtRatio > 0.5) score += 0.08; // High debt burden
  }
  
  return Math.min(score, 1.0);
}

// Calculate poverty score
function calculatePovertyScore(user: User): number {
  let score = 0.0;
  
  // SECC deprivation score (max 0.6)
  // Assuming we have a deprivation score from 0-7
  const deprivationScore = user.economicInfo?.rationCardType === 'AAY' ? 7 : 
                           user.economicInfo?.rationCardType === 'PHH' ? 4 : 0;
  score += (deprivationScore / 7.0) * 0.6;
  
  // BPL status (max 0.4)
  if (user.economicInfo?.incomeLevel === 'BPL') score += 0.4;
  
  return Math.min(score, 1.0);
}

// Calculate unemployment score
function calculateUnemploymentScore(user: User): number {
  const daysSinceLastWork = user.mgnregaInfo?.lastWorkDate 
    ? Math.floor((Date.now() - new Date(user.mgnregaInfo.lastWorkDate).getTime()) / (1000 * 60 * 60 * 24))
    : 365;
  
  return Math.min(daysSinceLastWork / 365.0, 1.0);
}

// Calculate rotation score (equitable distribution)
function calculateRotationScore(user: User): number {
  const daysWorked = user.mgnregaInfo?.totalDaysWorkedThisYear || 0;
  return 1.0 - (daysWorked / 100.0);
}

// Calculate skill match score
function calculateSkillMatchScore(user: User, work: WorkOpportunity): number {
  if (!work.requirements?.skillsRequired || work.requirements.skillsRequired.length === 0) {
    return 1.0; // Unskilled work - everyone qualifies
  }
  
  const userSkills = user.skills?.map(s => s.skillName.toLowerCase()) || [];
  const requiredSkills = work.requirements.skillsRequired.map(s => s.toLowerCase());
  
  const matches = requiredSkills.filter(skill => userSkills.includes(skill));
  return matches.length / requiredSkills.length;
}

// Calculate proximity score
function calculateProximityScore(user: User, work: WorkOpportunity): number {
  if (!user.address?.geoLocation || !work.location?.geoLocation) {
    return 0.5; // Default if no location data
  }
  
  const userCoords = user.address.geoLocation.coordinates;
  const workCoords = work.location.geoLocation.coordinates;
  
  // Calculate Haversine distance
  const R = 6371; // Earth's radius in km
  const dLat = (workCoords[1] - userCoords[1]) * Math.PI / 180;
  const dLon = (workCoords[0] - userCoords[0]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userCoords[1] * Math.PI / 180) * Math.cos(workCoords[1] * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Women should work closer (policy decision)
  const maxAcceptableDistance = user.gender === 'female' ? 5.0 : 10.0;
  const maxPreferredDistance = user.mgnregaInfo?.maxTravelDistance || maxAcceptableDistance;
  
  if (distance > maxPreferredDistance) return 0.0;
  
  return 1.0 - (distance / maxAcceptableDistance);
}

// Main priority scoring function
export function calculatePriorityScore(
  input: PriorityInput,
  weights: typeof DEFAULT_WEIGHTS = DEFAULT_WEIGHTS
): PriorityScore {
  const { user, workOpportunity } = input;
  
  // Calculate individual component scores
  const vulnerabilityScore = calculateVulnerabilityScore(user);
  const unemploymentScore = calculateUnemploymentScore(user);
  const povertyScore = calculatePovertyScore(user);
  const rotationScore = calculateRotationScore(user);
  
  // Social category score
  let socialScore = 0.0;
  if (user.category === 'SC' || user.category === 'ST') socialScore = 1.0;
  else if (user.category === 'OBC') socialScore = 0.7;
  
  // Gender score (for 33% women quota)
  const genderScore = user.gender === 'female' ? 1.0 : 0.0;
  
  // Disability score
  const disabilityScore = user.isDisabled ? (user.disabilityPercentage || 100) / 100.0 : 0.0;
  
  // Calculate weighted final score
  let finalScore = 0.0;
  finalScore += weights.vulnerability * vulnerabilityScore;
  finalScore += weights.unemployment * unemploymentScore;
  finalScore += weights.poverty * povertyScore;
  finalScore += weights.social_category * socialScore;
  finalScore += weights.gender * genderScore;
  finalScore += weights.disability * disabilityScore;
  finalScore += weights.rotation * rotationScore;
  
  // Add skill and proximity bonuses if work opportunity provided
  if (workOpportunity) {
    const skillMatch = calculateSkillMatchScore(user, workOpportunity);
    const proximityScore = calculateProximityScore(user, workOpportunity);
    
    // Skill and proximity are suitability factors (10% weight total)
    finalScore += 0.05 * skillMatch;
    finalScore += 0.05 * proximityScore;
  }
  
  // Cap at 1.0
  finalScore = Math.min(finalScore, 1.0);
  
  // Build breakdown for explainability
  const breakdown: ScoreBreakdown = {
    urgency: {
      raw: unemploymentScore,
      weight: weights.unemployment,
      contribution: weights.unemployment * unemploymentScore,
    },
    vulnerability: {
      raw: vulnerabilityScore,
      weight: weights.vulnerability,
      contribution: weights.vulnerability * vulnerabilityScore,
    },
    poverty: {
      raw: povertyScore,
      weight: weights.poverty,
      contribution: weights.poverty * povertyScore,
    },
    social_category: {
      raw: socialScore,
      weight: weights.social_category,
      contribution: weights.social_category * socialScore,
    },
    gender: {
      raw: genderScore,
      weight: weights.gender,
      contribution: weights.gender * genderScore,
    },
    disability: {
      raw: disabilityScore,
      weight: weights.disability,
      contribution: weights.disability * disabilityScore,
    },
    rotation: {
      raw: rotationScore,
      weight: weights.rotation,
      contribution: weights.rotation * rotationScore,
    },
  };
  
  // Generate top factors for explanation
  const topFactors = [
    { feature: 'days_since_last_work', value: Math.floor(unemploymentScore * 365), contribution: breakdown.urgency.contribution, impact: 'increases' as const },
    { feature: 'vulnerability_composite', value: vulnerabilityScore.toFixed(2), contribution: breakdown.vulnerability.contribution, impact: 'increases' as const },
    { feature: 'poverty_score', value: povertyScore.toFixed(2), contribution: breakdown.poverty.contribution, impact: 'increases' as const },
    { feature: 'days_remaining_entitlement', value: Math.floor(rotationScore * 100), contribution: breakdown.rotation.contribution, impact: 'increases' as const },
  ];
  
  if (user.category === 'SC' || user.category === 'ST') {
    topFactors.push({ feature: 'social_category', value: user.category, contribution: breakdown.social_category.contribution, impact: 'increases' as const });
  }
  
  if (user.gender === 'female') {
    topFactors.push({ feature: 'gender', value: 'female', contribution: breakdown.gender.contribution, impact: 'increases' as const });
  }
  
  if (user.isDisabled) {
    topFactors.push({ feature: 'disability', value: `${user.disabilityPercentage}%`, contribution: breakdown.disability.contribution, impact: 'increases' as const });
  }
  
  // Sort by contribution
  topFactors.sort((a, b) => b.contribution - a.contribution);
  
  return {
    userId: user._id,
    priorityScore: finalScore,
    priorityRank: 0, // Will be set after sorting all scores
    urgencyScore: unemploymentScore,
    vulnerabilityScore,
    entitlementScore: rotationScore,
    suitabilityScore: workOpportunity ? (calculateSkillMatchScore(user, workOpportunity) + calculateProximityScore(user, workOpportunity)) / 2 : 0.5,
    breakdown,
    modelBreakdown: {
      rule_based: finalScore,
      gradient_boosting: finalScore * 0.95, // Simulated ensemble
      deep_learning: finalScore * 1.05,
    },
    explanation: {
      top_factors: topFactors.slice(0, 5),
      score: finalScore,
    },
    calculatedAt: new Date(),
  };
}

// ============================================
// FRAUD DETECTION MODEL
// ============================================

export interface FraudDetectionInput {
  user: User;
  attendanceHistory: Attendance[];
  paymentHistory: any[];
  networkData?: {
    sharedPhoneUsers: number;
    sharedBankUsers: number;
    sameAddressUsers: number;
  };
}

// Detect ghost worker patterns
function detectGhostPatterns(input: FraudDetectionInput): number {
  const { user, attendanceHistory } = input;
  let score = 0.0;
  
  // No Aadhaar authentication in 2 years (simulated)
  const lastAuth = user.lastLoginAt || new Date(Date.now() - 1000 * 60 * 60 * 24 * 800);
  const daysSinceAuth = Math.floor((Date.now() - new Date(lastAuth).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceAuth > 730) score += 0.30;
  
  // Suspiciously perfect attendance
  const attendanceRate = attendanceHistory.length > 0
    ? attendanceHistory.filter(a => a.presentStatus === 'present').length / attendanceHistory.length
    : 0;
  if (attendanceRate > 0.98 && attendanceHistory.length > 50) score += 0.25;
  
  // Phone shared by many beneficiaries
  if (input.networkData?.sharedPhoneUsers && input.networkData.sharedPhoneUsers > 5) {
    score += 0.20;
  }
  
  // Bank account receives payments for multiple beneficiaries
  if (input.networkData?.sharedBankUsers && input.networkData.sharedBankUsers > 1) {
    score += 0.35;
  }
  
  // No grievances, no interactions (unusual passivity)
  if (user.loginCount < 2) score += 0.15;
  
  return Math.min(score, 1.0);
}

// Detect wage theft patterns
function detectWageTheft(input: FraudDetectionInput): number {
  const { paymentHistory } = input;
  let score = 0.0;
  
  if (!paymentHistory || paymentHistory.length === 0) return 0.0;
  
  // Check for payment delays
  const delayedPayments = paymentHistory.filter(p => {
    if (p.status !== 'completed' || !p.completedDate || !p.expectedDate) return false;
    return new Date(p.completedDate) > new Date(p.expectedDate);
  });
  
  const delayRate = delayedPayments.length / paymentHistory.length;
  if (delayRate > 0.5) score += 0.4;
  else if (delayRate > 0.3) score += 0.2;
  
  // Check for payment amount discrepancies
  const discrepancies = paymentHistory.filter(p => {
    if (!p.wageCalculation || !p.paymentPeriod) return false;
    const expectedAmount = p.wageCalculation.dailyRate * p.paymentPeriod.daysCount;
    return Math.abs(p.netAmount - expectedAmount) > 10; // More than ₹10 difference
  });
  
  if (discrepancies.length > 0) score += 0.3;
  
  return Math.min(score, 1.0);
}

// Detect location fraud
function detectLocationFraud(input: FraudDetectionInput): number {
  const { attendanceHistory } = input;
  let score = 0.0;
  
  if (!attendanceHistory || attendanceHistory.length === 0) return 0.0;
  
  // Check for same-day multi-location attendance
  const dateGroups: Record<string, Attendance[]> = {};
  attendanceHistory.forEach(a => {
    const date = new Date(a.date).toDateString();
    if (!dateGroups[date]) dateGroups[date] = [];
    dateGroups[date].push(a);
  });
  
  const multiLocationDays = Object.values(dateGroups).filter(
    dayAttendances => dayAttendances.length > 1
  ).length;
  
  if (multiLocationDays > 5) score += 0.5;
  else if (multiLocationDays > 2) score += 0.25;
  
  return Math.min(score, 1.0);
}

// Detect collusion patterns
function detectCollusion(input: FraudDetectionInput): number {
  const { networkData } = input;
  let score = 0.0;
  
  if (!networkData) return 0.0;
  
  // Large network of related beneficiaries
  const totalConnections = networkData.sharedPhoneUsers + networkData.sharedBankUsers + networkData.sameAddressUsers;
  
  if (totalConnections > 10) score += 0.5;
  else if (totalConnections > 5) score += 0.25;
  
  return Math.min(score, 1.0);
}

// Main fraud detection function
export function detectFraud(input: FraudDetectionInput): FraudDetection {
  const fraudSignals = {
    anomaly_score: 0.0,
    ghost_probability: detectGhostPatterns(input),
    wage_theft_indicator: detectWageTheft(input),
    collusion_risk: detectCollusion(input),
    location_fraud_score: detectLocationFraud(input),
  };
  
  // Calculate anomaly score as average of other signals
  fraudSignals.anomaly_score = (
    fraudSignals.ghost_probability +
    fraudSignals.wage_theft_indicator +
    fraudSignals.collusion_risk +
    fraudSignals.location_fraud_score
  ) / 4;
  
  // Combined fraud probability
  const fraudProbability = (
    0.25 * fraudSignals.anomaly_score +
    0.30 * fraudSignals.ghost_probability +
    0.20 * fraudSignals.wage_theft_indicator +
    0.15 * fraudSignals.collusion_risk +
    0.10 * fraudSignals.location_fraud_score
  );
  
  // Determine risk level
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (fraudProbability > 0.8) riskLevel = 'CRITICAL';
  else if (fraudProbability > 0.6) riskLevel = 'HIGH';
  else if (fraudProbability > 0.3) riskLevel = 'MEDIUM';
  
  // Determine recommended action
  let recommendedAction = 'Normal processing';
  if (riskLevel === 'CRITICAL') recommendedAction = 'Block allocation + immediate investigation';
  else if (riskLevel === 'HIGH') recommendedAction = 'Supervisor approval + investigation';
  else if (riskLevel === 'MEDIUM') recommendedAction = 'Additional verification required';
  
  return {
    userId: input.user._id,
    fraudProbability,
    riskLevel,
    signals: fraudSignals,
    recommendedAction,
    detectedAt: new Date(),
  };
}

// ============================================
// FAIRNESS MONITORING MODEL
// ============================================

export interface FairnessInput {
  allocationResults: AllocationResult[];
  population: User[];
}

// Check demographic parity
function checkDemographicParity(results: AllocationResult[], protectedAttr: keyof AllocationResult): number {
  const groups: Record<string, { total: number; allocated: number }> = {};
  
  results.forEach(r => {
    const value = String(r[protectedAttr]);
    if (!groups[value]) groups[value] = { total: 0, allocated: 0 };
    groups[value].total++;
    if (r.allocated) groups[value].allocated++;
  });
  
  const rates = Object.values(groups).map(g => g.allocated / g.total);
  const maxRate = Math.max(...rates);
  const minRate = Math.min(...rates);
  
  return maxRate - minRate;
}

// Check geographic fairness
function checkGeographicFairness(results: AllocationResult[]): number {
  const villageAllocations: Record<string, { demand: number; allocated: number }> = {};
  
  results.forEach(r => {
    if (!villageAllocations[r.village_code]) {
      villageAllocations[r.village_code] = { demand: 0, allocated: 0 };
    }
    villageAllocations[r.village_code].demand++;
    if (r.allocated) villageAllocations[r.village_code].allocated++;
  });
  
  // Calculate Gini coefficient
  const allocationRates = Object.values(villageAllocations).map(v => v.allocated / v.demand);
  const n = allocationRates.length;
  const mean = allocationRates.reduce((a, b) => a + b, 0) / n;
  
  let numerator = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      numerator += Math.abs(allocationRates[i] - allocationRates[j]);
    }
  }
  
  const gini = numerator / (2 * n * n * mean);
  return 1 - gini; // Return fairness score (1 - Gini)
}

// Check calibration
function checkCalibration(results: AllocationResult[]): number {
  // Group by priority score buckets
  const buckets: Record<string, { total: number; allocated: number }> = {};
  
  results.forEach(r => {
    const bucket = Math.floor(r.priority_score * 10) / 10; // Round to 1 decimal
    const key = bucket.toString();
    if (!buckets[key]) buckets[key] = { total: 0, allocated: 0 };
    buckets[key].total++;
    if (r.allocated) buckets[key].allocated++;
  });
  
  // Calculate calibration error
  let totalError = 0;
  let totalCount = 0;
  
  Object.entries(buckets).forEach(([score, data]) => {
    const predictedRate = parseFloat(score);
    const actualRate = data.allocated / data.total;
    totalError += Math.abs(predictedRate - actualRate) * data.total;
    totalCount += data.total;
  });
  
  return totalError / totalCount;
}

// Check individual fairness
function checkIndividualFairness(results: AllocationResult[]): number {
  // Find similar individuals and check if they were treated similarly
  let similarPairs = 0;
  let consistentPairs = 0;
  
  for (let i = 0; i < results.length; i++) {
    for (let j = i + 1; j < results.length; j++) {
      const r1 = results[i];
      const r2 = results[j];
      
      // Check if similar (same caste, gender, similar priority score)
      const scoreDiff = Math.abs(r1.priority_score - r2.priority_score);
      if (r1.caste_category === r2.caste_category && 
          r1.gender === r2.gender && 
          scoreDiff < 0.1) {
        similarPairs++;
        if (r1.allocated === r2.allocated) {
          consistentPairs++;
        }
      }
    }
  }
  
  return similarPairs > 0 ? consistentPairs / similarPairs : 1.0;
}

// Main fairness audit function
export function auditFairness(input: FairnessInput): FairnessAudit {
  const { allocationResults, population } = input;
  
  const auditReport = {
    demographic_parity: 0,
    women_percentage: 0,
    geographic_fairness: 0,
    calibration_error: 0,
    individual_fairness: 0,
  };
  
  const violations: string[] = [];
  
  // 1. Demographic Parity
  auditReport.demographic_parity = checkDemographicParity(allocationResults, 'caste_category');
  if (auditReport.demographic_parity > 0.1) {
    violations.push(`Caste bias detected: ${(auditReport.demographic_parity * 100).toFixed(2)}% gap`);
  }
  
  // 2. Gender Quota
  const womenAllocated = allocationResults.filter(r => r.gender === 'F' && r.allocated).length;
  const totalAllocated = allocationResults.filter(r => r.allocated).length;
  auditReport.women_percentage = totalAllocated > 0 ? womenAllocated / totalAllocated : 0;
  if (auditReport.women_percentage < 0.33) {
    violations.push(`Women quota violated: only ${(auditReport.women_percentage * 100).toFixed(1)}%`);
  }
  
  // 3. Geographic Fairness
  auditReport.geographic_fairness = checkGeographicFairness(allocationResults);
  if (auditReport.geographic_fairness < 0.9) {
    violations.push(`Geographic imbalance: ${auditReport.geographic_fairness.toFixed(2)}`);
  }
  
  // 4. Calibration
  auditReport.calibration_error = checkCalibration(allocationResults);
  if (auditReport.calibration_error > 0.15) {
    violations.push(`Model miscalibrated: ${(auditReport.calibration_error * 100).toFixed(2)}% error`);
  }
  
  // 5. Individual Fairness
  auditReport.individual_fairness = checkIndividualFairness(allocationResults);
  if (auditReport.individual_fairness < 0.85) {
    violations.push(`Inconsistent treatment: ${auditReport.individual_fairness.toFixed(2)} similarity`);
  }
  
  // Recommended actions
  const recommendedActions: string[] = [];
  if (violations.length > 0) {
    recommendedActions.push('Review allocation algorithm for bias');
    recommendedActions.push('Retrain models with balanced dataset');
    recommendedActions.push('Implement post-processing fairness constraints');
    recommendedActions.push('Conduct manual audit of flagged allocations');
  }
  
  return {
    auditDate: new Date(),
    allocationResults,
    auditReport,
    violations,
    isFair: violations.length === 0,
    recommendedActions,
  };
}

// ============================================
// WORK ALLOCATION OPTIMIZER
// ============================================

export interface AllocationOptimizerInput {
  users: User[];
  workOpportunities: WorkOpportunity[];
  constraints: {
    minWomenPercentage: number;
    scStQuota: number;
    pwdQuota: number;
    maxWorkersPerWork: number;
  };
}

export interface OptimizedAllocation {
  workId: string;
  allocatedUsers: string[];
  waitlistedUsers: string[];
  fairness: {
    womenPercentage: number;
    scStPercentage: number;
    pwdPercentage: number;
  };
}

// Optimize work allocation with fairness constraints
export function optimizeAllocation(input: AllocationOptimizerInput): OptimizedAllocation[] {
  const { users, workOpportunities, constraints } = input;
  const allocations: OptimizedAllocation[] = [];
  
  workOpportunities.forEach(work => {
    // Calculate priority scores for all users
    const userScores = users.map(user => ({
      userId: user._id,
      score: calculatePriorityScore({ user, workOpportunity: work }).priorityScore,
      gender: user.gender,
      category: user.category,
      isDisabled: user.isDisabled,
    }));
    
    // Sort by priority score
    userScores.sort((a, b) => b.score - a.score);
    
    // Apply fairness constraints
    const allocatedUsers: string[] = [];
    const waitlistedUsers: string[] = [];
    
    let womenCount = 0;
    let scStCount = 0;
    let pwdCount = 0;
    
    // First pass: Ensure minimum quotas
    for (const user of userScores) {
      if (allocatedUsers.length >= constraints.maxWorkersPerWork) break;
      if (allocatedUsers.includes(user.userId)) continue;
      
      // Check if adding this user helps meet quotas
      const helpsQuota = (
        (user.gender === 'female' && womenCount / allocatedUsers.length < constraints.minWomenPercentage) ||
        ((user.category === 'SC' || user.category === 'ST') && scStCount / allocatedUsers.length < constraints.scStQuota) ||
        (user.isDisabled && pwdCount / allocatedUsers.length < constraints.pwdQuota)
      );
      
      if (helpsQuota || allocatedUsers.length < constraints.maxWorkersPerWork * 0.7) {
        allocatedUsers.push(user.userId);
        if (user.gender === 'female') womenCount++;
        if (user.category === 'SC' || user.category === 'ST') scStCount++;
        if (user.isDisabled) pwdCount++;
      } else {
        waitlistedUsers.push(user.userId);
      }
    }
    
    // Second pass: Fill remaining slots by priority
    for (const user of userScores) {
      if (allocatedUsers.length >= constraints.maxWorkersPerWork) break;
      if (!allocatedUsers.includes(user.userId)) {
        allocatedUsers.push(user.userId);
        if (user.gender === 'female') womenCount++;
        if (user.category === 'SC' || user.category === 'ST') scStCount++;
        if (user.isDisabled) pwdCount++;
      }
    }
    
    allocations.push({
      workId: work._id,
      allocatedUsers,
      waitlistedUsers: userScores
        .filter(u => !allocatedUsers.includes(u.userId))
        .map(u => u.userId),
      fairness: {
        womenPercentage: allocatedUsers.length > 0 ? womenCount / allocatedUsers.length : 0,
        scStPercentage: allocatedUsers.length > 0 ? scStCount / allocatedUsers.length : 0,
        pwdPercentage: allocatedUsers.length > 0 ? pwdCount / allocatedUsers.length : 0,
      },
    });
  });
  
  return allocations;
}

export default {
  calculatePriorityScore,
  detectFraud,
  auditFairness,
  optimizeAllocation,
  DEFAULT_WEIGHTS,
};
