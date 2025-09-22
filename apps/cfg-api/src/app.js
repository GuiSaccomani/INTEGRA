import express from "express";
import cfgRoutes from "./routes/cfgRoutes.js";
import logRoutes from "./routes/logRoutes.js";

const app = express();
app.use(express.json());

app.use("/api/cfg", cfgRoutes);
app.use("/api/logs", logRoutes);

app.use((err, req, res, next) => {
  console.error("Erro interno:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;
