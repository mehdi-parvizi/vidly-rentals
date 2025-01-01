import { Response, NextFunction } from "express";
import { CustomRequest } from "./auth.ts";

const admin = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user && !req.user.isAdmin) {
    res.status(403).send("Access Denied.");
    return;
  }
  next();
};

export default admin;
