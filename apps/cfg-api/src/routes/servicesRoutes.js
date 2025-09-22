import express from "express";

const router = express.Router();

// Endpoint para listar serviços (compatível com frontend)
router.get("/", (req, res) => {
  res.json([
    { id: 1, name: 'Sincronização', host: 'localhost', port: 3001, status: 'online' },
    { id: 2, name: 'Captura', host: 'localhost', port: 3002, status: 'online' }
  ]);
});

export default router;