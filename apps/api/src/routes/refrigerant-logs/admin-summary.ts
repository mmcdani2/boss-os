import { Router } from "express";
import { db } from "../../db/index.js";
import {
  refrigerantLogs,
  reimbursementRequests,
  sprayFoamJobLogs,
} from "../../db/schema.js";
import {
  requireAuth,
  type AuthedRequest,
} from "../../middleware/require-auth.js";

const router = Router();

function toChicagoDateKey(value: Date | string | null | undefined) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

router.get(
  "/admin/stats/summary",
  requireAuth,
  async (req: AuthedRequest, res) => {
    try {
      if (!req.authUser) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      if (req.authUser.role !== "admin") {
        return res.status(403).json({ error: "Forbidden." });
      }

      const [refrigerant, reimbursements, sprayFoam] = await Promise.all([
        db.select().from(refrigerantLogs),
        db.select().from(reimbursementRequests),
        db.select().from(sprayFoamJobLogs),
      ]);

      const allRecords = [
        ...refrigerant.map((row) => ({
          userId: row.userId,
          submittedAt: row.submittedAt,
        })),
        ...reimbursements.map((row) => ({
          userId: row.userId,
          submittedAt: row.submittedAt,
        })),
        ...sprayFoam.map((row) => ({
          userId: row.userId,
          submittedAt: row.submittedAt,
        })),
      ];

      const todayKey = toChicagoDateKey(new Date());

      const logsToday = allRecords.filter((record) => {
        return toChicagoDateKey(record.submittedAt) === todayKey;
      }).length;

      const totalLogs = allRecords.length;

      const activeTechs = new Set(
        allRecords
          .map((record) => record.userId)
          .filter((value): value is string => typeof value === "string" && value.length > 0)
      ).size;

      return res.json({
        totalLogs,
        logsToday,
        activeTechs,
      });
    } catch (error) {
      console.error("Admin combined summary error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  },
);

export default router;
