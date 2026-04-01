CREATE TABLE "inventory_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" varchar(255) NOT NULL,
        "sku" varchar(120) NOT NULL,
        "category" varchar(120) NOT NULL,
        "unit_of_measure" varchar(60) NOT NULL,
        "quantity_on_hand" integer DEFAULT 0 NOT NULL,
        "reorder_threshold" integer DEFAULT 0 NOT NULL,
        "storage_location" varchar(255) NOT NULL,
        "notes" text,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_transactions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "item_id" uuid NOT NULL,
        "transaction_type" varchar(50) NOT NULL,
        "quantity_delta" integer NOT NULL,
        "reason" text NOT NULL,
        "performed_by_user_id" uuid NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_item_id_inventory_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."inventory_items"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_performed_by_user_id_users_id_fk" FOREIGN KEY ("performed_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_items_sku_idx" ON "inventory_items" USING btree ("sku");
--> statement-breakpoint
CREATE INDEX "inventory_items_category_idx" ON "inventory_items" USING btree ("category");
--> statement-breakpoint
CREATE INDEX "inventory_items_active_idx" ON "inventory_items" USING btree ("is_active");
--> statement-breakpoint
CREATE INDEX "inventory_transactions_item_idx" ON "inventory_transactions" USING btree ("item_id");
--> statement-breakpoint
CREATE INDEX "inventory_transactions_user_idx" ON "inventory_transactions" USING btree ("performed_by_user_id");
--> statement-breakpoint
CREATE INDEX "inventory_transactions_created_at_idx" ON "inventory_transactions" USING btree ("created_at");