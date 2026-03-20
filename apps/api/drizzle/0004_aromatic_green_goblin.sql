CREATE TABLE "quick_estimate_calculator_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"division_id" uuid NOT NULL,
	"labor_rate" numeric(10, 2) DEFAULT '40.00' NOT NULL,
	"pricing_tiers" text DEFAULT '0.35,0.4,0.5' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spray_foam_material_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_log_id" uuid NOT NULL,
	"area_line_id" uuid NOT NULL,
	"line_number" integer NOT NULL,
	"foam_type" varchar(120) NOT NULL,
	"manufacturer" varchar(255) NOT NULL,
	"lot_number" varchar(255) NOT NULL,
	"sets_used" numeric(10, 2),
	"theoretical_yield_per_set" numeric(12, 2),
	"theoretical_total_yield" numeric(12, 2),
	"actual_yield" numeric(12, 2),
	"yield_percent" numeric(8, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "spray_foam_job_logs" ADD COLUMN "job_date" date;--> statement-breakpoint
ALTER TABLE "spray_foam_job_logs" ADD COLUMN "crew_lead" varchar(255);--> statement-breakpoint
ALTER TABLE "spray_foam_job_logs" ADD COLUMN "helpers_text" text;--> statement-breakpoint
ALTER TABLE "spray_foam_job_logs" ADD COLUMN "rig_name" varchar(255);--> statement-breakpoint
ALTER TABLE "spray_foam_job_logs" ADD COLUMN "time_on_job" varchar(100);--> statement-breakpoint
ALTER TABLE "spray_foam_job_logs" ADD COLUMN "ambient_temp_f" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "spray_foam_job_logs" ADD COLUMN "substrate_temp_f" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "spray_foam_job_logs" ADD COLUMN "humidity_percent" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "spray_foam_job_logs" ADD COLUMN "downtime_minutes" integer;--> statement-breakpoint
ALTER TABLE "spray_foam_job_logs" ADD COLUMN "downtime_reason" text;--> statement-breakpoint
ALTER TABLE "spray_foam_job_logs" ADD COLUMN "other_notes" text;--> statement-breakpoint
ALTER TABLE "spray_foam_job_logs" ADD COLUMN "photos_uploaded_to_hcp" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "quick_estimate_calculator_settings" ADD CONSTRAINT "quick_estimate_calculator_settings_division_id_divisions_id_fk" FOREIGN KEY ("division_id") REFERENCES "public"."divisions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spray_foam_material_lines" ADD CONSTRAINT "spray_foam_material_lines_job_log_id_spray_foam_job_logs_id_fk" FOREIGN KEY ("job_log_id") REFERENCES "public"."spray_foam_job_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spray_foam_material_lines" ADD CONSTRAINT "spray_foam_material_lines_area_line_id_spray_foam_job_log_lines_id_fk" FOREIGN KEY ("area_line_id") REFERENCES "public"."spray_foam_job_log_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "quick_estimate_calculator_settings_division_id_idx" ON "quick_estimate_calculator_settings" USING btree ("division_id");--> statement-breakpoint
CREATE UNIQUE INDEX "quick_estimate_calculator_settings_division_id_unique" ON "quick_estimate_calculator_settings" USING btree ("division_id");--> statement-breakpoint
CREATE INDEX "spray_foam_material_lines_job_log_id_idx" ON "spray_foam_material_lines" USING btree ("job_log_id");--> statement-breakpoint
CREATE INDEX "spray_foam_material_lines_area_line_id_idx" ON "spray_foam_material_lines" USING btree ("area_line_id");--> statement-breakpoint
CREATE INDEX "spray_foam_material_lines_job_log_line_idx" ON "spray_foam_material_lines" USING btree ("job_log_id","line_number");