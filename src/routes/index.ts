import { Router } from "express";
import userRouter from "../modules/user/user.routes";

const router = Router();

// User routes
router.use("/users", userRouter);

export default router;
