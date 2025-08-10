import { Request, Response } from "express";
import { BaseController } from "../../common/base.controller";
import { AuthService } from "./auth.service";

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
}
