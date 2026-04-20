import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price"),
  price_range: text("price_range"),
  category: text("category").notNull(),
  unit: text("unit").notNull(),
  available: boolean("available").notNull().default(true),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }).notNull(),
  streetAddress: text("street_address"),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  category: varchar("category", { length: 255 }),
  subCategory: varchar("sub_category", { length: 255 }),
  quantity: varchar("quantity", { length: 100 }),
  totalAmount: integer("total_amount"),
  items: text("items"), // Storing as stringified JSON for simplicity if jsonb is not available/complex
  deliveryOption: varchar("delivery_option", { length: 255 }).notNull(),
  notes: text("notes"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Order = typeof orders.$inferSelect;

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Contact = typeof contacts.$inferSelect;
