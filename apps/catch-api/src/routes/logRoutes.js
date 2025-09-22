import express from "express";
import { getLogs, saveLog } from "../services/logService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await getLogs(limit);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar logs" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { type, content } = req.body;
    await saveLog(type, content);
    res.status(201).json({ message: "Log registrado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
