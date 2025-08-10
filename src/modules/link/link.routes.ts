import { Router } from "express";
import { LinkService } from "./link.service";
import { LinkController } from "./link.controller";
import { validate } from "../../utils/validate";
import { createLinkSchema, redirectLinkSchema } from "./schema/link.schema";
import { authGuard } from "../auth/auth.guard";

const router = Router();

const linkService = new LinkService();
const linkController = new LinkController(linkService);

router.post(
  "/shorten",
  validate(createLinkSchema),
  authGuard,
  linkController.shortenUrl
);

router.get("/links", authGuard, linkController.getAllLinks);

router.get(
  "/stats/:slug",
  validate(redirectLinkSchema),
  authGuard,
  linkController.getLinkStats
);

router.delete(
  "/:slug",
  validate(redirectLinkSchema),
  authGuard,
  linkController.deleteLink
);

router.get("/:slug", validate(redirectLinkSchema), linkController.redirectUrl);

export default router;
