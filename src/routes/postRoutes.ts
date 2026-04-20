import { Router } from "express";
import { postController } from "../controllers/postController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.post("/", authMiddleware, postController.createPost);
router.put("/:id", authMiddleware, postController.updatePost);
router.delete("/:id", authMiddleware, postController.deletePost);

export default router;