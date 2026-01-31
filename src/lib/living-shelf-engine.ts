// SAHAYOG - Living Shelf of Works Engine
// Core AI/ML Engine for Geography-Driven Work Planning

import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  VillageGeographyProfile,
  GeographyDNA,
  AssetRecommendation,
  MGNREGAAssetType,
  AssetCategory,
  GeographyMatchScore,
  MicroTask,
  DemandForecast,
  AutoDPR,
  AssetSuggestionRule,
  RuleCondition,
} from '@/types/geography';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// ========================================
// ASSET SUGGESTION RULES ENGINE
// ========================================

class AssetSuggestionEngine {
  private rules: AssetSuggestionRule[] = [];

  constructor() {
    this.initializeRules();
  }

  // Initialize rule-based suggestions
  private initializeRules() {
    this.rules = [
      // RULE 1: High Slope + High Rainfall → Contour Bunds
      {
        ruleId: 'RULE_001',
        ruleName: 'Contour Bunds for Erosion Control',
        priority: 10,
        conditions: [
          { field: 'terrain.slope', operator: 'in', value: ['steep', 'moderate'] },
          { field: 'water.rainfallZone', operator: 'in', value: ['high', 'medium'] },
          { field: 'soil.erosionProne', operator: '==', value: true },
        ],
        suggestedAsset: 'contour_bund',
        weights: { terrainWeight: 0.4, soilWeight: 0.3, waterWeight: 0.3, seasonalWeight: 0, socialWeight: 0 },
        logic: 'AND',
        createdBy: 'system',
        effectiveness: 85,
        lastUpdated: new Date(),
      },

      // RULE 2: Water-Scarce Plain → Farm Ponds
      {
        ruleId: 'RULE_002',
        ruleName: 'Farm Ponds for Water Storage',
        priority: 9,
        conditions: [
          { field: 'terrain.type', operator: '==', value: 'plain' },
          { field: 'water.waterStress', operator: 'in', value: ['seasonal', 'perennial', 'acute'] },
          { field: 'soil.waterHoldingCapacity', operator: '==', value: 'low' },
        ],
        suggestedAsset: 'farm_pond',
        weights: { terrainWeight: 0.2, soilWeight: 0.2, waterWeight: 0.5, seasonalWeight: 0.1, socialWeight: 0 },
        logic: 'AND',
        createdBy: 'system',
        effectiveness: 90,
        lastUpdated: new Date(),
      },

      // RULE 3: Flood-Prone Areas → Drainage Channels
      {
        ruleId: 'RULE_003',
        ruleName: 'Drainage Channels for Flood Management',
        priority: 10,
        conditions: [
          { field: 'water.floodProne', operator: '==', value: true },
          { field: 'water.drainagePattern', operator: '==', value: 'poor' },
        ],
        suggestedAsset: 'drainage_channel',
        weights: { terrainWeight: 0.1, soilWeight: 0.1, waterWeight: 0.7, seasonalWeight: 0.1, socialWeight: 0 },
        logic: 'AND',
        createdBy: 'system',
        effectiveness: 88,
        lastUpdated: new Date(),
      },

      // RULE 4: Forest Fringe → Plantation
      {
        ruleId: 'RULE_004',
        ruleName: 'Plantation for Forest Fringe Areas',
        priority: 8,
        conditions: [
          { field: 'forest.forestFringe', operator: '==', value: true },
          { field: 'landUse.degradedLand', operator: '>', value: 10 },
        ],
        suggestedAsset: 'plantation',
        weights: { terrainWeight: 0.2, soilWeight: 0.2, waterWeight: 0.2, seasonalWeight: 0.2, socialWeight: 0.2 },
        logic: 'AND',
        createdBy: 'system',
        effectiveness: 80,
        lastUpdated: new Date(),
      },

      // RULE 5: Degraded Land → Wasteland Development
      {
        ruleId: 'RULE_005',
        ruleName: 'Wasteland Development',
        priority: 7,
        conditions: [
          { field: 'landUse.wasteland', operator: '>', value: 15 },
          { field: 'landUse.degradedLand', operator: '>', value: 20 },
        ],
        suggestedAsset: 'wasteland_development',
        weights: { terrainWeight: 0.2, soilWeight: 0.3, waterWeight: 0.2, seasonalWeight: 0.1, socialWeight: 0.2 },
        logic: 'AND',
        createdBy: 'system',
        effectiveness: 75,
        lastUpdated: new Date(),
      },

      // RULE 6: High Employment Demand → Check Dams
      {
        ruleId: 'RULE_006',
        ruleName: 'Check Dams for High Labour Absorption',
        priority: 9,
        conditions: [
          { field: 'socioEconomic.averageEmploymentDemand', operator: '>', value: 5000 },
          { field: 'water.waterStress', operator: 'in', value: ['seasonal', 'perennial'] },
          { field: 'terrain.type', operator: 'in', value: ['hilly', 'riverine'] },
        ],
        suggestedAsset: 'check_dam',
        weights: { terrainWeight: 0.3, soilWeight: 0.1, waterWeight: 0.4, seasonalWeight: 0, socialWeight: 0.2 },
        logic: 'AND',
        createdBy: 'system',
        effectiveness: 85,
        lastUpdated: new Date(),
      },

      // RULE 7: Poor Soil + Agricultural Land → Land Leveling
      {
        ruleId: 'RULE_007',
        ruleName: 'Land Leveling for Agricultural Improvement',
        priority: 7,
        conditions: [
          { field: 'landUse.agricultural', operator: '>', value: 50 },
          { field: 'soil.fertility', operator: '==', value: 'low' },
          { field: 'terrain.slope', operator: '==', value: 'flat' },
        ],
        suggestedAsset: 'land_leveling',
        weights: { terrainWeight: 0.3, soilWeight: 0.4, waterWeight: 0.1, seasonalWeight: 0.1, socialWeight: 0.1 },
        logic: 'AND',
        createdBy: 'system',
        effectiveness: 78,
        lastUpdated: new Date(),
      },

      // RULE 8: Percolation Tanks for Water Recharge
      {
        ruleId: 'RULE_008',
        ruleName: 'Percolation Tanks for Groundwater Recharge',
        priority: 8,
        conditions: [
          { field: 'water.groundwaterLevel', operator: 'in', value: ['deep', 'critical'] },
          { field: 'soil.drainage', operator: '==', value: 'good' },
          { field: 'terrain.type', operator: 'in', value: ['plain', 'plateau'] },
        ],
        suggestedAsset: 'percolation_tank',
        weights: { terrainWeight: 0.2, soilWeight: 0.3, waterWeight: 0.4, seasonalWeight: 0.1, socialWeight: 0 },
        logic: 'AND',
        createdBy: 'system',
        effectiveness: 82,
        lastUpdated: new Date(),
      },

      // RULE 9: Rural Connectivity for Remote Villages
      {
        ruleId: 'RULE_009',
        ruleName: 'Rural Roads for Connectivity',
        priority: 6,
        conditions: [
          { field: 'socioEconomic.connectivityScore', operator: '<', value: 40 },
          { field: 'terrain.type', operator: 'in', value: ['plain', 'hilly'] },
        ],
        suggestedAsset: 'rural_road',
        weights: { terrainWeight: 0.3, soilWeight: 0.1, waterWeight: 0, seasonalWeight: 0.1, socialWeight: 0.5 },
        logic: 'AND',
        createdBy: 'system',
        effectiveness: 70,
        lastUpdated: new Date(),
      },

      // RULE 10: Tank Desilting for Existing Water Bodies
      {
        ruleId: 'RULE_010',
        ruleName: 'Tank Desilting for Water Conservation',
        priority: 9,
        conditions: [
          { field: 'water.waterBodies.tanks', operator: '>', value: 0 },
          { field: 'water.waterStress', operator: 'in', value: ['seasonal', 'perennial'] },
        ],
        suggestedAsset: 'tank_desilting',
        weights: { terrainWeight: 0.1, soilWeight: 0.1, waterWeight: 0.6, seasonalWeight: 0.1, socialWeight: 0.1 },
        logic: 'AND',
        createdBy: 'system',
        effectiveness: 87,
        lastUpdated: new Date(),
      },
    ];
  }

