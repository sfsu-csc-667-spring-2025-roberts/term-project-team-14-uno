import express, { Request, Response } from "express";
const router = express.Router();

// Mock user data for demonstration
const mockUser = {
  email: "test@domain.com",
  password: "password123",
  id: "user123",
};

// router.post("/login", (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   // Basic validation
//   if (!email || !password) {
//     return res.status(400).send("Missing email or password.");
//   }

//   // Authenticate user (replace with real DB/user auth logic)
//   if (email === mockUser.email && password === mockUser.password) {
//     // Store session or issue token
//     req.session.userId = mockUser.id;

//     // Redirect to lobby
//     return res.redirect("/lobby");
//   } else {
//     return res.status(401).send("Invalid email or password.");
//   }
// });

export default router;
