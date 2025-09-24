const express = require("express");
const dataRoutes = require("./routes/dataRoutes");
const authRoutes = require("./routes/authRoutes");
const vendasRoutes = require("./routes/vendasRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
app.use(express.json());

// Rotas
app.use("/api", dataRoutes);
app.use("/api", authRoutes);
app.use("/api", vendasRoutes);
app.use("/api", uploadRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
 