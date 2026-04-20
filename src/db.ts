import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("forum.db", (error) => {
  if (error) {
    console.error("Database connection error:", error.message);
  } else {
    console.log("Connected to SQLite database");
  }
});