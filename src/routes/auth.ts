import express, { Request, Response } from "express";
import { validate } from "../middleware/validateBody.ts";
import schema from "../schemas/authSchema.ts";
import { User } from "../db/models/user.ts";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

interface Body {
  email: string;
  password: string;
}

router.post(
  "/",
  validate(schema),
  async (req: Request<{}, {}, Body>, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).send("Invalid email or password");
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).send("Invalid email or password");
      return;
    }
    const token = user.generateAuthToken();
    res.send(token);
  }
);

export default router;
