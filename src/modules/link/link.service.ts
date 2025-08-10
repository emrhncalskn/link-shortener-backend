import { CHARS } from "../../constants/chars.constant";
import { httpException, HttpException } from "../../utils/response";
import { LinkClickModel, LinkModel } from "./schema/link.model";
import { CreateLinkInput, LinkClick, LinkResponse } from "./schema/link.types";
import { ERROR_MESSAGES } from "../../constants/error-messages.constant";

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
        throw httpException.conflict(ERROR_MESSAGES.CUSTOM_CODE_ALREADY_EXISTS);
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
      ERROR_MESSAGES.COULD_NOT_GENERATE_UNIQUE_SHORT_CODE
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
      throw httpException.internalServerError(
        ERROR_MESSAGES.FAILED_TO_CREATE_LINK
      );
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
        throw httpException.notFound(ERROR_MESSAGES.LINK_NOT_FOUND);
      }

      await this.countClick(link._id.toString(), ipAddress, userAgent);

      return link.originalUrl;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw httpException.internalServerError(
        ERROR_MESSAGES.FAILED_TO_REDIRECT_LINK
      );
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
      console.error(ERROR_MESSAGES.FAILED_TO_LOG_CLICK, error);
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
      throw httpException.internalServerError(
        ERROR_MESSAGES.FAILED_TO_RETRIEVE_LINKS
      );
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
        throw httpException.notFound(ERROR_MESSAGES.LINK_NOT_FOUND);
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
        ERROR_MESSAGES.FAILED_TO_GET_LINK_ANALYTICS
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
        throw httpException.notFound(ERROR_MESSAGES.LINK_NOT_FOUND);
      }

      if (newShortCode && newShortCode !== shortCode) {
        const existingCodeLink = await LinkModel.findOne({
          shortCode: newShortCode,
        }).exec();
        if (existingCodeLink) {
          throw httpException.conflict(
            ERROR_MESSAGES.CUSTOM_CODE_ALREADY_EXISTS
          );
        }
      }

      const updatedLink = await LinkModel.findOneAndUpdate(
        filter,
        { $set: { shortCode: newShortCode || existingLink.shortCode } },
        { new: true }
      ).exec();
      if (!updatedLink) {
        throw httpException.notFound(ERROR_MESSAGES.LINK_NOT_FOUND);
      }

      return this.formatLinkResponse(updatedLink);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw httpException.internalServerError(
        ERROR_MESSAGES.FAILED_TO_UPDATE_LINK
      );
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
        throw httpException.notFound(ERROR_MESSAGES.LINK_NOT_FOUND);
      }

      await LinkClickModel.deleteMany({ linkId: link._id }).exec();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw httpException.internalServerError(
        ERROR_MESSAGES.FAILED_TO_DELETE_LINK
      );
    }
  }
}
