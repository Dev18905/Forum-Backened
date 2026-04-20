import express from "express";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";

const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});