  // Evaluate all rules against geography profile
  evaluateRules(geoDNA: GeographyDNA): Array<{ rule: AssetSuggestionRule; score: number; matches: boolean }> {
    return this.rules.map(rule => {
      const { matches, score } = this.evaluateRule(rule, geoDNA);
      return { rule, score, matches };
    }).filter(result => result.matches);
  }

  // Evaluate single rule
  private evaluateRule(rule: AssetSuggestionRule, geoDNA: GeographyDNA): { matches: boolean; score: number } {
    const conditionResults = rule.conditions.map(condition => this.evaluateCondition(condition, geoDNA));
    
    let matches = false;
    if (rule.logic === 'AND') {
      matches = conditionResults.every(result => result);
    } else if (rule.logic === 'OR') {
      matches = conditionResults.some(result => result);
    }

    // Calculate score based on rule effectiveness and priority
    const score = matches ? (rule.effectiveness * rule.priority / 100) : 0;

    return { matches, score };
  }

  // Evaluate single condition
  private evaluateCondition(condition: RuleCondition, geoDNA: GeographyDNA): boolean {
    const value = this.getNestedValue(geoDNA, condition.field);
    
    switch (condition.operator) {
      case '==':
        return value === condition.value;
      case '!=':
        return value !== condition.value;
      case '>':
        return value > condition.value;
      case '<':
        return value < condition.value;
      case '>=':
        return value >= condition.value;
      case '<=':
        return value <= condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value);
      case 'contains':
        return typeof value === 'string' && value.includes(condition.value);
      default:
        return false;
    }
  }

  // Get nested object value by path
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// ========================================
// AI-POWERED ASSET RECOMMENDATION ENGINE
// ========================================

