import express from "express";
import { login } from "../services/authService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await login(email, password);

    if (!token) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

export default router;
