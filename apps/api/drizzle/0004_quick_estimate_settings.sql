CREATE TABLE "quick_estimate_calculator_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "division_id" uuid NOT NULL REFERENCES "divisions"("id"),
  "labor_rate" numeric(10, 2) NOT NULL DEFAULT 40.00,
  "pricing_tiers" text NOT NULL DEFAULT '0.35,0.4,0.5',
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX "quick_estimate_calculator_settings_division_id_idx"
  ON "quick_estimate_calculator_settings" ("division_id");

CREATE UNIQUE INDEX "quick_estimate_calculator_settings_division_id_unique"
  ON "quick_estimate_calculator_settings" ("division_id");
