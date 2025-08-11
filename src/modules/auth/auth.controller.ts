import { Request, Response } from "express";
import { BaseController } from "../../common/base.controller";
import { AuthService } from "./auth.service";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constant";

export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const { username, password } = req.body;
      return await this.authService.login(username, password);
    });
  };

  register = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const { username, password } = req.body;
      return await this.authService.register(username, password);
    });
  };

  checkAuth = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const user = (req as any).user;
      const token = req.headers.authorization?.slice(7); // Remove "Bearer " prefix

      return {
        message: SUCCESS_MESSAGES.AUTHENTICATED,
        token,
        user: {
          id: user.id,
          username: user.username,
        },
      };
    });
  };
}
