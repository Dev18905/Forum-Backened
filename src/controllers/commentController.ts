import { Request, Response } from "express";
import { db } from "../db";
import { AuthRequest } from "../middleware/authMiddleware";

export const commentController = {
  addComment: (req: AuthRequest, res: Response) => {
    const { content } = req.body;
    const postId = Number(req.params.postId);
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    db.run(
      "INSERT INTO comments (content, postId, userId) VALUES (?, ?, ?)",
      [content, postId, userId],
      function (error) {
        if (error) {
          return res.status(500).json({ message: "Could not add comment" });
        }

        return res.status(201).json({
          message: "Comment added successfully",
          commentId: this.lastID
        });
      }
    );
  },

  getCommentsByPost: (req: Request, res: Response) => {
    const postId = Number(req.params.postId);

    db.all(
      "SELECT * FROM comments WHERE postId = ? ORDER BY createdAt ASC",
      [postId],
      (error, rows) => {
        if (error) {
          return res.status(500).json({ message: "Could not fetch comments" });
        }

        return res.status(200).json(rows);
      }
    );
  },

  updateComment: (req: AuthRequest, res: Response) => {
    const commentId = Number(req.params.id);
    const { content } = req.body;
    const userId = req.user.id;

    db.get(
      "SELECT * FROM comments WHERE id = ?",
      [commentId],
      (selectError, comment: any) => {
        if (selectError) {
          return res.status(500).json({ message: "Database error" });
        }

        if (!comment) {
          return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId !== userId) {
          return res.status(403).json({ message: "You can only edit your own comment" });
        }

        db.run(
          "UPDATE comments SET content = ? WHERE id = ?",
          [content, commentId],
          (updateError) => {
            if (updateError) {
              return res.status(500).json({ message: "Could not update comment" });
            }

            return res.status(200).json({ message: "Comment updated successfully" });
          }
        );
      }
    );
  },

  deleteComment: (req: AuthRequest, res: Response) => {
    const commentId = Number(req.params.id);
    const userId = req.user.id;

    db.get(
      "SELECT * FROM comments WHERE id = ?",
      [commentId],
      (selectError, comment: any) => {
        if (selectError) {
          return res.status(500).json({ message: "Database error" });
        }

        if (!comment) {
          return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId !== userId) {
          return res.status(403).json({ message: "You can only delete your own comment" });
        }

        db.run("DELETE FROM comments WHERE id = ?", [commentId], (deleteError) => {
          if (deleteError) {
            return res.status(500).json({ message: "Could not delete comment" });
          }

          return res.status(200).json({ message: "Comment deleted successfully" });
        });
      }
    );
  }
};