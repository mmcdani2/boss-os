import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { refrigerantLogs } from "../../db/schema.js";
import {
  requireAuth,
  type AuthedRequest,
} from "../../middleware/require-auth.js";

const router = Router();

router.get("/admin/all", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.authUser) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    if (req.authUser.role !== "admin") {
      return res.status(403).json({ error: "Forbidden." });
    }

    const divisionKey =
      typeof req.query.divisionKey === "string" ? req.query.divisionKey.trim() : "";

    const logs = divisionKey
      ? await db
          .select()
          .from(refrigerantLogs)
          .where(eq(refrigerantLogs.divisionKey, divisionKey))
          .orderBy(desc(refrigerantLogs.submittedAt))
      : await db
          .select()
          .from(refrigerantLogs)
          .orderBy(desc(refrigerantLogs.submittedAt));

    return res.json({ logs });
  } catch (error) {
    console.error("Admin get all refrigerant logs error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
