import { relations, sql } from "drizzle-orm";
import { pgEnum, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// export const Post = pgTable("post", (t) => ({
//   id: t.uuid().notNull().primaryKey().defaultRandom(),
//   title: t.varchar({ length: 256 }).notNull(),
//   content: t.text().notNull(),
//   createdAt: t.timestamp().defaultNow().notNull(),
//   updatedAt: t
//     .timestamp({ mode: "date", withTimezone: true })
//     .$onUpdateFn(() => sql`now()`),
// }));

// export const CreatePostSchema = createInsertSchema(Post, {
//   title: z.string().max(256),
//   content: z.string().max(256),
// }).omit({
//   id: true,
//   createdAt: true,
//   updatedAt: true,
// });
export const Role = pgEnum("role", ["basic", "admin", "editor"]);

export const RoleConst = {
  basic: "basic",
  admin: "admin",
  editor: "editor",
} as const;

export type RoleEnum = (typeof RoleConst)[keyof typeof RoleConst];

export const SubscribePlanEnum = pgEnum("subscribe_plan_enum", [
  "basic",
  "piece",
  "grading",
  "alert",
  "all",
]);

export const SubscribePlanEnumConst = {
  basic: "basic",
  piece: "piece",
  grading: "grading",
  alert: "alert",
  all: "all",
} as const;

export type SubscribePlanEnum =
  (typeof SubscribePlanEnumConst)[keyof typeof SubscribePlanEnumConst];

export const User = pgTable("user", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }),
  email: t.varchar({ length: 255 }).notNull(),
  customerName: t.varchar({ length: 255 }),
  shopName: t.varchar({ length: 255 }),
  gstNumber: t.varchar({ length: 255 }),
  customerPhNumber: t.varchar({ length: 255 }),
  image: t.varchar({ length: 255 }),

  role: Role().default("basic"),
  address: t.varchar({ length: 255 }),
  usersInDistrict: t.varchar({ length: 255 }),
  subscribedPlans: SubscribePlanEnum().default("basic"),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),

  emailVerified: t.timestamp({ mode: "date", withTimezone: true }),
  // image: t.varchar({ length: 255 }),
}));

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
}));

export const Account = pgTable(
  "account",
  (t) => ({
    userId: t
      .uuid()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    type: t
      .varchar({ length: 255 })
      .$type<"email" | "oauth" | "oidc" | "webauthn">()
      .notNull(),
    provider: t.varchar({ length: 255 }).notNull(),
    providerAccountId: t.varchar({ length: 255 }).notNull(),
    refresh_token: t.varchar({ length: 255 }),
    access_token: t.text(),
    expires_at: t.integer(),
    token_type: t.varchar({ length: 255 }),
    scope: t.varchar({ length: 255 }),
    id_token: t.text(),
    session_state: t.varchar({ length: 255 }),
  }),
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, { fields: [Account.userId], references: [User.id] }),
}));

export const Session = pgTable("session", (t) => ({
  sessionToken: t.varchar({ length: 255 }).notNull().primaryKey(),
  userId: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: t.timestamp({ mode: "date", withTimezone: true }).notNull(),
}));

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));

export const usersInDistrict = pgTable("usersInDistrict", (t) => ({
  id: t.serial().notNull().primaryKey(),
  stateDistrict: t.varchar({ length: 255 }),
  districtCode: t.varchar({ length: 255 }),
  userCount: t.integer().default(0),
  users: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
}));

export const SubscribePlan = pgTable("subscribePlan", (t) => ({
  id: t.serial().notNull().primaryKey(),
  enabledPlan: SubscribePlanEnum().default("basic"),

  User: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
}));

export const Address = pgTable("address", (t) => ({
  addressId: t.serial().notNull().primaryKey(),
  latitude: t.real().notNull(),
  longitude: t.real().notNull(),
  stateDistrict: t.varchar({ length: 255 }),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
}));

export const ReportDatabase = pgTable("reportDatabase", (t) => ({
  reportId: t.uuid().notNull().primaryKey().defaultRandom(),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  generatedFor: t.timestamp().defaultNow().notNull(),
}));

export const ReportDatabaseAverages = pgTable(
  "reportDatabaseAverages",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    report: t
      .uuid()
      .notNull()
      .references(() => ReportDatabase.reportId, {
        onDelete: "cascade",
      }),
    user: t
      .uuid()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    createdAt: t.timestamp().defaultNow().notNull(),
    reportId: t.varchar({ length: 255 }).notNull(),
    savedWeightAverage: t.numeric({ precision: 8, scale: 4 }).default("0.0"),
    savedLiterAverage: t.numeric({ precision: 8, scale: 4 }).default("0.0"),
    totalRecords: t.integer().default(0),
    // reportDatabase_comp_key: index("userId, reportId")
  }),
);

export const WeightDatabase = pgTable("weightDatabase", (t) => ({
  weightId: t.serial().notNull().primaryKey(),
  weight: t.numeric({ precision: 8, scale: 4 }).notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  // ReportDatabaseReportId: t.varchar({ length: 255 }),
}));

