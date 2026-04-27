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
  items: text("items"), 
  imageUrl: text("image_url"),
  deliveryOption: varchar("delivery_option", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }),
  postalCode: varchar("postal_code", { length: 50 }),
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

export const flashDeals = pgTable("flash_deals", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  discount: text("discount"),
  productId: uuid("product_id").references(() => products.id),
  isActive: boolean("is_active").notNull().default(true),
  isHero: boolean("is_hero").notNull().default(false),
  imageUrl: text("image_url"),
  endTime: timestamp("end_time", { mode: "date" }).notNull(),
  stockTotal: integer("stock_total").notNull().default(100),
  stockSold: integer("stock_sold").notNull().default(0),
  flashPrice: text("flash_price"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const flashSaleSettings = pgTable("flash_sale_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  endTime: timestamp("end_time", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  initials: varchar("initials", { length: 10 }),
  review: text("review").notNull(),
  rating: integer("rating").notNull().default(5),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Testimonial = typeof testimonials.$inferSelect;

export const priceCatalog = pgTable("price_catalog", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  priceRange: text("price_range").notNull(),
  unit: text("unit").notNull(),
  imageUrl: text("image_url"),
  iconName: text("icon_name"),
  color: text("color"),
  orderIndex: integer("order_index"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



export type PriceCatalogItem = typeof priceCatalog.$inferSelect;

export const partnerAds = pgTable("partner_ads", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
   linkUrl: text("link_url"),
   price: text("price"),
  isActive: boolean("is_active").notNull().default(true),
  hasLink: boolean("has_link").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type PartnerAd = typeof partnerAds.$inferSelect;
