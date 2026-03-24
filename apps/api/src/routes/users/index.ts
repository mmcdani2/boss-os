import { Router } from "express";
import listRouter from "./list.js";
import createRouter from "./create.js";
import updateStatusRouter from "./update-status.js";
import resetPasswordRouter from "./reset-password.js";

const router = Router();

router.use(listRouter);
router.use(createRouter);
router.use(updateStatusRouter);
router.use(resetPasswordRouter);

export default router;
