import express from "express";
import cfgRoutes from "./routes/cfgRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";

const app = express();

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());



app.use("/api/cfg", cfgRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/services", servicesRoutes);

app.use((err, req, res, next) => {
  console.error("Erro interno:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;
