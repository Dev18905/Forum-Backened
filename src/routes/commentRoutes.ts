import { Router } from "express";
import { commentController } from "../controllers/commentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/post/:postId", commentController.getCommentsByPost);
router.post("/post/:postId", authMiddleware, commentController.addComment);
router.put("/:id", authMiddleware, commentController.updateComment);
router.delete("/:id", authMiddleware, commentController.deleteComment);

export default router;