export class LivingShelfEngine {
  private genAI: GoogleGenerativeAI | null = null;
  private ruleEngine: AssetSuggestionEngine;

  constructor() {
    if (GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    }
    this.ruleEngine = new AssetSuggestionEngine();
  }

  // Main function: Generate asset recommendations
  async generateAssetRecommendations(
    villageProfile: VillageGeographyProfile
  ): Promise<AssetRecommendation[]> {
    const geoDNA = villageProfile.geographyDNA;

    // Step 1: Rule-based recommendations
    const ruleBasedResults = this.ruleEngine.evaluateRules(geoDNA);
    
    // Step 2: AI-enhanced recommendations
    const aiEnhancedRecommendations = await this.enhanceWithAI(ruleBasedResults, geoDNA);

    // Step 3: Generate full asset recommendations
    const recommendations = await Promise.all(
      aiEnhancedRecommendations.map(async (item) => 
        this.createAssetRecommendation(item.rule.suggestedAsset, item.score, geoDNA, item.reasoning)
      )
    );

    // Step 4: Sort by score and return top 15
    return recommendations.sort((a, b) => b.recommendation.score - a.recommendation.score).slice(0, 15);
  }

  // AI Enhancement using Gemini
  private async enhanceWithAI(
    ruleResults: Array<{ rule: AssetSuggestionRule; score: number; matches: boolean }>,
    geoDNA: GeographyDNA
  ): Promise<Array<{ rule: AssetSuggestionRule; score: number; reasoning: string }>> {
    if (!this.genAI) {
      // Fallback: return rule-based results with default reasoning
      return ruleResults.map(item => ({
        rule: item.rule,
        score: item.score,
        reasoning: `Geography-based recommendation: ${item.rule.ruleName}`
      }));
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are an expert MGNREGA planning engineer analyzing village geography for work recommendations.

Village Geography DNA:
- Terrain: ${geoDNA.terrain.type}, Slope: ${geoDNA.terrain.slope}
- Soil: ${geoDNA.soil.type}, Fertility: ${geoDNA.soil.fertility}, Erosion-prone: ${geoDNA.soil.erosionProne}
- Water: Rainfall Zone: ${geoDNA.water.rainfallZone}, Water Stress: ${geoDNA.water.waterStress}, Flood-prone: ${geoDNA.water.floodProne}
- Land Use: Agricultural: ${geoDNA.landUse.agricultural}%, Forest: ${geoDNA.landUse.forest}%, Wasteland: ${geoDNA.landUse.wasteland}%
- Climate: ${geoDNA.climate.zone}, Drought-prone: ${geoDNA.climate.droughtProne}
- Population: ${geoDNA.socioEconomic.totalPopulation}, Job Cards: ${geoDNA.socioEconomic.mgnregaJobCards}

Rule-based Asset Suggestions:
${ruleResults.map((item, idx) => `${idx + 1}. ${item.rule.suggestedAsset} (Score: ${item.score.toFixed(1)})`).join('\n')}

Task: For each suggested asset, provide a 1-sentence technical reasoning explaining WHY this asset is suitable for this specific geography.

Respond in JSON format:
{
  "recommendations": [
    {
      "asset": "asset_type",
      "reasoning": "Technical explanation based on geography"
    }
  ]
}`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse AI response
      const parsed = this.parseAIResponse(response);
      
      // Merge AI reasoning with rule results
      return ruleResults.map(item => {
        const aiRec = parsed.recommendations.find(r => r.asset === item.rule.suggestedAsset);
        return {
          rule: item.rule,
          score: item.score,
          reasoning: aiRec?.reasoning || item.rule.ruleName
        };
      });

    } catch (error) {
      console.error('AI enhancement failed:', error);
      // Fallback to rule-based reasoning
      return ruleResults.map(item => ({
        rule: item.rule,
        score: item.score,
        reasoning: item.rule.ruleName
      }));
    }
  }

  // Parse AI response (handle JSON or plain text)
  private parseAIResponse(response: string): { recommendations: Array<{ asset: string; reasoning: string }> } {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Ignore parse errors
    }

    // Fallback: empty recommendations
    return { recommendations: [] };
  }

  // Create full asset recommendation object
  private async createAssetRecommendation(
    assetType: MGNREGAAssetType,
    score: number,
    geoDNA: GeographyDNA,
    reasoning: string
  ): Promise<AssetRecommendation> {
    const assetSpecs = this.getAssetSpecifications(assetType);
    const microTasks = this.generateMicroTasks(assetType);

    return {
      assetId: `ASSET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      assetCode: assetType.toUpperCase(),
      assetType,
      assetName: this.getAssetName(assetType),
      category: this.getAssetCategory(assetType),
      recommendation: {
        score: Math.round(score),
        rank: 0, // Will be set after sorting
        confidence: score > 80 ? 'high' : score > 60 ? 'medium' : 'low',
        reasoning,
        geographyMatch: this.calculateGeographyMatch(assetType, geoDNA),
      },
      specifications: assetSpecs.specifications,
      labourDetails: assetSpecs.labourDetails,
      feasibility: this.generateFeasibilityAnalysis(assetType, geoDNA),
      microTasks,
      dprStatus: {
        status: 'not_started',
        autoGenerated: false,
      },
      generatedAt: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days validity
    };
  }

