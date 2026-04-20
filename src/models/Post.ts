export interface Post {
    id: number;
    title: string;
    content: string;
    userId: number;
    likes: number;
  }
  
  export const posts: Post[] = [];