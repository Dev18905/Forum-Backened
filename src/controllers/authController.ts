import { Request, Response } from "express";
import { db } from "../db";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

export const authController = {
  register: async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (selectError, existingUser: any) => {
        if (selectError) {
          return res.status(500).json({ message: "Database error" });
        }

        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
          function (insertError) {
            if (insertError) {
              return res.status(500).json({ message: "Could not register user" });
            }

            return res.status(201).json({
              message: "User registered successfully",
              userId: this.lastID
            });
          }
        );
      }
    );
  },

  login: (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, user: any) => {
        if (error) {
          return res.status(500).json({ message: "Database error" });
        }

        if (!user) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user.id, user.email);

        return res.status(200).json({
          message: "Login successful",
          token: token
        });
      }
    );
  }
};