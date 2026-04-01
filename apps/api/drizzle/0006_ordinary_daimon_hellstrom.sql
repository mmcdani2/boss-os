CREATE TABLE "inventory_item_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"location_name" varchar(255) NOT NULL,
	"location_type" varchar(50) NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inventory_item_locations" ADD CONSTRAINT "inventory_item_locations_item_id_inventory_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."inventory_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inventory_item_locations_item_idx" ON "inventory_item_locations" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "inventory_item_locations_item_location_idx" ON "inventory_item_locations" USING btree ("item_id","location_name");--> statement-breakpoint
CREATE INDEX "inventory_item_locations_location_type_idx" ON "inventory_item_locations" USING btree ("location_type");