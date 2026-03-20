import { Router } from "express";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "../../db/index.js";
import {
  divisionModules,
  divisions,
  modules,
  quickEstimateCalculatorSettings,
} from "../../db/schema.js";
import {
  requireAuth,
  type AuthedRequest,
} from "../../middleware/require-auth.js";

const router = Router();

type AllowedDivisionKey = "hvac" | "spray-foam";

const MODULES_BY_DIVISION: Record<AllowedDivisionKey, string[]> = {
  hvac: ["quick-estimate-calculator", "refrigerant-log", "reimbursement-request"],
  "spray-foam": ["reimbursement-request", "spray-foam-job-log"],
};

const QUICK_ESTIMATE_DEFAULTS = {
  laborRate: 40,
  pricingTiers: [0.35, 0.4, 0.5],
};

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizePricingTiers(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item) && item > 0 && item < 1)
    )
  ).sort((a, b) => a - b);
}

function parsePricingTiers(value: string) {
  const cleaned = value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item) && item > 0 && item < 1);

  return cleaned.length > 0
    ? Array.from(new Set(cleaned)).sort((a, b) => a - b)
    : QUICK_ESTIMATE_DEFAULTS.pricingTiers;
}

function getAllowedModuleKeysForDivision(divisionKey: string) {
  if (divisionKey === "hvac") {
    return MODULES_BY_DIVISION.hvac;
  }

  if (divisionKey === "spray-foam") {
    return MODULES_BY_DIVISION["spray-foam"];
  }

  return [];
}

async function ensureDivisionModuleRowsExist(divisionId: string, divisionKey: string) {
  const allowedKeys = getAllowedModuleKeysForDivision(divisionKey);

  if (allowedKeys.length === 0) {
    return;
  }

  const allowedModules = await db
    .select({
      id: modules.id,
      key: modules.key,
    })
    .from(modules)
    .where(inArray(modules.key, allowedKeys));

  const existingRows = await db
    .select({
      moduleId: divisionModules.moduleId,
    })
    .from(divisionModules)
    .where(eq(divisionModules.divisionId, divisionId));

  const existingModuleIds = new Set(existingRows.map((row) => row.moduleId));

  const missing = allowedModules.filter((module) => !existingModuleIds.has(module.id));

  if (missing.length === 0) {
    return;
  }

  await db.insert(divisionModules).values(
    missing.map((module) => ({
      divisionId,
      moduleId: module.id,
      isEnabled: false,
    }))
  );
}

