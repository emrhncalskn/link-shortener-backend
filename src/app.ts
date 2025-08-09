import express from "express";
import api from "./routes";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use("/api", api);

  app.use((_req, res) => res.status(404).json({ message: "Not found" }));
  app.use((err: any, _req: any, res: any, _next: any) => {
    res
      .status(err?.status ?? 500)
      .json({ message: err?.message ?? "Internal Server Error" });
  });
  return app;
}
