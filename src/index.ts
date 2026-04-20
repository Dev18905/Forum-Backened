import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { db } from "./db";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import { loggerMiddleware } from "./middleware/loggerMiddleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(loggerMiddleware);

const schemaPath = path.join(__dirname, "..", "schema.sql");
const schemaSql = fs.readFileSync(schemaPath, "utf8");

db.exec(schemaSql, (error) => {
  if (error) {
    console.error("Error creating tables:", error.message);
  } else {
    console.log("Tables are ready");
  }
});

app.get("/", (_req, res) => {
  res.send("Forum Backend API is running");
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});