  // Get asset specifications (mock data - would come from database)
  private getAssetSpecifications(assetType: MGNREGAAssetType): any {
    const specs: Record<string, any> = {
      farm_pond: {
        specifications: {
          estimatedCost: 150000,
          materialLabourRatio: 40,
          estimatedDuration: 30,
          totalLabourDays: 800,
          skillLevel: 'unskilled' as const,
          technicalSupervision: true,
          materialsRequired: [
            { name: 'Cement', quantity: 50, unit: 'bags', estimatedCost: 20000 },
            { name: 'Sand', quantity: 10, unit: 'truck', estimatedCost: 15000 },
            { name: 'Stone', quantity: 15, unit: 'truck', estimatedCost: 25000 },
          ],
          toolsRequired: ['Spades', 'Pickaxes', 'Crowbars', 'Measuring Tape'],
          safetyMeasures: ['Safety Boots', 'Helmets', 'First Aid Kit'],
        },
        labourDetails: {
          minWorkers: 20,
          maxWorkers: 50,
          optimalWorkers: 35,
          totalManDays: 800,
          wageRate: 231,
          totalWageComponent: 184800,
          preferredDistribution: { women: 40, scSt: 30, pwd: 5 },
          workTypes: { heavyWork: 60, moderateWork: 30, lightWork: 10 },
        },
      },
      contour_bund: {
        specifications: {
          estimatedCost: 80000,
          materialLabourRatio: 20,
          estimatedDuration: 20,
          totalLabourDays: 500,
          skillLevel: 'semi_skilled' as const,
          technicalSupervision: true,
          materialsRequired: [
            { name: 'Stone', quantity: 8, unit: 'truck', estimatedCost: 16000 },
          ],
          toolsRequired: ['Spades', 'Pickaxes', 'Leveling Tools'],
          safetyMeasures: ['Safety Boots', 'Gloves'],
        },
        labourDetails: {
          minWorkers: 15,
          maxWorkers: 40,
          optimalWorkers: 25,
          totalManDays: 500,
          wageRate: 231,
          totalWageComponent: 115500,
          preferredDistribution: { women: 50, scSt: 35, pwd: 5 },
          workTypes: { heavyWork: 50, moderateWork: 40, lightWork: 10 },
        },
      },
      // Add more asset types...
    };

    return specs[assetType] || specs.farm_pond; // Default fallback
  }

