import cors from "cors";
import express from "express";

import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({ message: "Self Order Backend API" });
  });

  app.use("/api", apiRouter);

  return app;
}
