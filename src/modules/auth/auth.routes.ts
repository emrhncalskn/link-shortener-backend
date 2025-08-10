import { Router } from "express";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { validate } from "../../utils/validate";
import { loginDto, registerDto } from "./schema/auth.schema";

const router = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

// Login route
router.post("/login", validate(loginDto), authController.login);

// Register route
router.post("/register", validate(registerDto), authController.register);

export default router;