  // Generate micro-tasks for parallel employment
  private generateMicroTasks(assetType: MGNREGAAssetType): MicroTask[] {
    const taskTemplates: Record<string, MicroTask[]> = {
      farm_pond: [
        {
          taskId: 'T1',
          taskName: { en: 'Site Survey & Marking', hi: 'साइट सर्वेक्षण और चिन्हांकन' },
          taskSequence: 1,
          taskType: 'survey',
          workIntensity: 'light',
          skillRequired: 'semi_skilled',
          workersNeeded: 5,
          estimatedDays: 3,
          totalManDays: 15,
          suitableFor: { women: true, men: true, elderly: true, pwd: true },
          dependencies: [],
          canRunParallel: false,
          parallelWith: [],
          wagePerDay: 231,
          totalWageCost: 3465,
          materialCost: 500,
          toolsNeeded: ['Measuring Tape', 'Marking Pegs', 'String'],
          materialsNeeded: [],
          weatherDependent: true,
          qualityCheckpoints: ['Accurate dimensions', 'Proper marking'],
        },
        {
          taskId: 'T2',
          taskName: { en: 'Excavation - Phase 1', hi: 'खुदाई - चरण 1' },
          taskSequence: 2,
          taskType: 'excavation',
          workIntensity: 'heavy',
          skillRequired: 'unskilled',
          workersNeeded: 30,
          estimatedDays: 10,
          totalManDays: 300,
          suitableFor: { women: false, men: true, elderly: false, pwd: false },
          dependencies: ['T1'],
          canRunParallel: false,
          parallelWith: [],
          wagePerDay: 231,
          totalWageCost: 69300,
          materialCost: 0,
          toolsNeeded: ['Spades', 'Pickaxes', 'Crowbars'],
          materialsNeeded: [],
          weatherDependent: true,
          qualityCheckpoints: ['Depth check', 'Slope verification'],
        },
        {
          taskId: 'T3',
          taskName: { en: 'Excavation - Phase 2', hi: 'खुदाई - चरण 2' },
          taskSequence: 3,
          taskType: 'excavation',
          workIntensity: 'heavy',
          skillRequired: 'unskilled',
          workersNeeded: 25,
          estimatedDays: 8,
          totalManDays: 200,
          suitableFor: { women: false, men: true, elderly: false, pwd: false },
          dependencies: ['T2'],
          canRunParallel: false,
          parallelWith: [],
          wagePerDay: 231,
          totalWageCost: 46200,
          materialCost: 0,
          toolsNeeded: ['Spades', 'Pickaxes'],
          materialsNeeded: [],
          weatherDependent: true,
          qualityCheckpoints: ['Final depth', 'Bottom leveling'],
        },
        {
          taskId: 'T4',
          taskName: { en: 'Bund Construction', hi: 'बांध निर्माण' },
          taskSequence: 4,
          taskType: 'construction',
          workIntensity: 'moderate',
          skillRequired: 'semi_skilled',
          workersNeeded: 20,
          estimatedDays: 7,
          totalManDays: 140,
          suitableFor: { women: true, men: true, elderly: false, pwd: false },
          dependencies: ['T3'],
          canRunParallel: false,
          parallelWith: [],
          wagePerDay: 231,
          totalWageCost: 32340,
          materialCost: 60000,
          toolsNeeded: ['Spades', 'Trowels', 'Compactors'],
          materialsNeeded: [
            { name: 'Cement', quantity: 50, unit: 'bags', estimatedCost: 20000 },
            { name: 'Sand', quantity: 10, unit: 'truck', estimatedCost: 15000 },
            { name: 'Stone', quantity: 15, unit: 'truck', estimatedCost: 25000 },
          ],
          weatherDependent: true,
          qualityCheckpoints: ['Bund strength', 'Height verification'],
        },
        {
          taskId: 'T5',
          taskName: { en: 'Plantation Around Pond', hi: 'तालाब के आसपास वृक्षारोपण' },
          taskSequence: 5,
          taskType: 'plantation',
          workIntensity: 'light',
          skillRequired: 'unskilled',
          workersNeeded: 15,
          estimatedDays: 2,
          totalManDays: 30,
          suitableFor: { women: true, men: true, elderly: true, pwd: true },
          dependencies: ['T4'],
          canRunParallel: true,
          parallelWith: ['T6'],
          wagePerDay: 231,
          totalWageCost: 6930,
          materialCost: 2000,
          toolsNeeded: ['Spades', 'Watering Cans'],
          materialsNeeded: [{ name: 'Saplings', quantity: 100, unit: 'nos', estimatedCost: 2000 }],
          weatherDependent: true,
          qualityCheckpoints: ['Proper spacing', 'Adequate watering'],
        },
      ],
    };

    return taskTemplates[assetType] || [];
  }

