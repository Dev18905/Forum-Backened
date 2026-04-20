import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export function generateToken(userId: number, email: string) {
  return jwt.sign(
    {
      id: userId,
      email: email
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}