export const createWeight = createInsertSchema(WeightDatabase, {
  weight: z.number().multipleOf(0.0001),
}).omit({ user: true, createdAt: true, updatedAt: true });

// export const updateWeight =

export const LiterDatabase = pgTable("literDatabase", (t) => ({
  literId: t.serial().notNull().primaryKey(),
  liter: t.numeric({ precision: 8, scale: 4 }).notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  // ReportDatabaseReportId: t.varchar({ length: 255 }),
}));

export const createLiter = createInsertSchema(LiterDatabase, {
  liter: z.number().multipleOf(0.0001),
}).omit({ user: true, createdAt: true, updatedAt: true });

export const PieceCountingTemplate = pgTable("pieceCountingTemplate", (t) => ({
  pieceId: t.serial().notNull().primaryKey(),
  itemName: t.varchar({ length: 255 }).notNull(),
  description: t.text(),
  singlePieceWeight: t.numeric({ precision: 8, scale: 4 }).notNull(),
  makePublic: t.boolean().default(false),
  isDeleted: t.boolean().default(false),
  deletedAt: t.timestamp(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  createdBy: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
}));

export const createPieceTemplateCounter = createInsertSchema(
  PieceCountingTemplate,
  {
    itemName: z.string().max(255),
    singlePieceWeight: z.number().multipleOf(0.0001),
    deletedAt: z.date().optional(),
    makePublic: z.boolean().default(false),
    createdBy: z.string().optional(),
    description: z.string().optional(),
    isDeleted: z.boolean().default(false),
  },
).omit({ createdAt: true, updatedAt: true, user: true });

export const PieceCountingDatabase = pgTable("pieceCountingDatabase", (t) => ({
  pieceId: t.serial().notNull().primaryKey(),
  itemName: t.varchar({ length: 255 }).notNull(),
  singlePieceWeight: t.numeric({ precision: 8, scale: 4 }).notNull(),
  itemsCounted: t.integer(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  // ReportDatabaseReportId: t.varchar({ length: 255 }),
}));

export const createPieceCounter = createInsertSchema(PieceCountingDatabase, {
  itemName: z.string().max(255),
  singlePieceWeight: z.number().multipleOf(0.0001),
  itemsCounted: z.number(),
}).omit({ createdAt: true, updatedAt: true, user: true });

export const GradeSystemTemplate = pgTable("gradeSystemTemplate", (t) => ({
  gradeTemaplateId: t.serial().notNull().primaryKey(),
  itemName: t.varchar({ length: 255 }),
  gradeName: t.varchar({ length: 255 }),
  gradeUpperLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  gradeLowerLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  makePublic: t.boolean().default(false),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  createdBy: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
}));

export const createGradeTemplate = createInsertSchema(GradeSystemTemplate, {
  itemName: z.string().max(255),
  gradeName: z.string().max(255),
  gradeLowerLimit: z.number().multipleOf(0.0001),
  gradeUpperLimit: z.number().multipleOf(0.0001),
  createdBy: z.string(),
  makePublic: z.boolean().optional().default(false),
}).omit({ user: true, createdAt: true, updatedAt: true });

export const GradeDatabase = pgTable("gradeDatabase", (t) => ({
  itemName: t.varchar({ length: 255 }),
  gradeId: t.serial().notNull().primaryKey(),
  gradeName: t.varchar({ length: 255 }),
  gradeUpperLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  gradeLowerLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  gradedItemWeight: t.numeric({ precision: 8, scale: 4 }).notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  // ReportDatabaseReportId: t.varchar({ length: 255 }),
}));

export const createGradeDatabase = createInsertSchema(GradeDatabase, {
  itemName: z.string(),
  gradeName: z.string(),
  gradeLowerLimit: z.number().multipleOf(0.0001),
  gradeUpperLimit: z.number().multipleOf(0.0001),
  gradedItemWeight: z.number().multipleOf(0.0001),
}).omit({ user: true, createdAt: true, updatedAt: true });

export const AlertSystemTemplate = pgTable("alertSystemTemplate", (t) => ({
  alertTemplateId: t.serial().notNull().primaryKey(),
  itemName: t.varchar({ length: 255 }),
  description: t.text(),
  alertUpperLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  alertLowerLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  makePublic: t.boolean().default(false),
  priority: t.integer().default(1),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  createdBy: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
}));

export const createAlertTemplate = createInsertSchema(AlertSystemTemplate, {
  itemName: z.string(),
  alertLowerLimit: z.number(),
  alertUpperLimit: z.number(),
  makePublic: z.boolean().optional(),
  createdBy: z.string(),
}).omit({ user: true, createdAt: true, updatedAt: true });

export const AlertDatabase = pgTable("alertDatabase", (t) => ({
  alertId: t.serial().notNull().primaryKey(),
  itemName: t.varchar({ length: 255 }),
  alertUpperLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  alertLowerLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  // ReportDatabaseReportId: t.varchar({ length: 255 }),
}));

export const createAlert = createInsertSchema(AlertDatabase, {
  itemName: z.string(),
  alertUpperLimit: z.number(),
  alertLowerLimit: z.number(),
}).omit({ user: true, createdAt: true, updatedAt: true });
