import { Router } from "express";
import userRouter from "../modules/user/user.routes";
import authRouter from "../modules/auth/auth.routes";
import linkRouter from "../modules/link/link.routes";

const router = Router();

// User routes
router.use("/user", userRouter);

// Auth routes
router.use("/auth", authRouter);

// Link routes
router.use("/", linkRouter);

export default router;