router.get("/", requireAuth, async (_req: AuthedRequest, res) => {
  try {
    const rows = await db
      .select({
        id: divisions.id,
        companyId: divisions.companyId,
        key: divisions.key,
        name: divisions.name,
        isActive: divisions.isActive,
        createdAt: divisions.createdAt,
        updatedAt: divisions.updatedAt,
      })
      .from(divisions)
      .orderBy(asc(divisions.name));

    return res.json({ divisions: rows });
  } catch (error) {
    console.error("Get divisions error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/:id/modules", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const divisionId = getSingleParam(req.params.id);

    if (!divisionId) {
      return res.status(400).json({ error: "Division id is required." });
    }

    const divisionRows = await db
      .select({
        id: divisions.id,
        companyId: divisions.companyId,
        key: divisions.key,
        name: divisions.name,
        isActive: divisions.isActive,
        createdAt: divisions.createdAt,
        updatedAt: divisions.updatedAt,
      })
      .from(divisions)
      .where(eq(divisions.id, divisionId))
      .limit(1);

    const division = divisionRows[0];

    if (!division) {
      return res.status(404).json({ error: "Division not found." });
    }

    await ensureDivisionModuleRowsExist(divisionId, division.key);

    const allowedKeys = getAllowedModuleKeysForDivision(division.key);

    const rows = await db
      .select({
        id: divisionModules.id,
        isEnabled: divisionModules.isEnabled,
        createdAt: divisionModules.createdAt,
        updatedAt: divisionModules.updatedAt,
        module: {
          id: modules.id,
          key: modules.key,
          name: modules.name,
          category: modules.category,
          isActive: modules.isActive,
          createdAt: modules.createdAt,
          updatedAt: modules.updatedAt,
        },
      })
      .from(divisionModules)
      .innerJoin(modules, eq(divisionModules.moduleId, modules.id))
      .where(
        and(
          eq(divisionModules.divisionId, divisionId),
          inArray(modules.key, allowedKeys)
        )
      )
      .orderBy(asc(modules.name));

    return res.json({
      division,
      modules: rows,
    });
  } catch (error) {
    console.error("Get division modules error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.patch(
  "/:id/modules/:divisionModuleId",
  requireAuth,
  async (req: AuthedRequest, res) => {
    try {
      const divisionId = getSingleParam(req.params.id);
      const divisionModuleId = getSingleParam(req.params.divisionModuleId);
      const isEnabled = req.body?.isEnabled;

      if (!divisionId) {
        return res.status(400).json({ error: "Division id is required." });
      }

      if (!divisionModuleId) {
        return res.status(400).json({ error: "Division module id is required." });
      }

      if (typeof isEnabled !== "boolean") {
        return res.status(400).json({ error: "isEnabled must be a boolean." });
      }

      const match = await db
        .select({
          id: divisionModules.id,
          divisionId: divisionModules.divisionId,
          moduleId: divisionModules.moduleId,
          isEnabled: divisionModules.isEnabled,
          createdAt: divisionModules.createdAt,
          updatedAt: divisionModules.updatedAt,
        })
        .from(divisionModules)
        .where(
          and(
            eq(divisionModules.id, divisionModuleId),
            eq(divisionModules.divisionId, divisionId)
          )
        )
        .limit(1);

      const row = match[0];

      if (!row) {
        return res.status(404).json({ error: "Division module not found." });
      }

      const updated = await db
        .update(divisionModules)
        .set({
          isEnabled,
          updatedAt: new Date(),
        })
        .where(eq(divisionModules.id, divisionModuleId))
        .returning();

      return res.json({
        divisionModule: updated[0],
      });
    } catch (error) {
      console.error("Patch division module error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
);

router.get(
  "/:id/quick-estimate-calculator-settings",
  requireAuth,
  async (req: AuthedRequest, res) => {
    try {
      const divisionId = getSingleParam(req.params.id);

      if (!divisionId) {
        return res.status(400).json({ error: "Division id is required." });
      }

      const divisionRows = await db
        .select({
          id: divisions.id,
          key: divisions.key,
          name: divisions.name,
        })
        .from(divisions)
        .where(eq(divisions.id, divisionId))
        .limit(1);

      const division = divisionRows[0];

      if (!division) {
        return res.status(404).json({ error: "Division not found." });
      }

      if (division.key !== "hvac") {
        return res.status(400).json({ error: "Quick Estimate Calculator only applies to HVAC." });
      }

      const rows = await db
        .select()
        .from(quickEstimateCalculatorSettings)
        .where(eq(quickEstimateCalculatorSettings.divisionId, divisionId))
        .limit(1);

      const settings = rows[0];

      if (!settings) {
        return res.json({
          settings: QUICK_ESTIMATE_DEFAULTS,
        });
      }

      return res.json({
        settings: {
          laborRate: Number(settings.laborRate),
          pricingTiers: parsePricingTiers(settings.pricingTiers),
        },
      });
    } catch (error) {
      console.error("Get quick estimate calculator settings error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
);

router.put(
  "/:id/quick-estimate-calculator-settings",
  requireAuth,
  async (req: AuthedRequest, res) => {
    try {
      const divisionId = getSingleParam(req.params.id);

      if (!divisionId) {
        return res.status(400).json({ error: "Division id is required." });
      }

      const divisionRows = await db
        .select({
          id: divisions.id,
          key: divisions.key,
          name: divisions.name,
        })
        .from(divisions)
        .where(eq(divisions.id, divisionId))
        .limit(1);

      const division = divisionRows[0];

      if (!division) {
        return res.status(404).json({ error: "Division not found." });
      }

      if (division.key !== "hvac") {
        return res.status(400).json({ error: "Quick Estimate Calculator only applies to HVAC." });
      }

      const laborRateValue = Number(req.body?.laborRate);
      const pricingTiers = normalizePricingTiers(req.body?.pricingTiers);

      if (!Number.isFinite(laborRateValue) || laborRateValue <= 0) {
        return res.status(400).json({ error: "Labor rate must be greater than 0." });
      }

      if (pricingTiers.length === 0) {
        return res.status(400).json({ error: "At least one valid pricing tier is required." });
      }

      const existingRows = await db
        .select()
        .from(quickEstimateCalculatorSettings)
        .where(eq(quickEstimateCalculatorSettings.divisionId, divisionId))
        .limit(1);

      const laborRateText = laborRateValue.toFixed(2);
      const pricingTiersText = pricingTiers.join(",");

      let saved;

      if (existingRows[0]) {
        saved = (
          await db
            .update(quickEstimateCalculatorSettings)
            .set({
              laborRate: laborRateText,
              pricingTiers: pricingTiersText,
              updatedAt: new Date(),
            })
            .where(eq(quickEstimateCalculatorSettings.divisionId, divisionId))
            .returning()
        )[0];
      } else {
        saved = (
          await db
            .insert(quickEstimateCalculatorSettings)
            .values({
              divisionId,
              laborRate: laborRateText,
              pricingTiers: pricingTiersText,
            })
            .returning()
        )[0];
      }

      return res.json({
        settings: {
          laborRate: Number(saved.laborRate),
          pricingTiers,
        },
      });
    } catch (error) {
      console.error("Save quick estimate calculator settings error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
);

export default router;