  // Calculate geography match score
  private calculateGeographyMatch(assetType: MGNREGAAssetType, geoDNA: GeographyDNA): GeographyMatchScore {
    // Simplified scoring logic
    let terrainMatch = 50;
    let soilMatch = 50;
    let waterMatch = 50;
    let seasonalMatch = 50;

    // Asset-specific matching
    if (assetType === 'farm_pond') {
      if (geoDNA.water.waterStress !== 'none') waterMatch = 90;
      if (geoDNA.terrain.type === 'plain') terrainMatch = 85;
      if (geoDNA.soil.waterHoldingCapacity === 'low') soilMatch = 80;
    } else if (assetType === 'contour_bund') {
      if (geoDNA.terrain.slope !== 'flat') terrainMatch = 90;
      if (geoDNA.soil.erosionProne) soilMatch = 95;
      if (geoDNA.water.rainfallZone === 'high') waterMatch = 85;
    }

    const overallMatch = (terrainMatch + soilMatch + waterMatch + seasonalMatch) / 4;

    return {
      terrainMatch,
      soilMatch,
      waterMatch,
      seasonalMatch,
      overallMatch: Math.round(overallMatch),
      matchCriteria: ['Terrain compatibility', 'Soil suitability', 'Water need', 'Seasonal feasibility'],
    };
  }

  // Generate feasibility analysis
  private generateFeasibilityAnalysis(assetType: MGNREGAAssetType, geoDNA: GeographyDNA): any {
    return {
      technical: {
        feasible: true,
        constraints: ['Technical supervision required', 'Soil testing recommended'],
        preconditions: ['Site survey', 'Community consultation'],
      },
      seasonal: {
        bestMonths: ['November', 'December', 'January', 'February'],
        avoidMonths: ['July', 'August'], // monsoon
        weatherDependent: true,
      },
      social: {
        communityConsent: 'required' as const,
        landAvailability: 'available' as const,
        beneficiaries: Math.floor(geoDNA.socioEconomic.totalHouseholds * 0.3),
      },
      economic: {
        benefitCostRatio: 2.5,
        impactScore: 75,
        sustainability: 'high' as const,
      },
      environmental: {
        environmentalClearance: false,
        ecologicalImpact: 'positive' as const,
        climateResilience: 85,
      },
    };
  }

  // Get asset category
  private getAssetCategory(assetType: MGNREGAAssetType): AssetCategory {
    const categoryMap: Record<string, AssetCategory> = {
      farm_pond: 'water_conservation',
      check_dam: 'water_conservation',
      percolation_tank: 'water_conservation',
      drainage_channel: 'water_conservation',
      contour_bund: 'land_development',
      land_leveling: 'land_development',
      bunding: 'land_development',
      wasteland_development: 'land_development',
      rural_road: 'rural_connectivity',
      plantation: 'forestry',
      tank_desilting: 'water_conservation',
    };

    return categoryMap[assetType] || 'infrastructure';
  }

