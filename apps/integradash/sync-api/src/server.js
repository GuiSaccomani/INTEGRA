const express = require("express");
const { syncSales } = require("./syncService");
require("dotenv").config();

const app = express();
const PORT = 3010;
let syncInterval = null;

// Inicia sincronização com intervalo configurável
app.get("/start-sync/:seconds", (req, res) => {
  const seconds = parseInt(req.params.seconds, 10) || 5;

  if (syncInterval) clearInterval(syncInterval);

  syncInterval = setInterval(() => {
    syncSales();
  }, seconds * 1000);

  res.send(`⏱️ Sincronização iniciada a cada ${seconds} segundos.`);
});

// Para a sincronização
app.get("/stop-sync", (req, res) => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    res.send("🛑 Sincronização parada.");
  } else {
    res.send("⚠️ Nenhuma sincronização ativa.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
