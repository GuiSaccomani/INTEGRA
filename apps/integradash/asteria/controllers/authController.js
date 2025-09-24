const authService = require("../services/authService");

exports.login = async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ success: false, message: "Informe usuario e senha" });
    }
 
    const token = await authService.login(usuario, senha);

    if (!token) {
      return res.status(401).json({ success: false, message: "Credenciais inválidas" });
    }

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
