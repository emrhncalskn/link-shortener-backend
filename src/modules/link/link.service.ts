import { CHARS } from "../../constants/chars.constant";
import { httpException, HttpException } from "../../utils/response";
import { LinkClickModel, LinkModel } from "./schema/link.model";
import { CreateLinkInput, LinkClick, LinkResponse } from "./schema/link.types";

export class LinkService {
  private generateShortCode(length: number = 10): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return result;
  }

  private async generateUniqueShortCode(customCode?: string): Promise<string> {
    if (customCode) {
      const existing = await LinkModel.findOne({ shortCode: customCode })
        .lean()
        .exec();
      if (existing) {
        throw httpException.conflict("Custom code already exists");
      }
      return customCode;
    }

    let shortCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortCode = this.generateShortCode();
      const existing = await LinkModel.findOne({ shortCode }).lean().exec();
      if (!existing) {
        return shortCode;
      }
      attempts++;
    } while (attempts < maxAttempts);

    throw httpException.internalServerError(
      "Could not generate unique short code, please try again later"
    );
  }

  private formatLinkResponse(link: any): LinkResponse {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    return {
      _id: link._id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      shortUrl: `${baseUrl}/${link.shortCode}`,
      clicks: link.clicks,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    };
  }

  async createLink(
    linkData: CreateLinkInput,
    userId?: string
  ): Promise<LinkResponse> {
    try {
      const shortCode = await this.generateUniqueShortCode(linkData.customCode);

      const link = new LinkModel({
        originalUrl: linkData.originalUrl,
        shortCode,
        userId: userId || undefined,
      });

      const savedLink = await link.save();
      return this.formatLinkResponse(savedLink);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw httpException.internalServerError("Failed to create link");
    }
  }

  async redirectLink(
    shortCode: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<string> {
    try {
      const link = await LinkModel.findOneAndUpdate(
        { shortCode },
        { $inc: { clicks: 1 } },
        { new: true }
      ).exec();

      if (!link) {
        throw httpException.notFound("Link not found");
      }

      await this.countClick(link._id.toString(), ipAddress, userAgent);

      return link.originalUrl;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw httpException.internalServerError("Failed to redirect link");
    }
  }

  private async countClick(
    linkId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const click = new LinkClickModel({
        linkId,
        ipAddress,
        userAgent,
      });
      await click.save();
    } catch (error) {
      console.error("Failed to log click:", error);
    }
  }

  async getAllLinks(
    page = 1,
    limit = 10,
    userId?: string
  ): Promise<{
    links: LinkResponse[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const filter = userId ? { userId } : {};

      const [links, total] = await Promise.all([
        LinkModel.find(filter)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean()
          .exec(),
        LinkModel.countDocuments(filter).exec(),
      ]);

      const formattedLinks = links.map((link) => this.formatLinkResponse(link));
      const totalPages = Math.ceil(total / limit);

      return {
        links: formattedLinks,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      throw httpException.internalServerError("Failed to retrieve links");
    }
  }

  async getLinkStats(
    shortCode: string,
    userId?: string
  ): Promise<{ link: LinkResponse; recentClicks: LinkClick[] }> {
    try {
      const filter: any = { shortCode };
      if (userId) {
        filter.userId = userId;
      }

      const link = await LinkModel.findOne(filter).lean().exec();
      if (!link) {
        throw httpException.notFound("Link not found");
      }

      const recentClicks = await LinkClickModel.find({ linkId: link._id })
        .sort({ clickedAt: -1 })
        .lean<LinkClick[]>()
        .exec();

      return {
        link: this.formatLinkResponse(link),
        recentClicks,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw httpException.internalServerError(
        "Failed to retrieve link statistics"
      );
    }
  }

  async updateLink(
    shortCode: string,
    newShortCode?: string,
    userId?: string
  ): Promise<LinkResponse> {
    try {
      const filter: any = { shortCode };
      if (userId) {
        filter.userId = userId;
      }

      const existingLink = await LinkModel.findOne(filter).exec();
      if (!existingLink) {
        throw httpException.notFound("Link not found");
      }

      if (newShortCode && newShortCode !== shortCode) {
        const existingCodeLink = await LinkModel.findOne({
          shortCode: newShortCode,
        }).exec();
        if (existingCodeLink) {
          throw httpException.conflict("New short code already exists");
        }
      }

      const updatedLink = await LinkModel.findOneAndUpdate(
        filter,
        { $set: { shortCode: newShortCode || existingLink.shortCode } },
        { new: true }
      ).exec();
      if (!updatedLink) {
        throw httpException.notFound("Link not found");
      }

      return this.formatLinkResponse(updatedLink);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw httpException.internalServerError("Failed to update link");
    }
  }

  async deleteLink(shortCode: string, userId?: string): Promise<void> {
    try {
      const filter: any = { shortCode };
      if (userId) {
        filter.userId = userId;
      }

      const link = await LinkModel.findOneAndDelete(filter).exec();
      if (!link) {
        throw httpException.notFound("Link not found");
      }

      await LinkClickModel.deleteMany({ linkId: link._id }).exec();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw httpException.internalServerError("Failed to delete link");
    }
  }
}
