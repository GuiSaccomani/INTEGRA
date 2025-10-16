import express from "express";
import cors from "cors";
import cfgRoutes from "./routes/cfgRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import authRoutes from "./routes/authRoutes.js"

const app = express();

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use("/cfg", cfgRoutes);
app.use("/logs", logRoutes);
app.use("/login", authRoutes);

app.use((err, req, res, next) => {
  console.error("Erro interno:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;
