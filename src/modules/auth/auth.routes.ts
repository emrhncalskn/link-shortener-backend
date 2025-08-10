import { Router } from "express";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { validate } from "../../utils/validate";
import { loginDto, registerDto } from "./schema/auth.schema";
import { authGuard } from "./auth.guard";

const router = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

// Login route
router.post("/login", validate(loginDto), authController.login);

// Register route
router.post("/register", validate(registerDto), authController.register);

// Auth Check route
router.get("/check", authGuard, authController.checkAuth);

export default router;
