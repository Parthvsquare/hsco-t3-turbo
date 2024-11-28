import { relations, sql } from "drizzle-orm";
import { pgEnum, pgTable, primaryKey } from "drizzle-orm/pg-core";

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
export const SubscribePlanEnum = pgEnum("subscribe_plan_enum", [
  "basic",
  "piece",
  "grading",
  "alert",
]);

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
  id: t.varchar({ length: 255 }).notNull().primaryKey(),
  stateDistrict: t.varchar({ length: 255 }),
  districtCode: t.varchar({ length: 255 }),
  userCount: t.integer().default(0),
  users: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
}));

export const SubscribePlan = pgTable("subscribePlan", (t) => ({
  id: t.varchar({ length: 255 }).notNull().primaryKey(),
  enabledPlan: SubscribePlanEnum().default("basic"),

  User: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
}));

export const Address = pgTable("address", (t) => ({
  addressId: t.varchar({ length: 255 }).notNull().primaryKey(),
  latitude: t.real().notNull(),
  longitude: t.real().notNull(),
  stateDistrict: t.varchar({ length: 255 }),
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
  weight: t.numeric({ precision: 8, scale: 4 }).notNull(),
  weightId: t.varchar({ length: 255 }).notNull().primaryKey(),
  createdAt: t.timestamp().defaultNow().notNull(),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  ReportDatabaseReportId: t.varchar({ length: 255 }),
}));

export const LiterDatabase = pgTable("literDatabase", (t) => ({
  liter: t.numeric({ precision: 8, scale: 4 }).notNull(),
  literId: t.varchar({ length: 255 }).notNull().primaryKey(),
  createdAt: t.timestamp().defaultNow().notNull(),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  ReportDatabaseReportId: t.varchar({ length: 255 }),
}));

export const PieceCountingTemplate = pgTable("pieceCountingTemplate", (t) => ({
  pieceId: t.varchar({ length: 255 }).notNull().primaryKey(),
  itemName: t.varchar({ length: 255 }).notNull(),
  description: t.text(),
  singlePieceWeight: t.numeric({ precision: 8, scale: 4 }).notNull(),
  makePublic: t.boolean().default(false),
  isDeleted: t.boolean().default(false),
  deletedAt: t.timestamp(),
  createdBy: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  userId: t.varchar({ length: 255 }),
}));

export const PieceCountingDatabase = pgTable("pieceCountingDatabase", (t) => ({
  pieceId: t.varchar({ length: 255 }).notNull().primaryKey(),
  itemName: t.varchar({ length: 255 }).notNull(),
  singlePieceWeight: t.numeric({ precision: 8, scale: 4 }).notNull(),
  itemsCounted: t.numeric({ precision: 8, scale: 4 }).notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  ReportDatabaseReportId: t.varchar({ length: 255 }),
}));

export const GradeSystemTemplate = pgTable("gradeSystemTemplate", (t) => ({
  gradeId: t.varchar({ length: 255 }).notNull().primaryKey(),
  itemName: t.varchar({ length: 255 }),
  gradeName: t.varchar({ length: 255 }),
  gradeUpperLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  gradeLowerLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  makePublic: t.boolean().default(false),
  createdBy: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  userId: t.varchar({ length: 255 }),
}));

export const GradeDatabase = pgTable("gradeDatabase", (t) => ({
  itemName: t.varchar({ length: 255 }),
  gradeId: t.varchar({ length: 255 }).notNull().primaryKey(),
  gradeName: t.varchar({ length: 255 }),
  gradeUpperLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  gradeLowerLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  gradedItemWeight: t.numeric({ precision: 8, scale: 4 }).notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  ReportDatabaseReportId: t.varchar({ length: 255 }),
}));

export const AlertSystemTemplate = pgTable("alertSystemTemplate", (t) => ({
  alertId: t.varchar({ length: 255 }).notNull().primaryKey(),
  itemName: t.varchar({ length: 255 }),
  description: t.text(),
  alertUpperLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  alertLowerLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  makePublic: t.boolean().default(false),
  priority: t.integer().default(1),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp().defaultNow().notNull(),
  createdBy: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  userId: t.varchar({ length: 255 }),
}));

export const AlertDatabase = pgTable("alertDatabase", (t) => ({
  alertId: t.varchar({ length: 255 }).notNull().primaryKey(),
  itemName: t.varchar({ length: 255 }),
  alertUpperLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  alertLowerLimit: t.numeric({ precision: 8, scale: 4 }).notNull(),
  savedAt: t.numeric({ precision: 8, scale: 4 }).notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  user: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  ReportDatabaseReportId: t.varchar({ length: 255 }),
}));