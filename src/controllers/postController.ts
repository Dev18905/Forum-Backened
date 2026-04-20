import { Request, Response } from "express";
import { db } from "../db";
import { AuthRequest } from "../middleware/authMiddleware";

export const postController = {
  createPost: (req: AuthRequest, res: Response) => {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    db.run(
      "INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)",
      [title, content, userId],
      function (error) {
        if (error) {
          return res.status(500).json({ message: "Could not create post" });
        }

        return res.status(201).json({
          message: "Post created successfully",
          postId: this.lastID
        });
      }
    );
  },

  getAllPosts: (_req: Request, res: Response) => {
    db.all("SELECT * FROM posts ORDER BY createdAt DESC", [], (error, rows) => {
      if (error) {
        return res.status(500).json({ message: "Could not fetch posts" });
      }

      return res.status(200).json(rows);
    });
  },

  getPostById: (req: Request, res: Response) => {
    const postId = Number(req.params.id);

    db.get("SELECT * FROM posts WHERE id = ?", [postId], (error, row) => {
      if (error) {
        return res.status(500).json({ message: "Could not fetch post" });
      }

      if (!row) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json(row);
    });
  },

  updatePost: (req: AuthRequest, res: Response) => {
    const postId = Number(req.params.id);
    const { title, content } = req.body;
    const userId = req.user.id;

    db.get("SELECT * FROM posts WHERE id = ?", [postId], (selectError, post: any) => {
      if (selectError) {
        return res.status(500).json({ message: "Database error" });
      }

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.userId !== userId) {
        return res.status(403).json({ message: "You can only edit your own post" });
      }

      db.run(
        "UPDATE posts SET title = ?, content = ? WHERE id = ?",
        [title, content, postId],
        (updateError) => {
          if (updateError) {
            return res.status(500).json({ message: "Could not update post" });
          }

          return res.status(200).json({ message: "Post updated successfully" });
        }
      );
    });
  },

  deletePost: (req: AuthRequest, res: Response) => {
    const postId = Number(req.params.id);
    const userId = req.user.id;

    db.get("SELECT * FROM posts WHERE id = ?", [postId], (selectError, post: any) => {
      if (selectError) {
        return res.status(500).json({ message: "Database error" });
      }

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.userId !== userId) {
        return res.status(403).json({ message: "You can only delete your own post" });
      }

      db.run("DELETE FROM posts WHERE id = ?", [postId], (deleteError) => {
        if (deleteError) {
          return res.status(500).json({ message: "Could not delete post" });
        }

        return res.status(200).json({ message: "Post deleted successfully" });
      });
    });
  }
};