import express from "express";
import api from "./routes";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use("/api", api);

  app.use((_req, res) => res.status(404).json({ message: "Route Not Found" }));
  app.use((err: any, _req: any, res: any, _next: any) => {
    const statusCode = err?.statusCode ?? err?.status ?? 500;
    const message = err?.message ?? "Internal Server Error";
    res.status(statusCode).json({ message });
  });
  return app;
}
