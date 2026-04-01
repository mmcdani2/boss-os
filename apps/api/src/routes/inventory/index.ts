import { Router } from "express";
import { asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { inventoryItems } from "../../db/schema.js";
import { requireAuth, type AuthedRequest } from "../../middleware/require-auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.authUser) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    if (req.authUser.role !== "admin") {
      return res.status(403).json({ error: "Forbidden." });
    }

    const rows = await db
      .select({
        id: inventoryItems.id,
        name: inventoryItems.name,
        sku: inventoryItems.sku,
        category: inventoryItems.category,
        unitOfMeasure: inventoryItems.unitOfMeasure,
        quantityOnHand: inventoryItems.quantityOnHand,
        reorderThreshold: inventoryItems.reorderThreshold,
        storageLocation: inventoryItems.storageLocation,
        notes: inventoryItems.notes,
        isActive: inventoryItems.isActive,
        createdAt: inventoryItems.createdAt,
        updatedAt: inventoryItems.updatedAt,
      })
      .from(inventoryItems)
      .where(eq(inventoryItems.isActive, true))
      .orderBy(asc(inventoryItems.name), asc(inventoryItems.sku));

    const lowStockCount = rows.filter(
      (item) => item.quantityOnHand <= item.reorderThreshold
    ).length;

    const categoryCount = new Set(rows.map((item) => item.category)).size;

    return res.json({
      items: rows,
      stats: {
        totalItems: rows.length,
        lowStockCount,
        categoryCount,
      },
    });
  } catch (error) {
    console.error("List inventory items error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
