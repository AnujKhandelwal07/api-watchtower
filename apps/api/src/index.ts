import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "api" });
});

const port = 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});