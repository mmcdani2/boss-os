import { Router } from "express";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { requireAuth, type AuthedRequest } from "../../middleware/require-auth.js";

const router = Router();

router.patch("/:id/password", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.authUser) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    if (req.authUser.role !== "admin") {
      return res.status(403).json({ error: "Forbidden." });
    }

    const id = String(req.params.id || "").trim();
    const password = String(req.body?.password || "");

    console.log("[USER RESET PASSWORD] attempt", {
      targetUserId: id,
      actorUserId: req.authUser.sub,
      actorRole: req.authUser.role,
      passwordLength: password.length,
    });

    if (!id) {
      return res.status(400).json({ error: "User id is required." });
    }

    if (password.length < 8) {
      console.log("[USER RESET PASSWORD] rejected short password", {
        targetUserId: id,
        passwordLength: password.length,
      });
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    const existing = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    const existingUser = existing[0];

    console.log("[USER RESET PASSWORD] lookup", {
      targetUserId: id,
      found: !!existingUser,
      email: existingUser?.email ?? null,
      fullName: existingUser?.fullName ?? null,
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    console.log("[USER RESET PASSWORD] hash created", {
      targetUserId: id,
      hashPrefix: passwordHash.slice(0, 10),
    });

    const updated = await db
      .update(users)
      .set({
        passwordHash,
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

    console.log("[USER RESET PASSWORD] success", {
      targetUserId: updated[0]?.id ?? null,
      email: updated[0]?.email ?? null,
      updatedAt: updated[0]?.updatedAt ?? null,
    });

    return res.json({ user: updated[0] });
  } catch (error) {
    console.error("Reset user password error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
