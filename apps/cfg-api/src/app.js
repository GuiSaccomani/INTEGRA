import express from "express";
import cfgRoutes from "./routes/cfgRoutes.js";
import logRoutes from "./routes/logRoutes.js";

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

// Endpoint para serviços (compatível com frontend)
app.get('/api/services', (req, res) => {
  res.json([
    { id: 1, name: 'Sincronização', host: 'localhost', port: 3001, status: 'online' },
    { id: 2, name: 'Captura', host: 'localhost', port: 3002, status: 'online' }
  ]);
});

app.use("/api/cfg", cfgRoutes);
app.use("/api/logs", logRoutes);

app.use((err, req, res, next) => {
  console.error("Erro interno:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;
