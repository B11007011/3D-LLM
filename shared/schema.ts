import { pgTable, text, serial, integer, timestamp, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { sqliteTable, text as sqliteText, integer as sqliteInteger, blob } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";
import type { SQL } from "drizzle-orm";
import type { 
  PgTableWithColumns, 
  PgColumn,
  AnyPgColumn 
} from "drizzle-orm/pg-core";
import type { 
  SQLiteTableWithColumns, 
  SQLiteColumn,
  AnySQLiteColumn 
} from "drizzle-orm/sqlite-core";

// Define types for tables to avoid 'any' type errors
type TableType = SQLiteTableWithColumns<any> | PgTableWithColumns<any>;

// Schema definition for both SQLite and PostgreSQL
const isDev = process.env.NODE_ENV === 'development';
console.log("Schema NODE_ENV:", process.env.NODE_ENV, "isDev:", isDev);

// Task and file type enums
const taskStatusValues = ['backlog', 'todo', 'in_progress', 'review', 'done'] as const;
const fileTypeValues = ['model', 'texture', 'material', 'animation', 'document', 'other'] as const;

// PostgreSQL enums
const pgTaskStatusEnum = pgEnum('task_status', taskStatusValues);
const pgFileTypeEnum = pgEnum('file_type', fileTypeValues);

// Define schemas based on database type
let users: TableType;
let projects: TableType;
let projectMembers: TableType;
let milestones: TableType;
let tasks: TableType;
let folders: TableType;
let files: TableType;
let fileVersions: TableType;
let fileActivities: TableType;
let comments: TableType;

if (isDev) {
  // SQLite schema
  // Users
  users = sqliteTable("users", {
    id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
    username: sqliteText("username").notNull().unique(),
    password: sqliteText("password").notNull(),
    fullName: sqliteText("full_name").notNull(),
    email: sqliteText("email").notNull(),
    avatar: sqliteText("avatar"),
    role: sqliteText("role").default("member"),
  });
  
  // Projects
  projects = sqliteTable("projects", {
    id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
    name: sqliteText("name").notNull(),
    description: sqliteText("description"),
    startDate: blob("start_date").notNull(),
    endDate: blob("end_date"),
    status: sqliteText("status").default("active"),
    createdAt: blob("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: blob("updated_at").default(sql`CURRENT_TIMESTAMP`),
  });
  
  // Project Members
  projectMembers = sqliteTable("project_members", {
    id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
    projectId: sqliteInteger("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    userId: sqliteInteger("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    role: sqliteText("role").default("member"),
    joinedAt: blob("joined_at").default(sql`CURRENT_TIMESTAMP`),
  });
  
  // Milestones
  milestones = sqliteTable("milestones", {
    id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
    projectId: sqliteInteger("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    name: sqliteText("name").notNull(),
    description: sqliteText("description"),
    dueDate: blob("due_date"),
    completed: sqliteInteger("completed", { mode: 'boolean' }).default(false),
    createdAt: blob("created_at").default(sql`CURRENT_TIMESTAMP`),
  });
  
  // Tasks
  tasks = sqliteTable("tasks", {
    id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
    projectId: sqliteInteger("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    milestoneId: sqliteInteger("milestone_id").references(() => milestones.id, { onDelete: 'set null' }),
    assigneeId: sqliteInteger("assignee_id").references(() => users.id, { onDelete: 'set null' }),
    title: sqliteText("title").notNull(),
    description: sqliteText("description"),
    status: sqliteText("status").default('todo'),
    priority: sqliteText("priority").default("medium"),
    dueDate: blob("due_date"),
    estimatedHours: sqliteInteger("estimated_hours"),
    createdAt: blob("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: blob("updated_at").default(sql`CURRENT_TIMESTAMP`),
  });
  
  // Folders
  folders = sqliteTable("folders", {
    id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
    projectId: sqliteInteger("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    name: sqliteText("name").notNull(),
    parentId: sqliteInteger("parent_id").references(() => folders.id, { onDelete: 'cascade' }),
    path: sqliteText("path").notNull(),
    createdAt: blob("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: blob("updated_at").default(sql`CURRENT_TIMESTAMP`),
  });
  
  // Files
  files = sqliteTable("files", {
    id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
    projectId: sqliteInteger("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    folderId: sqliteInteger("folder_id").references(() => folders.id, { onDelete: 'set null' }),
    name: sqliteText("name").notNull(),
    type: sqliteText("type").notNull(),
    fileExtension: sqliteText("file_extension").notNull(),
    path: sqliteText("path").notNull(),
    size: sqliteInteger("size").notNull(), // in bytes
    metadata: sqliteText("metadata"),
    currentVersionId: sqliteInteger("current_version_id"),
    createdAt: blob("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: blob("updated_at").default(sql`CURRENT_TIMESTAMP`),
  });
  
  // File Versions
  fileVersions = sqliteTable("file_versions", {
    id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
    fileId: sqliteInteger("file_id").notNull().references(() => files.id, { onDelete: 'cascade' }),
    versionNumber: sqliteInteger("version_number").notNull(),
    createdById: sqliteInteger("created_by_id").references(() => users.id),
    path: sqliteText("path").notNull(),
    size: sqliteInteger("size").notNull(),
    metadata: sqliteText("metadata"),
    changeDescription: sqliteText("change_description"),
    createdAt: blob("created_at").default(sql`CURRENT_TIMESTAMP`),
  });
  
  // File Activities
  fileActivities = sqliteTable("file_activities", {
    id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
    fileId: sqliteInteger("file_id").notNull().references(() => files.id, { onDelete: 'cascade' }),
    userId: sqliteInteger("user_id").references(() => users.id),
    action: sqliteText("action").notNull(), // e.g., 'created', 'updated', 'deleted', 'renamed'
    details: sqliteText("details"),
    createdAt: blob("created_at").default(sql`CURRENT_TIMESTAMP`),
  });
  
  // Comments
  comments = sqliteTable("comments", {
    id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
    taskId: sqliteInteger("task_id").references(() => tasks.id, { onDelete: 'cascade' }),
    fileId: sqliteInteger("file_id").references(() => files.id, { onDelete: 'cascade' }),
    userId: sqliteInteger("user_id").notNull().references(() => users.id),
    content: sqliteText("content").notNull(),
    createdAt: blob("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: blob("updated_at").default(sql`CURRENT_TIMESTAMP`),
  });
} else {
  // PostgreSQL schema
  // Users
  users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    avatar: text("avatar"),
    role: text("role").default("member"),
  });
  
  // Projects
  projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    status: text("status").default("active"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });
  
  // Project Members
  projectMembers = pgTable("project_members", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    role: text("role").default("member"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  });
  
  // Milestones
  milestones = pgTable("milestones", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    name: text("name").notNull(),
    description: text("description"),
    dueDate: timestamp("due_date"),
    completed: boolean("completed").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
  
  // Tasks
  tasks = pgTable("tasks", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    milestoneId: integer("milestone_id").references(() => milestones.id, { onDelete: 'set null' }),
    assigneeId: integer("assignee_id").references(() => users.id, { onDelete: 'set null' }),
    title: text("title").notNull(),
    description: text("description"),
    status: pgTaskStatusEnum("status").default('todo'),
    priority: text("priority").default("medium"),
    dueDate: timestamp("due_date"),
    estimatedHours: integer("estimated_hours"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });
  
  // Folders
  folders = pgTable("folders", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    name: text("name").notNull(),
    parentId: integer("parent_id").references(() => folders.id, { onDelete: 'cascade' }),
    path: text("path").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });
  
  // Files
  files = pgTable("files", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    folderId: integer("folder_id").references(() => folders.id, { onDelete: 'set null' }),
    name: text("name").notNull(),
    type: pgFileTypeEnum("type").notNull(),
    fileExtension: text("file_extension").notNull(),
    path: text("path").notNull(),
    size: integer("size").notNull(), // in bytes
    metadata: jsonb("metadata"),
    currentVersionId: integer("current_version_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });
  
  // File Versions
  fileVersions = pgTable("file_versions", {
    id: serial("id").primaryKey(),
    fileId: integer("file_id").notNull().references(() => files.id, { onDelete: 'cascade' }),
    versionNumber: integer("version_number").notNull(),
    createdById: integer("created_by_id").references(() => users.id),
    path: text("path").notNull(),
    size: integer("size").notNull(),
    metadata: jsonb("metadata"),
    changeDescription: text("change_description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
  
  // File Activities
  fileActivities = pgTable("file_activities", {
    id: serial("id").primaryKey(),
    fileId: integer("file_id").notNull().references(() => files.id, { onDelete: 'cascade' }),
    userId: integer("user_id").references(() => users.id),
    action: text("action").notNull(), // e.g., 'created', 'updated', 'deleted', 'renamed'
    details: jsonb("details"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
  
  // Comments
  comments = pgTable("comments", {
    id: serial("id").primaryKey(),
    taskId: integer("task_id").references(() => tasks.id, { onDelete: 'cascade' }),
    fileId: integer("file_id").references(() => files.id, { onDelete: 'cascade' }),
    userId: integer("user_id").notNull().references(() => users.id),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });
}

// Export the tables
export {
  users,
  projects,
  projectMembers,
  milestones,
  tasks,
  folders,
  files,
  fileVersions,
  fileActivities,
  comments,
  pgTaskStatusEnum,
  pgFileTypeEnum
};

// Relations are the same for both database types
export const usersRelations = relations(users, ({ many }) => ({
  projectMembers: many(projectMembers),
  tasks: many(tasks),
  comments: many(comments),
  fileActivities: many(fileActivities),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  members: many(projectMembers),
  milestones: many(milestones),
  files: many(files),
  tasks: many(tasks),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));

export const milestonesRelations = relations(milestones, ({ one, many }) => ({
  project: one(projects, {
    fields: [milestones.projectId],
    references: [projects.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  milestone: one(milestones, {
    fields: [tasks.milestoneId],
    references: [milestones.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  project: one(projects, {
    fields: [folders.projectId],
    references: [projects.id],
  }),
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
  }),
  subfolders: many(folders, { relationName: 'subfolders' }),
  files: many(files),
}));

export const filesRelations = relations(files, ({ one, many }) => ({
  project: one(projects, {
    fields: [files.projectId],
    references: [projects.id],
  }),
  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),
  versions: many(fileVersions),
  activities: many(fileActivities),
}));

export const fileVersionsRelations = relations(fileVersions, ({ one }) => ({
  file: one(files, {
    fields: [fileVersions.fileId],
    references: [files.id],
  }),
  createdBy: one(users, {
    fields: [fileVersions.createdById],
    references: [users.id],
  }),
}));

export const fileActivitiesRelations = relations(fileActivities, ({ one }) => ({
  file: one(files, {
    fields: [fileActivities.fileId],
    references: [files.id],
  }),
  user: one(users, {
    fields: [fileActivities.userId],
    references: [users.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
  file: one(files, {
    fields: [comments.fileId],
    references: [files.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectMemberSchema = createInsertSchema(projectMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFolderSchema = createInsertSchema(folders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFileVersionSchema = createInsertSchema(fileVersions).omit({
  id: true,
  createdAt: true,
});

export const insertFileActivitySchema = createInsertSchema(fileActivities).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type ProjectMember = typeof projectMembers.$inferSelect;
export type InsertProjectMember = z.infer<typeof insertProjectMemberSchema>;

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Folder = typeof folders.$inferSelect;
export type InsertFolder = z.infer<typeof insertFolderSchema>;

export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;

export type FileVersion = typeof fileVersions.$inferSelect;
export type InsertFileVersion = z.infer<typeof insertFileVersionSchema>;

export type FileActivity = typeof fileActivities.$inferSelect;
export type InsertFileActivity = z.infer<typeof insertFileActivitySchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
