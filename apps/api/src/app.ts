import express from "express";
import cors from "cors";
import providerRoutes from "./modules/providers/provider.routes.js";
import snapshotRoutes from "./modules/snapshots/snapshot.routes.js";
import diffRoutes from "./modules/diffs/diff.routes.js";
import { providerAlertRouter, alertRouter } from "./modules/alerts/alert.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/providers", providerRoutes);
app.use("/providers/:providerId/snapshots", snapshotRoutes);
app.use("/providers/:providerId/diffs", diffRoutes);

app.use("/providers/:providerId/alerts", providerAlertRouter);
app.use("/alerts", alertRouter);

export default app;
