import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  decimal,
  text,
  index,
  integer,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("companies_slug_idx").on(table.slug),
  })
);

export const divisions = pgTable(
  "divisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    key: varchar("key", { length: 100 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    companyIdx: index("divisions_company_id_idx").on(table.companyId),
    companyKeyIdx: index("divisions_company_key_idx").on(table.companyId, table.key),
  })
);

export const modules = pgTable(
  "modules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 120 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    category: varchar("category", { length: 120 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    keyIdx: index("modules_key_idx").on(table.key),
  })
);

export const divisionModules = pgTable(
  "division_modules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    divisionId: uuid("division_id").notNull().references(() => divisions.id),
    moduleId: uuid("module_id").notNull().references(() => modules.id),
    isEnabled: boolean("is_enabled").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    divisionIdx: index("division_modules_division_id_idx").on(table.divisionId),
    moduleIdx: index("division_modules_module_id_idx").on(table.moduleId),
    divisionModuleIdx: index("division_modules_division_module_idx").on(
      table.divisionId,
      table.moduleId
    ),
  })
);

export const quickEstimateCalculatorSettings = pgTable(
  "quick_estimate_calculator_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    divisionId: uuid("division_id").notNull().references(() => divisions.id),
    laborRate: decimal("labor_rate", { precision: 10, scale: 2 }).notNull().default("40.00"),
    pricingTiers: text("pricing_tiers").notNull().default("0.35,0.4,0.5"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    divisionIdx: index("quick_estimate_calculator_settings_division_id_idx").on(table.divisionId),
    divisionUniqueIdx: uniqueIndex("quick_estimate_calculator_settings_division_id_unique").on(
      table.divisionId
    ),
  })
);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("tech"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const refrigerantLogs = pgTable("refrigerant_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  companyKey: varchar("company_key", { length: 50 }).notNull(),
  divisionKey: varchar("division_key", { length: 100 }),
  techNameSnapshot: varchar("tech_name_snapshot", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }),
  jobNumber: varchar("job_number", { length: 100 }),
  city: varchar("city", { length: 120 }),
  state: varchar("state", { length: 50 }),
  equipmentType: varchar("equipment_type", { length: 120 }),
  refrigerantType: varchar("refrigerant_type", { length: 120 }).notNull(),
  poundsAdded: decimal("pounds_added", { precision: 10, scale: 2 }),
  poundsRecovered: decimal("pounds_recovered", { precision: 10, scale: 2 }),
  leakSuspected: boolean("leak_suspected").default(false),
  notes: text("notes"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reimbursementRequests = pgTable(
  "reimbursement_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id),
    companyKey: varchar("company_key", { length: 50 }).notNull(),
    divisionKey: varchar("division_key", { length: 100 }),
    techNameSnapshot: varchar("tech_name_snapshot", { length: 255 }).notNull(),
    amountSpent: decimal("amount_spent", { precision: 10, scale: 2 }).notNull(),
    purchaseDate: date("purchase_date").notNull(),
    vendor: varchar("vendor", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    paymentMethod: varchar("payment_method", { length: 100 }).notNull(),
    purpose: text("purpose").notNull(),
    tiedToJob: boolean("tied_to_job").notNull().default(false),
    jobNumber: varchar("job_number", { length: 100 }),
    notes: text("notes"),
    receiptUploaded: boolean("receipt_uploaded").notNull().default(false),
    urgentReimbursementNeeded: boolean("urgent_reimbursement_needed").notNull().default(false),
    status: varchar("status", { length: 50 }).notNull().default("submitted"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewedByUserId: uuid("reviewed_by_user_id").references(() => users.id),
    reimbursementDate: date("reimbursement_date"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("reimbursement_requests_user_id_idx").on(table.userId),
    divisionIdx: index("reimbursement_requests_division_key_idx").on(table.divisionKey),
    statusIdx: index("reimbursement_requests_status_idx").on(table.status),
    submittedIdx: index("reimbursement_requests_submitted_at_idx").on(table.submittedAt),
  })
);

export const sprayFoamJobLogs = pgTable(
  "spray_foam_job_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id),
    companyKey: varchar("company_key", { length: 50 }).notNull(),
    divisionKey: varchar("division_key", { length: 100 }),
    techNameSnapshot: varchar("tech_name_snapshot", { length: 255 }).notNull(),
    customerName: varchar("customer_name", { length: 255 }),
    jobNumber: varchar("job_number", { length: 100 }),
    jobDate: date("job_date"),
    crewLead: varchar("crew_lead", { length: 255 }),
    helpersText: text("helpers_text"),
    rigName: varchar("rig_name", { length: 255 }),
    timeOnJob: varchar("time_on_job", { length: 100 }),
    ambientTempF: decimal("ambient_temp_f", { precision: 10, scale: 2 }),
    substrateTempF: decimal("substrate_temp_f", { precision: 10, scale: 2 }),
    humidityPercent: decimal("humidity_percent", { precision: 10, scale: 2 }),
    downtimeMinutes: integer("downtime_minutes"),
    downtimeReason: text("downtime_reason"),
    otherNotes: text("other_notes"),
    photosUploadedToHcp: boolean("photos_uploaded_to_hcp").notNull().default(false),
    city: varchar("city", { length: 120 }),
    state: varchar("state", { length: 50 }),
    notes: text("notes"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    divisionIdx: index("spray_foam_job_logs_division_key_idx").on(table.divisionKey),
    submittedIdx: index("spray_foam_job_logs_submitted_at_idx").on(table.submittedAt),
  })
);

export const sprayFoamJobLogLines = pgTable(
  "spray_foam_job_log_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    jobLogId: uuid("job_log_id").notNull().references(() => sprayFoamJobLogs.id),
    lineNumber: integer("line_number").notNull(),
    areaDescription: varchar("area_description", { length: 255 }).notNull(),
    jobType: varchar("job_type", { length: 120 }).notNull(),
    foamType: varchar("foam_type", { length: 120 }).notNull(),
    squareFeet: decimal("square_feet", { precision: 10, scale: 2 }),
    thicknessInches: decimal("thickness_inches", { precision: 10, scale: 2 }),
    boardFeet: decimal("board_feet", { precision: 12, scale: 2 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    jobLogIdx: index("spray_foam_job_log_lines_job_log_id_idx").on(table.jobLogId),
    jobLogLineIdx: index("spray_foam_job_log_lines_job_log_line_idx").on(
      table.jobLogId,
      table.lineNumber
    ),
  })
);

export const sprayFoamMaterialLines = pgTable(
  "spray_foam_material_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    jobLogId: uuid("job_log_id").notNull().references(() => sprayFoamJobLogs.id),
    areaLineId: uuid("area_line_id").notNull().references(() => sprayFoamJobLogLines.id),
    lineNumber: integer("line_number").notNull(),
    foamType: varchar("foam_type", { length: 120 }).notNull(),
    manufacturer: varchar("manufacturer", { length: 255 }).notNull(),
    lotNumber: varchar("lot_number", { length: 255 }).notNull(),
    setsUsed: decimal("sets_used", { precision: 10, scale: 2 }),
    theoreticalYieldPerSet: decimal("theoretical_yield_per_set", {
      precision: 12,
      scale: 2,
    }),
    theoreticalTotalYield: decimal("theoretical_total_yield", {
      precision: 12,
      scale: 2,
    }),
    actualYield: decimal("actual_yield", { precision: 12, scale: 2 }),
    yieldPercent: decimal("yield_percent", { precision: 8, scale: 2 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    jobLogIdx: index("spray_foam_material_lines_job_log_id_idx").on(table.jobLogId),
    areaLineIdx: index("spray_foam_material_lines_area_line_id_idx").on(table.areaLineId),
    jobLogLineIdx: index("spray_foam_material_lines_job_log_line_idx").on(
      table.jobLogId,
      table.lineNumber
    ),
  })
);

export const inventoryItems = pgTable(
  "inventory_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    sku: varchar("sku", { length: 120 }).notNull(),
    category: varchar("category", { length: 120 }).notNull(),
    unitOfMeasure: varchar("unit_of_measure", { length: 60 }).notNull(),
    quantityOnHand: integer("quantity_on_hand").notNull().default(0),
    reorderThreshold: integer("reorder_threshold").notNull().default(0),
    storageLocation: varchar("storage_location", { length: 255 }).notNull(),
    notes: text("notes"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    skuIdx: uniqueIndex("inventory_items_sku_idx").on(table.sku),
    categoryIdx: index("inventory_items_category_idx").on(table.category),
    activeIdx: index("inventory_items_active_idx").on(table.isActive),
  })
);


export const inventoryItemLocations = pgTable(
  "inventory_item_locations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    itemId: uuid("item_id").notNull().references(() => inventoryItems.id),
    locationName: varchar("location_name", { length: 255 }).notNull(),
    locationType: varchar("location_type", { length: 50 }).notNull(),
    quantity: integer("quantity").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    itemIdx: index("inventory_item_locations_item_idx").on(table.itemId),
    itemLocationIdx: index("inventory_item_locations_item_location_idx").on(
      table.itemId,
      table.locationName
    ),
    locationTypeIdx: index("inventory_item_locations_location_type_idx").on(table.locationType),
  })
);
export const inventoryTransactions = pgTable(
  "inventory_transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    itemId: uuid("item_id").notNull().references(() => inventoryItems.id),
    transactionType: varchar("transaction_type", { length: 50 }).notNull(),
    quantityDelta: integer("quantity_delta").notNull(),
    reason: text("reason").notNull(),
    performedByUserId: uuid("performed_by_user_id").notNull().references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    itemIdx: index("inventory_transactions_item_idx").on(table.itemId),
    userIdx: index("inventory_transactions_user_idx").on(table.performedByUserId),
    createdAtIdx: index("inventory_transactions_created_at_idx").on(table.createdAt),
  })
);


