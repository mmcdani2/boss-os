import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { companies } from "../../db/schema.js";
import {
  requireAuth,
  type AuthedRequest,
} from "../../middleware/require-auth.js";

const router = Router();

router.get("/", requireAuth, async (_req: AuthedRequest, res) => {
  try {
    const rows = await db.select().from(companies).limit(1);
    const company = rows[0];

    if (!company) {
      return res.status(404).json({ error: "Company not found." });
    }

    return res.json({
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        isActive: company.isActive,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get company error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.patch("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const rawName = typeof req.body?.name === "string" ? req.body.name : "";
    const name = rawName.trim();

    if (!name) {
      return res.status(400).json({ error: "Company name is required." });
    }

    const rows = await db.select().from(companies).limit(1);
    const company = rows[0];

    if (!company) {
      return res.status(404).json({ error: "Company not found." });
    }

    const updated = await db
      .update(companies)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eq(companies.id, company.id))
      .returning();

    return res.json({
      company: {
        id: updated[0].id,
        name: updated[0].name,
        slug: updated[0].slug,
        isActive: updated[0].isActive,
        createdAt: updated[0].createdAt,
        updatedAt: updated[0].updatedAt,
      },
    });
  } catch (error) {
    console.error("Patch company error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
