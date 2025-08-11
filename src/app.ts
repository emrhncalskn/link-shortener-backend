import express from "express";
import cors from "cors";
import api from "./routes";
import { ERROR_MESSAGES } from "./constants/error-messages.constant";

export function createApp() {
  const app = express();

  // CORS configuration
  const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(",") || [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(express.json());

  app.use("/", api);

  app.use((_req, res) => res.status(404).json({ message: "Route Not Found" }));
  app.use((err: any, _req: any, res: any, _next: any) => {
    const statusCode = err?.statusCode ?? err?.status ?? 500;
    const message = err?.message ?? ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({ message });
  });
  return app;
}
