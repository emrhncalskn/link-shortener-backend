import { Router } from "express";
import userRouter from "../modules/user/user.routes";
import authRouter from "../modules/auth/auth.routes";

const router = Router();

// User routes
router.use("/user", userRouter);

// Auth routes
router.use("/auth", authRouter);

export default router;
