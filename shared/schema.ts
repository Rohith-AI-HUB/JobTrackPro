import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobTitle: text("job_title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  applicationDate: text("application_date").notNull(), // Using text for simplicity
  status: text("status").notNull().$type<"applied" | "interviewing" | "offer" | "rejected">(),
  jobUrl: text("job_url"),
  notes: text("notes"),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = {
  id: string; // Changed to string for MongoDB compatibility
  jobTitle: string;
  company: string;
  location: string | null;
  applicationDate: string;
  status: "applied" | "interviewing" | "offer" | "rejected";
  jobUrl: string | null;
  notes: string | null;
};

// For backward compatibility with existing user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
