// MongoDB Connection and Database Operations
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

// MongoDB Connection String
const MONGODB_URI = 'mongodb+srv://harrysteelers45_db_user:oRVfBACyaOqYw42C@cluster0.svjwfuw.mongodb.net/';
const DB_NAME = 'sahayog_db';

// MongoDB Client
let client: MongoClient | null = null;
let db: Db | null = null;

// Collections
export const collections: {
  users?: Collection;
  conversations?: Collection;
  mgnregaWorkOpportunities?: Collection;
  mgnregaAttendance?: Collection;
  payments?: Collection;
  grievances?: Collection;
  schemes?: Collection;
  skillsCourses?: Collection;
  notifications?: Collection;
  aiSystemPrompts?: Collection;
  officials?: Collection;
  auditLogs?: Collection;
  certificates?: Collection;
  feedback?: Collection;
  analytics?: Collection;
  mlPriorityScores?: Collection;
  fraudDetections?: Collection;
  fairnessAudits?: Collection;
} = {};

// Connect to MongoDB
export async function connectToDatabase(): Promise<Db> {
  if (db) return db;

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    
    // Initialize collections
    collections.users = db.collection('users');
    collections.conversations = db.collection('conversations');
    collections.mgnregaWorkOpportunities = db.collection('mgnrega_work_opportunities');
    collections.mgnregaAttendance = db.collection('mgnrega_attendance');
    collections.payments = db.collection('payments');
    collections.grievances = db.collection('grievances');
    collections.schemes = db.collection('schemes');
    collections.skillsCourses = db.collection('skills_courses');
    collections.notifications = db.collection('notifications');
    collections.aiSystemPrompts = db.collection('ai_system_prompts');
    collections.officials = db.collection('officials');
    collections.auditLogs = db.collection('audit_logs');
    collections.certificates = db.collection('certificates');
    collections.feedback = db.collection('feedback');
    collections.analytics = db.collection('analytics');
    collections.mlPriorityScores = db.collection('ml_priority_scores');
    collections.fraudDetections = db.collection('fraud_detections');
    collections.fairnessAudits = db.collection('fairness_audits');

    // Create indexes for better performance
    await createIndexes();
    
    console.log('Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Create indexes for collections
async function createIndexes() {
  if (!db) return;

  try {
    // Users collection indexes
    await collections.users?.createIndex({ aadhaarNumber: 1 }, { unique: true });
    await collections.users?.createIndex({ 'mgnregaInfo.jobCardNumber': 1 });
    await collections.users?.createIndex({ 'address.villageLGDCode': 1 });
    await collections.users?.createIndex({ 'address.districtLGDCode': 1 });
    await collections.users?.createIndex({ phoneNumber: 1 });
    await collections.users?.createIndex({ 'address.geoLocation': '2dsphere' });

    // Conversations collection indexes
    await collections.conversations?.createIndex({ userId: 1, startedAt: -1 });
    await collections.conversations?.createIndex({ sessionId: 1 }, { unique: true });
    await collections.conversations?.createIndex({ 'summary.issuesIdentified.severity': 1 });

    // Work opportunities indexes
    await collections.mgnregaWorkOpportunities?.createIndex({ 'location.geoLocation': '2dsphere' });
    await collections.mgnregaWorkOpportunities?.createIndex({ 'location.villageLGDCode': 1 });
    await collections.mgnregaWorkOpportunities?.createIndex({ status: 1, 'workDetails.startDate': 1 });
    await collections.mgnregaWorkOpportunities?.createIndex({ 'allocation.slotsRemaining': 1 });

    // Attendance indexes
    await collections.mgnregaAttendance?.createIndex({ userId: 1, date: -1 });
    await collections.mgnregaAttendance?.createIndex({ workOpportunityId: 1 });
    await collections.mgnregaAttendance?.createIndex({ jobCardNumber: 1 });
    await collections.mgnregaAttendance?.createIndex({ paymentStatus: 1 });

    // Payments indexes
    await collections.payments?.createIndex({ userId: 1, status: 1 });
    await collections.payments?.createIndex({ scheme: 1, status: 1 });
    await collections.payments?.createIndex({ ftoNumber: 1 });
    await collections.payments?.createIndex({ completedDate: -1 });

    // Grievances indexes
    await collections.grievances?.createIndex({ grievanceNumber: 1 }, { unique: true });
    await collections.grievances?.createIndex({ userId: 1, status: 1 });
    await collections.grievances?.createIndex({ status: 1, 'slaDetails.slaDeadline': 1 });
    await collections.grievances?.createIndex({ 'assignedTo.officerId': 1, status: 1 });
    await collections.grievances?.createIndex({ category: 1, relatedScheme: 1 });

    // Schemes indexes
    await collections.schemes?.createIndex({ schemeCode: 1 }, { unique: true });
    await collections.schemes?.createIndex({ isActive: 1, isPrimaryFocus: -1 });

    // Notifications indexes
    await collections.notifications?.createIndex({ userId: 1, createdAt: -1 });
    await collections.notifications?.createIndex({ userId: 1, 'channels.app.read': 1 });

    // ML Priority Scores indexes
    await collections.mlPriorityScores?.createIndex({ userId: 1, calculatedAt: -1 });
    await collections.mlPriorityScores?.createIndex({ priorityScore: -1 });

    // Fraud Detection indexes
    await collections.fraudDetections?.createIndex({ userId: 1, detectedAt: -1 });
    await collections.fraudDetections?.createIndex({ fraudProbability: -1 });

    console.log('Indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

// Close MongoDB connection
export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

// Get database instance
export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}

// Helper function to convert string to ObjectId
export function toObjectId(id: string): ObjectId {
  return new ObjectId(id);
}

// Database operations for Users
export const userOperations = {
  async findByAadhaar(aadhaarNumber: string) {
    return collections.users?.findOne({ aadhaarNumber });
  },

  async findById(userId: string) {
    return collections.users?.findOne({ _id: toObjectId(userId) });
  },

  async create(userData: any) {
    const result = await collections.users?.insertOne({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result?.insertedId;
  },

  async update(userId: string, updateData: any) {
    return collections.users?.updateOne(
      { _id: toObjectId(userId) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );
  },

  async updateByAadhaar(aadhaarNumber: string, updateData: any) {
    return collections.users?.updateOne(
      { aadhaarNumber },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );
  },

  async findNearbyWork(lat: number, lng: number, radiusKm: number = 10) {
    return collections.mgnregaWorkOpportunities?.find({
      'location.geoLocation': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radiusKm * 1000
        }
      },
      status: { $in: ['upcoming', 'ongoing'] },
      'allocation.slotsRemaining': { $gt: 0 }
    }).toArray();
  }
};

// Database operations for Work Opportunities
export const workOperations = {
  async findAll(filters: any = {}) {
    return collections.mgnregaWorkOpportunities?.find(filters).toArray();
  },

  async findById(workId: string) {
    return collections.mgnregaWorkOpportunities?.findOne({ _id: toObjectId(workId) });
  },

  async findNearby(lat: number, lng: number, radiusKm: number = 10) {
    return collections.mgnregaWorkOpportunities?.find({
      'location.geoLocation': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radiusKm * 1000
        }
      },
      status: { $in: ['upcoming', 'ongoing'] },
      'allocation.slotsRemaining': { $gt: 0 }
    }).toArray();
  },

  async allocateWorker(workId: string, userId: string, userName: string) {
    return collections.mgnregaWorkOpportunities?.updateOne(
      { _id: toObjectId(workId) },
      {
        $push: {
          'allocation.allocatedWorkers': {
            userId: toObjectId(userId),
            name: userName,
            allocatedDate: new Date(),
            status: 'confirmed'
          } as any
        },
        $inc: { 'allocation.slotsRemaining': -1 }
      }
    );
  }
};

// Database operations for Grievances
export const grievanceOperations = {
  async create(grievanceData: any) {
    const grievanceNumber = `GRV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    const result = await collections.grievances?.insertOne({
      ...grievanceData,
      grievanceNumber,
      filedAt: new Date(),
      status: 'open',
      slaDetails: {
        slaDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        daysRemaining: 5,
        isAtRisk: false,
        isBreached: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { insertedId: result?.insertedId, grievanceNumber };
  },

  async findByUser(userId: string) {
    return collections.grievances?.find({ userId: toObjectId(userId) }).sort({ filedAt: -1 }).toArray();
  },

  async findById(grievanceId: string) {
    return collections.grievances?.findOne({ _id: toObjectId(grievanceId) });
  },

  async updateStatus(grievanceId: string, status: string, resolution?: any) {
    const updateData: any = {
      status,
      updatedAt: new Date()
    };
    if (resolution) {
      updateData.resolution = resolution;
    }
    return collections.grievances?.updateOne(
      { _id: toObjectId(grievanceId) },
      { $set: updateData }
    );
  }
};

// Database operations for Payments
export const paymentOperations = {
  async findByUser(userId: string) {
    return collections.payments?.find({ userId: toObjectId(userId) }).sort({ createdAt: -1 }).toArray();
  },

  async findPending(userId: string) {
    return collections.payments?.find({ 
      userId: toObjectId(userId),
      status: { $in: ['initiated', 'processing'] }
    }).toArray();
  },

  async getTotalEarned(userId: string, year: number) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);
    
    const result = await collections.payments?.aggregate([
      {
        $match: {
          userId: toObjectId(userId),
          status: 'completed',
          completedDate: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$netAmount' }
        }
      }
    ]).toArray();
    
    return result?.[0]?.total || 0;
  }
};

// Database operations for Attendance
export const attendanceOperations = {
  async findByUser(userId: string, year?: number) {
    const matchStage: any = { userId: toObjectId(userId) };
    if (year) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31);
      matchStage.date = { $gte: startOfYear, $lte: endOfYear };
    }
    return collections.mgnregaAttendance?.find(matchStage).sort({ date: -1 }).toArray();
  },

  async getDaysWorked(userId: string, year: number) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);
    
    const result = await collections.mgnregaAttendance?.aggregate([
      {
        $match: {
          userId: toObjectId(userId),
          date: { $gte: startOfYear, $lte: endOfYear },
          presentStatus: { $in: ['present', 'half_day'] }
        }
      },
      {
        $group: {
          _id: null,
          totalDays: {
            $sum: {
              $cond: [
                { $eq: ['$presentStatus', 'half_day'] },
                0.5,
                1
              ]
            }
          }
        }
      }
    ]).toArray();
    
    return result?.[0]?.totalDays || 0;
  }
};

// Database operations for Conversations
export const conversationOperations = {
  async create(sessionId: string, userId: string, channel: string, language: string) {
    const result = await collections.conversations?.insertOne({
      sessionId,
      userId: toObjectId(userId),
      startedAt: new Date(),
      channel,
      language,
      messages: [],
      summary: {
        mainTopics: [],
        userRequests: [],
        actionsCompleted: [],
        pendingActions: [],
        dataFieldsUpdated: [],
        issuesIdentified: []
      }
    });
    return result?.insertedId;
  },

  async addMessage(sessionId: string, message: any) {
    return collections.conversations?.updateOne(
      { sessionId },
      {
        $push: { messages: message },
        $set: { updatedAt: new Date() }
      }
    );
  },

  async updateSummary(sessionId: string, summary: any) {
    return collections.conversations?.updateOne(
      { sessionId },
      {
        $set: {
          summary,
          endedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
  },

  async findByUser(userId: string, limit: number = 10) {
    return collections.conversations?.find({ userId: toObjectId(userId) })
      .sort({ startedAt: -1 })
      .limit(limit)
      .toArray();
  }
};

// Database operations for ML Models
export const mlOperations = {
  async savePriorityScore(scoreData: any) {
    return collections.mlPriorityScores?.insertOne({
      ...scoreData,
      calculatedAt: new Date()
    });
  },

  async saveFraudDetection(fraudData: any) {
    return collections.fraudDetections?.insertOne({
      ...fraudData,
      detectedAt: new Date()
    });
  },

  async saveFairnessAudit(auditData: any) {
    return collections.fairnessAudits?.insertOne({
      ...auditData,
      auditDate: new Date()
    });
  },

  async getPriorityScores(workId: string) {
    return collections.mlPriorityScores?.find({ workId })
      .sort({ priorityScore: -1 })
      .toArray();
  }
};

// Audit logging
export const auditOperations = {
  async log(action: string, userId: string, details: any) {
    return collections.auditLogs?.insertOne({
      action,
      userId: toObjectId(userId),
      details,
      timestamp: new Date(),
      ipAddress: details.ipAddress || null
    });
  }
};

export default {
  connectToDatabase,
  closeDatabaseConnection,
  getDatabase,
  collections,
  userOperations,
  workOperations,
  grievanceOperations,
  paymentOperations,
  attendanceOperations,
  conversationOperations,
  mlOperations,
  auditOperations,
  toObjectId
};
