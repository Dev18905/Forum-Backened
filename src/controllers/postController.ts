import { posts } from "../models/Post";

let postId = 1;

export const createPost = (req: any, res: any) => {
  const { title, content, userId } = req.body;

  const post = {
    id: postId++,
    title,
    content,
    userId,
    likes: 0
  };

  posts.push(post);

  res.json(post);
};

export const getPosts = (req: any, res: any) => {
  res.json(posts);
};

export const deletePost = (req: any, res: any) => {
  const id = Number(req.params.id);

  const index = posts.findIndex(p => p.id === id);

  if (index === -1) return res.status(404).json("Post not found");

  posts.splice(index, 1);

  res.json("Post deleted");
};

export const likePost = (req: any, res: any) => {
  const id = Number(req.params.id);

  const post = posts.find(p => p.id === id);

  if (!post) return res.status(404).json("Post not found");

  post.likes++;

  res.json(post);
};