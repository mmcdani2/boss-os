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

router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.authUser) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    if (req.authUser.role !== "admin") {
      return res.status(403).json({ error: "Forbidden." });
    }

    const name = String(req.body?.name || "").trim();
    const sku = String(req.body?.sku || "").trim();
    const category = String(req.body?.category || "").trim();
    const unitOfMeasure = String(req.body?.unitOfMeasure || "").trim();
    const quantityOnHand = Number(req.body?.quantityOnHand ?? 0);
    const reorderThreshold = Number(req.body?.reorderThreshold ?? 0);
    const storageLocation = String(req.body?.storageLocation || "").trim();
    const notesRaw = String(req.body?.notes || "").trim();

    if (!name || !sku || !category || !unitOfMeasure || !storageLocation) {
      return res.status(400).json({
        error: "Name, SKU, category, unit of measure, and storage location are required.",
      });
    }

    if (!Number.isInteger(quantityOnHand) || quantityOnHand < 0) {
      return res.status(400).json({ error: "Quantity on hand must be a non-negative whole number." });
    }

    if (!Number.isInteger(reorderThreshold) || reorderThreshold < 0) {
      return res.status(400).json({ error: "Reorder threshold must be a non-negative whole number." });
    }

    const existing = await db
      .select({ id: inventoryItems.id })
      .from(inventoryItems)
      .where(eq(inventoryItems.sku, sku))
      .limit(1);

    if (existing[0]) {
      return res.status(409).json({ error: "An inventory item with that SKU already exists." });
    }

    const inserted = await db
      .insert(inventoryItems)
      .values({
        name,
        sku,
        category,
        unitOfMeasure,
        quantityOnHand,
        reorderThreshold,
        storageLocation,
        notes: notesRaw || null,
        isActive: true,
      })
      .returning({
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
      });

    return res.status(201).json({ item: inserted[0] });
  } catch (error) {
    console.error("Create inventory item error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
