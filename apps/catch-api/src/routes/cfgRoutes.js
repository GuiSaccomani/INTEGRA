import express from "express";
import { getCfg, updateCfg } from "../services/cfgService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cfg = await getCfg();
    res.json(cfg);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar configurações" });
  }
});

router.put("/", async (req, res) => {
  try {
    const newCfg = req.body;
    const result = await updateCfg(newCfg);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar configurações" });
  }
});

export default router;
