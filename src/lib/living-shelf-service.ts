// SAHAYOG - Living Shelf Data Service
// Database operations for Geography-Driven Work Planning

import type {
  VillageGeographyProfile,
  GeographyDNA,
  LivingShelfOfWorks,
  ReadyWork,
  StandbyWork,
  EmergencyWork,
  AssetRecommendation,
  AutoDPR,
} from '@/types/geography';
import { livingShelfEngine } from './living-shelf-engine';

// ========================================
// MOCK DATA GENERATION
// ========================================

// Generate mock village geography profiles
export function generateMockVillageProfiles(): VillageGeographyProfile[] {
  return [
    {
      _id: 'VILLAGE_001',
      villageLGDCode: 'MH191001',
      villageName: 'शहापूर',
      block: 'शहापूर',
      district: 'ठाणे',
      state: 'महाराष्ट्र',
      geographyDNA: {
        terrain: {
          type: 'hilly',
          slope: 'moderate',
          elevation: { min: 200, max: 450, avg: 325, unit: 'meters' },
          landform: 'valley',
        },
        soil: {
          type: 'laterite',
          texture: 'medium',
          depth: 'medium',
          drainage: 'good',
          fertility: 'medium',
          erosionProne: true,
          waterHoldingCapacity: 'medium',
          pH: 6.5,
          source: 'NBSS&LUP',
        },
        water: {
          rainfallZone: 'high',
          annualRainfall: { mm: 2500, variability: 'erratic' },
          waterStress: 'seasonal',
          waterBodies: { ponds: 3, tanks: 2, rivers: 1, canals: 0 },
          drainagePattern: 'dendritic',
          floodProne: false,
          groundwaterLevel: 'medium',
          irrigationStatus: 'partial',
        },
        landUse: {
          agricultural: 55,
          forest: 25,
          barren: 5,
          wasteland: 8,
          builtUp: 5,
          waterbodies: 2,
          source: 'satellite',
          degradedLand: 10,
          fallowLand: 12,
        },
        climate: {
          zone: 'tropical',
          temperatureRange: { min: 15, max: 38, unit: 'celsius' },
          seasonalPattern: {
            monsoon: { start: 'June', end: 'September', intensity: 'high' },
            winter: { start: 'November', end: 'February' },
            summer: { start: 'March', end: 'May' },
          },
          droughtProne: false,
          heatwaveProne: true,
          cycloneProne: false,
        },
        forest: {
          coverPercentage: 25,
          forestType: 'open',
          forestFringe: true,
          biodiversityZone: false,
          scheduledArea: false,
          forestRights: false,
        },
        socioEconomic: {
          totalPopulation: 8500,
          totalHouseholds: 1800,
          scPopulation: 1200,
          stPopulation: 400,
          mgnregaJobCards: 1200,
          averageEmploymentDemand: 85000,
          migrationLevel: 'medium',
          literacyRate: 68,
          connectivityScore: 55,
        },
      },
      dataSources: {
        nbssLup: { integrated: true, lastSync: new Date('2024-01-15') },
        isro: { demData: true, satelliteImagery: true, lastSync: new Date('2024-02-01') },
        imd: { rainfallData: true, lastSync: new Date('2024-01-20') },
        fsi: { forestCoverData: true, lastSync: new Date('2023-12-01') },
        watershedAtlas: { integrated: true, watershedCode: 'WS_MH_191_001' },
        nrsc: { wastelandAtlas: true, lastSync: new Date('2024-01-10') },
        mgnregaMIS: { historicalWorkData: true, demandData: true, lastSync: new Date('2024-01-31') },
      },
      recommendedAssets: [],
      livingShelf: {
        shelfId: 'SHELF_001',
        villageLGDCode: 'MH191001',
        fiscalYear: '2025-26',
        lastUpdated: new Date(),
        readyWorks: [],
        standbyWorks: [],
        emergencyWorks: [],
        metrics: {
          totalWorks: 0,
          readyCount: 0,
          standbyCount: 0,
          emergencyCount: 0,
          totalLabourPotential: 0,
          totalBudgetReserved: 0,
          coverage: {
            waterConservation: 0,
            landDevelopment: 0,
            ruralConnectivity: 0,
            agriculture: 0,
            livelihood: 0,
            forestry: 0,
          },
          geographicDistribution: { northVillages: 0, southVillages: 0, eastVillages: 0, westVillages: 0 },
          seasonalReadiness: { monsoon: 0, postMonsoon: 0, winter: 0, summer: 0 },
        },
        autoUpdateRules: {
          enabled: true,
          updateFrequency: 'weekly',
          lastAutoUpdate: new Date(),
          nextScheduledUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      demandForecasts: [],
      lastUpdated: new Date(),
      profileVersion: 'v1.0',
    },
    {
      _id: 'VILLAGE_002',
      villageLGDCode: 'MH191002',
      villageName: 'वाडा',
      block: 'वाडा',
      district: 'ठाणे',
      state: 'महाराष्ट्र',
      geographyDNA: {
        terrain: {
          type: 'plain',
          slope: 'gentle',
          elevation: { min: 100, max: 180, avg: 140, unit: 'meters' },
          landform: 'plain',
        },
        soil: {
          type: 'alluvial',
          texture: 'fine',
          depth: 'deep',
          drainage: 'moderate',
          fertility: 'high',
          erosionProne: false,
          waterHoldingCapacity: 'high',
          pH: 7.2,
          source: 'NBSS&LUP',
        },
        water: {
          rainfallZone: 'medium',
          annualRainfall: { mm: 1800, variability: 'stable' },
          waterStress: 'seasonal',
          waterBodies: { ponds: 5, tanks: 4, rivers: 0, canals: 2 },
          drainagePattern: 'parallel',
          floodProne: true,
          groundwaterLevel: 'shallow',
          irrigationStatus: 'full',
        },
        landUse: {
          agricultural: 75,
          forest: 10,
          barren: 2,
          wasteland: 3,
          builtUp: 8,
          waterbodies: 2,
          source: 'satellite',
          degradedLand: 4,
          fallowLand: 8,
        },
        climate: {
          zone: 'subtropical',
          temperatureRange: { min: 18, max: 35, unit: 'celsius' },
          seasonalPattern: {
            monsoon: { start: 'June', end: 'September', intensity: 'medium' },
            winter: { start: 'November', end: 'February' },
            summer: { start: 'March', end: 'May' },
          },
          droughtProne: true,
          heatwaveProne: false,
          cycloneProne: false,
        },
        forest: {
          coverPercentage: 10,
          forestType: 'none',
          forestFringe: false,
          biodiversityZone: false,
          scheduledArea: false,
          forestRights: false,
        },
        socioEconomic: {
          totalPopulation: 12000,
          totalHouseholds: 2400,
          scPopulation: 1800,
          stPopulation: 200,
          mgnregaJobCards: 1800,
          averageEmploymentDemand: 120000,
          migrationLevel: 'high',
          literacyRate: 72,
          connectivityScore: 75,
        },
      },
      dataSources: {
        nbssLup: { integrated: true, lastSync: new Date('2024-01-15') },
        isro: { demData: true, satelliteImagery: true, lastSync: new Date('2024-02-01') },
        imd: { rainfallData: true, lastSync: new Date('2024-01-20') },
        fsi: { forestCoverData: true, lastSync: new Date('2023-12-01') },
        watershedAtlas: { integrated: true, watershedCode: 'WS_MH_191_002' },
        nrsc: { wastelandAtlas: true, lastSync: new Date('2024-01-10') },
        mgnregaMIS: { historicalWorkData: true, demandData: true, lastSync: new Date('2024-01-31') },
      },
      recommendedAssets: [],
      livingShelf: {
        shelfId: 'SHELF_002',
        villageLGDCode: 'MH191002',
        fiscalYear: '2025-26',
        lastUpdated: new Date(),
        readyWorks: [],
        standbyWorks: [],
        emergencyWorks: [],
        metrics: {
          totalWorks: 0,
          readyCount: 0,
          standbyCount: 0,
          emergencyCount: 0,
          totalLabourPotential: 0,
          totalBudgetReserved: 0,
          coverage: {
            waterConservation: 0,
            landDevelopment: 0,
            ruralConnectivity: 0,
            agriculture: 0,
            livelihood: 0,
            forestry: 0,
          },
          geographicDistribution: { northVillages: 0, southVillages: 0, eastVillages: 0, westVillages: 0 },
          seasonalReadiness: { monsoon: 0, postMonsoon: 0, winter: 0, summer: 0 },
        },
        autoUpdateRules: {
          enabled: true,
          updateFrequency: 'weekly',
          lastAutoUpdate: new Date(),
          nextScheduledUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      demandForecasts: [],
      lastUpdated: new Date(),
      profileVersion: 'v1.0',
    },
  ];
}

// ========================================
// LIVING SHELF OPERATIONS
// ========================================

export class LivingShelfService {
  private villageProfiles: Map<string, VillageGeographyProfile> = new Map();

  constructor() {
    // Initialize with mock data
    const profiles = generateMockVillageProfiles();
    profiles.forEach(profile => {
      this.villageProfiles.set(profile.villageLGDCode, profile);
    });
  }

  // Get village geography profile
  async getVillageProfile(villageLGDCode: string): Promise<VillageGeographyProfile | null> {
    return this.villageProfiles.get(villageLGDCode) || null;
  }

  // Generate Living Shelf for a village
  async generateLivingShelf(villageLGDCode: string): Promise<LivingShelfOfWorks | null> {
    const profile = await this.getVillageProfile(villageLGDCode);
    if (!profile) return null;

    // Step 1: Generate asset recommendations using AI
    const recommendations = await livingShelfEngine.generateAssetRecommendations(profile);

    // Step 2: Classify works into three states
    const { readyWorks, standbyWorks, emergencyWorks } = this.classifyWorks(recommendations);

    // Step 3: Calculate metrics
    const metrics = this.calculateShelfMetrics(readyWorks, standbyWorks, emergencyWorks);

    // Step 4: Generate demand forecast
    const forecast = await livingShelfEngine.generateDemandForecast(profile, {});

    // Update profile
    profile.recommendedAssets = recommendations;
    profile.demandForecasts = [forecast];
    profile.livingShelf = {
      shelfId: `SHELF_${villageLGDCode}`,
      villageLGDCode,
      fiscalYear: '2025-26',
      lastUpdated: new Date(),
      readyWorks,
      standbyWorks,
      emergencyWorks,
      metrics,
      autoUpdateRules: {
        enabled: true,
        updateFrequency: 'weekly',
        lastAutoUpdate: new Date(),
        nextScheduledUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    };

    this.villageProfiles.set(villageLGDCode, profile);

    return profile.livingShelf;
  }

  // Classify works into three states: READY, STANDBY, EMERGENCY
  private classifyWorks(recommendations: AssetRecommendation[]): {
    readyWorks: ReadyWork[];
    standbyWorks: StandbyWork[];
    emergencyWorks: EmergencyWork[];
  } {
    // Top 3 high-confidence works → READY (simulated as already approved)
    const readyWorks: ReadyWork[] = recommendations
      .filter(r => r.recommendation.confidence === 'high')
      .slice(0, 3)
      .map((rec, idx) => ({
        workId: `READY_${Date.now()}_${idx}`,
        assetType: rec.assetType,
        workTitle: rec.assetName,
        status: 'ready' as const,
        readyState: {
          dprPrepared: true,
          dprApprovedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          dprApprovedBy: 'Block Development Officer',
          technicalSanction: true,
          sanctionNumber: `TS/2025/${1000 + idx}`,
          sanctionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          budgetAllocated: true,
          allocationAmount: rec.specifications.estimatedCost,
          siteIdentified: true,
          siteDetails: 'Site survey completed, coordinates marked',
        },
        labourAllocation: {
          totalSlots: rec.labourDetails.maxWorkers,
          allocatedSlots: 0,
          remainingSlots: rec.labourDetails.maxWorkers,
          targetCategories: {
            scSt: Math.floor(rec.labourDetails.maxWorkers * 0.3),
            women: Math.floor(rec.labourDetails.maxWorkers * 0.4),
            pwd: Math.floor(rec.labourDetails.maxWorkers * 0.05),
          },
        },
        timeline: {
          canStartFrom: new Date(),
          estimatedDuration: rec.specifications.estimatedDuration,
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        },
        microTasks: rec.microTasks,
        assetDetails: rec,
        createdDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        priority: 10 - idx,
      }));

    // Next 6 medium-high confidence works → STANDBY (auto-generated DPR)
    const standbyWorks: StandbyWork[] = recommendations
      .filter(r => r.recommendation.confidence === 'medium' || r.recommendation.confidence === 'high')
      .slice(3, 9)
      .map((rec, idx) => ({
        workId: `STANDBY_${Date.now()}_${idx}`,
        assetType: rec.assetType,
        workTitle: rec.assetName,
        status: 'standby' as const,
        standbyState: {
          geographyValidated: true,
          demandValidated: true,
          autoDPRGenerated: true,
          dprGeneratedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          awaitingApproval: true,
          approvalLevel: 'gp',
          estimatedApprovalTime: 7,
        },
        quickActivation: {
          canActivateIn: 48,
          requiredSteps: ['GP approval', 'Technical sanction', 'Budget allocation'],
          documentsReady: ['Auto-DPR', 'Site survey', 'Cost estimate'],
          documentsPending: ['GP resolution', 'Technical sanction letter'],
        },
        labourPotential: {
          minWorkers: rec.labourDetails.minWorkers,
          maxWorkers: rec.labourDetails.maxWorkers,
          estimatedManDays: rec.labourDetails.totalManDays,
        },
        assetDetails: rec,
        generatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        validityPeriod: 90,
        expiresOn: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000),
      }));

    // Remaining works → EMERGENCY (pre-approved for crisis)
    const emergencyWorks: EmergencyWork[] = recommendations
      .slice(9, 12)
      .map((rec, idx) => ({
        workId: `EMERGENCY_${Date.now()}_${idx}`,
        assetType: rec.assetType,
        workTitle: rec.assetName,
        status: 'emergency' as const,
        emergencyType: idx === 0 ? 'drought' : idx === 1 ? 'migration_spike' : 'seasonal_gap',
        emergencyState: {
          triggerCondition: 'Demand spike > 150% of normal',
          activationThreshold: 'Block officer verbal approval',
          fastTrackApproval: true,
          reducedDocumentation: true,
          canStartImmediately: true,
        },
        rapidDeployment: {
          activationTime: 12,
          minimalPaperwork: ['Work order', 'Muster roll'],
          verbalApprovalAllowed: true,
          postFactoDocumentation: true,
        },
        crisisContext: {
          affectedPopulation: 500,
          urgencyScore: 85,
          reliefPotential: 'high',
          communityConsent: true,
        },
        labourAbsorption: {
          canAbsorb: rec.labourDetails.maxWorkers,
          immediateSlots: Math.floor(rec.labourDetails.maxWorkers * 0.5),
          scalable: true,
          maxScaleUp: rec.labourDetails.maxWorkers * 2,
        },
        assetDetails: rec,
        preApprovedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        validDuration: 180,
      }));

    return { readyWorks, standbyWorks, emergencyWorks };
  }

  // Calculate shelf metrics
  private calculateShelfMetrics(
    readyWorks: ReadyWork[],
    standbyWorks: StandbyWork[],
    emergencyWorks: EmergencyWork[]
  ): any {
    const totalLabourPotential =
      readyWorks.reduce((sum, w) => sum + w.assetDetails.labourDetails.totalManDays, 0) +
      standbyWorks.reduce((sum, w) => sum + w.labourPotential.estimatedManDays, 0) +
      emergencyWorks.reduce((sum, w) => sum + w.labourAbsorption.canAbsorb * 20, 0);

    const totalBudgetReserved =
      readyWorks.reduce((sum, w) => sum + w.readyState.allocationAmount, 0) +
      standbyWorks.reduce((sum, w) => sum + w.assetDetails.specifications.estimatedCost, 0);

    const coverage: any = {
      waterConservation: 0,
      landDevelopment: 0,
      ruralConnectivity: 0,
      agriculture: 0,
      livelihood: 0,
      forestry: 0,
    };

    [...readyWorks, ...standbyWorks, ...emergencyWorks].forEach(work => {
      const category = work.assetDetails.category;
      if (category in coverage) {
        coverage[category]++;
      }
    });

    return {
      totalWorks: readyWorks.length + standbyWorks.length + emergencyWorks.length,
      readyCount: readyWorks.length,
      standbyCount: standbyWorks.length,
      emergencyCount: emergencyWorks.length,
      totalLabourPotential,
      totalBudgetReserved,
      coverage,
      geographicDistribution: { northVillages: 0, southVillages: 0, eastVillages: 0, westVillages: 0 },
      seasonalReadiness: { monsoon: 0, postMonsoon: 0, winter: 0, summer: 0 },
    };
  }

  // Get all village profiles
  async getAllVillages(): Promise<VillageGeographyProfile[]> {
    return Array.from(this.villageProfiles.values());
  }

  // Activate a standby work (move to ready)
  async activateStandbyWork(villageLGDCode: string, workId: string): Promise<boolean> {
    const profile = await this.getVillageProfile(villageLGDCode);
    if (!profile) return false;

    const standbyWork = profile.livingShelf.standbyWorks.find(w => w.workId === workId);
    if (!standbyWork) return false;

    // Convert to ready work
    const readyWork: ReadyWork = {
      workId: `READY_${Date.now()}`,
      assetType: standbyWork.assetType,
      workTitle: standbyWork.workTitle,
      status: 'ready',
      readyState: {
        dprPrepared: true,
        dprApprovedDate: new Date(),
        dprApprovedBy: 'Gram Panchayat',
        technicalSanction: true,
        sanctionNumber: `TS/2026/${Math.floor(Math.random() * 9000) + 1000}`,
        sanctionDate: new Date(),
        budgetAllocated: true,
        allocationAmount: standbyWork.assetDetails.specifications.estimatedCost,
        siteIdentified: true,
        siteDetails: 'Activated from standby',
      },
      labourAllocation: {
        totalSlots: standbyWork.labourPotential.maxWorkers,
        allocatedSlots: 0,
        remainingSlots: standbyWork.labourPotential.maxWorkers,
        targetCategories: {
          scSt: Math.floor(standbyWork.labourPotential.maxWorkers * 0.3),
          women: Math.floor(standbyWork.labourPotential.maxWorkers * 0.4),
          pwd: Math.floor(standbyWork.labourPotential.maxWorkers * 0.05),
        },
      },
      timeline: {
        canStartFrom: new Date(),
        estimatedDuration: standbyWork.assetDetails.specifications.estimatedDuration,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
      microTasks: standbyWork.assetDetails.microTasks,
      assetDetails: standbyWork.assetDetails,
      createdDate: new Date(),
      priority: 5,
    };

    // Remove from standby, add to ready
    profile.livingShelf.standbyWorks = profile.livingShelf.standbyWorks.filter(w => w.workId !== workId);
    profile.livingShelf.readyWorks.push(readyWork);

    // Update metrics
    profile.livingShelf.metrics.readyCount++;
    profile.livingShelf.metrics.standbyCount--;

    this.villageProfiles.set(villageLGDCode, profile);

    return true;
  }

  // Trigger emergency work
  async triggerEmergencyWork(villageLGDCode: string, workId: string): Promise<boolean> {
    const profile = await this.getVillageProfile(villageLGDCode);
    if (!profile) return false;

    const emergencyWork = profile.livingShelf.emergencyWorks.find(w => w.workId === workId);
    if (!emergencyWork) return false;

    // Convert to ready work (fast-track)
    const readyWork: ReadyWork = {
      workId: `EMERGENCY_READY_${Date.now()}`,
      assetType: emergencyWork.assetType,
      workTitle: emergencyWork.workTitle,
      status: 'ready',
      readyState: {
        dprPrepared: true,
        dprApprovedDate: new Date(),
        dprApprovedBy: 'Block Development Officer (Emergency)',
        technicalSanction: true,
        sanctionNumber: `EMG/2026/${Math.floor(Math.random() * 9000) + 1000}`,
        sanctionDate: new Date(),
        budgetAllocated: true,
        allocationAmount: emergencyWork.assetDetails.specifications.estimatedCost,
        siteIdentified: true,
        siteDetails: 'Emergency activation',
      },
      labourAllocation: {
        totalSlots: emergencyWork.labourAbsorption.canAbsorb,
        allocatedSlots: 0,
        remainingSlots: emergencyWork.labourAbsorption.canAbsorb,
        targetCategories: {
          scSt: Math.floor(emergencyWork.labourAbsorption.canAbsorb * 0.3),
          women: Math.floor(emergencyWork.labourAbsorption.canAbsorb * 0.4),
          pwd: Math.floor(emergencyWork.labourAbsorption.canAbsorb * 0.05),
        },
      },
      timeline: {
        canStartFrom: new Date(),
        estimatedDuration: emergencyWork.assetDetails.specifications.estimatedDuration,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      microTasks: emergencyWork.assetDetails.microTasks,
      assetDetails: emergencyWork.assetDetails,
      createdDate: new Date(),
      priority: 10,
    };

    profile.livingShelf.readyWorks.push(readyWork);
    profile.livingShelf.metrics.readyCount++;

    this.villageProfiles.set(villageLGDCode, profile);

    return true;
  }
}

// Export singleton instance
export const livingShelfService = new LivingShelfService();
