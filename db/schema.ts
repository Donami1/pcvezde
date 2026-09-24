import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const configs = sqliteTable("Configs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  gpu: text("gpu").notNull(),
  cpu: text("cpu").notNull(),
  ram: text("ram").notNull(),
  storage: text("storage").notNull(),
  pricePerDay: integer("pricePerDay").notNull(),
  pricePerMonth: integer("pricePerMonth"),
  image: text("image"),
  shortDesc: text("shortDesc"),
  features: text("features"),
  isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const bookings = sqliteTable("Bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("userId"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  city: text("city"),
  address: text("address"),
  period: text("period"),
  config: text("config"),
  comment: text("comment"),
  status: text("status", { enum: ["NEW", "CONFIRMED", "COMPLETED", "CANCELLED"] })
    .notNull()
    .default("NEW"),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  city: text("city").notNull().default(""),
  rating: integer("rating").notNull().default(5),
  text: text("text").notNull(),
  isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const faqItems = sqliteTable("faq_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const units = sqliteTable("units", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  configId: integer("configId").references(() => configs.id, {
    onDelete: "cascade",
  }),
  label: text("label").notNull(),
  status: text("status", { enum: ["FREE", "BUSY"] }).notNull().default("FREE"),
  bookingId: integer("bookingId"),
  rentedAt: integer("rentedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;
export const UNIT_STATUSES = ["FREE", "BUSY"] as const;
export type UnitStatus = (typeof UNIT_STATUSES)[number];

export type Config = typeof configs.$inferSelect;
export type NewConfig = typeof configs.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type FaqItem = typeof faqItems.$inferSelect;
export type NewFaqItem = typeof faqItems.$inferInsert;

export type BookingStatus = "NEW" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export const BOOKING_STATUSES: BookingStatus[] = [
  "NEW",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

export function bookingStatusLabel(status: string) {
  switch (status) {
    case "NEW":
      return "Новая";
    case "CONFIRMED":
      return "Подтверждена";
    case "COMPLETED":
      return "Выполнена";
    case "CANCELLED":
      return "Отменена";
    default:
      return status;
  }
}