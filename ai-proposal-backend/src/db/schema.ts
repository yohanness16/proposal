
import * as p from "drizzle-orm/pg-core";
import { user as authUser, user } from "../../auth-schema";
import { relations } from "drizzle-orm";

export const account_status_enum=p.pgEnum("account_status" , ["active" , "payment_issued" , "banned"]);
export const source_type_enum=p.pgEnum("source_type" , ["website_link" , "Text" , "pdf"]);
export const content_status_enum=p.pgEnum("content_status" , ["generating" , "generated" , "failed"]);
export const document_type_enum=p.pgEnum("document_type" , ["PDF" , "DOCX" , "XML" , "HTML"]);


export const usersTable = p.pgTable("users", {
  id: p.text("id").primaryKey().notNull(),
  full_name: p.varchar({ length: 255 }).notNull(),
  email: p.varchar({ length: 255 }).notNull().unique(),
  account_status:account_status_enum("account_status").default("active").notNull(),
  created_at:p.timestamp("created_at").defaultNow().notNull(),
  last_login:p.timestamp("last_login"),
  betterAuthUserId: p.text("better_auth_user_id")
    .notNull()
    .references(() => authUser.id, { onDelete: "cascade" }),


});

export const users_profile=p.pgTable("profile" , {
  id: p.uuid("id").primaryKey().defaultRandom().notNull(),
  user_id: p.text("user_id").notNull().references(()=>usersTable.id , { onDelete: "cascade" }),
  bio:p.text("bio"),
  profile_link:p.varchar("profile_link",{length:255}),
  github_link:p.varchar("github_link",{length:255}),
  language:p.text("langugae"),
  updated_at:p.timestamp("updated_at").defaultNow(),


});

export const skills = p.pgTable("skills", {
  id: p.uuid("id").primaryKey().defaultRandom().notNull(),
  profile_id: p.uuid("profile_id")
    .notNull()
    .references(() => users_profile.id, { onDelete: "cascade" }),
  name: p.varchar("name", { length: 100 }).notNull(), 
  level: p.varchar("level", { length: 50 }), 
  category: p.varchar("category", { length: 50 }), 
  created_at: p.timestamp("created_at").defaultNow().notNull(),
});


export const education = p.pgTable("education", {
  id: p.uuid("id").primaryKey().defaultRandom().notNull(),
  profile_id: p.uuid("profile_id").notNull().references(() => users_profile.id, { onDelete: "cascade" }),
  school: p.varchar("school", { length: 255 }).notNull(),
  degree: p.varchar("degree", { length: 255 }).notNull(),
  field_of_study: p.varchar("field_of_study", { length: 255 }),
  start_date: p.timestamp("start_date"),
  end_date: p.timestamp("end_date"),
  description: p.text("description"), 
});


export const experience = p.pgTable("experience", {
  id: p.uuid("id").primaryKey().defaultRandom().notNull(),
  profile_id: p.uuid("profile_id").notNull().references(() => users_profile.id, { onDelete: "cascade" }),
  company: p.varchar("company", { length: 255 }).notNull(),
  position: p.varchar("position", { length: 255 }).notNull(),
  location: p.varchar("location", { length: 255 }),
  start_date: p.timestamp("start_date").notNull(),
  end_date: p.timestamp("end_date"), 
  is_current: p.boolean("is_current").default(false),
  description: p.text("description").notNull(), 
});


export const certifications = p.pgTable("certifications", {
  id: p.uuid("id").primaryKey().defaultRandom().notNull(),
  profile_id: p.uuid("profile_id").notNull().references(() => users_profile.id, { onDelete: "cascade" }),
  name: p.varchar("name", { length: 255 }).notNull(),
  issuing_org: p.varchar("issuing_org", { length: 255 }).notNull(),
  issue_date: p.timestamp("issue_date"),
  expiry_date: p.timestamp("expiry_date"),
  credential_id: p.varchar("credential_id", { length: 255 }),
  credential_url: p.text("credential_url"),
});

