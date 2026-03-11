import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import {
  requireAuth,
  type AuthedRequest,
} from "../../middleware/require-auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const found = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = found[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "User is inactive." });
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);

    if (!passwordOk) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  return res.json({
    user: req.authUser,
  });
});

export default router;
