import jwt from "jsonwebtoken";
import { getUserByEmail } from "./userService.js";

export async function login(email, password) {
  try {
    const user = await getUserByEmail(email);

    if (!user || user.USER_PASSWORD !== password) {
      return null;
    }

    const token = jwt.sign(
      { id: user.USER_ID, email: user.USER_EMAIL },
      "v",
      { expiresIn: "1h" }
    );

    return token;
  } catch (err) {
    console.error("Erro ao autenticar usuário:", err);
    throw err;
  }
}