  // Get localized asset name
  private getAssetName(assetType: MGNREGAAssetType): { en: string; hi: string } {
    const names: Record<MGNREGAAssetType, { en: string; hi: string }> = {
      farm_pond: { en: 'Farm Pond', hi: 'फार्म तालाब' },
      check_dam: { en: 'Check Dam', hi: 'चेक डैम' },
      percolation_tank: { en: 'Percolation Tank', hi: 'पारगम्य टंकी' },
      water_harvesting_structure: { en: 'Water Harvesting Structure', hi: 'जल संचयन संरचना' },
      drainage_channel: { en: 'Drainage Channel', hi: 'जल निकासी नाली' },
      contour_bund: { en: 'Contour Bund', hi: 'समोच्च बांध' },
      gabion_structure: { en: 'Gabion Structure', hi: 'गैबियन संरचना' },
      tank_desilting: { en: 'Tank Desilting', hi: 'तालाब गाद निकासी' },
      land_leveling: { en: 'Land Leveling', hi: 'भूमि समतलीकरण' },
      bunding: { en: 'Bunding', hi: 'बंधान' },
      terracing: { en: 'Terracing', hi: 'सीढ़ीदार खेती' },
      gully_plugging: { en: 'Gully Plugging', hi: 'नाली अवरोधन' },
      wasteland_development: { en: 'Wasteland Development', hi: 'बंजर भूमि विकास' },
      soil_conservation: { en: 'Soil Conservation', hi: 'मृदा संरक्षण' },
      rural_road: { en: 'Rural Road', hi: 'ग्रामीण सड़क' },
      rural_drain: { en: 'Rural Drain', hi: 'ग्रामीण नाली' },
      community_pond: { en: 'Community Pond', hi: 'सामुदायिक तालाब' },
      playground: { en: 'Playground', hi: 'खेल का मैदान' },
      cremation_ground: { en: 'Cremation Ground', hi: 'श्मशान घाट' },
      plantation: { en: 'Plantation', hi: 'वृक्षारोपण' },
      horticulture_development: { en: 'Horticulture Development', hi: 'बागवानी विकास' },
      pasture_development: { en: 'Pasture Development', hi: 'चारागाह विकास' },
      agroforestry: { en: 'Agroforestry', hi: 'कृषि वानिकी' },
      irrigation_channel: { en: 'Irrigation Channel', hi: 'सिंचाई नहर' },
      field_channel: { en: 'Field Channel', hi: 'खेत नहर' },
      vermicompost_unit: { en: 'Vermicompost Unit', hi: 'वर्मीकम्पोस्ट इकाई' },
      seed_storage: { en: 'Seed Storage', hi: 'बीज भंडारण' },
      livestock_shed: { en: 'Livestock Shed', hi: 'पशुशाला' },
      poultry_unit: { en: 'Poultry Unit', hi: 'मुर्गी पालन इकाई' },
      fishery: { en: 'Fishery', hi: 'मत्स्य पालन' },
      sericulture: { en: 'Sericulture', hi: 'रेशम उत्पादन' },
    };

    return names[assetType] || { en: assetType, hi: assetType };
  }

  // ========================================
  // DEMAND FORECASTING (AI-powered)
  // ========================================

