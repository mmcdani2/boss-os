import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { divisions, quickEstimateCalculatorSettings } from "../../db/schema.js";
import {
  requireAuth,
  type AuthedRequest,
} from "../../middleware/require-auth.js";

const router = Router();

const QUICK_ESTIMATE_DEFAULTS = {
  laborRate: 40,
  pricingTiers: [0.35, 0.4, 0.5],
};

function parsePricingTiers(value: string) {
  const cleaned = value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item) && item > 0 && item < 1);

  return cleaned.length > 0
    ? Array.from(new Set(cleaned)).sort((a, b) => a - b)
    : QUICK_ESTIMATE_DEFAULTS.pricingTiers;
}

router.get("/quick-estimate-calculator", requireAuth, async (_req: AuthedRequest, res) => {
  try {
    const hvacDivision = (
      await db
        .select({
          id: divisions.id,
          key: divisions.key,
        })
        .from(divisions)
        .where(eq(divisions.key, "hvac"))
        .limit(1)
    )[0];

    if (!hvacDivision) {
      return res.json({
        settings: QUICK_ESTIMATE_DEFAULTS,
      });
    }

    const settingsRow = (
      await db
        .select()
        .from(quickEstimateCalculatorSettings)
        .where(eq(quickEstimateCalculatorSettings.divisionId, hvacDivision.id))
        .limit(1)
    )[0];

    if (!settingsRow) {
      return res.json({
        settings: QUICK_ESTIMATE_DEFAULTS,
      });
    }

    return res.json({
      settings: {
        laborRate: Number(settingsRow.laborRate),
        pricingTiers: parsePricingTiers(settingsRow.pricingTiers),
      },
    });
  } catch (error) {
    console.error("Get field quick estimate calculator settings error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
