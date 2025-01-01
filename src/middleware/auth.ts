import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface Payload {
  _id: string;
  isAdmin: boolean;
}
export interface CustomRequest extends Request {
  user?: Payload;
}

export const auth = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401).send("Access Denied: No token provided");
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.VIDLY_JWT_PRIVATE_KEY!
    ) as Payload;
    req.user = { _id: payload._id, isAdmin: payload.isAdmin };
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