  async generateDemandForecast(
    villageProfile: VillageGeographyProfile,
    historicalData: any
  ): Promise<DemandForecast> {
    if (!this.genAI) {
      return this.generateFallbackForecast(villageProfile);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are an AI demand forecasting system for MGNREGA employment.

Village: ${villageProfile.villageName}
Job Cards: ${villageProfile.geographyDNA.socioEconomic.mgnregaJobCards}
Average Employment Demand: ${villageProfile.geographyDNA.socioEconomic.averageEmploymentDemand} days/year
Migration Level: ${villageProfile.geographyDNA.socioEconomic.migrationLevel}
Rainfall Zone: ${villageProfile.geographyDNA.water.rainfallZone}
Drought Prone: ${villageProfile.geographyDNA.climate.droughtProne}

Current Month: ${new Date().toLocaleString('default', { month: 'long' })}

Task: Predict employment demand for next 30 days.

Consider:
1. Seasonal patterns (agricultural cycle)
2. Weather impact (rainfall, temperature)
3. Migration trends
4. Historical demand patterns
5. Upcoming festivals/events

Respond in JSON:
{
  "expectedWorkers": <number>,
  "expectedManDays": <number>,
  "peakDemandDate": "YYYY-MM-DD",
  "demandPattern": "steady|spike|declining|cyclical",
  "confidence": <0-100>,
  "reasoning": "Brief explanation"
}`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      const parsed = this.parseAIResponse(response);

      const forecastData = parsed as any;

      return {
        forecastId: `FORECAST_${Date.now()}`,
        villageLGDCode: villageProfile.villageLGDCode,
        forecastType: 'short_term',
        predictionWindow: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          horizonDays: 30,
        },
        prediction: {
          expectedWorkers: forecastData.expectedWorkers || 100,
          expectedManDays: forecastData.expectedManDays || 2000,
          peakDemandDate: new Date(forecastData.peakDemandDate || Date.now()),
          demandPattern: forecastData.demandPattern || 'steady',
          confidence: forecastData.confidence || 70,
        },
        triggerFactors: {
          seasonalPattern: 0.3,
          historicalTrend: 0.2,
          cropCycle: 0.2,
          weather: 0.15,
          migration: 0.1,
          festivals: 0.05,
          other: 0,
        },
        inputData: {
          historicalDemand: [],
          rainfallData: [],
          temperatureData: [],
          cropCalendar: 'Rabi season',
          migrationTrends: villageProfile.geographyDNA.socioEconomic.migrationLevel,
          pastThreeYearsAvg: villageProfile.geographyDNA.socioEconomic.averageEmploymentDemand,
        },
        recommendations: {
          recommendedAction: 'maintain',
          suggestedWorks: ['farm_pond', 'land_leveling'],
          prepareBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          workersToAccommodate: forecastData.expectedWorkers || 100,
        },
        modelInfo: {
          modelName: 'Gemini-1.5-Flash',
          modelVersion: 'v1',
          accuracy: 75,
          lastTrained: new Date(),
        },
        generatedAt: new Date(),
        generatedBy: 'ai',
      };

    } catch (error) {
      console.error('Demand forecasting failed:', error);
      return this.generateFallbackForecast(villageProfile);
    }
  }

  // Fallback forecast (rule-based)
  private generateFallbackForecast(villageProfile: VillageGeographyProfile): DemandForecast {
    const avgDemand = villageProfile.geographyDNA.socioEconomic.averageEmploymentDemand;
    const jobCards = villageProfile.geographyDNA.socioEconomic.mgnregaJobCards;
    
    const expectedWorkers = Math.floor(jobCards * 0.4); // 40% job cards active
    const expectedManDays = expectedWorkers * 15; // avg 15 days per worker in 30 days

    return {
      forecastId: `FORECAST_${Date.now()}`,
      villageLGDCode: villageProfile.villageLGDCode,
      forecastType: 'short_term',
      predictionWindow: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        horizonDays: 30,
      },
      prediction: {
        expectedWorkers,
        expectedManDays,
        peakDemandDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        demandPattern: 'steady',
        confidence: 60,
      },
      triggerFactors: {
        seasonalPattern: 0.4,
        historicalTrend: 0.3,
        cropCycle: 0.2,
        weather: 0.1,
        migration: 0,
        festivals: 0,
        other: 0,
      },
      inputData: {
        historicalDemand: [],
        rainfallData: [],
        temperatureData: [],
        cropCalendar: 'Rabi season',
        migrationTrends: villageProfile.geographyDNA.socioEconomic.migrationLevel,
        pastThreeYearsAvg: avgDemand,
      },
      recommendations: {
        recommendedAction: 'maintain',
        suggestedWorks: ['farm_pond', 'contour_bund'],
        prepareBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        workersToAccommodate: expectedWorkers,
      },
      modelInfo: {
        modelName: 'Rule-Based-Fallback',
        modelVersion: 'v1',
        accuracy: 60,
        lastTrained: new Date(),
      },
      generatedAt: new Date(),
      generatedBy: 'ai',
    };
  }
}

// Export singleton instance
export const livingShelfEngine = new LivingShelfEngine();
