import { Schema, model } from "mongoose";

const linkSchema = new Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "links",
  }
);

const linkClickSchema = new Schema(
  {
    linkId: {
      type: Schema.Types.ObjectId,
      ref: "Link",
      required: true,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
    clickedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    collection: "link_clicks",
  }
);

// Index for better performance
linkSchema.index({ userId: 1 });
linkClickSchema.index({ linkId: 1 });
linkClickSchema.index({ clickedAt: -1 });

export const LinkModel = model("Link", linkSchema);
export const LinkClickModel = model("LinkClick", linkClickSchema);
