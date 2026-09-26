import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email'),
  name: text('name').notNull(),
  location: text('location'),
  latitude: text('latitude'),
  longitude: text('longitude'),
  language: text('language'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const plants = pgTable('plants', {
  id: serial('id').primaryKey(),
  customId: text('custom_id').notNull().unique(),
  userUid: text('user_uid')
    .references(() => users.uid)
    .notNull(),
  customName: text('custom_name').notNull(),
  cropType: text('crop_type').notNull(),
  plantName: text('plant_name'),
  icon: text('icon'),
  currentDisease: text('current_disease'),
  currentSeverity: text('current_severity'),
  currentHealthScore: integer('current_health_score').default(100),
  healthStatusLabel: text('health_status_label'),
  environmentTag: text('environment_tag'),
  lastScannedDate: text('last_scanned_date'),
  scansJson: text('scans_json'),
  dailyActionPlanJson: text('daily_action_plan_json'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const diseaseReports = pgTable('disease_reports', {
  id: serial('id').primaryKey(),
  reportId: text('report_id').notNull().unique(),
  diseaseName: text('disease_name').notNull(),
  crop: text('crop').notNull(),
  reportsCount: integer('reports_count').default(1),
  severity: text('severity').notNull(),
  latitude: text('latitude').notNull(),
  longitude: text('longitude').notNull(),
  locationName: text('location_name').notNull(),
  samplePhotoUrl: text('sample_photo_url'),
  spreadAlertJson: text('spread_alert_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const communityPosts = pgTable('community_posts', {
  id: serial('id').primaryKey(),
  postId: text('post_id').notNull().unique(),
  authorUid: text('author_uid').notNull(),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role'),
  location: text('location'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  crop: text('crop').notNull(),
  diseaseTag: text('disease_tag'),
  imageUrl: text('image_url'),
  likes: integer('likes').default(0),
  repliesJson: text('replies_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const expertConsultations = pgTable('expert_consultations', {
  id: serial('id').primaryKey(),
  consultationId: text('consultation_id').notNull().unique(),
  userUid: text('user_uid').notNull(),
  plantName: text('plant_name').notNull(),
  cropType: text('crop_type').notNull(),
  detectedDisease: text('detected_disease'),
  symptoms: text('symptoms'),
  location: text('location'),
  question: text('question').notNull(),
  imageUrl: text('image_url'),
  status: text('status').default('Under Review'),
  expertResponseJson: text('expert_response_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  plants: many(plants),
}));

export const plantsRelations = relations(plants, ({ one }) => ({
  owner: one(users, {
    fields: [plants.userUid],
    references: [users.uid],
  }),
}));
