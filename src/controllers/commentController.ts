import { comments } from "../models/Comment";

let commentId = 1;

export const addComment = (req: any, res: any) => {
  const { text, userId } = req.body;
  const postId = Number(req.params.postId);

  const comment = {
    id: commentId++,
    text,
    userId,
    postId
  };

  comments.push(comment);

  res.json(comment);
};