export const jobs = p.pgTable("jobs" , {
  id: p.uuid("id").primaryKey().defaultRandom().notNull(),
  user_id: p.text("user_id").notNull().references(()=>usersTable.id , { onDelete: "cascade" }),
  source_type:source_type_enum("source_type").default("Text").notNull(),
  title:p.varchar("title" , {length:255}).notNull(),
  description:p.text("description").notNull(),
  company_name:p.varchar("company_name" , {length:255}),
  responsibility:p.text("responsibility").notNull(),
  deadline:p.timestamp("deadline").notNull(),
  source_link: p.varchar("source_link", { length: 500 }), // Change "link" to "source_link"
  requirment: p.json("requirment").default({}).notNull(), // Change "requirments" to "requirment"
  budget: p.varchar("budget", { length: 100 }),
  location:p.text("location").default("remote").notNull(),
  searched_at:p.timestamp("searched_at").defaultNow().notNull(),

})

export const generated_contents=p.pgTable("generated_content"  , {
  id: p.uuid("id").primaryKey().defaultRandom().notNull(),
  user_id: p.text("user_id").notNull().references(()=>usersTable.id , { onDelete: "cascade" }),
  user_profile:p.uuid("user_profile").notNull().references(()=>users_profile.id , { onDelete: "cascade" }),
  jobs_id:p.uuid("jobs_id").notNull().references(()=>jobs.id , {onDelete:"cascade" }),
  content_type:p.text("content_type").notNull(),
  content_status:content_status_enum("content_status").default("generating").notNull(),
  tone:p.text("tone").notNull(),
  length:p.integer("length").notNull(),
  renderd_text:p.text("renderd_text"),
  structured_output:p.text("structred_output").notNull(),
  model_used:p.text("model_used").notNull(),
  prompt:p.text("prompt").notNull(),
  created_at:p.timestamp("created_at").defaultNow().notNull(),


});

export const documents = p.pgTable("document" , {
  id:p.uuid("id").primaryKey().defaultRandom().notNull(),
  user_id: p.text("user_id").notNull().references(()=>usersTable.id , { onDelete: "cascade" }),
  content_id:p.uuid("content_id").notNull().references(()=>generated_contents.id , {onDelete : "cascade"}),
  document_type:document_type_enum("document_type").default("PDF").notNull(),
  file_size:p.varchar("file_size" , {length:10}).default("0b").notNull(),
  file_location:p.varchar("file_location" , {length:255}).notNull(),
  created_at:p.timestamp("created_at").defaultNow().notNull(),


});


export const usersRelations = relations(usersTable, ({ one, many }) => ({
  profile: one(users_profile, {
    fields: [usersTable.id],
    references: [users_profile.user_id],
  }),
  jobs: many(jobs),
  generatedContents: many(generated_contents),
  documents: many(documents),
}));


export const profileRelations = relations(users_profile, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [users_profile.user_id],
    references: [usersTable.id],
  }),
  skills: many(skills),
  education: many(education),
  experience: many(experience),
  certifications: many(certifications),
  generatedContents: many(generated_contents),
}));


export const skillsRelations = relations(skills, ({ one }) => ({
  profile: one(users_profile, {
    fields: [skills.profile_id],
    references: [users_profile.id],
  }),
}));


export const educationRelations = relations(education, ({ one }) => ({
  profile: one(users_profile, {
    fields: [education.profile_id],
    references: [users_profile.id],
  }),
}));


export const experienceRelations = relations(experience, ({ one }) => ({
  profile: one(users_profile, {
    fields: [experience.profile_id],
    references: [users_profile.id],
  }),
}));


export const certificationsRelations = relations(certifications, ({ one }) => ({
  profile: one(users_profile, {
    fields: [certifications.profile_id],
    references: [users_profile.id],
  }),
}));


export const jobsRelations = relations(jobs, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [jobs.user_id],
    references: [usersTable.id],
  }),
  generatedContents: many(generated_contents),
}));


export const generatedContentsRelations = relations(generated_contents, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [generated_contents.user_id],
    references: [usersTable.id],
  }),
  profile: one(users_profile, {
    fields: [generated_contents.user_profile],
    references: [users_profile.id],
  }),
  job: one(jobs, {
    fields: [generated_contents.jobs_id],
    references: [jobs.id],
  }),
  documents: many(documents),
}));


export const documentRelations = relations(documents, ({ one }) => ({
  user: one(usersTable, {
    fields: [documents.user_id],
    references: [usersTable.id],
  }),
  content: one(generated_contents, {
    fields: [documents.content_id],
    references: [generated_contents.id],
  }),
}));