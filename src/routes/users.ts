import express, { Request, Response } from "express";
import { createUser, getUser, getUsers, UserProps } from "../db/models/user.ts";
import { validate } from "../middleware/validateBody.ts";
import schema from "../schemas/userSchema.ts";
import { auth, CustomRequest } from "../middleware/auth.ts";

const router = express.Router();

router.get("/", async (_req, res) => {
  const users = await getUsers();
  res.send(users);
});

router.get("/profile", auth, async (req: CustomRequest, res) => {
  const user = await getUser(req.user!._id);
  if (!user) return;
  res.send(user);
});

router.post(
  "/",
  validate(schema),
  async (req: Request<{}, {}, UserProps>, res: Response) => {
    try {
      const userProps = await createUser(req.body);
      res.header("x-auth-token", userProps.token).send(userProps.user);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
);

export default router;
