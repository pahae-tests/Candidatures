import jwt from "jsonwebtoken";

const JWT_SECRET = "1111";

export function verifyAuth(req, res) {
  const token = req.cookies?.authToken;

  if (!token) {
    return null;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    return { _id: user._id, nom: user.nom, prenom: user.prenom };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}