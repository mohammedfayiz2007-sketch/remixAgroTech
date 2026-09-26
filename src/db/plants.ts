import { db } from './index.ts';
import { plants, diseaseReports, communityPosts } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getPlantsByUserUid(userUid: string) {
  try {
    return await db.select().from(plants).where(eq(plants.userUid, userUid));
  } catch (error) {
    console.error('Database query failed in getPlantsByUserUid:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function upsertPlantInDb(data: {
  customId: string;
  userUid: string;
  customName: string;
  cropType: string;
  plantName?: string;
  icon?: string;
  currentDisease?: string;
  currentSeverity?: string;
  currentHealthScore?: number;
  healthStatusLabel?: string;
  environmentTag?: string;
  lastScannedDate?: string;
  scansJson?: string;
  dailyActionPlanJson?: string;
}) {
  try {
    const result = await db
      .insert(plants)
      .values(data)
      .onConflictDoUpdate({
        target: plants.customId,
        set: {
          customName: data.customName,
          cropType: data.cropType,
          plantName: data.plantName,
          icon: data.icon,
          currentDisease: data.currentDisease,
          currentSeverity: data.currentSeverity,
          currentHealthScore: data.currentHealthScore,
          healthStatusLabel: data.healthStatusLabel,
          environmentTag: data.environmentTag,
          lastScannedDate: data.lastScannedDate,
          scansJson: data.scansJson,
          dailyActionPlanJson: data.dailyActionPlanJson,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in upsertPlantInDb:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getAllDiseaseReports() {
  try {
    return await db.select().from(diseaseReports);
  } catch (error) {
    console.error('Database query failed in getAllDiseaseReports:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getAllCommunityPosts() {
  try {
    return await db.select().from(communityPosts).orderBy(desc(communityPosts.createdAt));
  } catch (error) {
    console.error('Database query failed in getAllCommunityPosts:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
