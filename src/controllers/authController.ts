import { users } from "../models/User";

let userId = 1;

export const register = (req:any, res:any) => {
    console.log("REGISTER HIT");
    console.log(req.body);
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
  
    return res.status(200).json({
      message: "User registered successfully"
    });
  };
  

export const login = (req: any, res: any) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(400).json("Invalid credentials");
  }

  res.json(user);
};