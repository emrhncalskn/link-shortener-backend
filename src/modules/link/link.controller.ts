import { Request, Response } from "express";
import { BaseController } from "../../common/base.controller";
import { LinkService } from "./link.service";
import { HttpException } from "../../utils/response";

export class LinkController extends BaseController {
  constructor(private linkService: LinkService) {
    super();
  }

  shortenUrl = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const { originalUrl, customCode } = req.body;
      const userId = (req as any).user?.id;

      return await this.linkService.createLink(
        { originalUrl, customCode },
        userId
      );
    });
  };

  redirectUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get("User-Agent");

      const originalUrl = await this.linkService.redirectLink(
        slug,
        ipAddress,
        userAgent
      );

      res.redirect(301, originalUrl);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  getAllLinks = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userId = (req as any).user?.id;

      return await this.linkService.getAllLinks(page, limit, userId);
    });
  };

  getLinkStats = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const { slug } = req.params;
      const userId = (req as any).user?.id;

      return await this.linkService.getLinkStats(slug, userId);
    });
  };

  deleteLink = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, async () => {
      const { slug } = req.params;
      const userId = (req as any).user?.id;

      await this.linkService.deleteLink(slug, userId);
      return { message: "Link deleted successfully" };
    });
  };
}
