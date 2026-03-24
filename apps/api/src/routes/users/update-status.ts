import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { requireAuth, type AuthedRequest } from "../../middleware/require-auth.js";

const router = Router();

router.patch("/:id/status", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.authUser) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    if (req.authUser.role !== "admin") {
      return res.status(403).json({ error: "Forbidden." });
    }

    const id = String(req.params.id || "").trim();
    const isActive = req.body?.isActive;

    if (!id) {
      return res.status(400).json({ error: "User id is required." });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ error: "isActive must be a boolean." });
    }

    const existing = await db
      .select({
        id: users.id,
        role: users.role,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    const user = existing[0];

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.id === req.authUser.sub && isActive === false) {
      return res.status(400).json({ error: "You cannot deactivate your own account." });
    }

    const updated = await db
      .update(users)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return res.json({ user: updated[0] });
  } catch (error) {
    console.error("Update user status error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
