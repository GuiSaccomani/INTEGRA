import jwt from "jsonwebtoken";
import { getUserByEmail } from "./userService.js";
import { saveLog } from "./logService.js";

/**
 * Autentica usuário com base no e-mail e senha.
 * @param {string} email - e-mail do usuário
 * @param {string} password - senha informada
 * @returns {string|null} - token JWT se sucesso, null caso contrário
 */
export async function login(email, password) {
  try {
    const user = await getUserByEmail(email);

    if (!user || user.PASSWORD !== password) {
      return null;
    }

    const token = jwt.sign(
      { id: user.ID, email: user.EMAIL },
      "v",
      { expiresIn: "1h" }
    );

    await saveLog("AUTH", `Login realizado com sucesso para ${user.EMAIL}`);

    return token;
  } catch (err) {
    console.error("Erro ao autenticar usuário:", err);
    await saveLog("ERROR", `Erro no login: ${err.message}`);
    throw err;
  }
}
