export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
  }
  
  // simple in-memory storage
  export const users: User[] = [];