import express from "express";
import {
  createPost,
  getPosts,
  deletePost,
  likePost
} from "../controllers/postController";

import { addComment } from "../controllers/commentController";

const router = express.Router();

router.post("/", createPost);
router.get("/", getPosts);
router.delete("/:id", deletePost);
router.post("/:id/like", likePost);

// comments
router.post("/:postId/comment", addComment);

export default router;